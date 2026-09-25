import React, { useState, useEffect } from 'react';
import {
  User,
  Users,
  Calendar,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  Building2,
  Layers,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Printer,
  Download,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  RotateCw,
  Clock,
  Check,
  Send,
  Settings
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function RegistrationForm() {
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  // Email Verification State
  const [maskedEmail, setMaskedEmail] = useState('');
  const [isEmailCodeSent, setIsEmailCodeSent] = useState(false);
  const [emailCodeValue, setEmailCodeValue] = useState('');
  const [emailCodeError, setEmailCodeError] = useState('');
  const [configErrorNotice, setConfigErrorNotice] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    gender: '',
    dateOfBirth: '',
    contactNumber: '',
    emailAddress: '',
    permanentAddress: '',
    district: '',
    state: '',
    pincode: '',
    // Step 2
    educationalQualification: '',
    coreStream: '',
    yearOfPassing: '',
    professionalStatus: '',
    totalWorkExperience: '',
    currentJobProfile: '',
    skillsSummary: '',
    // Step 3
    targetIndustries: '',
    preferredJobLocation: '',
    candidateDeclaration: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [candidateId, setCandidateId] = useState('');

  // 60-Second Countdown Timer
  useEffect(() => {
    let timer = null;
    if (isTimerActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0 && isTimerActive) {
      setIsTimerActive(false);
      setEmailCodeError('पडताळणी कोड कालबाह्य झाला आहे. कृपया नवीन कोड मागवा (Code expired. Please resend).');
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerActive, countdown]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    // If email changes after sending code, reset verification
    if (field === 'emailAddress' && isEmailCodeSent && !isEmailVerified) {
      setIsEmailCodeSent(false);
      setEmailCodeValue('');
      setEmailCodeError('');
      setConfigErrorNotice('');
      setIsTimerActive(false);
    }
  };

  // 1. Send Email Verification Code to Backend
  const handleSendEmailCode = async () => {
    const cleanEmail = formData.emailAddress.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail) {
      setErrors((prev) => ({ ...prev, emailAddress: 'कृपया ईमेल आयडी प्रविष्ट करा.' }));
      toast.error('कृपया ईमेल आयडी प्रविष्ट करा.', 'ईमेल आवश्यक');
      return;
    }

    if (!emailRegex.test(cleanEmail)) {
      setErrors((prev) => ({ ...prev, emailAddress: 'कृपया वैध ईमेल आयडी प्रविष्ट करा.' }));
      toast.error('कृपया वैध ईमेल आयडी प्रविष्ट करा.', 'अवैध ईमेल');
      return;
    }

    setIsSendingCode(true);
    setEmailCodeError('');
    setConfigErrorNotice('');

    try {
      const response = await fetch('/api/email/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsEmailCodeSent(true);
        setMaskedEmail(data.maskedEmail || cleanEmail);
        setCountdown(60);
        setIsTimerActive(true);
        setEmailCodeValue('');
        setEmailCodeError('');
        toast.success(`Verification code sent to ${data.maskedEmail}`, 'Code Sent Successfully');
      } else {
        // DO NOT show success if email delivery failed
        setIsEmailCodeSent(false);
        if (data.isConfigError) {
          setConfigErrorNotice(data.error);
        } else {
          setEmailCodeError(data.error || 'Unable to send verification code. Please try again.');
        }
        toast.error(data.error || 'Unable to send verification code. Please try again.', 'त्रुटी (Error)');
      }
    } catch (err) {
      console.error('Error sending email code:', err);
      setIsEmailCodeSent(false);
      setEmailCodeError('Unable to send verification code. Please try again.');
      toast.error('Unable to send verification code. Please try again.', 'Network Error');
    } finally {
      setIsSendingCode(false);
    }
  };

  // 2. Resend Email Code
  const handleResendEmailCode = () => {
    if (countdown > 0) return;
    handleSendEmailCode();
  };

  // 3. Verify Email Code
  const handleVerifyEmailCode = async () => {
    const cleanEmail = formData.emailAddress.trim().toLowerCase();
    const cleanCode = emailCodeValue.trim();

    if (!cleanCode || cleanCode.length !== 6) {
      setEmailCodeError('कृपया ६ अंकी पडताळणी कोड प्रविष्ट करा (Enter 6-digit code).');
      toast.error('कृपया ६ अंकी कोड प्रविष्ट करा.', 'कोड आवश्यक');
      return;
    }

    setIsVerifyingCode(true);
    setEmailCodeError('');

    try {
      const response = await fetch('/api/email/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          code: cleanCode,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setIsEmailVerified(true);
        setIsEmailCodeSent(false);
        setIsTimerActive(false);
        setEmailCodeError('');
        setConfigErrorNotice('');
        toast.success('Email Verified ✓', 'ईमेल पडताळणी पूर्ण');
      } else {
        setEmailCodeError(data.error || 'Invalid verification code. Please enter the correct code.');
        toast.error(data.error || 'Invalid verification code.', 'सत्यापन अयशस्वी');
      }
    } catch (err) {
      console.error('Error verifying email code:', err);
      setEmailCodeError('सर्व्हरशी संपर्क होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा.');
      toast.error('सत्यापन करताना त्रुटी आली.', 'Network Error');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // Step Validation
  const validateStep = (step) => {
    const errs = {};
    if (step === 1) {
      if (!formData.fullName.trim()) errs.fullName = 'पूर्ण नाव आवश्यक आहे';
      if (!formData.gender) errs.gender = 'लिंग निवडणे आवश्यक आहे';
      if (!formData.dateOfBirth) errs.dateOfBirth = 'जन्मदिनांक आवश्यक आहे';
      if (!formData.contactNumber.trim() || formData.contactNumber.length < 10) {
        errs.contactNumber = '१० अंकी मोबाईल क्रमांक आवश्यक आहे';
      }
      if (!formData.emailAddress.trim()) {
        errs.emailAddress = 'ईमेल आयडी आवश्यक आहे';
      } else if (!isEmailVerified) {
        errs.emailAddress = 'कृपया पुढे जाण्यापूर्वी ईमेल पडताळणी पूर्ण करा (Please verify email first)';
      }
    } else if (step === 2) {
      if (!formData.educationalQualification.trim())
        errs.educationalQualification = 'शैक्षणिक पात्रता आवश्यक आहे';
      if (!formData.professionalStatus)
        errs.professionalStatus = 'सध्याची स्थिती निवडणे आवश्यक आहे';
    } else if (step === 3) {
      if (!formData.targetIndustries)
        errs.targetIndustries = 'कृपया आवडते क्षेत्र निवडा';
      if (!formData.preferredJobLocation)
        errs.preferredJobLocation = 'कृपया पसंतीचे ठिकाण निवडा';
      if (!formData.candidateDeclaration)
        errs.candidateDeclaration = 'कृपया उमेदवाराचे घोषणापत्र स्वीकारा';
    }
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error('कृपया सर्व आवश्यक माहिती भरा व ईमेल पडताळणी करा.', 'माहिती अपूर्ण');
      return false;
    }
    return true;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: document.getElementById('nondani')?.offsetTop - 80, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) {
      setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const generatedId = data.candidateId || data._id || data.id;
        setCandidateId(generatedId);
        setRegistrationSuccess(true);
        toast.success(`नोंदणी यशस्वी! आपला नोंदणी क्रमांक: ${generatedId}`, 'नोंदणी यशस्वी!');
      } else if (response.status === 409) {
        // Candidate already registered with this phone / email
        const existingId = data.existingCandidateId;
        if (existingId) {
          setCandidateId(existingId);
          setRegistrationSuccess(true);
          toast.info(`आपली आधीच नोंदणी झालेली आहे. आपला Candidate ID: ${existingId}`, 'नोंदणी आधीच अस्तित्वात');
        } else {
          toast.error(data.error || 'या मोबाईल किंवा ईमेलद्वारे आधीच नोंदणी झालेली आहे.', 'नोंदणी आधीच अस्तित्वात');
        }
      } else {
        toast.error(data.error || 'नोंदणी करताना त्रुटी आली. कृपया सर्व माहिती तपासा.', 'नोंदणी अयशस्वी');
      }
    } catch (err) {
      console.error('Registration submit error:', err);
      toast.error('सर्व्हरशी संपर्क होऊ शकला नाही. कृपया इंटरनेट कनेक्शन तपासा.', 'Network Error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      gender: '',
      dateOfBirth: '',
      contactNumber: '',
      emailAddress: '',
      permanentAddress: '',
      district: '',
      state: '',
      pincode: '',
      educationalQualification: '',
      coreStream: '',
      yearOfPassing: '',
      professionalStatus: '',
      totalWorkExperience: '',
      currentJobProfile: '',
      skillsSummary: '',
      targetIndustries: '',
      preferredJobLocation: '',
      candidateDeclaration: false
    });
    setCurrentStep(1);
    setIsEmailVerified(false);
    setIsEmailCodeSent(false);
    setEmailCodeValue('');
    setEmailCodeError('');
    setConfigErrorNotice('');
    setIsTimerActive(false);
    setRegistrationSuccess(false);
    setErrors({});
  };

  const stepList = [
    { num: 1, label: 'वैयक्तिक माहिती' },
    { num: 2, label: 'शैक्षणिक माहिती' },
    { num: 3, label: 'नोकरीची माहिती' },
    { num: 4, label: 'पुष्टीकरण' }
  ];

  const inputClass =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 md:py-3 text-[14px] md:text-[15px] font-normal text-gray-800 outline-none transition focus:border-[#ea580c] focus:ring-2 focus:ring-orange-500/20';

  return (
    <section id="nondani" className="mx-auto mt-6 md:mt-10 w-full max-w-[1600px] px-3 sm:px-6 lg:px-10 xl:px-16 scroll-mt-24">
      {/* Mobile Registration Header Visual Banner (CSS-Based) */}
      <div className="md:hidden relative overflow-hidden rounded-[20px] bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-4 border border-indigo-500/30 shadow-md mb-3 text-white">
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-blue-500/20 rounded-full blur-xl pointer-events-none"></div>
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-bold mb-1">
              <Briefcase className="w-3 h-3 text-blue-400" />
              <span>मोफत नोंदणी २०२६</span>
            </div>
            <h3 className="text-lg font-black text-white leading-tight">
              उमेदवार नोंदणी – सुवर्ण संधी
            </h3>
            <p className="text-[11px] text-blue-200 mt-0.5 font-medium">
              महाराष्ट्रातील ५०+ प्रमुख कंपन्यांचा सहभाग
            </p>
          </div>
          <div className="size-14 sm:size-16 rounded-xl overflow-hidden border border-white/20 shadow-xs shrink-0">
            <img
              src="/career-job-opportunity.jpg"
              alt="नोकरी व करिअर संधी"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Tablet Registration Header Visual Banner */}
      <div className="hidden md:flex lg:hidden relative overflow-hidden rounded-[24px] bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-5 border border-indigo-500/30 shadow-md mb-4 text-white items-center justify-between">
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold mb-1.5">
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            <span>मोफत उमेदवार नोंदणी महामेळावा २०२६</span>
          </div>
          <h3 className="text-xl font-black text-white leading-tight">
            आपली माहिती भरा आणि नामांकित कंपन्यांमध्ये नोकरी मिळवा
          </h3>
        </div>
        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <img
            src="/career-job-opportunity.jpg"
            alt="नोकरी व करिअर संधी"
            className="w-24 h-16 rounded-xl object-cover border border-white/20 shadow-md"
            loading="lazy"
          />
          <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-center text-xs font-bold text-blue-200 backdrop-blur-xs">
            <span className="block text-amber-400 font-extrabold text-sm">50+</span> कंपन्या
          </div>
        </div>
      </div>

      {/* Stepper Bar (Mobile & Tablet) */}
      <div className="lg:hidden w-full px-2 py-3 bg-white rounded-2xl border border-orange-100 shadow-sm mb-4">
        <div className="flex items-center justify-between relative max-w-sm mx-auto px-2">
          <div className="absolute top-4 left-6 right-6 h-[2px] border-t-2 border-dashed border-gray-200 -z-0"></div>
          {stepList.map((step) => {
            const isActive = currentStep === step.num || currentStep > step.num;
            return (
              <div key={step.num} className="flex flex-col items-center z-10">
                <div
                  className={`size-8 sm:size-9 rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-300 ${
                    isActive
                      ? 'bg-[#ea580c] text-white shadow-md shadow-orange-500/30 scale-105'
                      : 'bg-gray-100 text-gray-500 border border-gray-200'
                  }`}
                >
                  {step.num}
                </div>
                <span
                  className={`mt-1.5 text-[10px] sm:text-[11px] font-bold text-center leading-tight ${
                    isActive ? 'text-[#ea580c]' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Registration Card Container with Soft Radial Glow */}
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/15 via-indigo-500/20 to-cyan-500/15 rounded-3xl blur-2xl pointer-events-none -z-10"></div>
        <div className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm flex flex-col lg:flex-row min-h-[600px] lg:min-h-[700px] relative z-10">
        {/* Left Side Promotional Panel (Desktop) */}
        <div className="hidden lg:flex w-full shrink-0 flex-col bg-[#fff8f3] p-6 pb-8 lg:w-[380px] xl:w-[430px] border-r border-orange-100 justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-primary text-xs font-bold w-fit mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>मोफत उमेदवार नोंदणी २०२६</span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#ea580c]">
              उमेदवार नोंदणी
            </h2>
            <p className="mt-2 text-sm font-semibold text-gray-700">
              आपली माहिती भरा आणि नामांकित कंपन्यांमध्ये नोकरीच्या सुवर्णसंधी मिळवा
            </p>

            {/* Stepper Vertical Indicator on Desktop */}
            <div className="mt-6 flex flex-col gap-3">
              {stepList.map((step) => {
                const isCurrent = currentStep === step.num;
                const isPassed = currentStep > step.num;
                return (
                  <div
                    key={step.num}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                      isCurrent
                        ? 'bg-white shadow-sm border border-orange-200 text-primary font-bold'
                        : isPassed
                        ? 'text-green-700 bg-green-50/70'
                        : 'text-gray-400'
                    }`}
                  >
                    <div
                      className={`size-7 rounded-full flex items-center justify-center text-xs font-black ${
                        isCurrent
                          ? 'bg-primary text-white shadow-sm'
                          : isPassed
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isPassed ? '✓' : step.num}
                    </div>
                    <span className="text-xs font-bold">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI-Generated Career & Employment Visual Card */}
          <div className="mt-auto pt-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 p-5 text-white border border-indigo-500/30 shadow-xl group">
              {/* Glowing circles & ambient orbs */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

              {/* Light floating particle grid pattern */}
              <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:14px_14px] opacity-15 pointer-events-none"></div>

              <div className="relative z-10">
                {/* AI-Generated Job/Career Image */}
                <div className="relative w-full h-36 rounded-xl overflow-hidden mb-3.5 border border-white/15 shadow-md">
                  <img
                    src="/career-job-opportunity.jpg"
                    alt="नोकरी व करिअर संधी २०२६"
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[11px] font-bold">
                    <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                    <span>करिअर संधी २०२६</span>
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>

                <h4 className="text-base font-extrabold text-white tracking-tight leading-snug">
                  ५०+ नामांकित कंपन्यांमध्ये थेट मुलाखती
                </h4>
                <p className="mt-1.5 text-xs text-blue-200/90 leading-relaxed font-medium">
                  खासदार नोकरी महोत्सवाच्या माध्यमातून आपल्या कौशल्यानुसार योग्य नोकरी व उज्ज्वल भविष्याची संधी मिळवा.
                </p>

                {/* Feature Badges */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-200">
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/10 border border-white/10 backdrop-blur-xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>तात्काळ नियुक्ती</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-white/10 border border-white/10 backdrop-blur-xs">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                    <span>सर्व शाखा</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Multi-Step Form */}
        <div className="flex-1 px-4 py-5 sm:p-6 lg:p-10 flex flex-col">
          {!registrationSuccess ? (
            <form onSubmit={currentStep === 4 ? handleFinalSubmit : handleNext} className="flex-1 flex flex-col justify-between">
              {/* STEP 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="mb-2 border-b border-orange-100 pb-3">
                    <h3 className="text-xl md:text-2xl font-black text-[#ea580c]">
                      १. वैयक्तिक माहिती
                    </h3>
                    <div className="w-12 h-1 bg-[#ea580c] rounded-full mt-1.5 lg:hidden"></div>
                  </div>

                  <div className="grid gap-4 md:gap-5 md:grid-cols-3">
                    {/* Full Name */}
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-[13px] md:text-[14px] leading-snug font-semibold text-gray-700">
                        Full Name (First Name - Father's Name - Surname) / पूर्ण नाव (नाव - वडिलांचे नाव - आडनाव)
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <User className="size-4 sm:size-5" />
                        </div>
                        <input
                          type="text"
                          className={`${inputClass} pl-10 sm:pl-11 ${errors.fullName ? 'border-red-400 bg-red-50/20' : ''}`}
                          placeholder="उदा. रोहन विजय पाटील"
                          value={formData.fullName}
                          onChange={(e) => updateField('fullName', e.target.value)}
                        />
                      </div>
                      {errors.fullName && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.fullName}</p>}
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="mb-1.5 block text-[13px] md:text-[14px] leading-snug font-semibold text-gray-700">
                        Gender / लिंग <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <Users className="size-4 sm:size-5" />
                        </div>
                        <select
                          className={`${inputClass} pl-10 sm:pl-11 appearance-none bg-white ${errors.gender ? 'border-red-400 bg-red-50/20' : ''}`}
                          value={formData.gender}
                          onChange={(e) => updateField('gender', e.target.value)}
                        >
                          <option value="">निवडा (Select)</option>
                          <option value="male">Male (पुरुष)</option>
                          <option value="female">Female (महिला)</option>
                          <option value="other">Other (इतर)</option>
                        </select>
                      </div>
                      {errors.gender && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.gender}</p>}
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="mb-1.5 block text-[13px] md:text-[14px] leading-snug font-semibold text-gray-700">
                        Date of Birth / जन्मदिनांक <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <Calendar className="size-4 sm:size-5" />
                        </div>
                        <input
                          type="date"
                          className={`${inputClass} pl-10 sm:pl-11 ${errors.dateOfBirth ? 'border-red-400 bg-red-50/20' : ''}`}
                          value={formData.dateOfBirth}
                          onChange={(e) => updateField('dateOfBirth', e.target.value)}
                        />
                      </div>
                      {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.dateOfBirth}</p>}
                    </div>

                    {/* Contact Number (Standard Registration Field) */}
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-[13px] md:text-[14px] leading-snug font-semibold text-gray-700">
                        Contact Number (WhatsApp No) / संपर्क क्रमांक (व्हॉट्सॲप नंबर)
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <Phone className="size-4 sm:size-5" />
                        </div>
                        <input
                          type="tel"
                          maxLength={10}
                          className={`${inputClass} pl-10 sm:pl-11 ${errors.contactNumber ? 'border-red-400 bg-red-50/20' : ''}`}
                          placeholder="10 अंकी मोबाईल क्रमांक (उदा. 9876543210)"
                          value={formData.contactNumber}
                          onChange={(e) => updateField('contactNumber', e.target.value.replace(/\D/g, ''))}
                        />
                      </div>
                      {errors.contactNumber && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{errors.contactNumber}</p>
                      )}
                    </div>

                    {/* EMAIL ADDRESS & VERIFICATION AUTHENTICATION SECTION */}
                    <div className="md:col-span-3 mt-1">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-[13px] md:text-[14px] leading-snug font-semibold text-gray-700">
                          Email Address / ईमेल आयडी
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        {isEmailVerified && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200 animate-fade-in">
                            <Check className="size-3 stroke-[3]" />
                            <span>Email Verified ✓ (ईमेल सत्यापित)</span>
                          </span>
                        )}
                      </div>

                      <div className="flex gap-2 items-center">
                        <div className="relative flex-1">
                          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                            <Mail className="size-4 sm:size-5" />
                          </div>
                          <input
                            type="email"
                            className={`${inputClass} pl-10 sm:pl-11 ${
                              isEmailVerified
                                ? 'bg-gray-50 border-green-300 text-gray-700 font-semibold cursor-not-allowed'
                                : errors.emailAddress
                                ? 'border-red-400 bg-red-50/20'
                                : ''
                            }`}
                            placeholder="उदा. name@example.com"
                            value={formData.emailAddress}
                            onChange={(e) => updateField('emailAddress', e.target.value)}
                            disabled={isEmailVerified || isSendingCode}
                          />
                        </div>

                        {!isEmailVerified && (
                          <button
                            type="button"
                            onClick={handleSendEmailCode}
                            disabled={isSendingCode || !formData.emailAddress.includes('@')}
                            className="rounded-xl px-4 sm:px-5 py-2.5 md:py-3 text-xs sm:text-sm font-bold text-white transition shrink-0 whitespace-nowrap shadow-sm bg-[#ea580c] hover:bg-[#ea580c]/90 active:scale-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                          >
                            <Send className="size-3.5" />
                            <span>{isSendingCode ? 'Sending Code...' : isEmailCodeSent ? 'Resend Code' : 'Send Verification Code'}</span>
                          </button>
                        )}
                      </div>

                      {errors.emailAddress && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{errors.emailAddress}</p>
                      )}

                      {/* SMTP Configuration Notice if .env is missing ईमेल or पासवर्ड */}
                      {configErrorNotice && (
                        <div className="mt-3 p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs animate-fade-in space-y-1.5">
                          <div className="flex items-center gap-1.5 font-bold text-amber-800">
                            <Settings className="size-4 text-amber-700" />
                            <span>Email Provider Setup Required in .env</span>
                          </div>
                          <p className="leading-relaxed">
                            {configErrorNotice}
                          </p>
                          <p className="text-[11px] text-amber-700 font-medium">
                            कृपया <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">.env</code> फाईलमध्ये <code className="font-mono">ईमेल</code> आणि <code className="font-mono">पासवर्ड</code> (Gmail App Password) प्रविष्ट करा.
                          </p>
                        </div>
                      )}

                      {/* EMAIL CODE VERIFICATION DRAWER (ONLY SHOWN IF EMAIL WAS ACTUALLY DISPATCHED) */}
                      {isEmailCodeSent && !isEmailVerified && (
                        <div className="mt-3.5 p-4 sm:p-5 bg-gradient-to-br from-orange-50 via-white to-orange-50/60 border border-orange-200 rounded-2xl shadow-xs animate-fade-in">
                          {/* Target Email Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-orange-100">
                            <div>
                              <span className="text-xs sm:text-sm font-bold text-gray-800 block">
                                Verification code sent to{' '}
                                <span className="font-mono text-primary font-extrabold">
                                  {maskedEmail}
                                </span>
                              </span>
                              <span className="text-[11px] text-gray-500">
                                कृपया आपल्या ईमेल इनबॉक्स/स्पॅम फोल्डरमध्ये आलेला ६ अंकी कोड प्रविष्ट करा (Valid for 5 minutes).
                              </span>
                            </div>
                          </div>

                          {/* Code Input & Verify Button */}
                          <div className="mt-3.5 flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                            <div className="relative flex-1 sm:max-w-xs">
                              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                <KeyRound className="size-4" />
                              </div>
                              <input
                                type="text"
                                placeholder="६ अंकी कोड टाका"
                                maxLength={6}
                                value={emailCodeValue}
                                onChange={(e) => {
                                  setEmailCodeValue(e.target.value.replace(/\D/g, ''));
                                  setEmailCodeError('');
                                }}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-orange-300 text-sm font-bold tracking-widest text-center outline-none bg-white focus:border-primary focus:ring-2 focus:ring-orange-500/20"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={handleVerifyEmailCode}
                              disabled={isVerifyingCode || emailCodeValue.length < 6}
                              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition shadow-sm active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              {isVerifyingCode ? (
                                <span>Verifying...</span>
                              ) : (
                                <>
                                  <ShieldCheck className="size-4" />
                                  <span>Verify Email (पडताळणी करा)</span>
                                </>
                              )}
                            </button>

                            {/* Resend Code & 60s Countdown */}
                            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 sm:pt-0">
                              {countdown > 0 ? (
                                <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                                  <Clock className="size-3.5 text-gray-400" />
                                  <span>पुन्हा कोड मागवा ({countdown}s)</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={handleResendEmailCode}
                                  disabled={isSendingCode}
                                  className="text-xs font-bold text-primary hover:text-primary-dark transition flex items-center gap-1 underline underline-offset-2 cursor-pointer"
                                >
                                  <RotateCw className="size-3" />
                                  <span>Resend Code (पुन्हा पाठवा)</span>
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Inline Error Message */}
                          {emailCodeError && (
                            <div className="mt-2.5 p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-start gap-2 animate-fade-in">
                              <AlertCircle className="size-4 shrink-0 text-red-500 mt-0.5" />
                              <span>{emailCodeError}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* General Error Message when drawer is not open */}
                      {!isEmailCodeSent && emailCodeError && (
                        <div className="mt-2.5 p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-semibold flex items-start gap-2 animate-fade-in">
                          <AlertCircle className="size-4 shrink-0 text-red-500 mt-0.5" />
                          <span>{emailCodeError}</span>
                        </div>
                      )}
                    </div>

                    {/* Permanent Address */}
                    <div className="md:col-span-3">
                      <label className="mb-1.5 block text-[13px] md:text-[14px] leading-snug font-semibold text-gray-700">
                        Permanent Address / कायमस्वरूपी पत्ता
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-3 text-gray-400 pointer-events-none">
                          <MapPin className="size-4 sm:size-5" />
                        </div>
                        <textarea
                          rows={2}
                          className={`${inputClass} pl-10 sm:pl-11 resize-none`}
                          placeholder="Permanent Address (As per Aadhar Card)"
                          value={formData.permanentAddress}
                          onChange={(e) => updateField('permanentAddress', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* District */}
                    <div>
                      <label className="mb-1.5 block text-[13px] md:text-[14px] leading-snug font-semibold text-gray-700">
                        District / जिल्हा
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="उदा. पुणे / Pune"
                        value={formData.district}
                        onChange={(e) => updateField('district', e.target.value)}
                      />
                    </div>

                    {/* State */}
                    <div>
                      <label className="mb-1.5 block text-[13px] md:text-[14px] leading-snug font-semibold text-gray-700">
                        State / राज्य
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="महाराष्ट्र / Maharashtra"
                        value={formData.state}
                        onChange={(e) => updateField('state', e.target.value)}
                      />
                    </div>

                    {/* Pincode */}
                    <div>
                      <label className="mb-1.5 block text-[13px] md:text-[14px] leading-snug font-semibold text-gray-700">
                        Pincode / पिनकोड
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        className={inputClass}
                        placeholder="उदा. 411033"
                        value={formData.pincode}
                        onChange={(e) => updateField('pincode', e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Educational & Professional Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="mb-2 border-b border-orange-100 pb-3">
                    <h3 className="text-xl md:text-2xl font-black text-[#ea580c]">
                      २. शिक्षण आणि अनुभव
                    </h3>
                    <div className="w-12 h-1 bg-[#ea580c] rounded-full mt-1.5 lg:hidden"></div>
                  </div>

                  <div className="grid gap-4 md:gap-5 md:grid-cols-3">
                    {/* Educational Qualification */}
                    <div>
                      <label className="mb-1.5 block text-[13px] md:text-[14px] leading-snug font-semibold text-gray-700">
                        Educational Qualification / शैक्षणिक पात्रता <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <GraduationCap className="size-4 sm:size-5" />
                        </div>
                        <input
                          type="text"
                          className={`${inputClass} pl-10 sm:pl-11 ${errors.educationalQualification ? 'border-red-400 bg-red-50/20' : ''}`}
                          placeholder="e.g. 10th, 12th, ITI, Diploma, BE, B.Com, MBA"
                          value={formData.educationalQualification}
                          onChange={(e) => updateField('educationalQualification', e.target.value)}
                        />
                      </div>
                      {errors.educationalQualification && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{errors.educationalQualification}</p>
                      )}
                    </div>

                    {/* Core Stream */}
                    <div className="md:col-span-2">
                      <label className="mb-1.5 block text-[13px] md:text-[14px] leading-snug font-semibold text-gray-700">
                        Core Stream / Branch / Specialization / मुख्य शाखा
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="e.g. Mechanical, Computer Science, Commerce, Electrical, Science"
                        value={formData.coreStream}
                        onChange={(e) => updateField('coreStream', e.target.value)}
                      />
                    </div>

                    {/* Year of Passing */}
                    <div>
                      <label className="mb-1.5 block text-[13px] md:text-[14px] leading-snug font-semibold text-gray-700">
                        Year of Passing / उत्तीर्ण झालेले वर्ष
                      </label>
                      <input
                        type="number"
                        min="1980"
                        max="2027"
                        className={inputClass}
                        placeholder="उदा. 2024"
                        value={formData.yearOfPassing}
                        onChange={(e) => updateField('yearOfPassing', e.target.value)}
                      />
                    </div>

                    {/* Professional Status */}
                    <div>
                      <label className="mb-1.5 block text-[13px] md:text-[14px] leading-snug font-semibold text-gray-700">
                        Professional Status / सध्याची स्थिती <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        className={`${inputClass} appearance-none bg-white ${errors.professionalStatus ? 'border-red-400 bg-red-50/20' : ''}`}
                        value={formData.professionalStatus}
                        onChange={(e) => updateField('professionalStatus', e.target.value)}
                      >
                        <option value="">निवडा (Select)</option>
                        <option value="looking">Looking for Job (नोकरीच्या शोधात)</option>
                        <option value="working">Working (सध्या कार्यरत)</option>
                        <option value="student">Fresher / Student (विद्यार्थी)</option>
                      </select>
                      {errors.professionalStatus && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{errors.professionalStatus}</p>
                      )}
                    </div>

                    {/* Total Work Experience */}
                    <div>
                      <label className="mb-1.5 block text-[13px] md:text-[14px] leading-snug font-semibold text-gray-700">
                        Total Work Experience / एकूण कामाचा अनुभव
                      </label>
                      <select
                        className={`${inputClass} appearance-none bg-white`}
                        value={formData.totalWorkExperience}
                        onChange={(e) => updateField('totalWorkExperience', e.target.value)}
                      >
                        <option value="">निवडा (Select)</option>
                        <option value="0">Less than 1 Year (१ वर्षापेक्षा कमी)</option>
                        <option value="1-2">1 to 2 Years (१ ते २ वर्षे)</option>
                        <option value="2-5">2 to 5 Years (२ ते ५ वर्षे)</option>
                        <option value="5+">More than 5 Years (५ वर्षांपेक्षा जास्त)</option>
                        <option value="internship">Internship done (इंटर्नशिप पूर्ण)</option>
                      </select>
                    </div>

                    {/* Current / Last Job Profile & Company */}
                    <div className="md:col-span-3">
                      <label className="mb-1.5 block text-[13px] md:text-[14px] leading-snug font-semibold text-gray-700">
                        Current / Last Job Profile & Company Name
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="उदा. CNC Operator at ABC Corp / Fresher"
                        value={formData.currentJobProfile}
                        onChange={(e) => updateField('currentJobProfile', e.target.value)}
                      />
                    </div>

                    {/* Technical & Soft Skills Summary */}
                    <div className="md:col-span-3">
                      <label className="mb-1.5 block text-[13px] md:text-[14px] leading-snug font-semibold text-gray-700">
                        Technical & Soft Skills Summary / तांत्रिक आणि इतर कौशल्ये
                      </label>
                      <input
                        type="text"
                        className={inputClass}
                        placeholder="उदा. AutoCAD, Tally ERP, Python, MS Office, English Communication, Machine Operation"
                        value={formData.skillsSummary}
                        onChange={(e) => updateField('skillsSummary', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Job Preferences & Undertaking */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="mb-2 border-b border-orange-100 pb-3">
                    <h3 className="text-xl md:text-2xl font-black text-[#ea580c]">
                      ३. नोकरीची पसंती आणि घोषणापत्र
                    </h3>
                    <div className="w-12 h-1 bg-[#ea580c] rounded-full mt-1.5 lg:hidden"></div>
                  </div>

                  <div className="grid gap-4 md:gap-5 md:grid-cols-3">
                    {/* Target Industries */}
                    <div className="md:col-span-3">
                      <label className="mb-1.5 block text-[13px] md:text-[14px] leading-snug font-semibold text-gray-700">
                        Target Industries / Sectors You Want to Interview For / क्षेत्र <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        className={`${inputClass} appearance-none bg-white ${errors.targetIndustries ? 'border-red-400 bg-red-50/20' : ''}`}
                        value={formData.targetIndustries}
                        onChange={(e) => updateField('targetIndustries', e.target.value)}
                      >
                        <option value="">-- क्षेत्र निवडा (Choose Sector) --</option>
                        <option value="it">Information Technology (IT) / Software Development</option>
                        <option value="nonit">Non-IT Core Engineering & Manufacturing / Automobile</option>
                        <option value="bfsi">Banking, Financial Services & Insurance (BFSI)</option>
                        <option value="retail">Retail, FMCG & Consumer Goods</option>
                        <option value="logistics">Logistics, Supply Chain & Warehousing</option>
                        <option value="healthcare">Healthcare, Pharmaceuticals & Medical Devices</option>
                        <option value="bpo">Customer Support, Telecalling, BPO & KPO</option>
                        <option value="sales">Sales, Business Development & Field Marketing</option>
                        <option value="admin">Back Office, Admin, HR & Data Entry</option>
                        <option value="accounts">Accounts, Finance & Taxation (Tally / GST)</option>
                        <option value="digital">Digital Marketing, Graphic Design & Media</option>
                        <option value="hospitality">Hospitality, Hotel Management, Travel</option>
                        <option value="education">Education, Teaching & Training</option>
                        <option value="security">Security, Facility Management & Maintenance</option>
                        <option value="other">Other (इतर)</option>
                      </select>
                      {errors.targetIndustries && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{errors.targetIndustries}</p>
                      )}
                    </div>

                    {/* Preferred Job Location */}
                    <div className="md:col-span-3">
                      <label className="mb-1.5 block text-[13px] md:text-[14px] leading-snug font-semibold text-gray-700">
                        Preferred Job Location / पसंतीचे ठिकाण <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        className={`${inputClass} appearance-none bg-white ${errors.preferredJobLocation ? 'border-red-400 bg-red-50/20' : ''}`}
                        value={formData.preferredJobLocation}
                        onChange={(e) => updateField('preferredJobLocation', e.target.value)}
                      >
                        <option value="">निवडा (Select Location)</option>
                        <option value="dharashiv">Dharashiv (धाराशिव)</option>
                        <option value="yavatmal">Yavatmal (यवतमाळ)</option>
                        <option value="washim">Washim (वाशिम)</option>
                        <option value="digras">Digras (डिग्रस)</option>
                        <option value="all">All Maharashtra / सर्व ठिकाणे</option>
                      </select>
                      {errors.preferredJobLocation && (
                        <p className="text-red-500 text-xs mt-1 font-semibold">{errors.preferredJobLocation}</p>
                      )}
                    </div>

                    {/* Declaration Undertaking */}
                    <div className={`md:col-span-3 mt-2 bg-orange-50/80 p-4 rounded-xl border ${errors.candidateDeclaration ? 'border-red-300 bg-red-50/20' : 'border-orange-200'}`}>
                      <label className="flex items-start gap-3 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          className="mt-1 size-5 shrink-0 accent-[#ea580c] cursor-pointer"
                          checked={formData.candidateDeclaration}
                          onChange={(e) => updateField('candidateDeclaration', e.target.checked)}
                        />
                        <div className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                          <span className="font-bold text-gray-900 block mb-1">
                            Candidate Declaration Undertaking / उमेदवाराचे घोषणापत्र
                          </span>
                          मी याद्वारे प्रमाणित करतो/करते की मी दिलेली वरील सर्व माहिती सत्य व बिनचूक आहे. नोकरी मेळाव्यामध्ये दिलेल्या नियमांचे मी काटेकोर पालन करेन.
                        </div>
                      </label>
                      {errors.candidateDeclaration && (
                        <p className="text-red-500 text-xs mt-2 font-semibold">{errors.candidateDeclaration}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Confirmation */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="mb-2 border-b border-orange-100 pb-3">
                    <h3 className="text-xl md:text-2xl font-black text-[#ea580c]">
                      ४. माहिती पुष्टीकरण (Review & Confirm)
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">
                      कृपया आपण भरलेली माहिती तपासून घ्या व 'अंतिम अर्ज सादर करा' वर क्लिक करा.
                    </p>
                  </div>

                  <div className="bg-orange-50/40 rounded-xl p-4 sm:p-5 border border-orange-200 space-y-4 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-orange-100">
                      <div>
                        <span className="text-gray-500 block">पूर्ण नाव:</span>
                        <span className="font-bold text-gray-900">{formData.fullName || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">लिंग / Gender:</span>
                        <span className="font-bold text-gray-900 capitalize">{formData.gender || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">मोबाईल क्रमांक:</span>
                        <span className="font-bold text-gray-900">{formData.contactNumber || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">ईमेल:</span>
                        <span className="font-bold text-gray-900 flex items-center gap-1">
                          <span>{formData.emailAddress || '-'}</span>
                          {isEmailVerified && <span className="text-green-600 font-bold text-xs">✓ Verified</span>}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3 border-b border-orange-100">
                      <div>
                        <span className="text-gray-500 block">शैक्षणिक पात्रता:</span>
                        <span className="font-bold text-gray-900">{formData.educationalQualification || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">शाखा / Specialization:</span>
                        <span className="font-bold text-gray-900">{formData.coreStream || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">सध्याची स्थिती:</span>
                        <span className="font-bold text-gray-900 capitalize">{formData.professionalStatus || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">अनुभव:</span>
                        <span className="font-bold text-gray-900">{formData.totalWorkExperience || 'Fresher'}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <span className="text-gray-500 block">आवडते क्षेत्र:</span>
                        <span className="font-bold text-primary capitalize">{formData.targetIndustries || '-'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block">पसंतीचे ठिकाण:</span>
                        <span className="font-bold text-primary uppercase">{formData.preferredJobLocation || '-'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Navigation Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 pt-5">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gray-100 text-gray-700 px-6 py-3 text-sm md:text-base font-bold hover:bg-gray-200 transition order-2 sm:order-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>मागे</span>
                  </button>
                ) : (
                  <div className="hidden sm:block"></div>
                )}

                {currentStep < 4 ? (
                  <button
                    type="submit"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] px-8 py-3.5 text-sm md:text-base font-extrabold text-white shadow-lg shadow-orange-500/25 transition active:scale-[0.99] order-1 sm:order-2 ml-auto cursor-pointer"
                  >
                    <span>पुढे</span>
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-8 py-3.5 text-sm md:text-base font-extrabold text-white shadow-lg shadow-green-600/30 transition active:scale-[0.99] order-1 sm:order-2 ml-auto disabled:opacity-75 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>नोंदणी होत आहे...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        <span>अंतिम अर्ज सादर करा (Submit)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          ) : (
            /* Registration Success Screen & Digital Pass */
            <div className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-6 animate-fade-in">
              <div className="size-16 sm:size-20 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4 shadow-inner">
                <CheckCircle2 className="size-10 sm:size-12 stroke-[2.5]" />
              </div>

              <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-black rounded-full mb-2">
                नोंदणी यशस्वी झाली!
              </span>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                अभिनंदन, {formData.fullName}!
              </h3>
              <p className="mt-2 text-sm text-gray-600 max-w-md">
                आपला भव्य नोकरी मेळावा २०२६ साठीचा अर्ज यशस्वीरीत्या नोंदवला गेला आहे.
              </p>

              {/* Digital Registration Pass Card */}
              <div className="mt-6 w-full max-w-md bg-gradient-to-br from-orange-50 via-white to-orange-50/50 border-2 border-dashed border-orange-300 rounded-2xl p-5 shadow-sm text-left">
                <div className="flex justify-between items-center pb-3 border-b border-orange-200">
                  <div className="flex items-center gap-2">
                    <img src="/logo3.png" alt="Logo" className="w-7 h-7 rounded-full border border-primary" />
                    <span className="text-xs font-bold text-gray-800">उमेदवार प्रवेश पास</span>
                  </div>
                  <span className="text-[11px] font-bold text-primary bg-white px-2 py-0.5 rounded border border-orange-200">
                    Job Fair 2026
                  </span>
                </div>

                <div className="py-3 space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">उमेदवार नोंदणी क्रमांक:</span>
                    <span className="font-mono font-black text-primary text-sm sm:text-base">{candidateId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">नाव:</span>
                    <span className="font-bold text-gray-900">{formData.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">मोबाईल:</span>
                    <span className="font-semibold text-gray-800">{formData.contactNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">ईमेल:</span>
                    <span className="font-semibold text-gray-800">{formData.emailAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">पात्रता:</span>
                    <span className="font-semibold text-gray-800">{formData.educationalQualification}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">स्थळ:</span>
                    <span className="font-semibold text-gray-800">धाराशिव (Dharashiv)</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-orange-200 flex justify-between items-center text-[11px] text-gray-500">
                  <span>दिनांक: २५ ऑक्टोबर २०२६</span>
                  <span>वेळ: स. ९:०० ते सायं. ५:००</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 text-xs sm:text-sm font-bold hover:bg-gray-100 transition cursor-pointer"
                >
                  <Printer className="size-4" />
                  <span>पास प्रिंट करा</span>
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold hover:bg-primary-hover transition shadow-md cursor-pointer"
                >
                  <span>नवीन नोंदणी करा</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </section>
  );
}
