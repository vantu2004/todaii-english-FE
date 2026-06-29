const LoadingSkeleton = () => {
  return (
    <div className="bg-white dark:bg-neutral-900/60 rounded-3xl p-6 border border-neutral-100 dark:border-neutral-800/80 animate-pulse shadow-sm">
      {/* Title Skeleton */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-3"></div>
          <div className="h-4 w-32 bg-neutral-100 dark:bg-neutral-800/50 rounded-md"></div>
        </div>
      </div>

      {/* Audio Skeleton */}
      <div className="flex gap-3 mb-8">
        <div className="h-10 w-32 bg-neutral-100 dark:bg-neutral-800/30 rounded-lg"></div>
        <div className="h-10 w-32 bg-neutral-100 dark:bg-neutral-800/30 rounded-lg"></div>
      </div>

      {/* Meanings Skeleton */}
      <div className="space-y-6">
        {[1, 2].map((i) => (
          <div key={i}>
            <div className="h-5 w-24 bg-neutral-200 dark:bg-neutral-800 rounded mb-4"></div>
            <div className="space-y-3 pl-4 border-l-2 border-neutral-100 dark:border-neutral-800">
              <div className="h-4 w-full max-w-2xl bg-neutral-100 dark:bg-neutral-800/50 rounded"></div>
              <div className="h-4 w-3/4 max-w-xl bg-neutral-100 dark:bg-neutral-800/50 rounded"></div>
              <div className="h-12 w-full max-w-2xl bg-neutral-50 dark:bg-neutral-900/50 rounded-lg mt-2"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;
