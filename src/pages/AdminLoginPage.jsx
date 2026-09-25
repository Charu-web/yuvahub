import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, Eye, EyeOff, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Check if session already active
  useEffect(() => {
    const token = localStorage.getItem('yuvahub_admin_token');
    if (!token) {
      setCheckingAuth(false);
      return;
    }

    fetch('/api/admin/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          navigate('/admin', { replace: true });
        } else {
          localStorage.removeItem('yuvahub_admin_token');
          localStorage.removeItem('yuvahub_admin_user');
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        setCheckingAuth(false);
      });
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('कृपया ईमेल आणि पासवर्ड दोन्ही प्रविष्ट करा.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() })
      });

      const data = await res.json();

      if (data.success && data.token) {
        localStorage.setItem('yuvahub_admin_token', data.token);
        localStorage.setItem('yuvahub_admin_user', JSON.stringify(data.admin));
        navigate('/admin', { replace: true });
      } else {
        setError(data.error || 'अवैध क्रेडेंशियल्स. कृपया तपासा.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('सर्व्हरशी संपर्क होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-slate-300">
          <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">प्रशासकीय सत्र तपासत आहे...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex flex-col justify-between text-slate-100 selection:bg-orange-500 selection:text-white">
      {/* Top Bar Navigation */}
      <header className="p-4 sm:p-6 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40 backdrop-blur-md">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-orange-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>मुख्य वेबसाइटवर परत जा</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>प्रणाली सुरक्षित (SSL Encrypted)</span>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle Decorative Gradient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/15 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header & Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 text-white shadow-lg shadow-orange-500/30 mb-4 border border-orange-400/30">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              YuvaHub Admin Portal
            </h1>
            <p className="text-sm font-semibold text-orange-400 mt-1">
              नोकरी महोत्सव २०२६ • प्रशासकीय नियंत्रण कक्ष
            </p>
            <p className="text-xs text-slate-400 mt-2">
              फक्त अधिकृत प्रशासकीय लॉगिनसाठी (Restricted Access)
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">लॉगिन अयशस्वी</p>
                <p className="text-xs text-red-300/90 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ईमेल किंवा युझरनेम (Admin Email / Username)
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ईमेल आयडी किंवा युझरनेम"
                  className="w-full bg-slate-950/70 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                पासवर्ड (Password)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/70 border border-slate-700 rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 hover:from-orange-500 hover:to-amber-400 focus:ring-4 focus:ring-orange-500/30 transition-all duration-200 shadow-lg shadow-orange-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>लॉगिन होत आहे...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>प्रशासक लॉगिन (Secure Sign In)</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-slate-500 border-t border-slate-800/60 bg-slate-950/40">
        © 2026 YuvaHub • नोकरी महोत्सव २०२६ • सर्व हक्क सुरक्षित
      </footer>
    </div>
  );
}
