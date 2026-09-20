import React from 'react';
import { ArrowUp, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { name: 'मुखपृष्ठ', href: '#standard-naukri-mahotsav' },
    { name: 'नोकरी महोत्सव २०२६', href: '#standard-naukri-mahotsav' },
    { name: 'कंपन्या व पदभरती', href: '#niyokta' },
    { name: 'गॅलरी व व्हिडिओ', href: '#success-stories' },
    { name: 'महत्त्वाच्या सूचना', href: '#suchana' },
    { name: 'माहिती व डाउनलोड्स', href: '#downloads' },
    { name: 'उमेदवार नोंदणी', href: '#nondani' },
  ];

  return (
    <footer className="w-full bg-[#18191b] text-gray-300 pt-14 pb-8 border-t-4 border-primary">
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-stone-800">
          
          {/* Col 1: MP Identity & Branding */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/logo3.png"
                alt="खासदार संजय देशमुख (मामा)"
                className="h-14 w-auto rounded-full border-2 border-primary"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/logo2.png';
                }}
              />
              <div>
                <h4 className="text-white font-black text-base leading-tight">
                  खासदार संजय देशमुख
                </h4>
                <p className="text-xs text-primary font-bold">
                  यवतमाळ - वाशिम लोकसभा मतदारसंघ
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed font-medium">
              यवतमाळ - वाशिम मतदारसंघातील तरुणांच्या हाताला काम आणि उज्ज्वल भवितव्य देण्यासाठी ईश्वर फाउंडेशन व युवा हब द्वारे भव्य नोकरी महोत्सवाचे आयोजन.
            </p>

            {/* Official Facebook Link */}
            <div className="mt-4">
              <a
                href="https://www.facebook.com/SanjayDeshmukhSpeak/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 text-xs font-bold transition-all"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Official Facebook: @SanjayDeshmukhSpeak</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 border-l-2 border-primary pl-2.5">
              महत्त्वाचे दुवे
            </h4>
            <ul className="space-y-2 text-xs font-semibold">
              {navLinks.map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.href}
                    className="hover:text-primary transition-colors flex items-center gap-1.5"
                  >
                    <span>›</span>
                    <span>{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Helpline & Contact */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 border-l-2 border-primary pl-2.5">
              संपर्क व हेल्पलाइन
            </h4>
            <div className="space-y-3 text-xs text-gray-400">
              <div className="flex items-start gap-2.5">
                <Phone className="size-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white font-bold">मेळावा हेल्पलाइन:</span>
                  <span className="text-orange-400 font-extrabold">7391966295 / 9511910595 / 9511910350</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="block text-white font-bold">आयोजन स्थळ:</span>
                  <span className="text-gray-300">डिग्रस, यवतमाळ जिल्हा (Yavatmal – Washim)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Event Timing & Guarantee */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 border-l-2 border-primary pl-2.5">
              मेळावा वैशिष्ट्ये
            </h4>
            <div className="bg-stone-900/90 rounded-2xl p-4 border border-stone-800 text-xs space-y-2 font-medium">
              <div className="text-orange-400 font-bold">
                ★ १००% मोफत ऑनलाईन नोंदणी व प्रवेश
              </div>
              <div className="text-gray-300">
                ★ ५०+ नामांकित कंपन्यांकडून थेट मुलाखती
              </div>
              <div className="text-gray-300">
                ★ निवड न झालेल्यांना मोफत PVC जॉब कार्ड
              </div>
              <div className="text-gray-300">
                ★ दिव्यांग उमेदवारांना विशेष प्राधान्य
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 font-semibold">
          <p>© {new Date().getFullYear()} खासदार संजय देशमुख. सर्व हक्क राखीव. | ईश्वर फाउंडेशन व युवा हब उपक्रम</p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-800 hover:bg-primary text-gray-300 hover:text-white transition-all text-xs font-bold shadow-xs active:scale-95"
          >
            <span>वर जा</span>
            <ArrowUp className="size-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
