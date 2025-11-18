import { useParams } from "react-router-dom";
import { fetchArticlesByTopic } from "../../../../api/servers/articleApi";
import GenericArticleList from "../../../../components/servers/GenericArticleList";

const ArticlesInTopic = () => {
  const { id } = useParams();

  const fetchApi = (query) =>
    fetchArticlesByTopic(
      id,
      query.page,
      query.size,
      query.sortBy,
      query.direction,
      query.keyword
    );

  return <GenericArticleList title="Articles in Topic" fetchApi={fetchApi} />;
};

export default ArticlesInTopic;
