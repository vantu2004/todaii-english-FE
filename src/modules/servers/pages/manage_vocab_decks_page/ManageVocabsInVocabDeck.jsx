import VocabManagerContainer from "@/modules/servers/pages/VocabManagerContainer";
import {
  fetchVocabDeck,
  addWordToDeck,
  deleteWordFromDeck,
  deleteAllWordsFromDeck,
  vocabExtractionDeck,
} from "@/api/servers/vocabDeckApi";

const ManageVocabsInVocabDeck = () => {
  return (
    <VocabManagerContainer
      fetchApi={fetchVocabDeck}
      addApi={addWordToDeck}
      deleteApi={deleteWordFromDeck}
      clearApi={deleteAllWordsFromDeck}
      onVocabExtract={vocabExtractionDeck}
      title="VOCABULARY DECK"
    />
  );
};

export default ManageVocabsInVocabDeck;
