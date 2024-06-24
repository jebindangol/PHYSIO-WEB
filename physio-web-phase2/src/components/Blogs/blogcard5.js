import React from "react";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";

const BlogCard5 = ({ source, title}) => {
    return (
        <div className="flex w-[35vw]">
            <Image
                src={source}
                width={350}
                height={100}
                alt="blog_images"
                className={`rounded-md h-60 object-cover w-[17.5vw]`}
            />
            <div className="py-7 pr-5 h-60 pl-11 flex flex-col justify-between bg-blue-100 w-[17.5vw] rounded-r-md">
                <div className="text-lg font-medium overflow-auto line-clamp-4">{title}</div>
                <div className="flex items-end justify-end">
                <FiArrowUpRight className="text-green-600 text-3xl" />
                </div>
            </div>
        </div>
    );
};

export default BlogCard5;