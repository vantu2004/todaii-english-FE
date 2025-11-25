export default function AISuggestion({ word, onClick }) {
  return (
    <div className="p-4 mt-4 text-center border rounded bg-yellow-50">
      <p className="text-gray-700">
        Không tìm thấy từ <strong>{word}</strong> trong từ điển.
      </p>
      <button
        onClick={onClick}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Thử nghĩa bằng AI
      </button>
    </div>
  );
}
