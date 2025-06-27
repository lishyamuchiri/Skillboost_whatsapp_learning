// WhatsApp Business API integration
export interface WhatsAppConfig {
  accessToken: string;
  phoneNumberId: string;
  verifyToken: string;
}

export interface WhatsAppMessage {
  to: string;
  message: string;
  type?: 'text' | 'template';
}

export class WhatsAppService {
  private config: WhatsAppConfig;
  private baseURL = 'https://graph.facebook.com/v18.0';

  constructor(config: WhatsAppConfig) {
    this.config = config;
  }

  async sendMessage(to: string, message: string, type: 'text' | 'template' = 'text') {
    const url = `${this.baseURL}/${this.config.phoneNumberId}/messages`;
    
    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to.replace('+', ''),
      type: type,
      text: {
        preview_url: false,
        body: message
      }
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`WhatsApp API error: ${data.error?.message || 'Unknown error'}`);
      }

      return {
        success: true,
        messageId: data.messages[0].id,
        whatsappId: data.messages[0].id
      };
    } catch (error) {
      console.error('WhatsApp send error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async sendWelcomeMessage(to: string, name: string, plan: string) {
    const message = `🎉 Welcome to SkillBoost Kenya, ${name}!

Your ${plan} is now active and ready to go! 

Here's what happens next:
📚 You'll receive your first lesson within the next hour
⏰ Daily lessons will be sent at your preferred time
📈 Track your progress and earn badges
🏆 Earn certificates as you complete tracks

📖 *Quick Commands:*
• Reply "HELP" for assistance
• Reply "PAUSE" to pause lessons
• Reply "RESUME" to resume lessons
• Reply "PROGRESS" to see your stats

Ready to boost your skills? Your learning journey starts now! 🚀

_From the SkillBoost Kenya Team_`;

    return await this.sendMessage(to, message);
  }

  async sendDailyLesson(to: string, lesson: any, trackName: string, progress: number) {
    const message = `📚 *Daily Lesson - ${trackName}*

*${lesson.title}*

${lesson.content}

📊 *Your Progress:* ${Math.round(progress)}% complete
⏱️ *Time:* ~${lesson.estimated_reading_time_minutes} minutes

*Quick Quiz:* ${lesson.quiz_question || 'What\'s one key takeaway from today\'s lesson?'}

Reply with your answer to earn points! 💪

---
Reply "NEXT" for tomorrow's preview
Reply "HELP" for more options`;

    return await this.sendMessage(to, message);
  }

  async sendPaymentConfirmation(to: string, name: string, plan: string, amount: number, transactionId: string) {
    const message = `✅ *Payment Confirmed!*

Hi ${name}! Your payment of KES ${amount} has been received.

📱 *Transaction ID:* ${transactionId}
📅 *Subscription:* ${plan} 
⏰ *Valid until:* ${new Date(Date.now() + (plan.includes('Weekly') ? 7 : 30) * 24 * 60 * 60 * 1000).toLocaleDateString()}

Your daily lessons will continue as scheduled. Welcome to SkillBoost Kenya! 🎉

Questions? Reply "HELP" for support.`;

    return await this.sendMessage(to, message);
  }

  async sendPaymentReminder(to: string, name: string, plan: string, amount: number) {
    const message = `💰 *Payment Reminder*

Hi ${name}! 

Your ${plan} subscription will expire soon. To continue receiving daily lessons, please renew:

💵 Amount: KES ${amount}
📱 Pay via M-Pesa to Till Number: 123456
📋 Reference: Your WhatsApp number

Once paid, reply "PAID" to confirm and we'll verify immediately.

Questions? Reply "HELP" for support.

Keep learning! 📚✨`;

    return await this.sendMessage(to, message);
  }

  // Handle incoming webhook messages
  static async handleWebhook(body: any) {
    try {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      if (value?.messages) {
        const message = value.messages[0];
        const from = message.from;
        const messageBody = message.text?.body?.toLowerCase().trim();

        // Handle different message types
        switch (messageBody) {
          case 'help':
            return {
              action: 'send_help',
              to: from,
              data: { type: 'help_menu' }
            };
          
          case 'pause':
          case 'stop':
            return {
              action: 'pause_lessons',
              to: from,
              data: { type: 'pause' }
            };
          
          case 'resume':
          case 'start':
            return {
              action: 'resume_lessons',
              to: from,
              data: { type: 'resume' }
            };
          
          case 'progress':
          case 'stats':
            return {
              action: 'send_progress',
              to: from,
              data: { type: 'progress_report' }
            };
          
          case 'next':
            return {
              action: 'send_next_lesson',
              to: from,
              data: { type: 'next_lesson' }
            };
          
          case 'tracks':
          case 'courses':
            return {
              action: 'show_tracks',
              to: from,
              data: { type: 'track_list' }
            };
          
          case 'paid':
            return {
              action: 'verify_payment',
              to: from,
              data: { type: 'payment_verification' }
            };
          
          default:
            return {
              action: 'process_response',
              to: from,
              data: { 
                type: 'user_response', 
                message: messageBody,
                originalMessage: message
              }
            };
        }
      }

      return null;
    } catch (error) {
      console.error('Webhook processing error:', error);
      return null;
    }
  }
}

