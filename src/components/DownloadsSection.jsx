import React from 'react';
import { FileText, Download, CheckCircle, FileSpreadsheet } from 'lucide-react';
import { downloadsList } from '../data/jobData';
import { useToast } from '../context/ToastContext';

export default function DownloadsSection() {
  const toast = useToast();

  const handleDownload = (doc) => {
    toast.download(`${doc.title} (${doc.size}) डाउनलोड सुरू झाले आहे.`, 'डाउनलोड सुरू');
  };

  return (
    <section id="downloads" className="scroll-mt-24 mx-auto mt-14 mb-16 w-full max-w-[1600px] px-4 lg:px-10 xl:px-16">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-primary text-xs font-bold mb-2">
          <FileText className="w-3.5 h-3.5" />
          <span>संसाधने व माहितीपत्रके</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          महत्वाचे डाउनलोड्स
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          मेळाव्याच्या तयारीसाठी आवश्यक मार्गदर्शक सूचना आणि माहितीपत्रक डाऊनलोड करा
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {downloadsList.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:shadow-md hover:border-orange-300 transition-all flex items-center justify-between gap-4 group"
          >
            <div className="flex items-start gap-3.5">
              <div className="size-11 rounded-xl bg-orange-50 text-primary grid place-items-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                <FileText className="size-5" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug">
                  {item.title}
                </h3>
                <span className="text-[11px] font-semibold text-gray-400 block mt-0.5">
                  {item.size}
                </span>
                <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">
                  {item.desc}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleDownload(item)}
              className="size-9 rounded-xl border border-gray-200 text-gray-500 hover:text-white hover:bg-primary hover:border-primary transition-all grid place-items-center shrink-0 shadow-2xs active:scale-95 cursor-pointer"
              title="डाउनलोड करा"
            >
              <Download className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
