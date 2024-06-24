import React from "react";
import Image from "next/image";

const BlogCard4 = ({ source, title }) => {
    return (
        <div className="rounded-md shadow-lg h-60">
            <Image
                src={source}
                width={350}
                height={100}
                alt="blog_images"
                className={`h-40 object-cover w-52`}
            />
            <div className="w-52 p-3 h-20">
                <div className="text-bae font-medium line-clamp-2">{title}</div>
            </div>
        </div>
    );
};

export default BlogCard4;