const ArticleContent = ({ paragraphs }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8">
      {paragraphs?.map((p) => (
        <p key={p.id} className="text-gray-700 leading-relaxed mb-4">
          {p.text_vi_system}
        </p>
      ))}
    </div>
  );
};

export default ArticleContent;
