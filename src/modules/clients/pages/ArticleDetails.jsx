import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Eye, BookOpen, Share2, Bookmark, ArrowLeft, Globe } from 'lucide-react';

const ArticleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch article data
    // Replace with your actual API call
    const fetchArticle = async () => {
      try {
        // const response = await fetch(`/api/articles/${id}`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockArticle = {
          id: id,
          title: "The Future of Artificial Intelligence in Modern Technology",
          content: `
            <p>Artificial intelligence has been transforming the way we interact with technology, creating unprecedented opportunities across various industries. From healthcare to finance, AI is reshaping our world.</p>
            
            <h2>Understanding AI Development</h2>
            <p>The rapid advancement in AI technology has brought forth numerous innovations. Machine learning algorithms are becoming increasingly sophisticated, enabling computers to learn from data and improve their performance over time.</p>
            
            <p>Deep learning, a subset of machine learning, has particularly shown remarkable results in image recognition, natural language processing, and autonomous systems. These technologies are now integral to many applications we use daily.</p>
            
            <h2>Real-World Applications</h2>
            <p>In healthcare, AI assists doctors in diagnosing diseases more accurately. Financial institutions use AI for fraud detection and risk assessment. Self-driving cars rely on AI to navigate safely through complex environments.</p>
            
            <p>The integration of AI in our daily lives continues to expand, raising important questions about ethics, privacy, and the future of work. As we move forward, it's crucial to develop AI responsibly, ensuring it benefits humanity while minimizing potential risks.</p>
            
            <h2>Looking Ahead</h2>
            <p>The future of AI holds immense promise. Researchers are working on more advanced systems that can understand context, exhibit creativity, and make complex decisions. As these technologies mature, they will likely play an even more significant role in shaping our society.</p>
          `,
          author: "John Smith",
          publishedAt: "2024-11-15T10:30:00Z",
          source: "Tech Insights",
          cefrLevel: "B2",
          topic: "Technology",
          views: 1234,
          readingTime: 8,
          imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
        };
        
        setArticle(mockArticle);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching article:", error);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleBookmark = () => {
    // Add bookmark logic
    alert('Article bookmarked!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9fafc] pt-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="h-8 bg-gray-200 rounded-lg w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-96 bg-gray-200 rounded-2xl mb-8"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#f9fafc] pt-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Article not found</h2>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9fafc] pt-20 px-4 md:px-8 pb-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        {/* Article Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
          {/* Category Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {article.topic}
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
              {article.cefrLevel}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {article.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{article.author}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{formatDate(article.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span className="text-sm">{article.readingTime} phút đọc</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span className="text-sm">{article.views.toLocaleString()} lượt xem</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span className="text-sm">{article.source}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 
                       text-gray-700 rounded-xl transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Chia sẻ</span>
            </button>
            <button
              onClick={handleBookmark}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 
                       text-gray-700 rounded-xl transition-colors"
            >
              <Bookmark className="w-4 h-4" />
              <span>Lưu bài</span>
            </button>
          </div>
        </div>

        {/* Featured Image */}
        {article.imageUrl && (
          <div className="mb-6">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-96 object-cover rounded-2xl shadow-sm"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div 
            className="prose prose-lg max-w-none
                     prose-headings:font-bold prose-headings:text-gray-900
                     prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
                     prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                     prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                     prose-strong:text-gray-900 prose-strong:font-semibold"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Related Articles Section (Optional) */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Bài viết liên quan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Add related articles here */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <p className="text-gray-500 text-center py-8">Chưa có bài viết liên quan</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetails;