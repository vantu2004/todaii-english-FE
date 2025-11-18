import GenericArticleList from "../../../../components/servers/GenericArticleList";
import { fetchArticles } from "../../../../api/servers/articleApi";

const ManageArticles = () => {
  const fetchApi = (query) =>
    fetchArticles(
      query.page,
      query.size,
      query.sortBy,
      query.direction,
      query.keyword
    );

  return <GenericArticleList title="Manage Articles" fetchApi={fetchApi} />;
};

export default ManageArticles;
