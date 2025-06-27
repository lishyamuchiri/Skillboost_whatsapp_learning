import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { MPesaService, calculateExpiryDate } from '../../../src/utils/mpesa.ts';
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
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (req.method === 'POST') {
      const callbackData = await req.json();
      console.log('M-Pesa callback received:', JSON.stringify(callbackData, null, 2));

      // Process the callback
      const result = MPesaService.processCallback(callbackData);
      
      if (result.success) {
        // Payment successful - update payment record
        const { data: payment, error: paymentError } = await supabaseClient
          .from('payments')
          .update({
            status: 'completed',
            mpesa_transaction_id: result.mpesaReceiptNumber,
            updated_at: new Date().toISOString()
          })
          .eq('checkout_request_id', result.checkoutRequestID)
          .select()
          .single();

        if (paymentError) {
          console.error('Failed to update payment:', paymentError);
          throw paymentError;
        }

        // Update user subscription
        const expiryDate = calculateExpiryDate(payment.plan);
        
        const { data: user, error: userError } = await supabaseClient
          .from('users')
          .update({
            subscription_plan: payment.plan.toLowerCase().includes('weekly') ? 'weekly' : 'monthly',
            subscription_status: 'active',
            subscription_expires_at: expiryDate,
            updated_at: new Date().toISOString()
          })
          .eq('id', payment.user_id)
          .select()
          .single();

        if (userError) {
          console.error('Failed to update user:', userError);
          throw userError;
        }

        // Send confirmation via WhatsApp
        const whatsappService = new WhatsAppService(
          Deno.env.get('WHATSAPP_ACCESS_TOKEN') ?? '',
          Deno.env.get('WHATSAPP_PHONE_NUMBER_ID') ?? ''
        );

        const confirmationMessage = `✅ *Payment Confirmed!*

Hi ${user.name}! Your payment of KES ${result.amount} has been received.

📱 *Transaction ID:* ${result.mpesaReceiptNumber}
📅 *Subscription:* ${payment.plan} 
⏰ *Valid until:* ${new Date(expiryDate).toLocaleDateString()}

Your daily lessons will continue as scheduled. Welcome to SkillBoost Kenya! 🎉

Questions? Reply "HELP" for support.`;

        await whatsappService.sendMessage(user.whatsapp_number, confirmationMessage);

        // Log the transaction
        await supabaseClient
          .from('whatsapp_messages')
          .insert({
            user_id: user.id,
            message_type: 'payment',
            content: confirmationMessage,
            sent_at: new Date().toISOString(),
            delivery_status: 'sent'
          });

        console.log(`Payment processed successfully for user ${user.id}`);

      } else {
        // Payment failed - update payment record
        const { error: paymentError } = await supabaseClient
          .from('payments')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString()
          })
          .eq('checkout_request_id', result.checkoutRequestID);

        if (paymentError) {
          console.error('Failed to update failed payment:', paymentError);
        }

        console.log(`Payment failed: ${result.resultDesc}`);
      }

      return new Response('Callback processed', { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    return new Response('Method not allowed', { 
      status: 405, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('M-Pesa callback error:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});