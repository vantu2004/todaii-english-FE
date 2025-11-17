import toast from "react-hot-toast";
import {
  fetchVocabDeck,
  updateVocabDeck,
} from "../../../../api/servers/vocabDeckApi";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { logError } from "../../../../utils/LogError";
import VocabDeckForm from "../../../../components/servers/manage_vocab_decks_page/VocabDeckForm";

const UpdateVocabDeck = () => {
  const { id } = useParams();

  const [deck, setDeck] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchVocabDeck(id);
        setDeck(data);
      } catch (err) {
        logError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleUpdateDeck = async (formData) => {
    try {
      await updateVocabDeck(id, formData);
      toast.success("Vocabulary Deck updated!");

      navigate("/server/vocab-deck");
    } catch (error) {
      logError(error);
    }
  };

  if (loading) {
    return <div className="p-8 text-gray-500">Loading...</div>;
  }

  if (!deck) {
    return (
      <div className="p-8 text-red-500">
        Cannot load vocabulary deck. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none">
        <h2 className="mb-4 text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Manage Vocabulary Decks
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.5 }}
        className="flex-1 overflow-hidden border border-gray-300 rounded-lg shadow-sm"
      >
        <VocabDeckForm
          mode="update"
          initialData={deck}
          onSubmit={handleUpdateDeck}
        />
      </motion.div>
    </div>
  );
};

export default UpdateVocabDeck;
