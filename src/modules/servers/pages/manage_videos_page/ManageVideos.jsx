import { fetchVideos } from "../../../../api/servers/videoApi";
import GenericVideoList from "../../../../components/servers/GenericVideoList";

const ManageVideos = () => {
  const fetchApi = (query) =>
    fetchVideos(
      query.page,
      query.size,
      query.sortBy,
      query.direction,
      query.keyword
    );

  return <GenericVideoList title="Manage Articles" fetchApi={fetchApi} />;
};

export default ManageVideos;
