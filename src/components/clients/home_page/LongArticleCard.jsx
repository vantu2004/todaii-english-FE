import React from "react";
import { formatISODate } from "../../../utils/FormatDate";
import { Eye } from "lucide-react";

const LongArticleCard = ({
  image_url,
  title,
  cefr_level,
  description,
  source,
  views,
  published_at,
  updated_at
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex gap-4 hover:shadow-md transition hover:scale-101 duration-300 ease-in-out article-card">
      <img
        src={image_url}
        alt={title}
        className="w-60 h-36 object-cover rounded"
      />
      <div className="flex-1">
        <div className="inline items-center gap-2 mb-1">
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {cefr_level || "B1"}
          </span>
          <h2 className="font-bold text-lg line-clamp-2 title-hoverline ml-2">
            {title}
          </h2>
        </div>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>

        <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
          <span>Nguồn: {source}</span>
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" /> {views}
          </span>
          <span>{formatISODate(updated_at)}</span>
        </div>
      </div>
    </div>
  );
};

export default LongArticleCard;
