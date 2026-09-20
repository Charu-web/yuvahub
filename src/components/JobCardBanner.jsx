import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, ArrowRight, Maximize2 } from 'lucide-react';
import ImageLightboxModal from './ImageLightboxModal';

export default function JobCardBanner() {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <section className="w-[94%] max-w-[1600px] mx-auto my-10 md:my-16 px-2 sm:px-4">
      <div className="bg-gradient-to-br from-[#FFF9F4] via-[#FFF3EB] to-[#FFF9F4] rounded-3xl p-6 sm:p-10 border border-orange-200/90 shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
          
          {/* Left Text Info */}
          <div className="max-w-2xl text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-primary text-xs font-bold mb-3 shadow-xs">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>१००% रोजगार हमी व निरंतर सहकार्य</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 leading-tight">
              नोकरी न मिळालेल्या सर्व उमेदवारांना{' '}
              <span className="text-primary underline decoration-primary/30 underline-offset-4">
                विशेष जॉब कार्ड
              </span>{' '}
              वाटप!
            </h2>

            <p className="mt-3 text-sm sm:text-base text-gray-700 leading-relaxed font-medium">
              मेळाव्यात कोणत्याही कारणाने निवड न झाल्यास निराश होऊ नका. अशा सर्व उमेदवारांना खासदार संजय देशमुख व ईश्वर फाउंडेशन द्वारे विशेष <strong>'युवा रोजगार जॉब कार्ड'</strong> दिले जाईल, ज्याद्वारे आगामी काळात थेट कंपनी मुलाखती उपलब्ध केल्या जातील.
            </p>

            {/* Features checkmarks */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs sm:text-sm font-extrabold text-gray-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>आगामी काळात थेट कंपनी मुलाखतीचे कॉल्स</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-600 shrink-0" />
                <span>कौशल्य विकास कार्यशाळांमध्ये मोफत प्रवेश</span>
              </div>
            </div>

            <div className="mt-7">
              <a
                href="#nondani"
                className="inline-flex items-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white font-black px-6 py-3.5 text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
              >
                <span>आताच नोंदणी करून जॉब कार्ड सुरक्षित करा</span>
                <ArrowRight className="size-4" />
              </a>
            </div>
          </div>

          {/* Right PVC Job Card Image Showcase */}
          <div className="shrink-0 flex items-center justify-center">
            <div 
              className="relative group p-2 cursor-pointer"
              onClick={() => setLightboxOpen(true)}
              title="अधिकृत जॉब कार्ड मोठ्या आकारात पहा (Click to enlarge)"
            >
              <img
                src="/PVC JOB-CARD_page-0001.jpg.png"
                alt="अधिकृत PVC जॉब कार्ड"
                className="w-full max-w-[320px] sm:max-w-[360px] h-auto object-contain rounded-2xl shadow-2xl border-4 border-white transition-transform group-hover:scale-105"
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/Slider.jpg';
                }}
                style={{
                  width: '100%',
                  maxWidth: '360px',
                  height: 'auto',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
              <div className="absolute -bottom-2 right-4 bg-primary text-white text-[11px] font-black px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Maximize2 className="w-3 h-3" />
                <span>अधिकृत PVC जॉब कार्ड</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Image Lightbox Modal */}
      <ImageLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        imageSrc="/PVC JOB-CARD_page-0001.jpg.png"
        title="विशेष युवा रोजगार PVC जॉब कार्ड"
        subtitle="खासदार नोकरी महोत्सव २०२६ अधिकृत उपक्रम"
        category="रोजगार हमी कार्ड (Official Job Guarantee Card)"
        caption="मेळाव्यात निवड न झाल्यास निराश होऊ नका. अशा सर्व उमेदवारांना खासदार संजय देशमुख व ईश्वर फाउंडेशन द्वारे विशेष 'युवा रोजगार जॉब कार्ड' दिले जाईल."
        downloadUrl="/PVC JOB-CARD_page-0001.jpg.png"
        downloadFilename="PVC-Job-Card-Official.png"
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
