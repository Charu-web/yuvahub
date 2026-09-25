import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Building2, 
  GraduationCap, 
  Accessibility, 
  FileCheck2, 
  CreditCard, 
  PhoneCall, 
  Maximize2, 
  X, 
  Sparkles, 
  UserCheck, 
  ChevronRight, 
  Download,
  Award,
  Users,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import ImageLightboxModal from './ImageLightboxModal';

export default function StandardNaukriMahotsav() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const contactNumbers = [
    { number: '7391966295', display: '73919 66295', label: 'हेल्पलाइन १' },
    { number: '9511910595', display: '95119 10595', label: 'हेल्पलाइन २' },
    { number: '9511910350', display: '95119 10350', label: 'हेल्पलाइन ३' },
  ];

  const eventFeatures = [
    {
      icon: <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />,
      label: 'Date / दिनांक',
      value: '25 October 2026 (२५ ऑक्टोबर २०२६)',
      sub: 'Sunday / रविवार (दिवसभर महामेळावा)',
      color: 'border-orange-200 bg-orange-50/60'
    },
    {
      icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />,
      label: 'Time / वेळ',
      value: '9:00 AM – 5:00 PM (सकाळी ९ ते सायं ५ वा.)',
      sub: 'Full Day Event (थेट कंपनी मुलाखती)',
      color: 'border-amber-200 bg-amber-50/60'
    },
    {
      icon: <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />,
      label: 'Location / ठिकाण',
      value: 'धाराशिव (Dharashiv, Maharashtra)',
      sub: 'भव्य खासदार नोकरी महोत्सव स्थळ',
      color: 'border-orange-200 bg-orange-50/60'
    },
    {
      icon: <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />,
      label: 'Participating Companies / कंपन्या',
      value: '50 National & International Companies',
      sub: 'महाराष्ट्रातील ५० राष्ट्रीय व आंतरराष्ट्रीय नामांकित कंपन्या',
      color: 'border-red-200 bg-red-50/60'
    },
    {
      icon: <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />,
      label: 'Eligibility / शैक्षणिक पात्रता',
      value: '5th, 10th, 12th, ITI, Diploma, Graduate, Post Graduate',
      sub: 'सर्व शाखा, फ्रेशर्स व अनुभव असलेले तरुण-तरुणी पात्र',
      color: 'border-amber-200 bg-amber-50/60'
    },
    {
      icon: <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />,
      label: 'Organizer / पुढाकार',
      value: 'मा. ओमराजे निंबाळकर',
      sub: 'खासदार, धाराशिव मतदार संघ',
      color: 'border-orange-200 bg-orange-50/60'
    }
  ];

  const highlights = [
    {
      icon: <FileCheck2 className="w-5 h-5 text-emerald-600 shrink-0" />,
      title: 'जागेवर तात्काळ नियुक्तीपत्र',
      subtitle: 'Spot Offer Letters for Selected Candidates',
      bg: 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
    },
    {
      icon: <CreditCard className="w-5 h-5 text-purple-600 shrink-0" />,
      title: 'विशेष Job Card वाटप',
      subtitle: 'Guaranteed Job Card for All Applicants',
      bg: 'bg-purple-50/80 border-purple-200 text-purple-900'
    },
    {
      icon: <Accessibility className="w-5 h-5 text-blue-600 shrink-0" />,
      title: 'दिव्यांग उमेदवारांना विशेष प्राधान्य',
      subtitle: 'Special Priority for Differently-Abled',
      bg: 'bg-blue-50/80 border-blue-200 text-blue-900'
    }
  ];

  return (
    <section id="standard-naukri-mahotsav" className="relative pt-6 pb-10 md:pt-8 md:pb-16 bg-gradient-to-b from-[#FFFDF9] via-[#FFF8F3] to-[#FFFDF9] border-y border-orange-100/80 scroll-mt-24">
      {/* Decorative background glow elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Main Section Outer Container */}
      <div className="w-[92%] max-w-[1700px] mx-auto px-2 sm:px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-primary font-bold text-xs sm:text-sm mb-3 shadow-xs">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span>विशेष महामेळावा घोषणा • Grand Employment Mega Drive 2026</span>
          </div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
            Naukri Mahotsav <span className="text-primary">2026</span>
          </h2>
          
          <div className="mt-2 inline-block bg-gradient-to-r from-orange-600 to-amber-600 text-transparent bg-clip-text text-xl sm:text-2xl md:text-3xl font-extrabold">
            खासदार नोकरी महोत्सव २०२६ • धाराशिव
          </div>

          <p className="mt-3 text-sm sm:text-base md:text-lg text-gray-700 font-medium max-w-3xl mx-auto leading-relaxed">
            धाराशिव मतदार संघातील सुशिक्षित तरुण-तरुणींसाठी नोकरीची सुवर्णसंधी !
            <br className="hidden sm:inline" />
            <span className="text-orange-950 font-bold ml-1">
              संधी मिळाली, लाभ घेऊया • आपले भवितव्य, उज्ज्वल बनवूया
            </span>
          </p>

          {/* Key Campaign Announcement Banner */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-100/80 border border-amber-300 text-amber-950 text-xs sm:text-sm font-black shadow-xs">
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            <span>निवड झालेल्या उमेदवारांना तात्काळ नियुक्तीपत्र</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 xl:gap-10 items-start">
          
          {/* LEFT COLUMN: Poster Card */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col">
            <div className="w-full bg-white p-3 sm:p-4 rounded-3xl shadow-xl border border-orange-200/90 flex flex-col justify-between group relative">
              
              {/* Top Zoom Badge */}
              <div 
                onClick={() => setLightboxOpen(true)}
                className="absolute top-6 right-6 z-20 bg-[#FF7A00] hover:bg-[#F05A00] text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-md cursor-pointer transition-transform hover:scale-105"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>मोठा बॅनर पहा</span>
              </div>

              {/* Poster Image Container */}
              <div 
                className="w-full flex items-center justify-center p-2 sm:p-3 overflow-hidden rounded-2xl cursor-pointer relative bg-orange-50/30"
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src="/naukri-mahotsav-dharashiv-2026.jpg"
                  alt="Naukri Mahotsav 2026 - खासदार नोकरी महोत्सव २०२६ धाराशिव अधिकृत बॅनर"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/Slider.jpg';
                  }}
                  className="w-full max-w-full h-auto object-contain rounded-xl block mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
                  loading="eager"
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    height: 'auto',
                    objectFit: 'contain',
                    display: 'block'
                  }}
                />
              </div>

              {/* Campaign Slogan */}
              <div className="mt-3 text-center px-2 py-2 rounded-xl bg-orange-50/80 border border-orange-200">
                <span className="text-xs sm:text-sm font-black text-orange-950">
                  आपला माणूस आपल्यासाठी • मा. ओमराजे निंबाळकर (खासदार, धाराशिव मतदार संघ)
                </span>
              </div>

              {/* Action Buttons under Poster */}
              <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3 w-full">
                <a
                  href="#nondani"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white py-3 px-2 sm:px-3 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 text-center"
                >
                  <UserCheck className="w-4 h-4 shrink-0" />
                  <span>Apply Online</span>
                </a>

                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white hover:bg-orange-50 border border-orange-200 text-gray-800 py-3 px-2 sm:px-3 font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 text-center"
                >
                  <Maximize2 className="w-4 h-4 text-primary shrink-0" />
                  <span>View Poster</span>
                </button>

                <button
                  type="button"
                  onClick={() => setContactModalOpen(true)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-orange-100/80 hover:bg-orange-100 border border-orange-300 text-orange-950 py-3 px-2 sm:px-3 font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 text-center"
                >
                  <PhoneCall className="w-4 h-4 text-primary shrink-0" />
                  <span>Contact</span>
                </button>
              </div>

              {/* QR Online Note */}
              <div className="mt-3 p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-center">
                <p className="text-[12px] sm:text-xs text-amber-900 font-medium leading-relaxed">
                  📱 <strong>ऑनलाईन नोंदणी:</strong> <strong>"Apply Online"</strong> वर क्लिक करा किंवा खालील फॉर्म भरा.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Clean Structured Event Info Cards */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between">
            <div className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-orange-100 h-full flex flex-col justify-between gap-6">
              
              {/* Event Header Banner */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-orange-500 text-white text-[11px] font-black uppercase px-3 py-0.5 rounded-full tracking-wider shadow-xs">
                      Official Mega Job Fair
                    </span>
                    <span className="bg-orange-100 text-primary text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      धाराशिव मतदार संघ
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900">
                    Naukri Mahotsav 2026
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-gray-700 mt-0.5">
                    खासदार मा. ओमराजे निंबाळकर यांच्या पुढाकाराने भव्य रोजगार महामेळावा
                  </p>
                </div>

                <div className="hidden sm:flex flex-col items-end bg-orange-50/80 px-4 py-2 rounded-2xl border border-orange-200/80">
                  <span className="text-[11px] text-gray-500 font-bold uppercase">कंपनी सहभाग</span>
                  <span className="text-xl font-black text-primary">50 कंपन्या</span>
                </div>
              </div>

              {/* Event Info Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {eventFeatures.map((item, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 rounded-2xl border ${item.color} transition-all hover:translate-y-[-1px] hover:shadow-xs flex flex-col justify-between`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-white shadow-xs border border-orange-100 shrink-0">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
                          {item.label}
                        </span>
                        <div className="text-sm sm:text-base font-extrabold text-gray-900 mt-0.5 leading-snug break-words">
                          {item.value}
                        </div>
                        <div className="text-xs text-gray-600 font-medium mt-1">
                          {item.sub}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Highlights Cards Row */}
              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-black tracking-wider uppercase text-gray-400">
                  मेळाव्याची प्रमुख वैशिष्ट्ये (Key Highlights)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {highlights.map((h, i) => (
                    <div key={i} className={`p-3.5 rounded-2xl border ${h.bg} flex flex-col gap-1.5`}>
                      <div className="flex items-center gap-2">
                        {h.icon}
                        <span className="text-xs font-bold leading-tight">{h.title}</span>
                      </div>
                      <span className="text-[11px] opacity-80 leading-snug">{h.subtitle}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Call Helplines Bar */}
              <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 p-4 rounded-2xl border border-orange-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <PhoneCall className="w-5 h-5 text-primary shrink-0 animate-bounce" />
                  <div>
                    <span className="text-xs font-bold text-gray-900 block leading-tight">
                      अधिक माहिती व मदतीसाठी संपर्क:
                    </span>
                    <span className="text-[11px] text-gray-600 font-medium">
                      सकाळी ९:०० ते संध्याकाळी ६:०० दरम्यान कॉल करा
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {contactNumbers.map((c, i) => (
                    <a
                      key={i}
                      href={`tel:${c.number}`}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-orange-100 border border-orange-200 text-gray-900 hover:text-primary text-xs font-black transition-colors shadow-2xs flex items-center gap-1.5"
                    >
                      <PhoneCall className="w-3 h-3 text-primary" />
                      <span>{c.display}</span>
                    </a>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Lightbox Modal */}
      <ImageLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageSrc="/naukri-mahotsav-dharashiv-2026.jpg"
        title="Naukri Mahotsav 2026 - खासदार नोकरी महोत्सव २०२६ धाराशिव अधिकृत बॅनर"
        subtitle="मा. ओमराजे निंबाळकर (खासदार, धाराशिव मतदार संघ)"
        category="अधिकृत महामेळावा बॅनर (Official Mega Job Fair Banner)"
        caption="धाराशिव मतदार संघातील सुशिक्षित तरुण-तरुणींसाठी नोकरीची सुवर्णसंधी ! दिनांक: २५ ऑक्टोबर २०२६ • स्थळ: धाराशिव • वेळ: सकाळी ९ ते सायं ५ वा."
        downloadUrl="/naukri-mahotsav-dharashiv-2026.jpg"
        downloadFilename="Dharashiv-Naukri-Mahotsav-2026.jpg"
        actionButton={
          <a
            href="#nondani"
            onClick={() => setLightboxOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-extrabold transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm text-center"
          >
            <span>आताच नोंदणी करा</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        }
      />

      {/* Helpline Contact Modal */}
      {contactModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setContactModalOpen(false)}
        >
          <div 
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-orange-200 relative animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setContactModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-2xl bg-orange-100 text-primary flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900">अधिकृत संपर्क क्रमांक</h3>
                <p className="text-xs text-gray-500 font-medium">खासदार नोकरी महोत्सव २०२६ - धाराशिव</p>
              </div>
            </div>

            <div className="space-y-2.5 my-6">
              {contactNumbers.map((c, i) => (
                <a
                  key={i}
                  href={`tel:${c.number}`}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-orange-200 bg-orange-50/50 hover:bg-orange-100 transition-all text-gray-900 font-bold group"
                >
                  <div className="flex items-center gap-3">
                    <span className="size-8 rounded-xl bg-white text-primary flex items-center justify-center text-xs font-extrabold shadow-2xs">
                      {i + 1}
                    </span>
                    <div>
                      <span className="text-xs text-gray-500 block leading-tight">{c.label}</span>
                      <span className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">{c.display}</span>
                    </div>
                  </div>
                  <PhoneCall className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
                </a>
              ))}
            </div>

            <p className="text-[11px] text-gray-400 text-center">
              मेळावा स्थळ: धाराशिव • दिनांक: २५ ऑक्टोबर २०२६ • वेळ: सकाळी ९ ते सायं ५ वा.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
