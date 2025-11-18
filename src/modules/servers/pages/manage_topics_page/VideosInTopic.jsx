import { useParams } from "react-router-dom";
import { fetchVideosByTopic } from "../../../../api/servers/videoApi";
import GenericVideoList from "../../../../components/servers/GenericVideoList";

const VideosInTopic = () => {
  const { id } = useParams();

  const fetchApi = (query) =>
    fetchVideosByTopic(
      id,
      query.page,
      query.size,
      query.sortBy,
      query.direction,
      query.keyword
    );

  return <GenericVideoList title="Videos in Topic" fetchApi={fetchApi} />;
};

export default VideosInTopic;
