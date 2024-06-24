import React, { useState, useEffect, useRef } from "react";
import BlogCard from "../Blogs/blogcard";
import { IoCaretForwardSharp } from "react-icons/io5";
import { IoCaretBackSharp } from "react-icons/io5";
import { getAllBlogs } from "../../services/apiContract";
import { API_getImage } from "../../services/apiService";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Link from "next/link";


const BlogSection = () => {
  
  const [blogs,setBlogs] = useState([]);

  useEffect(() => {
    getAllBlogs()
    .then((res) => {
      console.log(res.data);
      const parsedBlogsData = res.data.map(blog => ({
        ...blog,
        thumb_image: blog.thumb_image ? JSON.parse(blog.thumb_image?.replace(/^{(.*)}$/, "[$1]") || "[]") : null,
        cover_image_mobile: blog.cover_image_mobile ? JSON.parse(blog.cover_image_mobile?.replace(/^{(.*)}$/, "[$1]") || "[]") : null,
        cover_image_web: blog.cover_image_web ? JSON.parse(blog.cover_image_web?.replace(/^{(.*)}$/, "[$1]") || "[]") : null
    }));
      const activeBlogs = parsedBlogsData.filter(blog => blog.status === true);
      activeBlogs.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      setBlogs(activeBlogs);
    })
    .catch((error) => {
      console.log("error fetching blogs", error)
    })
  },[])


  return (
    <div className="flex gap-4 justify-between my-10 items-center w-[90%] mx-auto">
      <div
        className="shadow-lg border py-5 px-1 rounded-md cursor-pointer prev1"
      >
        <IoCaretBackSharp className="text-red-500 text-3xl" />
      </div>
      <div className="flex overflow-hidden blog-section">
      <Swiper
            modules={[Navigation]}
            loop={true}
            spaceBetween={0}
            slidesPerView='auto'
            navigation={{
              prevEl: ".prev1",
              nextEl: ".next1",
            }}
            grabCursor={true}
            className=""
          >
        {blogs.map((blog, index) => (
          <SwiperSlide key={index}>
            <Link href={`/blogs/${blog.id}`}>
              <BlogCard key={index} source={API_getImage(blog.thumb_image)} title={blog.blog_title} />
            </Link>
          </SwiperSlide>

        ))}
        </Swiper>
      </div>
      <div className="shadow-lg border py-5 px-1 rounded-md cursor-pointer next1">
        <IoCaretForwardSharp className="text-red-500 text-3xl" />
      </div>
    </div>
  );
};

export default BlogSection;
