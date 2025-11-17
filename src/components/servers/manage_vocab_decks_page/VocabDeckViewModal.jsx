import {
  Eye,
  Layers,
  BookOpen,
  Hash,
  CheckCircle2,
  XCircle,
  User,
  Sparkles,
} from "lucide-react";
import Modal from "../Modal";
import { formatISODate } from "../../../utils/FormatDate";

const VocabDeckViewModal = ({ isOpen, onClose, deck }) => {
  if (!deck) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="sm:max-w-6xl"
      title={
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-indigo-100 to-indigo-50 rounded-lg">
            <Eye className="text-indigo-600" size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Vocabulary Deck Details
            </h2>
            <p className="text-sm text-gray-500">
              View deck information & words
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Deck Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 leading-tight">
            {deck.name}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{deck.description}</p>
        </div>

        {/* Status + CEFR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200/60">
            <p className="text-xs font-bold text-green-700 mb-1 uppercase tracking-wide">
              CEFR Level
            </p>
            <p className="text-lg font-bold text-gray-900">{deck.cefr_level}</p>
          </div>

          <div className="p-4 bg-gradient-to-br from-red-50 to-red-100/50 rounded-xl border border-red-200/60">
            <p className="text-xs font-bold text-red-700 mb-1 uppercase tracking-wide">
              Status
            </p>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 text-sm font-bold rounded-full"
              style={{
                backgroundColor: deck.enabled ? "#d1fae5" : "#fee2e2",
                color: deck.enabled ? "#065f46" : "#991b1b",
              }}
            >
              {deck.enabled ? (
                <CheckCircle2 size={16} />
              ) : (
                <XCircle size={16} />
              )}
              {deck.enabled ? "Enabled" : "Disabled"}
            </div>
          </div>
        </div>

        {/* Groups */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-2xl p-6 border border-yellow-200/60 shadow">
          <div className="flex items-center gap-2 mb-4">
            <Layers size={18} className="text-yellow-700" />
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
              Groups ({deck.groups?.length})
            </h3>
          </div>

          {deck.groups?.length === 0 ? (
            <p className="text-gray-500 italic">
              No groups linked to this deck.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {deck.groups.map((g) => (
                <div
                  key={g.id}
                  className="px-4 py-2 bg-white rounded-full text-sm border shadow-sm hover:shadow-md transition-all flex gap-2 items-center"
                >
                  <span>{g.name}</span>
                  {!g.enabled && (
                    <span className="text-gray-400 text-xs">(Disabled)</span>
                  )}
                  {g.is_deleted && (
                    <span className="text-red-500 text-xs">(Deleted)</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Words */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200/60 shadow">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-blue-700" />
            <h3 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
              Words ({deck.words?.length})
            </h3>
          </div>

          {deck.words?.length === 0 ? (
            <p className="text-gray-500 italic">This deck has no words yet.</p>
          ) : (
            <div className="space-y-6">
              {deck.words.map((word) => (
                <div
                  key={word.id}
                  className="bg-white rounded-xl border border-gray-200 shadow p-4 hover:shadow-lg transition-all"
                >
                  {/* Headword */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold text-gray-900">
                      {word.headword}
                    </h4>
                    {word.ipa && (
                      <span className="text-gray-500 italic">{word.ipa}</span>
                    )}
                  </div>

                  {/* Audio */}
                  {word.audio_url && (
                    <audio
                      controls
                      className="mt-3 w-full"
                      src={word.audio_url}
                    />
                  )}

                  {/* Senses */}
                  <div className="mt-4 space-y-4">
                    {word.senses.map((s) => (
                      <div
                        key={s.id}
                        className="p-4 rounded-xl bg-gray-50 shadow-sm"
                      >
                        <p className="text-xs uppercase font-bold text-gray-600 mb-1">
                          {s.pos}
                        </p>
                        <p className="font-semibold text-gray-800">
                          {s.meaning}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {s.definition}
                        </p>

                        {s.example && (
                          <p className="mt-2 text-sm text-gray-700 italic">
                            “{s.example}”
                          </p>
                        )}

                        {/* synonyms */}
                        {s.synonyms?.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-bold uppercase text-purple-700">
                              Synonyms
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {s.synonyms.map((syn, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold"
                                >
                                  {syn}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Collocations */}
                        {s.collocations?.length > 0 && (
                          <div className="mt-3">
                            <p className="text-xs font-bold uppercase text-green-700">
                              Collocations
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {s.collocations.map((col, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold"
                                >
                                  {col}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-xl p-4 border border-indigo-200/60">
            <p className="text-xs font-bold text-indigo-700 mb-1 uppercase">
              Created At
            </p>
            <p className="font-semibold text-gray-900">
              {formatISODate(deck.created_at)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/60">
            <p className="text-xs font-bold text-purple-700 mb-1 uppercase">
              Updated At
            </p>
            <p className="font-semibold text-gray-900">
              {formatISODate(deck.updated_at)}
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200/60">
            <p className="text-xs font-bold text-gray-700 mb-1 uppercase">
              Deck ID
            </p>
            <p className="font-mono font-bold text-gray-900">#{deck.id}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VocabDeckViewModal;
