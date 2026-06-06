import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Clock, BookOpen } from "lucide-react";

const TestCard = ({ test }) => {
  const imageUrl = test.image_url;

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 flex flex-col hover:shadow-md hover:-translate-y-1 transition-all duration-300 group overflow-hidden h-full">
      {/* Card Banner */}
      <div className="relative aspect-[16/9] w-full bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-center border-b border-neutral-100 dark:border-neutral-800/80 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={test.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-neutral-400 dark:text-neutral-500">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center">
              <GraduationCap className="text-brand-500" size={24} />
            </div>
          </div>
        )}

        {/* Test Type / Collection Badge */}
        {test.collection?.name && (
          <span className="absolute top-4 left-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase text-neutral-700 dark:text-neutral-300 px-2.5 py-1 rounded-lg border border-neutral-150/50 dark:border-neutral-700/50">
            {test.collection.name}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex-1">
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-3 line-clamp-2 group-hover:text-brand-500 transition-colors leading-snug">
            {test.title}
          </h3>

          <div className="flex items-center gap-4 text-xs font-medium text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-neutral-400" />
              <span>{test.duration || 120} phút</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen size={14} className="text-neutral-400" />
              <span>7 phần thi</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          to={`/client/toeic/${test.id}`}
          className="mt-6 w-full py-2.5 px-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold rounded-xl text-center hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm text-sm"
        >
          Chi tiết đề thi
        </Link>
      </div>
    </div>
  );
};

export default TestCard;
