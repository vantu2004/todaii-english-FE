import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import useArticleDetails from "../../../hooks/clients/useArticleDetails";

import BookmarkButton from "./../../../components/clients/article_details_page/BookmarkButton";
import ArticleHeader from "./../../../components/clients/article_details_page/ArticleHeader";
import ArticleImage from "./../../../components/clients/article_details_page/ArticleImage";
import ArticleContent from "./../../../components/clients/article_details_page/ArticleContent";
import ArticleWords from "./../../../components/clients/article_details_page/ArticleWords";

const ArticleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { article } = useArticleDetails(id);

  const [bookmarked, setBookmarked] = useState(false);
  const toggleBookmark = () => setBookmarked(!bookmarked);

  if (!article) return null;

  const data = {
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

  // Speak a single text
  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Sorry, your browser does not support text-to-speech!");
    }
  };


  return (
    <div className="min-h-screen bg-[#f9fafc] pt-20 px-4 md:px-8 pb-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        {/* Listen buttons */}
        <div className="mb-4 flex gap-2 justify-end">
          <button
            onClick={() => speakText(data.title)}
            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            🔊 Nghe tiêu đề
          </button>
        </div>

        <div className="relative">
          <BookmarkButton
            bookmarked={bookmarked}
            toggleBookmark={toggleBookmark}
          />
          <ArticleHeader data={data} formatDate={formatDate} />
        </div>

        <ArticleImage src={data.image} title={data.title} />

        <ArticleContent paragraphs={data.paragraphs} />

        <ArticleWords entries={data.entries} />
      </div>
    </div>
  );
};

export default ArticleDetails;
