import React from 'react';
import { Bell, Sparkles, Calendar, ChevronRight } from 'lucide-react';
import { updatesList } from '../data/jobData';

export default function UpdatesNotice() {
  return (
    <section id="suchana" className="scroll-mt-24 mx-auto mt-16 w-full max-w-[1600px] px-4 lg:px-10 xl:px-16">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 pb-3 border-b border-orange-100">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-orange-100 text-primary grid place-items-center">
            <Bell className="size-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              ताज्या सुचना आणि अपडेट्स
            </h2>
            <p className="text-xs text-gray-500 font-medium">
              मेळाव्याबाबतची महत्त्वपूर्ण परिपत्रके आणि घोषणा
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-primary bg-orange-50 border border-orange-200 px-3 py-1 rounded-full w-fit">
          नवीन अपडेट्स उपलब्ध
        </span>
      </div>

      {/* Notices List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {updatesList.map((notice) => (
          <div
            key={notice.id}
            className="bg-white rounded-2xl border border-gray-200/90 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-orange-300 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-black bg-red-500 text-white tracking-wider animate-pulse">
                  NEW
                </span>
                <span className="text-[11px] text-gray-400 font-semibold flex items-center gap-1">
                  <Calendar className="size-3" />
                  {notice.date}
                </span>
              </div>

              <p className="text-sm font-bold text-gray-800 leading-snug">
                {notice.title}
              </p>
            </div>

            <div className="mt-4 pt-2 border-t border-gray-100 flex justify-end">
              <a
                href="#nondani"
                className="text-xs font-bold text-primary hover:text-primary-dark transition flex items-center gap-1"
              >
                <span>अधिक माहिती</span>
                <ChevronRight className="size-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
