/*
  # SkillBoost Kenya Database Schema

  1. New Tables
    - `users` - Store user profiles and subscription info
    - `learning_tracks` - Available learning tracks (Digital Marketing, English, etc.)
    - `user_tracks` - User enrollment in specific tracks
    - `lessons` - Individual lessons within tracks
    - `user_lesson_progress` - Track user progress through lessons
    - `whatsapp_messages` - Log all WhatsApp interactions
    - `payments` - M-Pesa payment records

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Secure payment and user data

  3. Features
    - Automated lesson scheduling
    - Progress tracking
    - Payment integration
    - WhatsApp message logging
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number text UNIQUE NOT NULL,
  name text NOT NULL,
  email text,
  preferred_time text DEFAULT '9:00 AM',
  subscription_plan text DEFAULT 'free' CHECK (subscription_plan IN ('free', 'weekly', 'monthly')),
  subscription_status text DEFAULT 'inactive' CHECK (subscription_status IN ('active', 'inactive', 'expired')),
  subscription_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Learning tracks table
CREATE TABLE IF NOT EXISTS learning_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text DEFAULT '📚',
  total_lessons integer DEFAULT 0,
  estimated_duration_weeks integer DEFAULT 4,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- User track enrollment
CREATE TABLE IF NOT EXISTS user_tracks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  track_id uuid REFERENCES learning_tracks(id) ON DELETE CASCADE,
  progress numeric DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  is_active boolean DEFAULT true,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, track_id)
);

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id uuid REFERENCES learning_tracks(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  lesson_number integer NOT NULL,
  estimated_reading_time_minutes integer DEFAULT 5,
  quiz_question text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(track_id, lesson_number)
);

-- User lesson progress
CREATE TABLE IF NOT EXISTS user_lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES lessons(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  quiz_score integer CHECK (quiz_score >= 0 AND quiz_score <= 100),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- WhatsApp messages log
CREATE TABLE IF NOT EXISTS whatsapp_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  message_type text NOT NULL CHECK (message_type IN ('lesson', 'welcome', 'reminder', 'payment', 'certificate', 'response')),
  content text NOT NULL,
  sent_at timestamptz DEFAULT now(),
  delivery_status text DEFAULT 'pending' CHECK (delivery_status IN ('pending', 'sent', 'delivered', 'failed')),
  whatsapp_message_id text,
  created_at timestamptz DEFAULT now()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  currency text DEFAULT 'KES',
  plan text NOT NULL,
  payment_method text DEFAULT 'mpesa',
  mpesa_transaction_id text,
  checkout_request_id text,
  phone_number text NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Users can update their own data
CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Anyone can read learning tracks
CREATE POLICY "Anyone can read learning tracks"
  ON learning_tracks
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Users can read their own track enrollments
CREATE POLICY "Users can read own track enrollments"
  ON user_tracks
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Anyone can read lessons
CREATE POLICY "Anyone can read lessons"
  ON lessons
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Users can read their own progress
CREATE POLICY "Users can read own progress"
  ON user_lesson_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Users can read their own messages
CREATE POLICY "Users can read own messages"
  ON whatsapp_messages
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Users can read their own payments
CREATE POLICY "Users can read own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- Service role can do everything (for edge functions)
CREATE POLICY "Service role can manage all data"
  ON users
  FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role can manage learning tracks"
  ON learning_tracks
  FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role can manage user tracks"
  ON user_tracks
  FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role can manage lessons"
  ON lessons
  FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role can manage progress"
  ON user_lesson_progress
  FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role can manage messages"
  ON whatsapp_messages
  FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Service role can manage payments"
  ON payments
  FOR ALL
  TO service_role
  USING (true);

-- Insert sample learning tracks
INSERT INTO learning_tracks (name, description, icon, total_lessons, estimated_duration_weeks) VALUES
('Digital Marketing', 'Master social media marketing, content creation, and online advertising', '📱', 30, 6),
('English Mastery', 'Improve business English, pronunciation, and professional communication', '🗣️', 35, 7),
('Entrepreneurship', 'Learn business planning, customer service, and financial management', '💼', 25, 5),
('Vocational Skills', 'Essential skills for trades, project management, and professional development', '🔧', 28, 6);

-- Insert sample lessons for Digital Marketing track
DO $$
DECLARE
  digital_track_id uuid;
BEGIN
  SELECT id INTO digital_track_id FROM learning_tracks WHERE name = 'Digital Marketing';
  
  INSERT INTO lessons (track_id, title, content, lesson_number, estimated_reading_time_minutes, quiz_question) VALUES
  (digital_track_id, 'Creating Engaging Social Media Posts', 
   '🎯 Key Elements of Viral Content:

1. Hook in First 3 Seconds
   • Start with a question or surprising fact
   • Use numbers: "5 Ways to..." or "In 30 seconds..."

2. Visual Appeal
   • High-quality images or videos
   • Consistent color scheme
   • Clear, readable fonts

3. Value-First Approach
   • Solve a problem
   • Teach something new
   • Entertain or inspire

4. Call-to-Action
   • "Double-tap if you agree"
   • "Share with someone who needs this"
   • "Comment your experience below"

Today''s Action: Create one post using these principles!', 
   1, 3, 'What should you include in the first 3 seconds of your content?'),
   
  (digital_track_id, 'Understanding Your Target Audience', 
   '🎯 Know Your Audience:

1. Demographics
   • Age, gender, location
   • Income level, education
   • Job title, industry

2. Psychographics
   • Values and beliefs
   • Interests and hobbies
   • Pain points and challenges

3. Online Behavior
   • Which platforms they use
   • When they''re most active
   • What content they engage with

4. Create Buyer Personas
   • Give them names and faces
   • Write their stories
   • Understand their journey

Today''s Action: Create one detailed buyer persona for your business!', 
   2, 4, 'What are the three main categories for understanding your audience?');
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_whatsapp ON users(whatsapp_number);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_status, subscription_expires_at);
CREATE INDEX IF NOT EXISTS idx_user_tracks_user ON user_tracks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tracks_active ON user_tracks(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_lessons_track ON lessons(track_id, lesson_number);
CREATE INDEX IF NOT EXISTS idx_progress_user_lesson ON user_lesson_progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_messages_user ON whatsapp_messages(user_id, sent_at);
CREATE INDEX IF NOT EXISTS idx_payments_user ON payments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_checkout ON payments(checkout_request_id);

-- Functions for automated tasks

-- Function to update user progress
CREATE OR REPLACE FUNCTION update_user_track_progress()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE user_tracks 
  SET progress = (
    SELECT (COUNT(*) * 100.0 / lt.total_lessons)
    FROM user_lesson_progress ulp
    JOIN lessons l ON ulp.lesson_id = l.id
    JOIN learning_tracks lt ON l.track_id = lt.id
    WHERE ulp.user_id = NEW.user_id 
    AND l.track_id = (
      SELECT track_id FROM lessons WHERE id = NEW.lesson_id
    )
  )
  WHERE user_id = NEW.user_id 
  AND track_id = (
    SELECT track_id FROM lessons WHERE id = NEW.lesson_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update progress when lesson is completed
CREATE TRIGGER update_progress_trigger
  AFTER INSERT ON user_lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_user_track_progress();

-- Function to check and update subscription status
CREATE OR REPLACE FUNCTION check_subscription_expiry()
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET subscription_status = 'expired'
  WHERE subscription_status = 'active' 
  AND subscription_expires_at < now();
END;
$$ LANGUAGE plpgsql;