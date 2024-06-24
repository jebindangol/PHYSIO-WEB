import React from "react";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";

const BlogCard3 = ({ source, title }) => {
  return (
    <div className="w-64 rounded-md shadow-2xl">
      <Image
        src={source}
        width={350}
        height={100}
        alt="blog_images"
        className="rounded-md h-48 object-cover"
      />
      <div className="py-4 pr-5 flex h-24 pl-4">
        <div className="overflow-auto text-black font-semibold">{title}</div>
      </div>
    </div>
  );
};

export default BlogCard3;
