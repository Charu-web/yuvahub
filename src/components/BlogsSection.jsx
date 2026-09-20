import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, X } from 'lucide-react';
import { blogsList } from '../data/jobData';

export default function BlogsSection() {
  const [activeBlog, setActiveBlog] = useState(null);

  return (
    <section id="blogs" className="scroll-mt-24 mx-auto mt-16 w-full max-w-[1600px] px-4 lg:px-10 xl:px-16">
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-200">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-primary text-xs font-bold mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>करिअर व मुलाखत मार्गदर्शन</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            नवीन ब्लॉग्स आणि मार्गदर्शन
          </h2>
        </div>

        <a
          href="#blogs"
          className="hidden sm:inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-primary hover:text-primary-hover"
        >
          <span>सर्व पहा →</span>
        </a>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {blogsList.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-lg hover:border-orange-200 transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-primary">
                  {blog.category}
                </span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <Clock className="size-3" />
                  {blog.readTime}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors leading-snug mb-2">
                {blog.title}
              </h3>

              <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed">
                {blog.description}
              </p>
            </div>

            <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-400 flex items-center gap-1">
                <Calendar className="size-3.5" />
                {blog.date}
              </span>

              <button
                onClick={() => setActiveBlog(blog)}
                className="font-bold text-primary hover:text-primary-dark transition flex items-center gap-1"
              >
                <span>पुढे वाचा →</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Blog Reader Modal */}
      {activeBlog && (
        <div
          className="fixed inset-0 z-50 bg-[#FFF7ED]/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setActiveBlog(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-orange-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveBlog(null)}
              className="absolute top-5 right-5 size-9 rounded-full bg-gray-100 hover:bg-orange-100 text-gray-500 hover:text-primary transition-colors grid place-items-center"
            >
              <X className="size-5" />
            </button>

            <span className="text-xs font-bold text-primary bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
              {activeBlog.category}
            </span>

            <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-2 mb-3">
              {activeBlog.title}
            </h3>

            <div className="flex items-center gap-4 text-xs text-gray-400 mb-5 pb-3 border-b border-gray-100">
              <span>📅 {activeBlog.date}</span>
              <span>⏱️ {activeBlog.readTime}</span>
            </div>

            <div className="text-sm text-gray-700 leading-relaxed space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              <p>{activeBlog.description}</p>
              <p>
                मेळाव्यामध्ये विविध नामांकित कंपन्या एकाच छताखाली येत असल्यामुळे उमेदवारांना त्यांच्या शिक्षण व अनुभवानुसार एकापेक्षा जास्त कंपन्यांमध्ये मुलाखत देण्याची संधी मिळते. या संधीचे सोने करण्यासाठी रिझ्युमे अद्ययावत ठेवणे, कंपनीबद्दल माहिती घेणे आणि आत्मविश्वासू संवाद साधणे अत्यंत गरजेचे आहे.
              </p>
              <p>
                खासदार संजय देशमुख यांच्या संकल्पनेतून आयोजित हा उपक्रम यवतमाळ व वाशिम परिसरातील प्रत्येक सुशिक्षित बेरोजगार युवकाला स्वावलंबी बनवण्यासाठी कटिबद्ध आहे.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setActiveBlog(null)}
                className="px-6 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover"
              >
                बंद करा
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
