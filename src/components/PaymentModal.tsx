import React, { useState } from 'react';
import { X, CreditCard, Shield, CheckCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPayment, createUser, enrollUserInTrack } from '../lib/supabase';
import { formatKenyanPhoneNumber, isValidKenyanPhoneNumber, getPlanAmount, calculateExpiryDate } from '../lib/mpesa';

interface PaymentModalProps {
  plan: string;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ plan, onClose }) => {
  const [step, setStep] = useState(1);
  const [paymentData, setPaymentData] = useState({
    phoneNumber: '',
    email: '',
    name: '',
    whatsappNumber: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');

  const planDetails = {
    'Free Trial': { price: 0, period: '3 days', features: ['3 free lessons', '1 learning track', 'WhatsApp delivery'] },
    'Weekly Plan': { price: 50, period: 'per week', features: ['Unlimited lessons', '1 track', 'Progress tracking', 'Priority support'] },
    'Monthly Premium': { price: 150, period: 'per month', features: ['All tracks', 'Certificates', 'Mentor sessions', 'Job placement'] }
  };

  const currentPlan = planDetails[plan as keyof typeof planDetails];

  const handleInitiatePayment = async () => {
    if (!paymentData.name || !paymentData.whatsappNumber) {
      alert('Please fill in all required fields');
      return;
    }

    if (!isValidKenyanPhoneNumber(paymentData.whatsappNumber)) {
      alert('Please enter a valid Kenyan phone number');
      return;
    }

    if (currentPlan.price > 0 && !isValidKenyanPhoneNumber(paymentData.phoneNumber)) {
      alert('Please enter a valid M-Pesa phone number');
      return;
    }

    setIsProcessing(true);
    setStep(2);

    try {
      // Create user in database
      const userData = {
        name: paymentData.name,
        whatsapp_number: formatKenyanPhoneNumber(paymentData.whatsappNumber),
        email: paymentData.email || undefined,
        subscription_plan: plan.toLowerCase().includes('weekly') ? 'weekly' : 
                          plan.toLowerCase().includes('monthly') ? 'monthly' : 'free',
        subscription_status: currentPlan.price === 0 ? 'active' : 'inactive',
        subscription_expires_at: currentPlan.price === 0 ? calculateExpiryDate(plan) : undefined
      };

      const user = await createUser(userData);

      if (currentPlan.price === 0) {
        // Free trial - no payment needed
        setPaymentStatus('success');
        setStep(3);
        setIsProcessing(false);
        return;
      }

      // Create payment record
      const paymentRecord = await createPayment({
        user_id: user.id,
        amount: currentPlan.price,
        currency: 'KES',
        plan: plan,
        payment_method: 'mpesa',
        phone_number: formatKenyanPhoneNumber(paymentData.phoneNumber),
        status: 'pending'
      });

      // In a real implementation, you would call the M-Pesa STK Push API here
      // For demo purposes, we'll simulate the payment process
      setTimeout(() => {
        setPaymentStatus('success');
        setStep(3);
        setIsProcessing(false);
      }, 3000);

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      setIsProcessing(false);
      setStep(3);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <div className="text-center mb-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Enrollment</h2>
              <p className="text-gray-600">You're subscribing to {plan}</p>
            </div>

            {/* Plan Summary */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{plan}</span>
                <span className="text-lg font-bold">
                  {currentPlan.price === 0 ? 'FREE' : `KES ${currentPlan.price}`}
                </span>
              </div>
              <div className="text-sm text-gray-600">{currentPlan.period}</div>
              <div className="mt-3 space-y-1">
                {currentPlan.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* User Information Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={paymentData.name}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number *
                </label>
                <input
                  type="tel"
                  value={paymentData.whatsappNumber}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is where you'll receive your daily lessons
                </p>
              </div>

              {currentPlan.price > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    M-Pesa Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={paymentData.phoneNumber}
                    onChange={(e) => setPaymentData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter the number you'll use to pay with M-Pesa
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={paymentData.email}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  For receipts and updates
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center space-x-2 mt-6 p-3 bg-blue-50 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
              <p className="text-sm text-blue-700">
                Your payment is secured by M-Pesa and our encrypted systems
              </p>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center">
            <div className="mb-6">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader className="h-8 w-8 text-yellow-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentPlan.price === 0 ? 'Setting Up Your Trial' : 'Payment In Progress'}
              </h2>
              <p className="text-gray-600 mb-6">
                {currentPlan.price === 0 
                  ? 'Please wait while we set up your free trial...'
                  : 'Check your phone for the M-Pesa payment prompt'
                }
              </p>
            </div>

            {currentPlan.price > 0 && (
              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h3 className="font-semibold mb-2">📱 Complete Payment on Your Phone</h3>
                <ol className="text-sm text-left space-y-2">
                  <li>1. Check your phone for M-Pesa prompt</li>
                  <li>2. Enter your M-Pesa PIN</li>
                  <li>3. Confirm payment of KES {currentPlan.price}</li>
                  <li>4. Wait for confirmation</li>
                </ol>
              </div>
            )}

            <div className="text-sm text-gray-500">
              This may take up to 2 minutes...
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <div className="mb-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {paymentStatus === 'success' ? 'Welcome to SkillBoost!' : 'Enrollment Failed'}
              </h2>
              {paymentStatus === 'success' ? (
                <div>
                  <p className="text-gray-600 mb-6">
                    Your {plan} is now active! You'll receive your first lesson on WhatsApp shortly.
                  </p>
                  
                  <div className="bg-green-50 p-4 rounded-lg mb-6">
                    <h3 className="font-semibold mb-2">What happens next?</h3>
                    <ul className="text-sm space-y-1 text-left">
                      <li>✅ Welcome message sent to WhatsApp</li>
                      <li>✅ First lesson delivered within 1 hour</li>
                      <li>✅ Daily lessons at your preferred time</li>
                      <li>✅ Progress tracking activated</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={onClose}
                      className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                    >
                      Start Learning Now!
                    </button>
                    
                    <p className="text-xs text-gray-500">
                      You can reply "STOP" to pause lessons anytime
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 mb-6">
                    Enrollment could not be completed. Please try again or contact support.
                  </p>
                  
                  <div className="space-y-3">
                    <button
                      onClick={() => setStep(1)}
                      className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
                    >
                      Try Again
                    </button>
                    
                    <button
                      onClick={onClose}
                      className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-sm text-gray-500">
              {step === 1 ? 'Enrollment Details' : step === 2 ? 'Processing' : 'Complete'}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Step Content */}
          {renderStep()}

          {/* Footer */}
          {step === 1 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              
              <button
                onClick={handleInitiatePayment}
                disabled={!paymentData.name || !paymentData.whatsappNumber || (currentPlan.price > 0 && !paymentData.phoneNumber)}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentPlan.price === 0 ? 'Start Free Trial' : `Pay KES ${currentPlan.price}`}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;