import { createVocabDeck } from "../../../../api/servers/vocabDeckApi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { logError } from "../../../../utils/LogError";
import VocabDeckForm from "../../../../components/servers/manage_vocab_decks_page/VocabDeckForm";

const CreateVocabDeck = () => {
  const navigate = useNavigate();
  const [initialData] = useState({
    name: "",
    description: "",
    cefr_level: "A1",
    groups_ids: [],
  });

  const handleCreateDeck = async (data) => {
    try {
      await createVocabDeck(data);
      navigate("/server/vocab-deck");
    } catch (error) {
      logError(error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-none">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Manage Vocabulary Decks
        </h2>
      </div>

      {/* Deck Form */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
        className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm"
      >
        <VocabDeckForm
          mode="create"
          initialData={initialData}
          onSubmit={handleCreateDeck}
        />
      </motion.div>
    </div>
  );
};

export default CreateVocabDeck;
