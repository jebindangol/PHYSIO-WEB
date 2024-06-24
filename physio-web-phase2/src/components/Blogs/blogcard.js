import React from "react";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";

const BlogCard = ({ source, title, w = false }) => {
  return (
    <div className={`rounded-md shadow-md ${w ? "w-[17.25vw]" : "w-80"}`}>
      <Image
        src={source}
        width={350}
        height={100}
        alt="blog_images"
        className={`rounded-md h-44 object-cover ${w ? "w-[17.25vw]" : ""}`}
      />
      <div className="py-4 pr-5 h-[110px] pl-6 flex flex-col justify-between">
        <div className="text-lg font-medium overflow-hidden line-clamp-2">{title}</div>
        <div className="flex items-end justify-end">
          <FiArrowUpRight className="text-green-600 text-3xl" />
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
