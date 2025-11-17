const ArticleWords = ({ entries }) => {
  if (!entries?.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Từ vựng</h2>

      <div className="space-y-6">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="border border-gray-200 rounded-xl p-5 hover:shadow-sm transition"
          >
            {/* HEADWORD */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-blue-700">
                  {entry.headword}
                </h3>

                {entry.ipa && (
                  <p className="text-gray-600 text-sm mt-1">{entry.ipa}</p>
                )}
              </div>

              {entry.audio_url && (
                <button
                  onClick={() => new Audio(entry.audio_url).play()}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition active:scale-95"
                >
                  ▶ Nghe
                </button>
              )}
            </div>

            {/* SENSES */}
            <div className="mt-4 space-y-4">
              {entry.senses?.map((sense) => (
                <div key={sense.id} className="pl-3 border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium text-blue-700">
                      {sense.pos}
                    </span>{" "}
                    · {sense.meaning}
                  </p>

                  <p className="text-gray-600 mt-1 text-sm italic">
                    {sense.definition}
                  </p>

                  <p className="mt-2 text-gray-800">
                    <span className="font-medium">Ví dụ:</span> {sense.example}
                  </p>

                  {sense.synonyms?.length > 0 && (
                    <p className="mt-2 text-sm text-gray-700">
                      <span className="font-medium">Synonyms:</span>{" "}
                      {sense.synonyms.join(", ")}
                    </p>
                  )}

                  {sense.collocations?.length > 0 && (
                    <p className="mt-1 text-sm text-gray-700">
                      <span className="font-medium">Collocations:</span>{" "}
                      {sense.collocations.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleWords;
