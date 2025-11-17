import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    name: "Lifestyle",
    count: "3+",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400",
  },
  {
    name: "Travel",
    count: "3+",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400",
  },
  {
    name: "Beauty",
    count: "1+",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400",
  },
  {
    name: "Drink",
    count: "1+",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",
  },
];

const TopicGrid = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl text-gray-900">Topics</h3>
        <div className="flex gap-2">
          <button className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition">
            <ChevronLeft size={16} />
          </button>
          <button className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((category, i) => (
          <Link
            key={i}
            to={`/category/${category.name.toLowerCase()}`}
            className="relative h-32 rounded-lg overflow-hidden group"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span className="text-2xl font-bold">{category.count}</span>
              <span className="text-sm font-semibold">{category.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopicGrid;
