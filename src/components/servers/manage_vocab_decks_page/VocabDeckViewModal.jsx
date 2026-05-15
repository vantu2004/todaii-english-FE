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
import Modal from "@/components/servers/Modal";
import { formatISODate } from "@/utils/FormatDate";

const VocabDeckViewModal = ({ isOpen, onClose, deck }) => {
  if (!deck) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="sm:max-w-6xl"
      title={
        <h2 className="text-lg font-semibold text-gray-900">
          Vocabulary Deck Details
        </h2>
      }
    >
      <div className="space-y-8">
        {/* Deck Title */}
        <div className="text-center">
          <h1 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
            {deck.name}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{deck.description}</p>
        </div>

        {/* Status + CEFR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-xs font-medium text-gray-500 mb-1">
              CEFR Level
            </p>
            <p className="text-lg font-semibold text-gray-900">{deck.cefr_level}</p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <p className="text-xs font-medium text-gray-500 mb-1">
              Status
            </p>
            <div
              className="inline-flex items-center gap-2 px-3 py-1 text-sm font-semibold rounded-md"
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
        <div className="border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Layers size={18} className="text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">
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
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm flex gap-2 items-center"
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
        <div className="border border-gray-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={18} className="text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">
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
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  {/* Headword */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">
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
                        className="p-4 rounded-lg bg-gray-50"
                      >
                        <p className="text-xs font-medium text-gray-500 mb-1">
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
                            <p className="text-xs font-medium text-gray-500">
                              Synonyms
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {s.synonyms.map((syn, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium"
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
                            <p className="text-xs font-medium text-gray-500">
                              Collocations
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {s.collocations.map((col, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium"
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
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">
              Created At
            </p>
            <p className="font-medium text-gray-900">
              {formatISODate(deck.created_at)}
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">
              Updated At
            </p>
            <p className="font-medium text-gray-900">
              {formatISODate(deck.updated_at)}
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-xs font-medium text-gray-500 mb-1">
              Deck ID
            </p>
            <p className="font-mono font-medium text-gray-900">#{deck.id}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VocabDeckViewModal;
