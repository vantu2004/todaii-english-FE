import VocanManagerContainer from "../VocabManagerContainer";
import {
  fetchVideo,
  addWordToVideo,
  deleteWordFromVideo,
  deleteAllWordsFromVideo,
} from "../../../../api/servers/videoApi";

const ManageVocabsInVideo = () => {
  return (
    <VocanManagerContainer
      fetchApi={fetchVideo}
      addApi={addWordToVideo}
      deleteApi={deleteWordFromVideo}
      clearApi={deleteAllWordsFromVideo}
      onAutoGenerate={null}
      title="VIDEO"
    />
  );
};

export default ManageVocabsInVideo;
