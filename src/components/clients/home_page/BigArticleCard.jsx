import React from "react";
import { Link } from "react-router-dom";

const BigArticleCard = (imgURL, title, source, published_date) => {
  return (
    <div className="w-full flex justify-center rounded-xl shadow-md bg-white hover:shadow-lg border border-black/10 py-4">
      <Link className="block w-[95%] relative rounded-xl shadow-md text-white bg-black">
        <img
          src={imgURL}
          alt="article"
          className="w-[80%] mx-auto h-[400px] object-cover"
        />
        <div className="absolute bottom-0 h-40 rounded-xl bg-gradient-to-t from-black/60 to-black/30 p-5">
          <h2 className="text-white text-3xl font-extrabold z-10 leading-12">
            {title}
          </h2>
          <div className="mt-1">{source}</div>
          <></>
        </div>
      </Link>
    </div>
  );
};

export default BigArticleCard;
