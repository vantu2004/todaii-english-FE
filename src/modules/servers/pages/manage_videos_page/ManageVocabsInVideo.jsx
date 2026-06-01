import VocabManagerContainer from "@/modules/servers/pages/VocabManagerContainer";
import {
  fetchVideo,
  addWordToVideo,
  deleteWordFromVideo,
  deleteAllWordsFromVideo,
  vocabExtractionVideo,
} from "@/api/servers/videoApi";

const ManageVocabsInVideo = () => {
  return (
    <VocabManagerContainer
      fetchApi={fetchVideo}
      addApi={addWordToVideo}
      deleteApi={deleteWordFromVideo}
      clearApi={deleteAllWordsFromVideo}
      onVocabExtract={vocabExtractionVideo}
      title="VIDEO"
    />
  );
};

export default ManageVocabsInVideo;
