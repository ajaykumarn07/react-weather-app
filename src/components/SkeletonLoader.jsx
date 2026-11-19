import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Hero Skeleton */}
      <div className="glass-card rounded-3xl p-8 flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="space-y-4 w-full lg:w-1/2">
          <div className="h-10 bg-white/10 rounded-2xl w-3/4" />
          <div className="flex gap-2">
            <div className="h-6 bg-white/10 rounded-xl w-36" />
            <div className="h-6 bg-white/10 rounded-xl w-28" />
          </div>
          <div className="h-4 bg-white/10 rounded-lg w-full" />
        </div>

        <div className="flex items-center gap-6">
          <div className="w-28 h-28 bg-white/10 rounded-full" />
          <div className="space-y-3">
            <div className="h-16 bg-white/10 rounded-2xl w-32" />
            <div className="h-6 bg-white/10 rounded-xl w-24" />
          </div>
        </div>
      </div>

      {/* Hourly Skeleton */}
      <div className="glass-card rounded-3xl p-6">
        <div className="h-6 bg-white/10 rounded-xl w-44 mb-4" />
        <div className="flex gap-3 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white/10 rounded-2xl min-w-[110px] flex-shrink-0"
            />
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-36 bg-white/10 rounded-3xl p-5" />
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
