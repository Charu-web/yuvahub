import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Maximize2, 
  Search, 
  Copy, 
  Check, 
  AlertCircle,
  FileBadge2,
  Sparkles,
  Download
} from 'lucide-react';
import ImageLightboxModal from './ImageLightboxModal';

export default function JobCardBanner() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [copied, setCopied] = useState(false);

  // Live lookup from existing /api/registrations endpoint
  const handleLookup = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) {
      setSearchError('कृपया आपला नोंदणीकृत मोबाईल नंबर किंवा Candidate ID टाका.');
      return;
    }

    setLoading(true);
    setSearchError('');
    setSearchResult(null);

    try {
      const res = await fetch('/api/registrations');
      if (!res.ok) throw new Error('API connection failed');
      const data = await res.json();
      const list = data.registrations || [];

      // Find matching registration by phone or ID
      const found = list.find(r => 
        (r.contactNumber && r.contactNumber.trim() === query) ||
        (r.candidateId && r.candidateId.toLowerCase() === query.toLowerCase()) ||
        (r.id && r.id.toLowerCase() === query.toLowerCase())
      );

      if (found) {
        setSearchResult({
          candidateId: found.candidateId || found.id || found._id,
          fullName: found.fullName,
          district: found.district || 'धाराशिव',
          createdAt: found.createdAt || new Date().toISOString()
        });
      } else {
        setSearchError('या नंबर किंवा आयडीवर कोणतीही नोंदणी आढळली नाही. कृपया खाली नोंदणी करा.');
      }
    } catch (err) {
      setSearchError('डेटा तपासताना त्रुटी आली. कृपया नंतर पुन्हा प्रयत्न करा किंवा थेट नोंदणी करा.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="job-card-section" className="w-[94%] max-w-[1600px] mx-auto my-10 md:my-16 px-2 sm:px-4 scroll-mt-24">
      <div className="bg-gradient-to-br from-[#FFFDF9] via-[#FFF6ED] to-[#FFF1E6] rounded-3xl p-5 sm:p-8 md:p-10 border border-orange-200/90 shadow-2xl relative overflow-hidden">
        
        {/* Decorative Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600"></div>

        {/* Header Tag */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-primary text-xs sm:text-sm font-black shadow-xs">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>धाराशिव मतदार संघ विशेष उपक्रम • Job Card Initiative 2026</span>
          </div>

          <span className="text-xs font-bold text-gray-500">
            मा. ओमराजे निंबाळकर (खासदार, धाराशिव मतदार संघ)
          </span>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
          
          {/* Left Column: Official Job Card Image Showcase (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div 
              className="relative group p-2 cursor-pointer w-full max-w-[480px]"
              onClick={() => setLightboxOpen(true)}
              title="अधिकृत जॉब कार्ड मोठ्या आकारात पहा (Click to enlarge)"
            >
              <div className="relative rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white">
                <img
                  src="/dharashiv-job-card-banner.jpg"
                  alt="धाराशिव मतदार संघ JOB CARD - नोकरी मार्गदर्शन कार्ड"
                  className="w-full h-auto object-contain block mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
                  loading="lazy"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/pvc-job-card-official.png';
                  }}
                />

                {/* Enlarge Button Overlay */}
                <div className="absolute bottom-3 right-3 bg-black/70 hover:bg-black/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 backdrop-blur-xs transition-transform hover:scale-105">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>झूम करा (Enlarge Card)</span>
                </div>
              </div>

              {/* Sub-label */}
              <div className="mt-2 text-center">
                <p className="text-xs font-bold text-gray-600">
                  अधिकृत जॉब कार्ड • खासदार नोकरी महोत्सव २०२६
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Interactive Code Display (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              {/* Campaign Headings */}
              <div className="mb-4">
                <span className="text-xs sm:text-sm font-extrabold text-orange-600 uppercase tracking-wider block">
                  धाराशिव मतदार संघातील सुशिक्षित तरुण-तरुणींसाठी नोकरीची सुवर्णसंधी !
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mt-1 leading-tight flex items-center gap-2">
                  <span>JOB CARD</span>
                  <span className="text-sm sm:text-base font-bold text-gray-600 font-mr">
                    (नोकरी मार्गदर्शन कार्ड)
                  </span>
                </h2>
              </div>

              <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
                मेळाव्यात कोणत्याही कारणाने निवड न झाल्यास निराश होऊ नका. अशा सर्व उमेदवारांना खासदार ओमराजे निंबाळकर यांच्या पुढाकाराने विशेष <strong>'Job Card' (नोकरी मार्गदर्शन कार्ड)</strong> दिले जाईल, ज्याद्वारे आगामी काळात थेट नामांकित कंपन्यांमध्ये मुलाखती आणि रोजगाराच्या संधी उपलब्ध केल्या जातील.
              </p>

              {/* Benefits Checklist */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-bold text-gray-800">
                <div className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-orange-100">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>आगामी थेट कंपनी मुलाखतीचे कॉल्स</span>
                </div>
                <div className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-orange-100">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>कौशल्य विकास कार्यशाळेत मोफत प्रवेश</span>
                </div>
                <div className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-orange-100">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>तात्काळ नियुक्तीपत्र मिळण्याची संधी</span>
                </div>
                <div className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-orange-100">
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                  <span>मोफत डिजिटल व अधिकृत जॉब कार्ड</span>
                </div>
              </div>
            </div>

            {/* Interactive Job Card Unique Code Verification / Display Box */}
            <div className="mt-6 bg-white rounded-2xl p-4 sm:p-6 border-2 border-orange-200 shadow-md">
              <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <FileBadge2 className="w-5 h-5 text-primary" />
                  <h3 className="text-sm sm:text-base font-black text-gray-900">
                    JobCard Unique Code तपासणी व वाटप
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">
                  Official Verification
                </span>
              </div>

              {/* Code Search Input Form */}
              <form onSubmit={handleLookup} className="mt-3 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="नोंदणीकृत मोबाईल नंबर किंवा Candidate ID टाका..."
                    className="w-full pl-3 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-300 focus:border-primary focus:ring-2 focus:ring-orange-100 outline-none transition-all font-medium text-gray-800 placeholder:text-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>{loading ? 'तपासत आहे...' : 'कोड शोधा'}</span>
                </button>
              </form>

              {/* Error Message */}
              {searchError && (
                <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <span>{searchError}</span>
                </div>
              )}

              {/* Found Result Card Display with Styled Unique Code Field */}
              {searchResult ? (
                <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-300 animate-fadeIn">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                      <Check className="w-4 h-4 text-emerald-600" />
                      नोंदणी यशस्वीरीत्या पडताळली!
                    </span>
                    <span className="text-[11px] font-bold text-gray-600">
                      {searchResult.district}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-gray-900">
                    उमेदवार: <span className="text-orange-950 font-black">{searchResult.fullName}</span>
                  </p>

                  {/* Styled Blank-Field Match from Flyer */}
                  <div className="mt-3 bg-white p-3 rounded-xl border-2 border-dashed border-orange-400 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div>
                      <span className="text-[11px] font-black text-gray-500 uppercase tracking-wider block">
                        JobCard Unique Code:
                      </span>
                      <span className="font-mono text-lg sm:text-2xl font-black text-primary tracking-wider">
                        {searchResult.candidateId}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(searchResult.candidateId)}
                      className="px-3.5 py-1.5 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-900 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-primary" />}
                      <span>{copied ? 'कॉपी झाले!' : 'कोड कॉपी करा'}</span>
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] text-gray-500 font-medium">
                    हा युनिक कोड मेळावा स्थळी (२५ ऑक्टोबर रोजी धाराशिव येथे) दाखवणे आवश्यक आहे.
                  </p>
                </div>
              ) : (
                /* Default Visual Blank Field Guide Matching Flyer */
                <div className="mt-4 p-3 rounded-xl bg-orange-50/60 border border-orange-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-black text-gray-700 block">
                      JobCard Unique Code फील्ड:
                    </span>
                    <span className="text-[11px] text-gray-500 font-medium">
                      नोंदणी पूर्ण केल्यानंतर प्रत्येक उमेदवाराला विशेष ओळख कोड दिला जातो.
                    </span>
                  </div>
                  <a
                    href="#nondani"
                    className="shrink-0 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <span>नवीन नोंदणी करा</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <a
                href="#nondani"
                className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-black px-6 py-3.5 text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 text-center"
              >
                <span>आताच नोंदणी करून जॉब कार्ड सुरक्षित करा</span>
                <ArrowRight className="size-4" />
              </a>

              <a
                href="/job-card"
                className="inline-flex items-center gap-2 rounded-xl bg-white hover:bg-orange-50 border border-orange-200 text-gray-800 font-bold px-4 py-3.5 text-xs sm:text-sm shadow-xs transition-all active:scale-95"
              >
                <CreditCard className="size-4 text-primary" />
                <span>जॉब कार्ड तपशील पृष्ठ</span>
              </a>
            </div>

          </div>

        </div>
      </div>

      {/* High Resolution Lightbox Modal */}
      <ImageLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageSrc="/dharashiv-job-card-banner.jpg"
        title="धाराशिव मतदार संघ JOB CARD - नोकरी मार्गदर्शन कार्ड"
        subtitle="खासदार नोकरी महोत्सव २०२६ अधिकृत उपक्रम"
        category="रोजगार हमी व मार्गदर्शन कार्ड (Official Job Card)"
        caption="मेळाव्यात निवड न झाल्यास निराश होऊ नका. अशा सर्व उमेदवारांना खासदार ओमराजे निंबाळकर यांच्या पुढाकाराने विशेष Job Card दिले जाईल."
        downloadUrl="/dharashiv-job-card-banner.jpg"
        downloadFilename="Dharashiv-Job-Card-Official.jpg"
        actionButton={
          <a
            href="#nondani"
            onClick={() => setLightboxOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-extrabold transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm text-center"
          >
            <span>आताच नोंदणी करा</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        }
      />
    </section>
  );
}
