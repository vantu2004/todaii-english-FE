import { createVocabDeck } from "../../../../api/servers/vocabDeckApi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { logError } from "../../../../utils/LogError";
import VocabDeckForm from "../../../../components/servers/manage_vocab_decks_page/VocabDeckForm";
import { useHeaderContext } from "../../../../hooks/servers/useHeaderContext";
import { useEffect } from "react";

const CreateVocabDeck = () => {
  const { setHeader } = useHeaderContext();

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

  useEffect(() => {
    setHeader({
      title: "Manage Vocabulary Decks",
      breadcrumb: [
        { label: "Home", to: "/server" },
        { label: "Manage Vocabulary Decks", to: "/server/vocab-deck" },
        { label: "Create Vocabulary Deck" },
      ],
    });
  }, []);

  return (
    <div className="flex flex-col h-full">
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
