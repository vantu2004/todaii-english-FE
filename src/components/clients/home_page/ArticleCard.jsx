import React from "react";
import { formatISODate } from "../../../utils/FormatDate";
import { Eye } from "lucide-react";
import { Link } from "react-router-dom";

const ArticleCard = ({
  id,
  image_url,
  title,
  source_name,
  published_at,
  updated_at,
  views,
}) => {
  return (
    <Link
      to={`/client/article/${id}`}
      className="relative rounded-xl overflow-hidden shadow-sm bg-white hover:shadow-lg hover:scale-101 duration-300 ease-in-out"
    >
      <img src={image_url} alt="" className="w-full h-24 object-cover" />

      <div className="absolute h-6 top-18 border border-gray-400/10 text-[10px] rounded-r-sm  bg-[#f7f7f7] px-1">
        <p className="relative top-1">{source_name}</p>
      </div>
      <div className="p-2 bg-white text-[13px]">
        <p className="mt-1 text-gray-700 line-clamp-1">{title}</p>

        <p className="mt-3 text-gray-500">{formatISODate(updated_at)}</p>

        <div className="flex items-center gap-1 mt-2 text-gray-500">
          <Eye size={14} />
          <span>{views}</span>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
