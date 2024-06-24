import React from "react";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";

const BlogCard2 = ({ source, title, description, w = false }) => {
  return (
    <div className={`${w ? "" : ""}`}>
      <div className="rounded-md flex">
        <Image
          src={source}
          width={350}
          height={100}
          alt="blog_images"
          className={`rounded-md h-72 object-cover ${w ? "w-[17.75vw]" : ""}`}
        />
        <div className={`${w ? "w-[17.75vw]" : "w-80"} rounded-md shadow-box px-7 py-8 h-72 overflow-auto`}>
          <div className="font-semibold pb-4">
            {title}
          </div>
          <div className="text-gray-500 text-[15px] line-clamp-4">
            <div
              dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard2;
