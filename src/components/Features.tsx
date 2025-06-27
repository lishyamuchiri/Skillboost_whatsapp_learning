import React from 'react';
import { MessageCircle, Clock, Smartphone, Award, Users, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: MessageCircle,
      title: "WhatsApp Integration",
      description: "Learn directly through WhatsApp - no new apps to download or complicated logins required."
    },
    {
      icon: Clock,
      title: "5-Minute Lessons",
      description: "Bite-sized content that fits perfectly into your busy schedule. Learn during commute or breaks."
    },
    {
      icon: Smartphone,
      title: "Mobile-First Learning",
      description: "Optimized for mobile devices with offline capabilities and low data usage."
    },
    {
      icon: Award,
      title: "Certificates & Badges",
      description: "Earn recognized certificates and skill badges to showcase your achievements."
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Connect with fellow learners, share progress, and get motivation from the community."
    },
    {
      icon: Zap,
      title: "AI-Powered Content",
      description: "Personalized learning paths adapted to your pace and learning style."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose SkillBoost Kenya?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We've designed the perfect learning experience for busy Kenyan professionals and students
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gradient-to-br from-gray-50 to-green-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                <feature.icon className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-green-600">10,000+</div>
            <div className="text-sm text-gray-600">Active Learners</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">95%</div>
            <div className="text-sm text-gray-600">Completion Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">4.9/5</div>
            <div className="text-sm text-gray-600">User Rating</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-green-600">24/7</div>
            <div className="text-sm text-gray-600">Support Available</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;