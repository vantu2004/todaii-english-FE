import React from "react";
import { Link } from "react-router-dom";
import { formatISODate } from "../../../utils/FormatDate";
import { Eye } from "lucide-react";

const BigArticleCard = ({
  image_url,
  title,
  source_name,
  published_at,
  updated_at,
  views,
}) => {
  return (
    <div className="w-full flex justify-center rounded-xl shadow-md bg-white hover:shadow-lg border border-black/10 py-4 transition-shadow duration-300 article-card">
      <Link className="block w-[95%] relative rounded-xl shadow-md text-white bg-black overflow-hidden">
        <img
          src={image_url}
          alt="article"
          className="w-[80%] mx-auto h-[400px] object-cover"
        />
        <div className="absolute bottom-0 h-40 rounded-xl bg-gradient-to-t from-black/60 to-black/30 p-5">
          <h2 className="text-white text-3xl font-extrabold leading-12 title-hoverline">
            {title}
          </h2>
          <div className="mt-1 text-sm flex items-center gap-2">
            <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
              {source_name}
            </span>
            <span className="ml-4">{formatISODate(updated_at)}</span>
            <span className="ml-4 flex items-center gap-1">
              <Eye size={16} /> {views}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BigArticleCard;
