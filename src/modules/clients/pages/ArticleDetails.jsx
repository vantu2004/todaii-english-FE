import { useParams } from "react-router-dom";
import useArticleDetails from "../../../hooks/clients/useArticleDetails";
import ArticleHeader from "./../../../components/clients/article_details_page/ArticleHeader";
import ArticleImage from "./../../../components/clients/article_details_page/ArticleImage";
import ArticleContent from "./../../../components/clients/article_details_page/ArticleContent";
import { AnimatePresence, motion } from "framer-motion";
import SavedArticleTags from "../../../components/clients/home_page/sidebar/SavedArticleTags";
import RelatedArticles from "../../../components/clients/article_details_page/RelatedArticles";
import { getEntriesByArticleId } from "../../../api/clients/articleApi";
import EntryWordList from "../../../components/clients/EntryWordList";
import PageNotFound from "../../../pages/PageNotFound";

const ArticleDetails = () => {
  const { id } = useParams();
  const { article } = useArticleDetails(id);

  if (!article) return <PageNotFound />;

  const data = {
    id: article.id,
    title: article.title,
    author: article.author,
    publishedAt: article.published_at,
    cefr: article.cefr_level,
    source: article.source_name,
    image: article.image_url,
    views: article.views,
    topics: article.topics,
    paragraphs: article.paragraphs,
    words: article.words,
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <AnimatePresence>
      <motion.div
        key="search-results-page"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 50 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-neutral-50/50 pt-24 pb-12 px-4"
      >
        <div className="max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* LEFT - Main Content */}
            <div className="flex-1 min-w-0">
              <ArticleHeader data={data} formatDate={formatDate} />
              <ArticleImage src={data.image} title={data.title} />
              <ArticleContent paragraphs={data.paragraphs} />
              <EntryWordList id={data.id} fetchApi={getEntriesByArticleId} />
            </div>

            {/* RIGHT - Sidebar */}
            <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                <RelatedArticles articleId={id} />
                <SavedArticleTags />
              </div>
            </aside>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ArticleDetails;