// Sample lesson content for different tracks
export const sampleLessons = {
  digital: [
    {
      title: "Creating Engaging Social Media Posts",
      content: `🎯 *Key Elements of Viral Content:*

1. *Hook in First 3 Seconds*
   • Start with a question or surprising fact
   • Use numbers: "5 Ways to..." or "In 30 seconds..."

2. *Visual Appeal*
   • High-quality images or videos
   • Consistent color scheme
   • Clear, readable fonts

3. *Value-First Approach*
   • Solve a problem
   • Teach something new
   • Entertain or inspire

4. *Call-to-Action*
   • "Double-tap if you agree"
   • "Share with someone who needs this"
   • "Comment your experience below"

*Today's Action:* Create one post using these principles!`,
      quiz_question: "What should you include in the first 3 seconds of your content?",
      estimated_reading_time_minutes: 3
    }
  ],
  english: [
    {
      title: "Professional Email Writing",
      content: `📧 *Email Structure for Success:*

1. *Subject Line* (Clear & Specific)
   ❌ "Quick question"
   ✅ "Meeting request for project discussion"

2. *Greeting*
   • Formal: "Dear Mr./Ms. [Name]"
   • Semi-formal: "Hello [Name]"
   • Casual: "Hi [Name]"

3. *Opening Line*
   • State your purpose immediately
   • "I'm writing to request..."
   • "I wanted to follow up on..."

4. *Body* (Keep it brief)
   • One main point per paragraph
   • Use bullet points for lists
   • Be specific and clear

5. *Closing*
   • "Thank you for your time"
   • "I look forward to hearing from you"
   • "Best regards, [Your name]"

*Practice:* Write one professional email today!`,
      quiz_question: "What makes a good email subject line?",
      estimated_reading_time_minutes: 4
    }
  ],
  business: [
    {
      title: "Customer Service Excellence",
      content: `🌟 *The HEART Method:*

*H - Hear* the customer
• Listen actively without interrupting
• Ask clarifying questions
• Show you understand their concern

*E - Empathize* genuinely
• "I understand how frustrating this must be"
• "I can see why you're concerned"
• Acknowledge their feelings

*A - Act* quickly
• Offer immediate solutions
• If you can't solve it, find someone who can
• Set clear expectations for next steps

*R - Respond* professionally
• Stay calm and positive
• Use solution-focused language
• Avoid blame or excuses

*T - Thank* them
• Thank them for their patience
• Thank them for bringing the issue to attention
• Thank them for their business

*Remember:* A satisfied customer tells 3 people, but an unsatisfied customer tells 10!`,
      quiz_question: "What does the 'H' in the HEART method stand for?",
      estimated_reading_time_minutes: 3
    }
  ],
  vocational: [
    {
      title: "Basic Project Planning",
      content: `📋 *5-Step Project Planning:*

*Step 1: Define the Goal*
• What exactly needs to be accomplished?
• When does it need to be completed?
• What does success look like?

*Step 2: List All Tasks*
• Break the project into smaller tasks
• Include preparation and cleanup
• Don't forget procurement and approvals

*Step 3: Estimate Time*
• How long will each task take?
• Add 20% buffer for unexpected delays
• Consider dependencies between tasks

*Step 4: Allocate Resources*
• What materials do you need?
• How many people are required?
• What tools or equipment?

*Step 5: Create Timeline*
• Work backwards from deadline
• Identify critical path (longest sequence)
• Build in checkpoints and reviews

*Tool Tip:* Use your phone's notes app to track tasks and deadlines!`,
      quiz_question: "Why should you add a 20% time buffer to your estimates?",
      estimated_reading_time_minutes: 4
    }
  ]
};