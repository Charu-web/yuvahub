import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  Phone,
  Navigation,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { faqList, selectionSteps } from '../data/jobData';

export default function VenueAndFAQ() {
  const [openFaq, setOpenFaq] = useState(0);

  const contactNumbers = [
    { number: '7391966295', display: '73919 66295' },
    { number: '9511910595', display: '95119 10595' },
    { number: '9511910350', display: '95119 10350' },
  ];

  return (
    <section className="mx-auto mt-16 mb-20 w-[94%] max-w-[1600px] px-2 sm:px-4">
      {/* 1. VENUE DETAILS & SELECTION PROCESS CONTAINER */}
      <div className="grid lg:grid-cols-12 gap-8 mb-16">
        
        {/* Left Col: Venue & Map Embed (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-orange-200/80 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-red-500 animate-ping"></span>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  मेळावा अधिकृत स्थळ आणि वेळ
                </span>
              </div>
              <a
                href="https://maps.google.com/maps?q=Digras,+Yavatmal,+Maharashtra"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <span>Google Maps मध्ये पहा</span>
                <Navigation className="size-3.5" />
              </a>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug">
              डिग्रस, यवतमाळ (Digras, Yavatmal)
            </h3>
            <p className="text-sm font-bold text-gray-600 mt-1">
              यवतमाळ - वाशिम लोकसभा मतदारसंघ, महाराष्ट्र
            </p>

            {/* Date & Time Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs sm:text-sm">
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-orange-50/80 border border-orange-100">
                <Calendar className="size-5 text-primary shrink-0" />
                <div>
                  <span className="text-[11px] text-gray-500 block font-semibold">दिनांक (Date)</span>
                  <span className="font-extrabold text-gray-900">२० सप्टेंबर २०२६ (20 Sept 2026)</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-orange-50/80 border border-orange-100">
                <Clock className="size-5 text-primary shrink-0" />
                <div>
                  <span className="text-[11px] text-gray-500 block font-semibold">वेळ (Time)</span>
                  <span className="font-extrabold text-gray-900">सकाळी ९:०० ते सायं ५:०० वा.</span>
                </div>
              </div>
            </div>

            {/* Helpline Numbers */}
            <div className="mt-4 p-4 rounded-2xl bg-orange-50/60 border border-orange-200 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-bold text-gray-800">
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-primary shrink-0" />
                <span>अधिकृत संपर्क हेल्पलाइन:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {contactNumbers.map((c, i) => (
                  <a
                    key={i}
                    href={`tel:${c.number}`}
                    className="bg-white hover:bg-orange-100 text-primary border border-orange-200 px-2.5 py-1 rounded-lg text-xs font-black transition-colors"
                  >
                    {c.display}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="mt-6 rounded-2xl overflow-hidden border border-gray-200 h-64 sm:h-72 w-full shadow-inner">
            <iframe
              title="Digras Yavatmal Map"
              src="https://maps.google.com/maps?q=Digras,+Yavatmal,+Maharashtra&t=&z=14&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Right Col: 4-Step Selection Process Flow */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#FFF9F4] to-[#FFF3EB] rounded-3xl border border-orange-200/90 p-6 sm:p-8 shadow-xl flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-primary text-xs font-bold border border-orange-200 mb-3 shadow-xs">
              <Sparkles className="size-3.5 text-primary" />
              <span>थेट नियुक्ती प्रक्रिया</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
              मेळावा निवड प्रक्रिया (Selection Steps)
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1 mb-6">
              ईश्वर फाउंडेशन - दिग्रस आयोजित ५ सोप्या टप्प्यांत नोकरी व नियुक्तीपत्र
            </p>

            <div className="space-y-4">
              {selectionSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3.5 bg-white p-3.5 rounded-2xl border border-orange-100 shadow-xs">
                  <div className="size-9 rounded-xl bg-primary text-white font-black text-sm grid place-items-center shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <strong className="text-sm font-extrabold text-gray-900 block">{step.title}</strong>
                    <span className="text-xs text-gray-600 font-medium leading-snug">{step.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-orange-200 text-center">
            <a
              href="#nondani"
              className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-black shadow-md transition-all active:scale-95"
            >
              <span>ऑनलाईन नोंदणी सुरू करा</span>
              <CheckCircle2 className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>

      {/* 2. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <div className="bg-white rounded-3xl border border-orange-100 p-6 sm:p-10 shadow-xl">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-primary text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>सतत विचारले जाणारे प्रश्न</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
            Frequently Asked Questions (FAQ)
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
            Standard Naukri Mahotsav 2026 संदर्भातील शंका व निरसन
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqList.map((faq, idx) => (
            <div
              key={idx}
              className="border border-orange-100 rounded-2xl overflow-hidden transition-all bg-orange-50/40"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-extrabold text-sm sm:text-base text-gray-900 hover:text-primary transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div className="px-4 pb-5 pt-1 text-xs sm:text-sm text-gray-700 font-medium border-t border-orange-100/60 leading-relaxed bg-white">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
