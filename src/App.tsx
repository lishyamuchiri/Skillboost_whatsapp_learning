import React from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import LearningTracks from './components/LearningTracks';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import OnboardingModal from './components/OnboardingModal';
import PaymentModal from './components/PaymentModal';
import { useState } from 'react';

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const handleGetStarted = () => {
    setShowOnboarding(true);
  };

  const handleSelectPlan = (plan: string) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <Header />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Hero onGetStarted={handleGetStarted} />
        <Features />
        <LearningTracks />
        <Pricing onSelectPlan={handleSelectPlan} />
        <Testimonials />
      </motion.main>
      <Footer />
      
      {showOnboarding && (
        <OnboardingModal 
          onClose={() => setShowOnboarding(false)} 
          onSelectPlan={handleSelectPlan}
        />
      )}
      
      {showPayment && (
        <PaymentModal 
          plan={selectedPlan}
          onClose={() => setShowPayment(false)} 
        />
      )}
    </div>
  );
}

export default App;