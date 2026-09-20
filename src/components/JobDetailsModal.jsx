import React from 'react';
import { X, Building2, MapPin, GraduationCap, Briefcase, IndianRupee, CheckCircle2, ArrowRight } from 'lucide-react';

export default function JobDetailsModal({ job, onClose, onApply }) {
  if (!job) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-[#FFF7ED]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-orange-100 my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 size-9 rounded-full bg-gray-100 hover:bg-orange-100 text-gray-500 hover:text-primary transition-colors grid place-items-center"
        >
          <X className="size-5" />
        </button>

        {/* Company Header */}
        <div className="flex items-start gap-4 pb-5 border-b border-gray-100">
          <div className="size-16 rounded-2xl border border-gray-100 p-2 bg-white shadow-xs flex items-center justify-center shrink-0">
            <img
              src={job.logo}
              alt={job.company}
              className="max-w-full max-h-full object-contain"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/logo3.png';
              }}
            />
          </div>
          <div>
            <span className="text-xs font-bold text-primary uppercase tracking-wide bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-100">
              {job.sector}
            </span>
            <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 mt-1">
              {job.marathiTitle || job.title}
            </h3>
            <p className="text-sm font-semibold text-gray-600">{job.company}</p>
          </div>
        </div>

        {/* Key Job Specifications */}
        <div className="grid grid-cols-2 gap-3.5 py-5 border-b border-gray-100 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 text-gray-700">
            <GraduationCap className="size-4 text-primary shrink-0" />
            <div>
              <span className="text-[11px] text-gray-400 block">पात्रता</span>
              <span className="font-semibold">{job.qualification}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-gray-700">
            <IndianRupee className="size-4 text-primary shrink-0" />
            <div>
              <span className="text-[11px] text-gray-400 block">वेतनश्रेणी</span>
              <span className="font-semibold text-green-700">{job.salary}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-gray-700">
            <Briefcase className="size-4 text-primary shrink-0" />
            <div>
              <span className="text-[11px] text-gray-400 block">अनुभव</span>
              <span className="font-semibold">{job.experience}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-gray-700">
            <MapPin className="size-4 text-primary shrink-0" />
            <div>
              <span className="text-[11px] text-gray-400 block">नोकरीचे ठिकाण</span>
              <span className="font-semibold">{job.location}</span>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="py-4">
          <h4 className="text-sm font-bold text-gray-900 mb-1.5">कामाचे स्वरूप व जबाबदाऱ्या:</h4>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Benefits & Highlights */}
        <div className="bg-orange-50/60 rounded-xl p-3.5 border border-orange-100 mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800 mb-1">
            <CheckCircle2 className="size-4 text-green-600" />
            <span>मेळावा विशेष: जागेवर तात्काळ मुलाखत व निवड</span>
          </div>
          <p className="text-[11px] text-gray-600 pl-6">
            आवश्यक कागदपत्रे व रिझ्युमेच्या किमान ५ प्रती सोबत आणाव्यात.
          </p>
        </div>

        {/* CTA Actions */}
        <div className="flex items-center gap-3">
          <a
            href="#nondani"
            onClick={() => {
              onClose();
              if (onApply) onApply(job);
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white py-3 px-4 font-bold text-sm shadow-md hover:shadow-lg transition-all"
          >
            <span>नोंदणी फॉर्म भरा आणि अप्लाय करा</span>
            <ArrowRight className="size-4" />
          </a>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-bold hover:bg-gray-50 transition"
          >
            बंद करा
          </button>
        </div>
      </div>
    </div>
  );
}
