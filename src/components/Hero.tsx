import React from 'react';
import { MessageCircle, Play, Star, Users, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-16 pb-20">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="h-4 w-4 mr-2 fill-current" />
              Trusted by 10,000+ Kenyan Professionals
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Master New Skills in 
              <span className="text-green-600 block">5 Minutes Daily</span>
              <span className="text-sm lg:text-lg font-normal text-gray-600 block mt-2">
                via WhatsApp 📱
              </span>
            </h1>

            <p className="text-lg lg:text-xl text-gray-600 mb-8 leading-relaxed">
              Learn digital marketing, English, entrepreneurship & vocational skills through bite-sized lessons delivered straight to your WhatsApp. Perfect for busy hustlers and students!
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">5min</div>
                <div className="text-sm text-gray-600">Daily Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">4</div>
                <div className="text-sm text-gray-600">Skill Tracks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">KES 50</div>
                <div className="text-sm text-gray-600">Per Week</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                onClick={onGetStarted}
                className="bg-green-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MessageCircle className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                Start Learning Today
              </motion.button>
              
              <motion.button 
                className="border-2 border-green-500 text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Play className="h-5 w-5 mr-2" />
                Watch Demo
              </motion.button>
            </div>

            {/* Social Proof */}
            <div className="mt-8 flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                10,000+ Learners
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                5-Min Lessons
              </div>
              <div className="flex items-center">
                <Award className="h-4 w-4 mr-1" />
                Certificates
              </div>
            </div>
          </motion.div>

          {/* Right Content - Hero Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 border">
              {/* WhatsApp Mock Interface */}
              <div className="bg-green-500 text-white p-4 rounded-t-xl -m-8 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-semibold">SkillBoost Coach</div>
                      <div className="text-xs opacity-75">Online now</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Messages */}
              <div className="space-y-4">
                <div className="bg-green-100 p-3 rounded-lg rounded-tl-none max-w-xs">
                  <p className="text-sm">🎯 Today's Lesson: Digital Marketing Basics</p>
                  <p className="text-xs text-gray-600 mt-1">Learn how to create compelling social media posts in just 5 minutes!</p>
                </div>
                
                <div className="bg-gray-100 p-3 rounded-lg rounded-tr-none max-w-xs ml-auto">
                  <p className="text-sm">Thanks! This is exactly what I needed 🙌</p>
                </div>

                <div className="bg-green-100 p-3 rounded-lg rounded-tl-none max-w-xs">
                  <p className="text-sm">✅ Lesson completed! Your progress: 75%</p>
                  <p className="text-xs text-gray-600 mt-1">Tomorrow: "Writing Headlines That Convert"</p>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div 
                className="absolute -top-4 -right-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                New Lesson!
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold"
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                Certificate Ready!
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;