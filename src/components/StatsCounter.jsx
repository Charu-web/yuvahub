import React from 'react';
import { Building2, Users, Briefcase, UserCheck } from 'lucide-react';
import { statisticsData } from '../data/jobData';

export default function StatsCounter() {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Building2':
        return <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-primary stroke-[2.2]" />;
      case 'Users':
        return <Users className="w-6 h-6 sm:w-7 sm:h-7 text-primary stroke-[2.2]" />;
      case 'Briefcase':
        return <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-primary stroke-[2.2]" />;
      case 'UserCheck':
        return <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 text-primary stroke-[2.2]" />;
      default:
        return <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />;
    }
  };

  return (
    <section className="w-[94%] max-w-[1600px] mx-auto my-8 md:my-12 px-2 sm:px-4">
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border border-orange-100/90">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-orange-100">
          {statisticsData.map((stat, idx) => (
            <div
              key={stat.id}
              className={`flex flex-col items-center justify-center p-3 sm:p-5 transition-transform duration-300 hover:scale-[1.02] ${
                idx !== 0 ? 'pt-4 lg:pt-5' : ''
              }`}
            >
              <div className="size-14 sm:size-16 rounded-2xl bg-orange-100/80 border border-orange-200 grid place-items-center text-primary shadow-xs mb-3">
                {getIcon(stat.icon)}
              </div>
              <p className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-none">
                <span className="text-primary">{stat.count}</span>
              </p>
              <p className="mt-2 text-xs sm:text-sm md:text-base font-extrabold text-gray-700 text-center leading-snug">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
