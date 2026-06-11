import VocabManagerContainer from "@/modules/servers/pages/VocabManagerContainer";
import {
  fetchArticle,
  addWordToArticle,
  deleteWordFromArticle,
  deleteAllWordsFromArticle,
  vocabExtractionArticle,
} from "@/api/servers/articleApi";

const ManageVocabsInArticle = () => {
  return (
    <VocabManagerContainer
      fetchApi={fetchArticle}
      addApi={addWordToArticle}
      deleteApi={deleteWordFromArticle}
      clearApi={deleteAllWordsFromArticle}
      onVocabExtract={vocabExtractionArticle}
      title="ARTICLE"
    />
  );
};

export default ManageVocabsInArticle;
