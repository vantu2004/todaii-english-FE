import {
  ExternalLink,
  Volume2,
  Search,
  Loader,
  X,
  History,
} from "lucide-react";
import { fetchRawWord } from "../../../../api/servers/dictionaryApi";
import { useState, useRef, useEffect } from "react";

const DictionaryApi = () => {
  const [rawWord, setRawWord] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const debounceTimerRef = useRef(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("dictionarySearchHistory");
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (err) {
        console.error("Error loading search history:", err);
      }
    }
  }, []);

  const getRawWord = async (word) => {
    if (!word.trim()) {
      setRawWord([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetchRawWord(word);
      setRawWord(response);

      // Only save to history if API returned results
      if (response && response.length > 0) {
        setSearchHistory((prev) => {
          const filtered = prev.filter((item) => item !== word);
          const updated = [word, ...filtered].slice(0, 10);
          // Save to localStorage
          localStorage.setItem(
            "dictionarySearchHistory",
            JSON.stringify(updated)
          );
          return updated;
        });
      }
    } catch (err) {
      console.error("Error:", err);
      setRawWord([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounce
    debounceTimerRef.current = setTimeout(() => {
      getRawWord(value);
    }, 500);
  };

  const removeFromHistory = (word) => {
    setSearchHistory((prev) => {
      const updated = prev.filter((item) => item !== word);
      localStorage.setItem("dictionarySearchHistory", JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem("dictionarySearchHistory");
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br">
      {/* Title */}
      <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
        Dictionary API
        <a
          href="https://dictionaryapi.dev/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center p-1 rounded-lg text-gray-600 dark:text-gray-400 
           hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          title="Visit Dictionary API"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </h2>

      {/* Search Input */}
      <div className="relative mb-6">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          autoFocus
          value={searchTerm}
          placeholder="Search any word..."
          onChange={handleInputChange}
          className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 
                rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-600
                focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200
                dark:focus:border-blue-400 dark:focus:ring-blue-900/20
                transition-all duration-200 text-base"
        />
        {isLoading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <Loader className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />
          </div>
        )}
      </div>

      {/* Recent Searches */}
      {searchHistory.length > 0 && (
        <div className="pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Recent Searches
              </h3>
            </div>
            <button
              onClick={clearHistory}
              className="text-xs font-medium text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((word, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg
                  hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <button
                  onClick={() => {
                    setSearchTerm(word);
                    getRawWord(word);
                  }}
                  className="text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 font-medium"
                >
                  {word}
                </button>
                <button
                  onClick={() => removeFromHistory(word)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-600 dark:hover:text-red-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Container */}
      <div className="mt-8 space-y-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mb-3" />
            <p className="text-gray-600 dark:text-gray-400">Searching...</p>
          </div>
        ) : rawWord && rawWord.length > 0 ? (
          rawWord.map((entry, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50
                  hover:shadow-md dark:hover:shadow-lg dark:shadow-blue-900/10 transition-all"
            >
              {/* Word Header */}
              <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                    {entry.word}
                  </h3>
                  {entry.phonetic && (
                    <p className="text-lg text-blue-600 dark:text-blue-400 font-mono">
                      {entry.phonetic}
                    </p>
                  )}
                </div>
              </div>

              {/* Phonetics with Audio */}
              {entry.phonetics && entry.phonetics.length > 0 && (
                <div className="mb-6 space-y-2">
                  {entry.phonetics.map((p, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50
                          border border-gray-200/50 dark:border-gray-700/50"
                    >
                      <div className="flex-1">
                        {p.text && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {p.text}
                          </p>
                        )}
                      </div>
                      {p.audio && (
                        <button
                          onClick={() => new Audio(p.audio).play()}
                          className="flex-shrink-0 p-2 rounded-lg text-blue-600 dark:text-blue-400
                              hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                          title="Play audio"
                        >
                          <Volume2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Meanings */}
              {entry.meanings && entry.meanings.length > 0 && (
                <div className="space-y-6">
                  {entry.meanings.map((meaning, mIdx) => (
                    <div key={mIdx}>
                      {meaning.part_of_speech && (
                        <div className="flex items-center gap-3 mb-4">
                          <h4 className="text-lg font-semibold italic text-gray-900 dark:text-gray-50">
                            {meaning.part_of_speech}
                          </h4>
                          <div className="flex-1 h-px bg-gray-300 dark:bg-gray-700" />
                        </div>
                      )}

                      {/* Definitions */}
                      {meaning.definitions &&
                        meaning.definitions.length > 0 && (
                          <div className="mb-4">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                              Definitions
                            </p>
                            <ul className="space-y-2 ml-4">
                              {meaning.definitions.map((def, dIdx) => (
                                <li
                                  key={dIdx}
                                  className="text-gray-700 dark:text-gray-300 text-sm relative"
                                >
                                  <span className="absolute -left-4 w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 mt-1.5" />
                                  <span>{def.definition}</span>
                                  {def.example && (
                                    <div className="mt-2 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-2 border-blue-500 dark:border-blue-400">
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        Example:
                                      </p>
                                      <p className="text-sm italic text-gray-700 dark:text-gray-200">
                                        "{def.example}"
                                      </p>
                                    </div>
                                  )}
                                  {def.synonyms && def.synonyms.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1.5">
                                      {def.synonyms.map((syn, sIdx) => (
                                        <span
                                          key={sIdx}
                                          className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300
                                            rounded text-xs font-medium"
                                        >
                                          {syn}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Synonyms */}
                      {meaning.synonyms && meaning.synonyms.length > 0 && (
                        <div className="mt-4">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                            Synonyms
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {meaning.synonyms.map((syn, sIdx) => (
                              <span
                                key={sIdx}
                                className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300
                                    rounded-lg text-sm font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50
                                    transition-colors cursor-pointer"
                                onClick={() => {
                                  setSearchTerm(syn);
                                  getRawWord(syn);
                                }}
                              >
                                {syn}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : searchTerm ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No results found for "
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {searchTerm}
              </span>
              "
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              Try a different word or check the spelling
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Search className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Start searching to see definitions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DictionaryApi;
