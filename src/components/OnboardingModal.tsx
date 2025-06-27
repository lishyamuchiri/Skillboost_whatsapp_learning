import React, { useState } from 'react';
import { X, MessageCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingModalProps {
  onClose: () => void;
  onSelectPlan: (plan: string) => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose, onSelectPlan }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    whatsappNumber: '',
    selectedTracks: [] as string[],
    preferredTime: '9:00 AM',
    goal: ''
  });

  const tracks = [
    { id: 'digital', name: 'Digital Marketing', icon: '📱', desc: 'Social media, ads, content' },
    { id: 'english', name: 'English Mastery', icon: '🗣️', desc: 'Business English, speaking' },
    { id: 'business', name: 'Entrepreneurship', icon: '💼', desc: 'Business planning, finance' },
    { id: 'vocational', name: 'Vocational Skills', icon: '🔧', desc: 'Project management, trades' }
  ];

  const goals = [
    'Get a better job',
    'Start my own business',
    'Improve my current role',
    'Learn new skills for fun',
    'Prepare for opportunities'
  ];

  const handleTrackToggle = (trackId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedTracks: prev.selectedTracks.includes(trackId)
        ? prev.selectedTracks.filter(id => id !== trackId)
        : [...prev.selectedTracks, trackId]
    }));
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Complete onboarding, show plan selection
      setStep(5);
    }
  };

  const handlePlanSelect = (plan: string) => {
    onSelectPlan(plan);
    onClose();
  };

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.name.length > 0;
      case 2: return formData.whatsappNumber.length > 9;
      case 3: return formData.selectedTracks.length > 0;
      case 4: return formData.goal.length > 0;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="text-center">
            <div className="mb-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SkillBoost Kenya!</h2>
              <p className="text-gray-600">Let's personalize your learning experience</p>
            </div>
            
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">What's your name?</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your full name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center">
            <div className="mb-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">WhatsApp Number</h2>
              <p className="text-gray-600">We'll send your daily lessons here</p>
            </div>
            
            <div className="text-left">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your WhatsApp Number</label>
              <input
                type="tel"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                placeholder="+254 7XX XXX XXX"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Include country code (e.g., +254 for Kenya)
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <div className="mb-6">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Tracks</h2>
              <p className="text-gray-600">Select the skills you want to learn (you can choose multiple)</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {tracks.map((track) => (
                <div
                  key={track.id}
                  onClick={() => handleTrackToggle(track.id)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.selectedTracks.includes(track.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{track.icon}</span>
                    <div className="text-left">
                      <h3 className="font-medium text-gray-900">{track.name}</h3>
                      <p className="text-sm text-gray-600">{track.desc}</p>
                    </div>
                    {formData.selectedTracks.includes(track.id) && (
                      <CheckCircle className="h-5 w-5 text-green-500 ml-auto" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center">
            <div className="mb-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Learning Goal</h2>
              <p className="text-gray-600">What do you hope to achieve with SkillBoost?</p>
            </div>
            
            <div className="space-y-3">
              {goals.map((goal) => (
                <div
                  key={goal}
                  onClick={() => setFormData(prev => ({ ...prev, goal }))}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-all text-left ${
                    formData.goal === goal
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{goal}</span>
                    {formData.goal === goal && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred lesson time</label>
              <select
                value={formData.preferredTime}
                onChange={(e) => setFormData(prev => ({ ...prev, preferredTime: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="7:00 AM">7:00 AM</option>
                <option value="9:00 AM">9:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="6:00 PM">6:00 PM</option>
                <option value="8:00 PM">8:00 PM</option>
              </select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center">
            <div className="mb-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfect! You're All Set</h2>
              <p className="text-gray-600 mb-6">
                Hi {formData.name}! Choose your plan to start receiving lessons on WhatsApp
              </p>
            </div>

            <div className="space-y-4">
              <div 
                onClick={() => handlePlanSelect('Free Trial')}
                className="p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-green-300 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <h3 className="font-semibold">Start Free Trial</h3>
                    <p className="text-sm text-gray-600">3 days free • 1 track</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">FREE</div>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => handlePlanSelect('Weekly Plan')}
                className="p-4 border-2 border-green-500 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <h3 className="font-semibold">Weekly Plan</h3>
                    <p className="text-sm text-gray-600">Most popular • Full access</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">KES 50</div>
                    <div className="text-xs text-gray-500">per week</div>
                  </div>
                </div>
              </div>

              <div 
                onClick={() => handlePlanSelect('Monthly Premium')}
                className="p-4 border-2 border-purple-500 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <h3 className="font-semibold">Monthly Premium</h3>
                    <p className="text-sm text-gray-600">Best value • All tracks + mentoring</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">KES 150</div>
                    <div className="text-xs text-gray-500">per month</div>
                  </div>
                </div>
              </div>
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
            <div className="text-sm text-gray-500">Step {step} of 4</div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Progress Bar */}
          {step < 5 && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          )}

          {/* Step Content */}
          {renderStep()}

          {/* Footer */}
          {step < 5 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                {step > 1 ? 'Back' : 'Cancel'}
              </button>
              
              <button
                onClick={handleNext}
                disabled={!isStepValid()}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>{step === 4 ? 'Complete' : 'Next'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingModal;