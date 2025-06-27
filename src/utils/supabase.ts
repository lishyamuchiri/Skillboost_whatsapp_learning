import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  whatsapp_number: string;
  name: string;
  email?: string;
  preferred_time: string;
  subscription_plan: 'free' | 'weekly' | 'monthly';
  subscription_status: 'active' | 'inactive' | 'expired';
  subscription_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LearningTrack {
  id: string;
  name: string;
  description: string;
  icon: string;
  total_lessons: number;
  estimated_duration_weeks: number;
  created_at: string;
}

export interface UserTrack {
  id: string;
  user_id: string;
  track_id: string;
  progress: number;
  is_active: boolean;
  started_at: string;
  completed_at?: string;
}

export interface Lesson {
  id: string;
  track_id: string;
  title: string;
  content: string;
  lesson_number: number;
  estimated_reading_time_minutes: number;
  created_at: string;
}

export interface UserLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at?: string;
  quiz_score?: number;
  created_at: string;
}

export interface WhatsAppMessage {
  id: string;
  user_id: string;
  message_type: 'lesson' | 'welcome' | 'reminder' | 'payment' | 'certificate';
  content: string;
  sent_at: string;
  delivery_status: 'pending' | 'sent' | 'delivered' | 'failed';
  whatsapp_message_id?: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  plan: string;
  payment_method: 'mpesa';
  mpesa_transaction_id?: string;
  phone_number: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  updated_at: string;
}

// Helper functions
export const createUser = async (userData: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserByWhatsApp = async (whatsappNumber: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('whatsapp_number', whatsappNumber)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
  return data;
};

export const updateUserSubscription = async (
  userId: string, 
  plan: string, 
  expiresAt?: string
) => {
  const { data, error } = await supabase
    .from('users')
    .update({
      subscription_plan: plan,
      subscription_status: 'active',
      subscription_expires_at: expiresAt,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUserProgress = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_tracks')
    .select(`
      *,
      learning_tracks (*)
    `)
    .eq('user_id', userId)
    .eq('is_active', true);
  
  if (error) throw error;
  return data;
};

export const getNextLesson = async (userId: string, trackId: string) => {
  // Get user's completed lessons for this track
  const { data: completedLessons, error: progressError } = await supabase
    .from('user_lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId);
  
  if (progressError) throw progressError;
  
  const completedLessonIds = completedLessons?.map(p => p.lesson_id) || [];
  
  // Get next uncompleted lesson
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('track_id', trackId)
    .not('id', 'in', `(${completedLessonIds.join(',')})`)
    .order('lesson_number', { ascending: true })
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

export const markLessonComplete = async (userId: string, lessonId: string, quizScore?: number) => {
  const { data, error } = await supabase
    .from('user_lesson_progress')
    .insert([{
      user_id: userId,
      lesson_id: lessonId,
      completed_at: new Date().toISOString(),
      quiz_score: quizScore
    }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const logWhatsAppMessage = async (messageData: Partial<WhatsAppMessage>) => {
  const { data, error } = await supabase
    .from('whatsapp_messages')
    .insert([messageData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const createPayment = async (paymentData: Partial<Payment>) => {
  const { data, error } = await supabase
    .from('payments')
    .insert([paymentData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updatePaymentStatus = async (
  paymentId: string, 
  status: Payment['status'], 
  transactionId?: string
) => {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString()
  };
  
  if (transactionId) {
    updateData.mpesa_transaction_id = transactionId;
  }
  
  const { data, error } = await supabase
    .from('payments')
    .update(updateData)
    .eq('id', paymentId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};