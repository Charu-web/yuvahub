import React, { useState } from 'react';
import { Sparkles, Image as ImageIcon, X, Maximize2 } from 'lucide-react';
import ImageLightboxModal from './ImageLightboxModal';

export default function SuccessStories() {
  const [selectedMedia, setSelectedMedia] = useState(null);

  const galleryItems = [
    {
      id: "gallery-01",
      num: "01",
      src: "/gallery/gallery-01.jpg",
      title: "📍 शेंबाळपिंपरी संस्थान ता. पुसद",
      category: "Solar High Mast Light Inauguration",
      date: "2026",
      caption: `📍 शेंबाळपिंपरी संस्थान ता. पुसद

शेंबाळपिंपरी संस्थान ता.पुसद येथे माझ्या खासदार स्थानिक क्षेत्र विकास निधी मधून उपलब्ध करून दिलेल्या सोलार हायमास्ट लाईटचा लोकार्पण सोहळा संपन्न झाला.

याप्रसंगी ग्रामस्थ मोठ्या संख्येने उपस्थितीत होते.

~ संजय उत्तमराव देशमुख
खासदार यवतमाळ वाशिम लोकसभा`
    },
    {
      id: "gallery-03",
      num: "02",
      src: "/gallery/gallery-03.jpg",
      title: "📍 वेणी ता.पुसद",
      category: "Solar High Mast Light Inauguration",
      date: "2026",
      caption: `📍 वेणी ता.पुसद

वेणी ता.पुसद येथे माझ्या खासदार स्थानिक विकास निधी मधून उपलब्ध करून दिलेल्या सोलार हायमास्ट लाईटचा लोकार्पण सोहळा संपन्न झाला.

याप्रसंगी वेणी ता.पुसद येथील ग्रामस्थ मोठ्या संख्येने उपस्थितीत होते.

~ संजय उत्तमराव देशमुख
खासदार यवतमाळ वाशिम लोकसभा

#पुसद #yavatmal #pusad #sanjaydeshmukh
#washim`
    },
    {
      id: "gallery-04",
      num: "03",
      src: "/gallery/gallery-04.jpg",
      title: "📍 पारध ता.पुसद",
      category: "Solar High Mast Light & Kirtan Event",
      date: "2026",
      caption: `📍 पारध ता.पुसद

पारध ता.पुसद येथे माझ्या खासदार स्थानिक विकास निधी मधून उपलब्ध करून दिलेल्या सोलार हायमास्ट लाईटचा लोकार्पण सोहळा संपन्न झाला तसेच जयसिंग महाराज पुण्यतिथी निमित्त कीर्तन सोहळ्यास उपस्थितीत होतो.

याप्रसंगी ग्रामस्थ मोठ्या संख्येने उपस्थितीत होते.

~ संजय उत्तमराव देशमुख
खासदार यवतमाळ वाशिम लोकसभा`
    },
    {
      id: "gallery-06",
      num: "04",
      src: "/gallery/gallery-06.jpg",
      title: "📍 Chondi, Ta. Pusad",
      category: "Felicitation by Villagers",
      date: "2026",
      caption: `📍 Chondi, Ta. Pusad

Thank you very much for the felicitation by the villagers while visiting Chondi!

This time interacted with the villagers and learned about their various problems and problems. Thank you very much for the love and trust given by the villagers in large numbers.

~ Sanjay Uttamrao Deshmukh
MP, Yavatmal-Washim Loksabha`
    },
    {
      id: "gallery-08",
      num: "05",
      src: "/gallery/gallery-08.jpg",
      title: "Farmer Group League (FGL) Award Ceremony",
      category: "Farmer Group League",
      date: "दि. १४ ऑगस्ट २०२६",
      caption: `📍 वाटपणे लॉन्स, वाशिम | दि. १४ ऑगस्ट २०२६

वाशिमच्या शेतकऱ्यांनी आयोजित केलेल्या Farmer Group League (FGL) या अभिनव उपक्रमास उपस्थित राहिलो.

हवामान बदल, अनिश्चित पाऊस आणि वाढता उत्पादन खर्च अशा आव्हानांवर मात करत ७६५ शेतकरी गटांनी आधुनिक व हवामान अनुकूल शेतीचा स्वीकार केला, ही निश्चितच अभिमानाची बाब आहे.

नवे कृषी प्रयोग, आधुनिक तंत्रज्ञान आणि शेतकरी एकजुटीच्या माध्यमातून वाशिमच्या शेतकऱ्यांनी शेतीच्या नव्या वाटा महाराष्ट्रासमोर उभ्या केल्या आहेत.

सर्व सहभागी तसेच पारितोषिक प्राप्त शेतकरी बंधूंचे मनःपूर्वक अभिनंदन व पुढील वाटचालीसाठी हार्दिक शुभेच्छा!

यावेळी पालकमंत्री श्री. दत्तात्रय मामा भरणे, आमदार सईताई डहाके यांच्यासह मान्यवर उपस्थित होते.

~ संजय उत्तमराव देशमुख
खासदार, यवतमाळ–वाशिम लोकसभा

#FGL #FarmerGroupLeague #हवामानअनुकूलशेती #आधुनिकशेती #sanjaydeshmukh`
    },
    {
      id: "gallery-09",
      num: "06",
      src: "/gallery/gallery-09.jpg",
      title: "Farmer Group League (FGL) Award Ceremony",
      category: "Farmer Group League",
      date: "दि. १४ ऑगस्ट २०२६",
      caption: `📍 वाटपणे लॉन्स, वाशिम | दि. १४ ऑगस्ट २०२६

वाशिमच्या शेतकऱ्यांनी आयोजित केलेल्या Farmer Group League (FGL) या अभिनव उपक्रमास उपस्थित राहिलो.

हवामान बदल, अनिश्चित पाऊस आणि वाढता उत्पादन खर्च अशा आव्हानांवर मात करत ७६५ शेतकरी गटांनी आधुनिक व हवामान अनुकूल शेतीचा स्वीकार केला, ही निश्चितच अभिमानाची बाब आहे.

नवे कृषी प्रयोग, आधुनिक तंत्रज्ञान आणि शेतकरी एकजुटीच्या माध्यमातून वाशिमच्या शेतकऱ्यांनी शेतीच्या नव्या वाटा महाराष्ट्रासमोर उभ्या केल्या आहेत.

सर्व सहभागी तसेच पारितोषिक प्राप्त शेतकरी बंधूंचे मनःपूर्वक अभिनंदन व पुढील वाटचालीसाठी हार्दिक शुभेच्छा!

यावेळी पालकमंत्री श्री. दत्तात्रय मामा भरणे, आमदार सईताई डहाके यांच्यासह मान्यवर उपस्थित होते.

~ संजय उत्तमराव देशमुख
खासदार, यवतमाळ–वाशिम लोकसभा

#FGL #FarmerGroupLeague #हवामानअनुकूलशेती #आधुनिकशेती #sanjaydeshmukh`
    },
    {
      id: "gallery-10",
      num: "07",
      src: "/gallery/gallery-10.jpg",
      title: "Farmer Group League (FGL) Award Ceremony",
      category: "Farmer Group League",
      date: "दि. १४ ऑगस्ट २०२६",
      caption: `📍 वाटपणे लॉन्स, वाशिम | दि. १४ ऑगस्ट २०२६

वाशिमच्या शेतकऱ्यांनी आयोजित केलेल्या Farmer Group League (FGL) या अभिनव उपक्रमास उपस्थित राहिलो.

हवामान बदल, अनिश्चित पाऊस आणि वाढता उत्पादन खर्च अशा आव्हानांवर मात करत ७६५ शेतकरी गटांनी आधुनिक व हवामान अनुकूल शेतीचा स्वीकार केला, ही निश्चितच अभिमानाची बाब आहे.

नवे कृषी प्रयोग, आधुनिक तंत्रज्ञान आणि शेतकरी एकजुटीच्या माध्यमातून वाशिमच्या शेतकऱ्यांनी शेतीच्या नव्या वाटा महाराष्ट्रासमोर उभ्या केल्या आहेत.

सर्व सहभागी तसेच पारितोषिक प्राप्त शेतकरी बंधूंचे मनःपूर्वक अभिनंदन व पुढील वाटचालीसाठी हार्दिक शुभेच्छा!

यावेळी पालकमंत्री श्री. दत्तात्रय मामा भरणे, आमदार सईताई डहाके यांच्यासह मान्यवर उपस्थित होते.

~ संजय उत्तमराव देशमुख
खासदार, यवतमाळ–वाशिम लोकसभा

#FGL #FarmerGroupLeague #हवामानअनुकूलशेती #आधुनिकशेती #sanjaydeshmukh`
    },
    {
      id: "gallery-12",
      num: "08",
      src: "/gallery/gallery-12.jpg",
      title: "Farmer Group League (FGL) Award Ceremony",
      category: "Farmer Group League",
      date: "दि. १४ ऑगस्ट २०२६",
      caption: `📍 वाटपणे लॉन्स, वाशिम | दि. १४ ऑगस्ट २०२६

वाशिमच्या शेतकऱ्यांनी आयोजित केलेल्या Farmer Group League (FGL) या अभिनव उपक्रमास उपस्थित राहिलो.

हवामान बदल, अनिश्चित पाऊस आणि वाढता उत्पादन खर्च अशा आव्हानांवर मात करत ७६५ शेतकरी गटांनी आधुनिक व हवामान अनुकूल शेतीचा स्वीकार केला, ही निश्चितच अभिमानाची बाब आहे.

नवे कृषी प्रयोग, आधुनिक तंत्रज्ञान आणि शेतकरी एकजुटीच्या माध्यमातून वाशिमच्या शेतकऱ्यांनी शेतीच्या नव्या वाटा महाराष्ट्रासमोर उभ्या केल्या आहेत.

सर्व सहभागी तसेच पारितोषिक प्राप्त शेतकरी बंधूंचे मनःपूर्वक अभिनंदन व पुढील वाटचालीसाठी हार्दिक शुभेच्छा!

यावेळी पालकमंत्री श्री. दत्तात्रय मामा भरणे, आमदार सईताई डहाके यांच्यासह मान्यवर उपस्थित होते.

~ संजय उत्तमराव देशमुख
खासदार, यवतमाळ–वाशिम लोकसभा

#FGL #FarmerGroupLeague #हवामानअनुकूलशेती #आधुनिकशेती #sanjaydeshmukh`
    },
    {
      id: "gallery-14",
      num: "09",
      src: "/gallery/gallery-14.jpg",
      title: "Meeting with Foreign Minister S. Jaishankar",
      category: "Delhi ICWF Assistance",
      date: "2026",
      caption: `Late Om Dhananjay Nalaskar, who passed away unfortunately in Germany, was followed up immediately to bring the mortal remains to India and provide necessary help to his family.

The request was made to the Ministry of External Affairs so that the family would not face an additional financial burden. The mortal remains were brought to India free of cost under the Indian Community Welfare Fund (ICWF).

The Ministry of External Affairs and the Indian Embassy in Germany completed the necessary process, and the mortal remains reached India on 24th July 2026.

~ Sanjay Uttamrao Deshmukh
MP, Yavatmal-Washim Loksabha

#Yavatmal #washim #sanjaydeshmukh #Parliament #loksabha`
    }
  ];

  return (
    <section id="success-stories" className="scroll-mt-24 mx-auto mt-16 w-[92%] max-w-[1700px] px-2 sm:px-4 text-center overflow-hidden">
      {/* Section Header */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-primary text-xs font-bold mb-3 shadow-xs">
        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        <span>● ● अधिकृत फोटो गॅलरी व उपक्रम ● ●</span>
      </div>

      <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight">
        खासदार संजय देशमुख – अधिकृत फोटो गॅलरी
      </h2>
      <p className="mt-2 text-sm sm:text-base text-gray-700 max-w-2xl mx-auto font-medium">
        यवतमाळ - वाशिम लोकसभा मतदारसंघातील नोकरी महोत्सव व अधिकृत उपक्रमांची छायाचित्रे
      </p>

      {/* Media Cards Layout Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto text-left">
        {galleryItems.map((item) => {
          const hasImage = Boolean(item.src);
          const cardTitle = item.title || item.captionTitle || item.caption;
          const cardCategory = item.category || item.subtitle;
          const cardCaptionText = item.caption || item.quote;
          const cardDate = item.date || item.year || "2026";
          const isJobCard = item.src && item.src.toLowerCase().includes('job-card');

          return (
            <div
              key={item.id}
              className="w-full bg-white rounded-3xl border border-orange-200/90 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 group"
            >
              {/* Thumbnail Container */}
              {hasImage && (
                <div 
                  className="gallery-image relative cursor-pointer overflow-hidden bg-slate-900/5"
                  onClick={() => setSelectedMedia(item)}
                >
                  <img
                    src={item.src}
                    alt={cardTitle}
                    className={`w-full h-64 ${isJobCard ? 'object-contain p-2 bg-orange-50/40' : 'object-cover'} object-center group-hover:scale-105 transition-transform duration-500`}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `/media/${item.src.split('/').pop()}`;
                    }}
                  />
                </div>
              )}

              {/* Content Body */}
              <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2 gap-1 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-primary font-extrabold text-[11px]">
                      छायाचित्र #{item.num}
                    </span>
                    <span className="font-semibold text-gray-500 text-[11px] sm:text-xs">📅 {cardDate}</span>
                  </div>

                  {/* Photo Title */}
                  <h3 className="text-base sm:text-lg font-black text-gray-900 mb-1 leading-snug group-hover:text-primary transition-colors">
                    {cardTitle}
                  </h3>
                  
                  {/* Category */}
                  <p className="text-xs font-extrabold text-orange-600 mb-3">
                    {cardCategory}
                  </p>

                  {/* Caption rendered directly below category */}
                  {cardCaptionText && (
                    <p className="gallery-caption text-xs sm:text-sm text-gray-700 leading-relaxed pl-3 border-l-2 border-primary/40 font-medium whitespace-pre-line mb-3">
                      {cardCaptionText}
                    </p>
                  )}
                </div>

                {/* Action Button: View Full Image */}
                {hasImage && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => setSelectedMedia(item)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white py-2.5 px-4 font-extrabold text-xs transition-all active:scale-95 shadow-md cursor-pointer"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span>View Full Image</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Media Viewer Lightbox Modal (Clean Orange + White Theme) */}
      <ImageLightboxModal
        isOpen={Boolean(selectedMedia)}
        onClose={() => setSelectedMedia(null)}
        imageSrc={selectedMedia?.src}
        title={selectedMedia?.title || selectedMedia?.caption}
        subtitle="Standard Naukri Mahotsav 2026 | Official Gallery Photo"
        category={selectedMedia?.category}
        date={selectedMedia?.date}
        caption={selectedMedia?.caption}
        number={selectedMedia?.num}
        downloadUrl={selectedMedia?.src}
        downloadFilename={`gallery-${selectedMedia?.num}.jpg`}
      />

    </section>
  );
}
