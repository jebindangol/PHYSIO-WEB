import React from "react";
import Image from "next/image";
import BlogCard3 from "./blogcard3";
import Link from "next/link";
import { getBlogById } from "../../services/apiContract";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import {
  getAllBlogs,
} from "../../services/apiContract";
import { API_getImage } from "../../services/apiService";


const Details = () => {

  const router = useRouter();
  const {id} = router.query;
  const [blogs, setBlogs]=useState();
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    getBlogById(id)
    .then((res) => {
      setBlogs(res.data);
    })
    .catch((error) => {
      console.log(error);
    })
  },[id]);

  useEffect(() => {
    getAllBlogs()
    .then((res) => {
        console.log("Received all Blogs Details", res.data);
        const parsedBlogsData = res.data.map(blog => ({
            ...blog,
            thumb_image: blog.thumb_image ? blog.thumb_image.replace(/^{\"(.*)\"}$/, "$1") : null,
                cover_image_mobile : blog.cover_image_mobile ? blog.cover_image_mobile.replace(/^{\"(.*)\"}$/, "$1") : null,
                cover_image_web : blog.cover_image_web ? blog.cover_image_web.replace(/^{\"(.*)\"}$/, "$1") : null,
        }));
        const activeBlogs = parsedBlogsData.filter(blog => blog.status === true);
        activeBlogs.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
        setRelatedBlogs(activeBlogs);
    })
    .catch ((error) => {
        console.error(error);
    })
  },[]);

  const filteredRelatedBlogs = relatedBlogs.filter(
    (blog) => blog.category_id === blogs?.category_id && blog.id !== blogs?.id
  );


  return (
    <div
      className="shadow-equal rounded-md w-[96vw] mb-5"
      style={{ minHeight: "calc(100vh - 140px)" }}
    >
      <div
        style={{
          backgroundImage: 'url("/servicebg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="flex justify-between py-9 rounded-t-md"
      >
        <div className="flex items-center gap-5 w-[75vw] mx-auto pl-0">
          <div className="text-8xl font-thin text-gray-500">|</div>
          <div className="font-bold text-3xl text-gray-800 leading-10">
            <h1>NPC </h1>
            <h1 className="font-medium">NEWS & ARTICLES</h1>
          </div>
        </div>
      </div>
      {blogs && (
      <div className="mt-7 w-[75vw] mx-auto text-gray-800">
        <div className="flex justify-between">
          <div className="flex flex-col gap-5 w-[39vw]">
            <div className="text-xl font-semibold text-black">
              {blogs.blog_title}
            </div>
            <div className="text-gray-500">Published on : {blogs.created_at.split("T")[0]}</div>
            <div className="flex gap-7">
              <div>Share:</div>
              <img src="/facebook.png" className="h-5" />
              <img src="/instagram.png" className="h-5" />
              <img src="/twitter.png" className="h-5" />
            </div>
            <div className="flex flex-col gap-7 text-gray-700 mb-32">
              {blogs?.blog_content && (
                    <div className="ql-editor"
                      dangerouslySetInnerHTML={{ __html: blogs.blog_content }}
                    />
                  )}

              <div className="flex gap-7 mt-7">
                <div>Share:</div>
                <img src="/facebook.png" className="h-5" />
                <img src="/instagram.png" className="h-5" />
                <img src="/twitter.png" className="h-5" />
              </div>
            </div>
          </div>

          {/* More Articles */}
          <div className="text-black mb-11">
            <div className="font-bold text-lg mt-11 mb-7">More Articles</div>
            <div className="flex flex-col gap-11">
            {filteredRelatedBlogs.slice(0, 3).map((blog, index) => (
                <Link href={`/blogs/${blog.id}`} key={blog.id}>
                  <BlogCard3
                    source={API_getImage(blog.thumb_image)}
                    title={blog.blog_title}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default Details;
