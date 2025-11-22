// import { useState, useEffect, useCallback } from "react";
// import { Bookmark, BookmarkCheck, ChevronRight } from "lucide-react";
// import Modal from "../../../../components/servers/Modal";
// import Pagination from "../../../../components/clients/Pagination";
// import SavedArticleCard from "../../../../components/clients/saved_article_page/SavedArticleCard";
// import toast from "react-hot-toast";
// import SearchBar from "../../../../components/clients/SearchBar";
// import { getSavedArticlesByUser } from "../../../../api/clients/articleApi";

// const SavedArticles = () => {
//   const [articles, setArticles] = useState([]);
//   const [filteredArticles, setFilteredArticles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalElements, setTotalElements] = useState(0);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [currentArticle, setCurrentArticle] = useState(null);

//   useEffect(() => {
//     fetchSavedArticles();
//   }, [page]);

//   const fetchSavedArticles = async () => {
//     setLoading(true);
//     try {
//       const data = await getSavedArticlesByUser();

//       setArticles(data);
//       setFilteredArticles(data.content);
//       setTotalPages(data.total_pages);
//       setTotalElements(data.total_elements);
//     } catch (error) {
//       console.error("Error fetching saved articles:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openUnsaveModal = (article) => {
//     setCurrentArticle(article);
//     setModalOpen(true);
//   };

//   const confirmUnsave = async () => {
//     if (!currentArticle) return;
//     await unsavedArticle(currentArticle.id);
//     toast.success("Article has been unsaved!");
//     setModalOpen(false);
//     setCurrentArticle(null);
//     fetchSavedArticles();
//   };

//   const cancelUnsave = () => {
//     setModalOpen(false);
//     setCurrentArticle(null);
//   };

//   // Debounced search
//   const handleSearch = useCallback(
//     debounce((keyword) => {
//       const lower = keyword.toLowerCase();
//       setFilteredArticles(
//         articles.filter(
//           (a) =>
//             a.title.toLowerCase().includes(lower) ||
//             (a.description && a.description.toLowerCase().includes(lower))
//         )
//       );
//     }, 300),
//     [articles]
//   );

//   function debounce(func, wait) {
//     let timeout;
//     return function (...args) {
//       clearTimeout(timeout);
//       timeout = setTimeout(() => func.apply(this, args), wait);
//     };
//   }

//   if (loading) {
//     return (
//       <div className="mt-20 bg-[#f9fafc] min-h-screen py-8">
//         <div className="max-w-6xl mx-auto px-6">
//           <div className="animate-pulse space-y-4">
//             {Array(5)
//               .fill(0)
//               .map((_, i) => (
//                 <div key={i} className="bg-gray-200 h-48 rounded-xl"></div>
//               ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-20 bg-[#f9fafc] min-h-screen py-8">
//       <div className="max-w-6xl mx-auto px-6">
//         {/* Breadcrumbs */}
//         <nav className="text-base mb-4">
//           <ol className="flex items-center gap-2 text-gray-600">
//             <li>
//               <a
//                 href="/client/home"
//                 className="text-blue-600 hover:underline font-medium"
//               >
//                 Home
//               </a>
//             </li>
//             <ChevronRight size={15} />
//             <li className="text-gray-700 font-semibold">Saved articles</li>
//           </ol>
//         </nav>

//         {/* Header + Search */}
//         <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div className="flex items-center gap-3 mb-2">
//             <BookmarkCheck className="w-8 h-8 text-blue-600" />
//             <h1 className="text-3xl font-bold text-gray-900">
//               Bài viết đã lưu
//             </h1>
//           </div>
//           <div className="w-full sm:w-1/3">
//             <SearchBar
//               placeholder="Tìm kiếm bài viết..."
//               onChangeSearch={handleSearch}
//             />
//           </div>
//         </div>

//         {/* Articles List */}
//         {filteredArticles.length === 0 ? (
//           <div className="text-center py-20">
//             <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h2 className="text-xl font-semibold text-gray-700 mb-2">
//               {articles.length === 0
//                 ? "Chưa có bài viết nào được lưu"
//                 : "Không tìm thấy kết quả nào"}
//             </h2>
//             <p className="text-gray-500">
//               {articles.length === 0
//                 ? "Lưu các bài viết yêu thích để đọc sau"
//                 : "Thử kiểm tra lại từ khóa tìm kiếm của bạn"}
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredArticles.map((article) => (
//               <SavedArticleCard
//                 key={article.id}
//                 article={article}
//                 openUnsaveModal={openUnsaveModal} // pass modal handler
//               />
//             ))}
//           </div>
//         )}

//         {/* Pagination */}
//         {totalPages > 1 && (
//           <div className="mt-8">
//             <Pagination
//               currentPage={page}
//               totalPages={totalPages}
//               onPageChange={(p) => setPage(p)}
//             />
//           </div>
//         )}

//         {/* Modal */}
//         <Modal
//           isOpen={modalOpen}
//           onClose={cancelUnsave}
//           title="Xác nhận bỏ lưu bài viết"
//           footer={
//             <>
//               <button
//                 onClick={cancelUnsave}
//                 className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
//               >
//                 Hủy
//               </button>
//               <button
//                 onClick={confirmUnsave}
//                 className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 hover:scale-105 ease-in-out duration-300"
//               >
//                 Xác nhận
//               </button>
//             </>
//           }
//         >
//           <p>
//             Bạn có chắc muốn bỏ lưu bài viết: <br />
//             <span className="font-semibold">{currentArticle?.title}</span>
//           </p>
//         </Modal>
//       </div>
//     </div>
//   );
// };

// export default SavedArticles;

import React from "react";

const SavedArticles = () => {
  return <div>SavedArticles</div>;
};

export default SavedArticles;
