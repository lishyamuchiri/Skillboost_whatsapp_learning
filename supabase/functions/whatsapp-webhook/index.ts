import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { WhatsAppService } from '../../../src/utils/whatsapp.ts';

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
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Handle webhook verification (GET request from WhatsApp)
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');

      const verifyToken = Deno.env.get('WHATSAPP_VERIFY_TOKEN');

      if (mode === 'subscribe' && token === verifyToken) {
        console.log('WhatsApp webhook verified');
        return new Response(challenge, { status: 200 });
      } else {
        return new Response('Verification failed', { status: 403 });
      }
    }

    // Handle incoming messages (POST request)
    if (req.method === 'POST') {
      const body = await req.json();
      console.log('Received webhook:', JSON.stringify(body, null, 2));

      const action = await WhatsAppService.handleWebhook(body);
      
      if (!action) {
        return new Response('No action needed', { 
          status: 200, 
          headers: corsHeaders 
        });
      }

      const whatsappService = new WhatsAppService(
        Deno.env.get('WHATSAPP_ACCESS_TOKEN') ?? '',
        Deno.env.get('WHATSAPP_PHONE_NUMBER_ID') ?? ''
      );

      // Get user from database
      const { data: user } = await supabaseClient
        .from('users')
        .select('*')
        .eq('whatsapp_number', `+${action.to}`)
        .single();

      if (!user) {
        // Send onboarding message for new users
        await whatsappService.sendMessage(
          `+${action.to}`,
          `Welcome to SkillBoost Kenya! 🎉\n\nTo get started with your daily 5-minute lessons, visit: https://skillboost.co.ke\n\nReply "START" when you're ready to begin your learning journey!`
        );
        
        return new Response('New user welcomed', { 
          status: 200, 
          headers: corsHeaders 
        });
      }

      // Handle different actions based on user input
      switch (action.action) {
        case 'send_help':
          await whatsappService.sendHelpMenu(`+${action.to}`);
          break;

        case 'pause_lessons':
          await supabaseClient
            .from('users')
            .update({ subscription_status: 'inactive' })
            .eq('id', user.id);
          
          await whatsappService.sendMessage(
            `+${action.to}`,
            `⏸️ Lessons paused successfully!\n\nYour learning is now on hold. Reply "RESUME" anytime to continue your progress.\n\nTake your time - we'll be here when you're ready! 😊`
          );
          break;

        case 'resume_lessons':
          await supabaseClient
            .from('users')
            .update({ subscription_status: 'active' })
            .eq('id', user.id);
          
          await whatsappService.sendMessage(
            `+${action.to}`,
            `▶️ Welcome back, ${user.name}!\n\nYour lessons are now resumed. You'll receive your next lesson at ${user.preferred_time}.\n\nLet's continue building your skills! 💪`
          );
          break;

        case 'send_progress':
          // Get user progress
          const { data: progress } = await supabaseClient
            .from('user_tracks')
            .select(`
              *,
              learning_tracks (name)
            `)
            .eq('user_id', user.id)
            .eq('is_active', true);

          const progressText = progress?.map(p => 
            `📚 ${p.learning_tracks.name}: ${Math.round(p.progress)}%`
          ).join('\n') || 'No active tracks';

          await whatsappService.sendMessage(
            `+${action.to}`,
            `📊 *Your Learning Progress*\n\n${progressText}\n\n🎯 Keep going, ${user.name}! Every lesson brings you closer to your goals.\n\nReply "TRACKS" to explore more courses!`
          );
          break;

        case 'show_tracks':
          const { data: tracks } = await supabaseClient
            .from('learning_tracks')
            .select('*')
            .order('name');

          const tracksList = tracks?.map(track => 
            `${track.icon} ${track.name} - ${track.total_lessons} lessons`
          ).join('\n') || 'No tracks available';

          await whatsappService.sendMessage(
            `+${action.to}`,
            `📚 *Available Learning Tracks*\n\n${tracksList}\n\nTo enroll in additional tracks, visit: https://skillboost.co.ke\n\nReply "PROGRESS" to see your current progress!`
          );
          break;

        case 'verify_payment':
          await whatsappService.sendMessage(
            `+${action.to}`,
            `💰 *Payment Verification*\n\nWe're checking your payment now. This usually takes 1-2 minutes.\n\nOnce verified, your subscription will be activated automatically!\n\nIf you continue to have issues, please contact support: +254 700 123 456`
          );
          break;

        default:
          // Handle general responses or quiz answers
          await whatsappService.sendMessage(
            `+${action.to}`,
            `Thanks for your response! 👍\n\nFor help with commands, reply "HELP"\nTo see your progress, reply "PROGRESS"\nTo view available courses, reply "TRACKS"`
          );
      }

      // Log the interaction
      await supabaseClient
        .from('whatsapp_messages')
        .insert({
          user_id: user.id,
          message_type: 'response',
          content: `User: ${action.data.message} | Bot: ${action.action}`,
          sent_at: new Date().toISOString(),
          delivery_status: 'sent'
        });

      return new Response('Message processed', { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});