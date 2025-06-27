import React from 'react';
import { Check, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface PricingProps {
  onSelectPlan: (plan: string) => void;
}

const Pricing: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const plans = [
    {
      name: "Free Trial",
      price: "KES 0",
      period: "3 days",
      description: "Perfect to get started",
      features: [
        "3 free lessons",
        "1 learning track",
        "Basic progress tracking",
        "WhatsApp delivery",
        "Community access"
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "border-gray-200"
    },
    {
      name: "Weekly Plan",
      price: "KES 50",
      period: "per week",
      description: "Most popular for beginners",
      features: [
        "Unlimited lessons",
        "1 learning track of choice",
        "Progress tracking & badges",
        "WhatsApp delivery",
        "Priority support",
        "Weekly progress reports"
      ],
      cta: "Choose Weekly",
      popular: true,
      color: "border-green-500"
    },
    {
      name: "Monthly Premium",
      price: "KES 150",
      period: "per month",
      description: "Best value for serious learners",
      features: [
        "All learning tracks",
        "Unlimited lessons",
        "Certificates & badges",
        "WhatsApp delivery",
        "Priority support",
        "Weekly progress reports",
        "1-on-1 mentor sessions",
        "Job placement assistance"
      ],
      cta: "Go Premium",
      popular: false,
      color: "border-purple-500"
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
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Simple, Affordable Pricing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Choose the plan that fits your learning goals and budget. All plans include WhatsApp delivery and progress tracking.
          </p>
          
          {/* Value Proposition */}
          <div className="inline-flex items-center bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
            <Zap className="h-4 w-4 mr-2" />
            Save 40% with monthly plan vs daily coffee costs!
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-8"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative bg-white border-2 ${plan.color} rounded-2xl p-8 ${plan.popular ? 'shadow-xl scale-105' : 'shadow-lg'} hover:shadow-xl transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                onClick={() => onSelectPlan(plan.name)}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  plan.popular
                    ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {plan.cta}
              </motion.button>
            </motion.div>
          ))}
        </motion.div>

        {/* Money Back Guarantee */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            💰 7-Day Money-Back Guarantee
          </h3>
          <p className="text-gray-600 mb-4">
            Not satisfied with your learning experience? Get a full refund within 7 days, no questions asked.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>No setup fees</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="text-green-500">✓</span>
              <span>M-Pesa payments</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;