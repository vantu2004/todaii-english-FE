const LoadingSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-800/30 rounded-lg p-6 border border-gray-200 dark:border-gray-800 animate-pulse">
            {/* Title Skeleton */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-3"></div>
                    <div className="h-4 w-32 bg-gray-100 dark:bg-gray-700/50 rounded-md"></div>
                </div>
            </div>

            {/* Audio Skeleton */}
            <div className="flex gap-3 mb-8">
                <div className="h-10 w-32 bg-gray-100 dark:bg-gray-700/30 rounded-lg"></div>
                <div className="h-10 w-32 bg-gray-100 dark:bg-gray-700/30 rounded-lg"></div>
            </div>

            {/* Meanings Skeleton */}
            <div className="space-y-6">
                {[1, 2].map((i) => (
                    <div key={i}>
                        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                        <div className="space-y-3 pl-4 border-l-2 border-gray-100 dark:border-gray-700">
                            <div className="h-4 w-full max-w-2xl bg-gray-100 dark:bg-gray-700/50 rounded"></div>
                            <div className="h-4 w-3/4 max-w-xl bg-gray-100 dark:bg-gray-700/50 rounded"></div>
                            <div className="h-12 w-full max-w-2xl bg-gray-50 dark:bg-gray-800/50 rounded-lg mt-2"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LoadingSkeleton;