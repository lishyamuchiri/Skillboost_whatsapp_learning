import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { WhatsAppService, sampleLessons } from '../../../src/utils/whatsapp.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      console.log('Running lesson scheduler...');

      // Get all active users who should receive lessons today
      const now = new Date();
      const currentHour = now.getHours();
      const currentTime = `${currentHour}:00`;

      const { data: users, error: usersError } = await supabaseClient
        .from('users')
        .select(`
          *,
          user_tracks (
            *,
            learning_tracks (*)
          )
        `)
        .eq('subscription_status', 'active')
        .gte('subscription_expires_at', now.toISOString())
        .like('preferred_time', `${currentTime}%`);

      if (usersError) {
        throw usersError;
      }

      console.log(`Found ${users?.length || 0} users for lesson delivery`);

      const whatsappService = new WhatsAppService(
        Deno.env.get('WHATSAPP_ACCESS_TOKEN') ?? '',
        Deno.env.get('WHATSAPP_PHONE_NUMBER_ID') ?? ''
      );

      let deliveredCount = 0;

      for (const user of users || []) {
        try {
          // Get user's active tracks
          const activeTracks = user.user_tracks?.filter((ut: any) => ut.is_active) || [];
          
          if (activeTracks.length === 0) {
            console.log(`No active tracks for user ${user.id}`);
            continue;
          }

          // For each active track, check if user needs a lesson today
          for (const userTrack of activeTracks) {
            const track = userTrack.learning_tracks;
            
            // Get user's completed lessons for this track
            const { data: completedLessons } = await supabaseClient
              .from('user_lesson_progress')
              .select('lesson_id')
              .eq('user_id', user.id);

            const completedLessonIds = completedLessons?.map(cl => cl.lesson_id) || [];

            // Get next lesson for this track
            const { data: nextLesson } = await supabaseClient
              .from('lessons')
              .select('*')
              .eq('track_id', track.id)
              .not('id', 'in', `(${completedLessonIds.join(',') || 'null'})`)
              .order('lesson_number', { ascending: true })
              .limit(1)
              .single();

            if (nextLesson) {
              // Send the lesson via WhatsApp
              const progress = (completedLessonIds.length / track.total_lessons) * 100;
              
              await whatsappService.sendDailyLesson(
                user.whatsapp_number,
                nextLesson,
                track.name,
                progress
              );

              // Log the message
              await supabaseClient
                .from('whatsapp_messages')
                .insert({
                  user_id: user.id,
                  message_type: 'lesson',
                  content: `Lesson: ${nextLesson.title}`,
                  sent_at: new Date().toISOString(),
                  delivery_status: 'sent'
                });

              deliveredCount++;
              console.log(`Lesson delivered to ${user.name} (${user.whatsapp_number})`);
              
              // Add small delay to avoid rate limiting
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
        } catch (userError) {
          console.error(`Error processing user ${user.id}:`, userError);
          continue;
        }
      }

      console.log(`Lesson scheduler completed. Delivered ${deliveredCount} lessons.`);

      return new Response(
        JSON.stringify({ 
          success: true, 
          delivered: deliveredCount,
          message: `Delivered ${deliveredCount} lessons successfully`
        }), 
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Handle manual trigger for testing
    if (req.method === 'GET') {
      return new Response(
        JSON.stringify({ 
          message: 'Lesson scheduler is running. Use POST to trigger lesson delivery.' 
        }), 
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Lesson scheduler error:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});