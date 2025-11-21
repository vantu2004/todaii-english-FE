import React, { useState } from "react";
import { Volume2, Book, Search, Sparkles, BookOpen } from "lucide-react";
import { getRawWord } from "../../../../api/clients/dictionaryApi";
import toast from "react-hot-toast";
import SearchBar from "./../../../../components/clients/SearchBar";

const Dictionary = () => {
  const [word, setWord] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [audio, setAudio] = useState(null);

  const fetchWord = async (word) => {
    if (!word) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await getRawWord(word);
      if (!res) toast.error("Word not found");
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (url) => {
    if (!url) return;
    const sound = new Audio(url);
    sound.play();
    setAudio(sound);
  };

  const partOfSpeechColors = {
    noun: "bg-blue-100 text-blue-700 border-blue-200",
    verb: "bg-green-100 text-green-700 border-green-200",
    adjective: "bg-purple-100 text-purple-700 border-purple-200",
    adverb: "bg-orange-100 text-orange-700 border-orange-200",
    pronoun: "bg-pink-100 text-pink-700 border-pink-200",
    preposition: "bg-yellow-100 text-yellow-700 border-yellow-200",
    conjunction: "bg-red-100 text-red-700 border-red-200",
    interjection: "bg-indigo-100 text-indigo-700 border-indigo-200",
  };

  const getPartOfSpeechColor = (pos) => {
    return (
      partOfSpeechColors[pos?.toLowerCase()] ||
      "bg-gray-100 text-gray-700 border-gray-200"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-10 px-4 mt-16">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Todainary
            </h1>
          </div>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6 border border-gray-100">
          <SearchBar
            value={word}
            onSearch={(text) => {
              setWord(text);
              fetchWord(text);
            }}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Đang tìm kiếm...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-red-700 font-semibold text-lg">{error}</p>
          </div>
        )}

        {/* Results */}
        {data && data.length > 0 && (
          <div className="space-y-6">
            {/* Word Header Card */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-5xl font-bold mb-2">
                    {data[0]?.word || "No word"}
                  </h1>

                  {/* Phonetics */}
                  <div className="space-y-2 mt-4">
                    {data[0]?.phonetics?.map((p, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {p.text && (
                          <span className="text-white/90 text-xl font-medium bg-white/10 px-4 py-2 rounded-lg backdrop-blur">
                            {p.text}
                          </span>
                        )}
                        {p.audio && (
                          <button
                            onClick={() => playAudio(p.audio)}
                            className="p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur transition-all hover:scale-110"
                            title="Phát âm"
                          >
                            <Volume2 size={20} className="text-white" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <Sparkles className="w-12 h-12 text-white/60" />
              </div>
            </div>

            {/* Meanings */}
            {data.map((entry, index) => (
              <div key={index}>
                {entry.meanings.map((meaning, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100"
                  >
                    {/* Part of Speech Badge */}
                    <div className="flex items-center gap-3 mb-5">
                      <Book className="w-5 h-5 text-gray-400" />
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getPartOfSpeechColor(
                          meaning.partOfSpeech
                        )}`}
                      >
                        {meaning.partOfSpeech || "Meaning"}
                      </span>
                    </div>

                    {/* Definitions */}
                    <div className="space-y-4">
                      {meaning.definitions.map((def, di) => (
                        <div
                          key={di}
                          className="bg-gradient-to-r from-gray-50 to-blue-50 p-5 rounded-xl border-l-4 border-blue-400 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              {di + 1}
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-900 font-medium text-lg leading-relaxed">
                                {def.definition}
                              </p>
                              {def.example && (
                                <div className="mt-3 pl-4 border-l-2 border-purple-300 bg-purple-50/50 p-3 rounded-r-lg">
                                  <p className="text-purple-800 italic">
                                    "{def.example}"
                                  </p>
                                </div>
                              )}
                              {def.synonyms && def.synonyms.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <span className="text-sm text-gray-600 font-semibold">
                                    Từ đồng nghĩa:
                                  </span>
                                  {def.synonyms.map((syn, si) => (
                                    <span
                                      key={si}
                                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                                    >
                                      {syn}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {def.antonyms && def.antonyms.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <span className="text-sm text-gray-600 font-semibold">
                                    Từ trái nghĩa:
                                  </span>
                                  {def.antonyms.map((ant, ai) => (
                                    <span
                                      key={ai}
                                      className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                                    >
                                      {ant}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Meaning level synonyms/antonyms */}
                    {(meaning.synonyms?.length > 0 ||
                      meaning.antonyms?.length > 0) && (
                      <div className="mt-5 pt-5 border-t border-gray-200">
                        {meaning.synonyms?.length > 0 && (
                          <div className="mb-3">
                            <span className="text-sm text-gray-600 font-semibold mr-2">
                              Từ đồng nghĩa chung:
                            </span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {meaning.synonyms.map((syn, si) => (
                                <span
                                  key={si}
                                  className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm font-medium"
                                >
                                  {syn}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {meaning.antonyms?.length > 0 && (
                          <div>
                            <span className="text-sm text-gray-600 font-semibold mr-2">
                              Từ trái nghĩa chung:
                            </span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {meaning.antonyms.map((ant, ai) => (
                                <span
                                  key={ai}
                                  className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-sm font-medium"
                                >
                                  {ant}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && !data && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Tìm kiếm từ vựng
            </h3>
            <p className="text-gray-600">
              Nhập từ tiếng Anh để tra cứu nghĩa và cách phát âm
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dictionary;
