const SearchBar = ({ query, updateQuery }) => {
  return (
    <div className="w-full mb-4">
      <input
        type="text"
        placeholder="Tìm kiếm bài viết..."
        className="w-full px-4 py-2 rounded-xl border focus:ring-2 focus:ring-blue-500"
        value={query.keyword}
        onChange={(e) => updateQuery({ keyword: e.target.value, page: 1 })}
      />
    </div>
  );
};

export default SearchBar;
