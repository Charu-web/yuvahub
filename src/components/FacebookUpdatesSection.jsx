import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Share2,
  ExternalLink,
  Calendar,
  Sparkles,
  ArrowRight,
  X,
  MessageCircle,
  ThumbsUp,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { facebookProfileInfo, facebookPostsData } from '../data/facebookPostsData';

export default function FacebookUpdatesSection() {
  const [selectedPost, setSelectedPost] = useState(null);

  // Close modal on Escape key
  React.useEffect(() => {
    if (!selectedPost) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedPost(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPost]);

  const featuredPosts = facebookPostsData.filter(p => p.featured);
  const regularPosts = facebookPostsData.filter(p => !p.featured);

  return (
    <section id="updates" className="scroll-mt-24 mx-auto mt-20 w-[94%] max-w-[1600px] px-2 sm:px-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 pb-6 border-b border-orange-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 text-primary text-xs font-bold mb-3">
            <Sparkles className="size-3.5 text-primary animate-pulse" />
            <span>अधिकृत सोशल मीडिया अपडेट्स • Official Social Feed</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 tracking-tight">
            नवीनतम माहिती <span className="text-primary font-normal text-xl sm:text-2xl">(Latest Updates)</span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-semibold mt-1">
            खासदार ओमराजे निंबाळकर यांच्या अधिकृत फेसबुक पेजवरून मतदारसंघातील ताज्या घडामोडी व माहिती
          </p>
        </div>

        {/* Official Profile Badge & Follow Button */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 sm:p-4 rounded-2xl bg-white border border-orange-200/80 shadow-sm hover:shadow-md transition-all self-start md:self-auto max-w-full">
          <div className="relative shrink-0">
            <img
              src={facebookProfileInfo.avatar}
              alt={facebookProfileInfo.name}
              className="size-11 sm:size-12 rounded-full object-contain border-2 border-primary p-0.5 bg-orange-50 shrink-0"
            />
            <span className="absolute -bottom-0.5 -right-0.5 bg-blue-600 text-white rounded-full p-0.5">
              <CheckCircle2 className="size-3 text-white fill-blue-600" />
            </span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs sm:text-sm font-black text-gray-900 leading-tight truncate">
              {facebookProfileInfo.name}
            </span>
            <span className="text-[11px] text-gray-500 font-bold truncate">
              {facebookProfileInfo.username}
            </span>
          </div>
          <a
            href={facebookProfileInfo.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:ml-auto w-full sm:w-auto justify-center px-3.5 py-2 sm:py-1.5 rounded-xl bg-[#1877F2] hover:bg-[#0c63d4] text-white text-xs font-black transition-all inline-flex items-center gap-1.5 shadow-xs shrink-0 active:scale-95 text-center mt-1 sm:mt-0"
          >
            <span>फेसबुक फॉलो करा</span>
            <ExternalLink className="size-3.5" />
          </a>
        </div>
      </div>

      {/* Featured Posts (Top 2 Columns) */}
      <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-8">
        {featuredPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-3xl border border-orange-200/90 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
          >
            {/* Image Container */}
            <div
              className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100 cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
              
              {/* Category & Date Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary/95 text-white text-[11px] font-black shadow-md backdrop-blur-xs">
                  {post.category}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-black/60 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                  <Calendar className="size-3" />
                  {post.date}
                </span>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-5 sm:p-7 flex flex-col flex-1 justify-between">
              <div>
                <h3
                  onClick={() => setSelectedPost(post)}
                  className="text-base sm:text-lg lg:text-xl font-black text-gray-900 hover:text-primary transition-colors cursor-pointer leading-snug line-clamp-2"
                >
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 font-medium leading-relaxed mt-2.5 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {post.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] font-bold text-orange-900 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPost(post)}
                  className="text-xs sm:text-sm font-black text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1.5"
                >
                  <span>संपूर्ण वाचा (Read Full)</span>
                  <ArrowRight className="size-4" />
                </button>

                <a
                  href={post.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-[#1877F2] text-[#1877F2] hover:text-white text-xs font-bold transition-all inline-flex items-center gap-1.5 active:scale-95"
                  title="मूळ फेसबुक पोस्ट उघडा"
                >
                  <span>फेसबुक पोस्ट</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Grid of Remaining Updates */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {regularPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md hover:border-orange-300 transition-all duration-300 overflow-hidden flex flex-col group"
          >
            {/* Image */}
            <div
              className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-black/65 text-white text-[10px] font-bold backdrop-blur-xs flex items-center gap-1">
                  <Calendar className="size-2.5" />
                  {post.date}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1 justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider block mb-1">
                  {post.category}
                </span>
                <h4
                  onClick={() => setSelectedPost(post)}
                  className="text-xs sm:text-sm font-extrabold text-gray-900 hover:text-primary transition-colors cursor-pointer leading-snug line-clamp-2"
                >
                  {post.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-1.5 line-clamp-2">
                  {post.excerpt}
                </p>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPost(post)}
                  className="text-xs font-black text-primary hover:underline"
                >
                  वाचा
                </button>

                <a
                  href={post.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1"
                >
                  <span>फेसबुकवर पहा</span>
                  <ExternalLink className="size-3" />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Full Post Reader Modal (Rendered via Portal to escape any parent CSS context) */}
      {selectedPost && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setSelectedPost(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-orange-100 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 sm:px-6 py-4 border-b border-orange-100 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-primary text-xs font-bold">
                  {selectedPost.category}
                </span>
                <span className="text-xs text-gray-500 font-semibold flex items-center gap-1">
                  <Calendar className="size-3" />
                  {selectedPost.date}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="size-8 rounded-full border border-gray-200 grid place-items-center text-gray-500 hover:text-primary hover:bg-orange-50 transition-colors"
                aria-label="Close post"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7">
              {/* Image */}
              <div className="rounded-2xl overflow-hidden mb-5 border border-orange-100/80 bg-gray-50">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-auto max-h-[360px] object-cover mx-auto"
                />
              </div>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-black text-gray-900 leading-snug">
                {selectedPost.title}
              </h3>

              {/* Author Attribution */}
              <div className="flex items-center gap-2.5 my-3 pb-3 border-b border-gray-100">
                <img
                  src={facebookProfileInfo.avatar}
                  alt={selectedPost.author}
                  className="size-7 rounded-full object-contain border border-primary"
                />
                <span className="text-xs font-bold text-gray-800">
                  {selectedPost.author} ({facebookProfileInfo.username})
                </span>
              </div>

              {/* Exact Marathi Text */}
              <div className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed whitespace-pre-line space-y-3">
                {selectedPost.fullText}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-gray-100">
                {selectedPost.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-bold text-orange-900 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 px-5 sm:px-6 py-3.5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-gray-500 font-medium">
                स्रोत: खासदार ओमराजे निंबाळकर अधिकृत फेसबुक पेज
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedPost(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors"
                >
                  बंद करा
                </button>
                <a
                  href={selectedPost.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#1877F2] hover:bg-[#0c63d4] text-white text-xs font-black transition-all inline-flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span>फेसबुकवर उघडा</span>
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
