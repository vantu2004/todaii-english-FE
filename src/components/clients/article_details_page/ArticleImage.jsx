const ArticleImage = ({ src, title }) => {
  if (!src) return null;

  return (
    <img
      src={src}
      alt={title}
      className="w-full h-96 object-cover rounded-2xl shadow-sm mb-6"
    />
  );
};

export default ArticleImage;
