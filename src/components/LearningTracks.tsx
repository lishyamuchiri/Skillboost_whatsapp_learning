import React from 'react';
import { Smartphone, Globe, Briefcase, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';

const LearningTracks = () => {
  const tracks = [
    {
      icon: Smartphone,
      title: "Digital Marketing",
      description: "Master social media marketing, content creation, and online advertising",
      lessons: 30,
      duration: "6 weeks",
      skills: ["Social Media", "Content Marketing", "Facebook Ads", "SEO Basics"],
      color: "bg-blue-500",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      icon: Globe,
      title: "English Mastery",
      description: "Improve business English, pronunciation, and professional communication",
      lessons: 35,
      duration: "7 weeks",
      skills: ["Business English", "Pronunciation", "Writing", "Presentations"],
      color: "bg-purple-500",
      bgGradient: "from-purple-50 to-purple-100"
    },
    {
      icon: Briefcase,
      title: "Entrepreneurship",
      description: "Learn business planning, customer service, and financial management",
      lessons: 25,
      duration: "5 weeks",
      skills: ["Business Planning", "Customer Service", "Finance", "Marketing"],
      color: "bg-orange-500",
      bgGradient: "from-orange-50 to-orange-100"
    },
    {
      icon: Wrench,
      title: "Vocational Skills",
      description: "Essential skills for trades, project management, and professional development",
      lessons: 28,
      duration: "6 weeks",
      skills: ["Project Management", "Quality Control", "Safety", "Leadership"],
      color: "bg-green-500",
      bgGradient: "from-green-50 to-green-100"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <section id="tracks" className="py-20 bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Learning Track
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the skills that matter most to your career and start learning today
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-8"
        >
          {tracks.map((track, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`bg-gradient-to-br ${track.bgGradient} p-8 rounded-2xl border border-white/50 hover:shadow-xl transition-all duration-300 group cursor-pointer`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className={`${track.color} w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <track.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">{track.lessons} lessons</div>
                  <div className="text-sm text-gray-600">{track.duration}</div>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {track.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {track.description}
              </p>

              <div className="mb-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">What you'll learn:</h4>
                <div className="flex flex-wrap gap-2">
                  {track.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className="px-3 py-1 bg-white/70 text-gray-700 text-sm rounded-full border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <button className="w-full bg-white text-gray-900 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-sm">
                Start This Track
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center bg-white p-8 rounded-2xl shadow-sm border"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            🎓 Multiple Tracks Available
          </h3>
          <p className="text-gray-600 mb-6">
            Subscribe to premium and access all learning tracks. Mix and match skills to create your perfect learning journey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>All tracks included in premium</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Switch between tracks anytime</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Progress tracking across all skills</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningTracks;