import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useArticleDetails from "../../../hooks/clients/useArticleDetails";
import ArticleHeader from "./../../../components/clients/article_details_page/ArticleHeader";
import ArticleImage from "./../../../components/clients/article_details_page/ArticleImage";
import ArticleContent from "./../../../components/clients/article_details_page/ArticleContent";
import ArticleWords from "./../../../components/clients/article_details_page/ArticleWords";
import TopicTags from "../../../components/clients/home_page/sidebar/TopicTags";
import { AnimatePresence, motion } from "framer-motion";

const ArticleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { article } = useArticleDetails(id);

  if (!article) return null;

  const data = {
    id: article.id,
    title: article.title,
    author: article.author,
    publishedAt: article.published_at,
    cefr: article.cefr_level,
    source: article.source_name,
    image: article.image_url,
    views: article.views,
    topics: article.topics?.map((t) => t.name),
    paragraphs: article.paragraphs,
    entries: article.entries,
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

              <ArticleWords entries={data.entries} />
            </div>

            {/* RIGHT - Sidebar */}
            <aside className="w-full lg:w-80 xl:w-96 flex-shrink-0">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Topics */}
                <div className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-4">
                    Chủ đề
                  </h3>
                  <TopicTags />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ArticleDetails;
