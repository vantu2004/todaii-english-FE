import { Bookmark, BookmarkCheck } from "lucide-react";

const BookmarkButton = ({ bookmarked, toggleBookmark }) => {
  return (
    <button
      onClick={toggleBookmark}
      className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-all z-50"
    >
      {bookmarked ? (
        <BookmarkCheck className="w-6 h-6 text-blue-600" />
      ) : (
        <Bookmark className="w-6 h-6 text-gray-500" />
      )}
    </button>
  );
};

export default BookmarkButton;
