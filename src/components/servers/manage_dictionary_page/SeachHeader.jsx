import { Search, Loader } from "lucide-react";

const SearchHeader = ({
    searchTerm,
    onSearchChange,
    apiSource,
    onSourceChange,
    isLoading
}) => {
    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Input Field */}
            <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search className="w-5 h-5" />
                </div>
                <input
                    type="text"
                    autoFocus
                    value={searchTerm}
                    placeholder="Search any word..."
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-11 pr-12 py-2.5 border border-gray-300 dark:border-gray-700 
             rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
             placeholder:text-gray-400 focus:outline-none focus:border-gray-400 
             focus:ring-2 focus:ring-gray-900/10 transition-all text-sm"
                />
                {isLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <Loader className="w-5 h-5 text-gray-500 animate-spin" />
                    </div>
                )}
            </div>

            {/* Segmented Control Toggle (Aesthetic UI) */}
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg h-full">
                <button
                    onClick={() => onSourceChange("free")}
                    className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${apiSource === "free"
                        ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        }`}
                >
                    Free API
                </button>
                <button
                    onClick={() => onSourceChange("todaii")}
                    className={`flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium rounded-lg transition-all ${apiSource === "todaii"
                        ? "bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                        }`}
                >
                    Todaii API
                </button>
            </div>
        </div>
    );
};

export default SearchHeader;