import React, { useState } from 'react';
import {
  Building2,
  GraduationCap,
  Briefcase,
  FileCheck2,
  Accessibility,
  Target,
  ArrowRight,
  Search,
  CheckCircle,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { companyLogos, jobVacancies } from '../data/jobData';
import JobDetailsModal from './JobDetailsModal';

export default function EmployersSection() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);

  const categories = ['All', 'Automobile', 'Banking & Finance', 'IT & Software', 'Pharma & Healthcare', 'Manufacturing', 'Logistics'];

  const filteredJobs = jobVacancies.filter((job) => {
    const matchesCategory =
      selectedCategory === 'All' || job.sector.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.marathiTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.sector.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.qualification.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const highlights = [
    { icon: '🏢', title: '50+ राष्ट्रीय व आंतरराष्ट्रीय नामांकित कंपन्यांचा सहभाग' },
    { icon: '🎓', title: 'शिक्षण: 5th, 10th, 12th, ITI, Diploma ते पदवीधर' },
    { icon: '💼', title: 'Banking, Pharma सह सर्व क्षेत्रातील संधी (All Sector Welcome)' },
    { icon: '📄', title: 'निवड झालेल्या उमेदवारांना तात्काळ नियुक्तीपत्र' },
    { icon: '♿', title: 'मेळाव्यात दिव्यांग उमेदवारांना प्राधान्य' },
    { icon: '🎯', title: 'तुमच्या स्वप्नातील नोकरी मिळवण्याची सुवर्णसंधी' },
  ];

  return (
    <section id="niyokta" className="scroll-mt-24 mx-auto mt-10 md:mt-16 w-full max-w-[1600px] px-3 sm:px-6 lg:px-10 xl:px-16">
      {/* Top Banner Card with Highlights */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FF5400] via-[#ea580c] to-[#c2410c] text-white p-6 sm:p-10 shadow-xl">
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black mb-3">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>खासदार नोकरी महोत्सव २०२६ • धाराशिव मतदार संघ</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight">
            भव्य नोकरी मेळावा २०२६
          </h2>
          <p className="mt-2 text-base sm:text-xl font-bold text-orange-100">
            नोकरीची संधी, उज्ज्वल भविष्याची दिशा! धाराशिव मतदार संघातील तरुण-तरुणींसाठी सुवर्णसंधी!
          </p>

          {/* Highlights Grid */}
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {highlights.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 hover:bg-white/20 transition-all duration-300"
              >
                <span className="text-2xl shrink-0">{item.icon}</span>
                <span className="text-xs sm:text-sm font-semibold leading-snug">{item.title}</span>
              </div>
            ))}
          </div>

          {/* CTA Row */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#nondani"
              className="inline-flex items-center gap-2 rounded-full bg-white text-[#ea580c] font-black px-7 py-3.5 text-sm sm:text-base shadow-lg hover:bg-orange-50 hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <span>ऑनलाईन नोंदणी करा</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#job-listings"
              className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/30 text-white font-bold px-6 py-3.5 text-sm sm:text-base hover:bg-white/25 transition-all"
            >
              <span>उपलब्ध जागा पहा</span>
            </a>
          </div>
        </div>

        {/* Decorative background circle graphics */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-white/5 pointer-events-none blur-2xl"></div>
        <div className="absolute right-10 top-10 w-48 h-48 rounded-full bg-yellow-400/10 pointer-events-none blur-xl"></div>
      </div>

      {/* CONTINUOUS LOGO MARQUEE TICKER */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-primary text-xs font-bold mb-2">
          <span>५०+ नामांकित कॉर्पोरेट ब्रँड्स</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          प्रमुख सहभागी कंपन्या
        </h3>
        <p className="mt-1 text-sm text-gray-600">
          थेट मुलाखतीसाठी उपस्थित राहणाऱ्या अग्रगण्य कंपन्यांची यादी
        </p>

        {/* Marquee Track (Infinite Loop) */}
        <div className="mt-6 relative overflow-hidden py-4 border-y border-orange-100 bg-white/60">
          <div className="animate-marquee flex items-center gap-6">
            {[...companyLogos, ...companyLogos].map((company, idx) => (
              <div
                key={idx}
                className="flex items-center justify-center w-36 h-20 sm:w-44 sm:h-24 p-3 bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-md hover:border-orange-300 transition-all duration-300 shrink-0 group"
              >
                <img
                  src={company.logo}
                  alt={company.name}
                  className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition duration-300"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/logo3.png';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INTERACTIVE JOB VACANCIES SECTION */}
      <div id="job-listings" className="mt-14 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              उपलब्ध नोकरीच्या संधी आणि रिक्त पदे
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              आपल्या पात्रतेनुसार पदे शोधा आणि जागेवरच मुलाखतीची तयारी करा
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="पद, कंपनी किंवा क्षेत्र शोधा..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-orange-500/20 transition"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-md shadow-orange-500/25'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-200 hover:text-primary'
              }`}
            >
              {cat === 'All' ? 'सर्व क्षेत्रे (All Sectors)' : cat}
            </button>
          ))}
        </div>

        {/* Job Cards Grid */}
        <div className="mt-4 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  {/* Company Logo & Category */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="size-12 rounded-xl border border-gray-100 p-1.5 bg-white shadow-2xs flex items-center justify-center shrink-0">
                      <img
                        src={job.logo}
                        alt={job.company}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/logo3.png';
                        }}
                      />
                    </div>
                    <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100 text-right leading-tight">
                      {job.vacancies}
                    </span>
                  </div>

                  <span className="text-[11px] font-semibold text-gray-400 block uppercase">
                    {job.company}
                  </span>

                  <h4 className="text-base font-bold text-gray-900 group-hover:text-primary transition-colors mt-0.5 line-clamp-2">
                    {job.marathiTitle || job.title}
                  </h4>

                  {/* Criteria Tags */}
                  <div className="mt-3 space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="size-3.5 text-primary shrink-0" />
                      <span className="truncate">{job.qualification}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-green-700">
                      <span>💰</span>
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <span>📍</span>
                      <span className="truncate">{job.location}</span>
                    </div>
                  </div>
                </div>

                {/* Card CTA Actions */}
                <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="text-xs font-bold text-gray-600 hover:text-primary transition flex items-center gap-1"
                  >
                    <span>सविस्तर माहिती</span>
                    <ExternalLink className="size-3" />
                  </button>

                  <a
                    href="#nondani"
                    className="px-3.5 py-1.5 rounded-lg bg-orange-50 group-hover:bg-primary text-primary group-hover:text-white text-xs font-bold transition-all shadow-2xs"
                  >
                    अर्ज करा →
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-gray-500">
              <p className="font-bold text-base">कोणतेही पद आढळले नाही.</p>
              <p className="text-xs mt-1">कृपया शोध शब्द बदला किंवा दुसरे क्षेत्र निवडा.</p>
            </div>
          )}
        </div>
      </div>

      {/* Popup Modal for Job Details */}
      <JobDetailsModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onApply={(job) => {
          setSelectedJob(null);
        }}
      />
    </section>
  );
}
