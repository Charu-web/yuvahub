import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AntigravityBackground from '../components/AntigravityBackground';
import { ArrowLeft, Sparkles, Download, ArrowRight, AlertCircle, Home } from 'lucide-react';

export default function BannerDetailPage() {
  const { id } = useParams();

  const banners = [
    {
      id: "1",
      src: '/Slider.jpg',
      alt: 'भव्य नोकरी महोत्सव २०२६ - यवतमाळ वाशिम लोकसभा मतदारसंघ Banner',
      title: 'भव्य नोकरी महोत्सव २०२६ विशेष डिजिटल बॅनर',
      subtitle: 'यवतमाळ - वाशिम लोकसभा मतदारसंघ अधिकृत उपक्रम',
      category: 'डिजिटल बॅनर (Official Event Banner)',
      description: 'खासदार संजय देशमुख यांच्या संकल्पनेतून आयोजित भव्य नोकरी महोत्सव २०२६ अंतर्गत ५०+ नामांकित कंपन्यांमध्ये सुशिक्षित तरुणांसाठी थेट मुलाखतीची सुवर्णसंधी.',
      fbUrl: 'https://www.facebook.com/SanjayDeshmukhSpeak/'
    },
    {
      id: "2",
      src: '/PVC JOB-CARD_page-0001.jpg.png',
      alt: 'विशेष युवा रोजगार PVC जॉब कार्ड',
      title: 'विशेष युवा रोजगार PVC जॉब कार्ड',
      subtitle: 'मेळाव्यात निवड न झाल्यास आगामी कंपनी मुलाखतींसाठी मोफत जॉब कार्ड',
      category: 'रोजगार हमी जॉब कार्ड (Job Guarantee Card)',
      description: 'मेळाव्यात कोणत्याही कारणाने निवड न झाल्यास अशा सर्व उमेदवारांना खासदार संजय देशमुख व ईश्वर फाउंडेशन द्वारे विशेष युवा रोजगार जॉब कार्ड दिले जाईल.',
      fbUrl: 'https://www.facebook.com/SanjayDeshmukhSpeak/'
    },
    {
      id: "3",
      src: '/standard-naukri-mahotsav-2026.jpeg',
      alt: 'खासदार नोकरी महोत्सव २०२६ - अधिकृत पोस्टर',
      title: 'खासदार नोकरी महोत्सव २०२६ - अधिकृत मेळावा पोस्टर',
      subtitle: '२० सप्टेंबर २०२६ | डिग्रस, यवतमाळ (सकाळी ९ ते सायं ५)',
      category: 'मेळावा पोस्टर (Official Event Poster)',
      description: 'यवतमाळ – वाशिम मतदारसंघातील सुशिक्षित बेरोजगार युवक-युवतींसाठी डिग्रस येथे आयोजित भव्य नोकरी मेळाव्याचे अधिकृत माहिती पत्रक व पोस्टर.',
      fbUrl: 'https://www.facebook.com/SanjayDeshmukhSpeak/'
    }
  ];

  const currentBanner = banners.find((b) => b.id === id) || (id === undefined ? banners[0] : null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fdfaf6] selection:bg-orange-500 selection:text-white">
      {/* Antigravity Background */}
      <AntigravityBackground />

      {/* Navbar */}
      <Navbar />

      <main className="flex-1 relative z-10 pt-24 sm:pt-28 pb-12 animate-slide-up">
        <div className="w-[94%] max-w-[1400px] mx-auto px-2 sm:px-4">
          
          {/* Top Bar */}
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-orange-200 text-gray-700 hover:text-primary font-bold text-xs shadow-xs transition-all hover:shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-primary" />
              <span>मुख्य पृष्ठावर परत जा (Back to Home)</span>
            </Link>

            {currentBanner && (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-primary text-xs font-bold shadow-xs">
                <Sparkles className="w-4 h-4" />
                <span>{currentBanner.category}</span>
              </div>
            )}
          </div>

          {/* Banner Container or Fallback */}
          {currentBanner ? (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-orange-200/90 shadow-2xl relative overflow-hidden text-left">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                
                {/* Image Container */}
                <div className="w-full lg:w-3/5 flex items-center justify-center p-2 sm:p-4 bg-orange-50/40 rounded-2xl border border-orange-200/70">
                  <img
                    src={currentBanner.src}
                    alt={currentBanner.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/Slider.jpg';
                    }}
                    className="w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-lg block mx-auto"
                  />
                </div>

                {/* Banner Details */}
                <div className="w-full lg:w-2/5 flex flex-col justify-between">
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-[#FFF7ED] text-[#F05A00] border border-orange-200 text-xs font-extrabold mb-3">
                      {currentBanner.category}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-snug">
                      {currentBanner.title}
                    </h1>
                    <p className="mt-2 text-sm font-bold text-primary">
                      {currentBanner.subtitle}
                    </p>
                    <p className="mt-4 text-xs sm:text-sm text-gray-600 leading-relaxed font-medium">
                      {currentBanner.description}
                    </p>
                  </div>

                  <div className="mt-8 space-y-3 pt-6 border-t border-gray-100">
                    <Link
                      to="/job-card"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold px-6 py-3.5 text-sm shadow-md transition-all cursor-pointer"
                    >
                      <span>आताच नोंदणी करा (Register Now)</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <a
                      href={currentBanner.src}
                      download="Naukri-Mahotsav-Banner.jpg"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-orange-50 hover:bg-orange-100 text-primary border border-orange-200 font-bold px-6 py-3 text-xs transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>डिजिटल बॅनर डाउनलोड करा</span>
                    </a>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* Banner Not Found Fallback */
            <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-orange-200 shadow-xl text-center max-w-lg mx-auto my-12">
              <div className="size-16 rounded-2xl bg-orange-100 text-primary flex items-center justify-center mx-auto mb-4 border border-orange-200">
                <AlertCircle className="size-8 text-[#FF7A00]" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">बॅनर माहिती सापडली नाही</h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-6">
                मागणी केलेला बॅनर क्रमांक उपलब्ध नाही. कृपया मुख्य पृष्ठावर जावून नवीन पर्याय निवडा.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white text-xs font-extrabold shadow-md hover:bg-primary-hover transition"
              >
                <Home className="w-4 h-4" />
                <span>मुख्य पृष्ठावर जा</span>
              </Link>
            </div>
          )}

        </div>
      </main>

      <Footer className="relative z-10" />
    </div>
  );
}
