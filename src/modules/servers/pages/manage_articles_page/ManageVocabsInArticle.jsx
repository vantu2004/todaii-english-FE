import VocabManagerContainer from "../VocabManagerContainer";
import {
  fetchArticle,
  addWordToArticle,
  deleteWordFromArticle,
  deleteAllWordsFromArticle,
} from "../../../../api/servers/articleApi";

const ManageVocabsInArticle = () => {
  return (
    <VocabManagerContainer
      fetchApi={fetchArticle}
      addApi={addWordToArticle}
      deleteApi={deleteWordFromArticle}
      clearApi={deleteAllWordsFromArticle}
      onAutoGenerate={null}
      title="ARTICLE"
    />
  );
};

export default ManageVocabsInArticle;
