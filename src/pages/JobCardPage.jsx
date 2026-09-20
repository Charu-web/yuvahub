import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import RegistrationForm from '../components/RegistrationForm';
import JobCardBanner from '../components/JobCardBanner';
import Footer from '../components/Footer';
import AntigravityBackground from '../components/AntigravityBackground';
import { ShieldCheck, Sparkles, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JobCardPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fdfaf6] selection:bg-orange-500 selection:text-white">
      {/* Antigravity Layer */}
      <AntigravityBackground />

      {/* Header Navbar */}
      <Navbar />

      {/* Main Page Content */}
      <main className="flex-1 relative z-10 pt-24 sm:pt-28 pb-12 animate-slide-up">
        <div className="w-[94%] max-w-[1600px] mx-auto px-2 sm:px-4">
          
          {/* Breadcrumb Navigation Bar */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-orange-200 text-gray-700 hover:text-primary font-bold text-xs shadow-xs transition-all hover:shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-primary" />
              <span>मुख्य पृष्ठावर परत जा (Back to Home)</span>
            </Link>

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-primary text-xs font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>विशेष युवा रोजगार PVC जॉब कार्ड २०२६</span>
            </div>
          </div>

          {/* Job Card Banner Feature */}
          <JobCardBanner />

          {/* Registration Form Component */}
          <div className="mt-8">
            <RegistrationForm />
          </div>

        </div>
      </main>

      {/* Footer */}
      <Footer className="relative z-10" />
    </div>
  );
}
