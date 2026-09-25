import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import AntigravityBackground from './components/AntigravityBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import StandardNaukriMahotsav from './components/StandardNaukriMahotsav';
import StatsCounter from './components/StatsCounter';
import RegistrationForm from './components/RegistrationForm';
import EmployersSection from './components/EmployersSection';
import JobCardBanner from './components/JobCardBanner';
import UpdatesNotice from './components/UpdatesNotice';
import FacebookUpdatesSection from './components/FacebookUpdatesSection';
import BlogsSection from './components/BlogsSection';
import DownloadsSection from './components/DownloadsSection';
import VenueAndFAQ from './components/VenueAndFAQ';
import Footer from './components/Footer';
import { ToastProvider } from './context/ToastContext';
import JobCardPage from './pages/JobCardPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

/**
 * Main Single Page Homepage Component with Responsive Hero Image Slider
 */
function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const sectionId = location.hash.replace('#', '');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.hash]);

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-orange-500 selection:text-white overflow-x-hidden">
      {/* Antigravity Interactive Background Layer */}
      <AntigravityBackground />

      {/* Sticky Header Navbar */}
      <Navbar />

      {/* Main Page Body */}
      <main className="flex-1 relative z-10">
        {/* Homepage Hero Image Slider */}
        <Hero />

        {/* Standard Naukri Mahotsav 2026 Event Section */}
        <StandardNaukriMahotsav />

        {/* Live Counters */}
        <StatsCounter />

        {/* Interactive Candidate Registration Form & Job Card Area */}
        <RegistrationForm />

        {/* Grand Job Fair & Employers Section */}
        <EmployersSection />

        {/* PVC Job Card Guarantee Banner */}
        <JobCardBanner />

        {/* Latest Notices & Updates */}
        <UpdatesNotice />

        {/* Official Facebook Social Feed & Latest Updates */}
        <FacebookUpdatesSection />

        {/* Career Guidance & Blogs */}
        <BlogsSection />

        {/* Resource Downloads */}
        <DownloadsSection />

        {/* Venue Map & FAQs */}
        <VenueAndFAQ />
      </main>

      {/* Official Footer */}
      <Footer className="relative z-10" />
    </div>
  );
}

/**
 * Universal Application Router Wrapper
 */
export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Homepage */}
          <Route path="/" element={<HomePage />} />

          {/* Admin Panel Routes */}
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Job Card & Registration Routes */}
          <Route path="/job-card" element={<JobCardPage />} />
          <Route path="/job-card-registration" element={<JobCardPage />} />
          <Route path="/registration" element={<JobCardPage />} />
          <Route path="/candidate-registration" element={<JobCardPage />} />
          <Route path="/nondani" element={<JobCardPage />} />

          {/* Alias Section Routes */}
          <Route path="/mahotsav" element={<HomePage />} />
          <Route path="/event-details" element={<HomePage />} />
          <Route path="/employers" element={<HomePage />} />
          <Route path="/jobs" element={<HomePage />} />
          <Route path="/blogs" element={<HomePage />} />
          <Route path="/downloads" element={<HomePage />} />
          <Route path="/venue" element={<HomePage />} />

          {/* Catch-all Fallback Route */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
