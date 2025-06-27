import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Grace Wanjiku",
      role: "Small Business Owner, Nairobi",
      avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      content: "SkillBoost helped me learn digital marketing in just 5 weeks! My business sales increased by 200% after implementing what I learned. The WhatsApp format made it so easy to learn during my commute.",
      rating: 5,
      track: "Digital Marketing Graduate"
    },
    {
      name: "James Ochieng",
      role: "University Student, Kisumu",
      avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      content: "The English lessons transformed my communication skills! I now confidently present in class and even got selected for a leadership position. The daily 5-minute lessons fit perfectly with my busy schedule.",
      rating: 5,
      track: "English Mastery Graduate"
    },
    {
      name: "Mary Kiprotich",
      role: "Freelance Consultant, Eldoret",
      avatar: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      content: "I was skeptical about learning through WhatsApp, but SkillBoost proved me wrong! The entrepreneurship track gave me the tools to scale my consulting business. Now I earn 3x more than before.",
      rating: 5,
      track: "Entrepreneurship Graduate"
    },
    {
      name: "Peter Mwangi",
      role: "Electrician, Mombasa",
      avatar: "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      content: "The vocational skills track improved my project management abilities. I can now handle bigger contracts and my clients trust me more. The certificate also helped me get more professional jobs.",
      rating: 5,
      track: "Vocational Skills Graduate"
    },
    {
      name: "Sarah Akinyi",
      role: "Shop Owner, Nakuru",
      avatar: "https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      content: "Learning while working was impossible until I found SkillBoost. The bite-sized lessons helped me master social media marketing. My shop now has 5000+ followers and regular online customers!",
      rating: 5,
      track: "Digital Marketing Graduate"
    },
    {
      name: "David Kiplagat",
      role: "Teacher, Kericho",
      avatar: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1",
      content: "SkillBoost's teaching methodology is brilliant! As an educator, I appreciate how complex topics are broken down into digestible lessons. I completed 3 tracks and now offer private tutoring services.",
      rating: 5,
      track: "Multiple Tracks Graduate"
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
    <section id="testimonials" className="py-20 bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Success Stories from Kenya
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how SkillBoost Kenya has transformed careers and businesses across the country
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 relative"
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-green-200" />
              
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">
                "{testimonial.content}"
              </p>

              <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium inline-block">
                {testimonial.track}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 bg-white p-8 rounded-2xl shadow-lg border"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">10,000+</div>
              <div className="text-gray-600">Successful Graduates</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Course Completion Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">4.9/5</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">47</div>
              <div className="text-gray-600">Counties Reached</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;