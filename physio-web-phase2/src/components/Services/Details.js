import React from "react";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import { getServicesById } from "../../services/apiContract";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { API_getImage } from "../../services/apiService";
import {
  getAllBlogs,
} from "../../services/apiContract";
import BlogCard4 from "../Blogs/blogcard4";
import BlogCard5 from "../Blogs/blogcard5";
import Link from "next/link";

const Details = () => {
  const router = useRouter();
  const {id} = router.query;
  const [services, setServices]=useState();
  const [relatedBlogs, setRelatedBlogs] = useState([]);

  useEffect(() => {
    if (id) {
      getServicesById(id)
        .then((res) => {
          setServices(res.data);
          console.log("service", res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [id]);

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
        console.log("active",relatedBlogs);
    })
    .catch ((error) => {
        console.error(error);
    })
  },[]);

  const filteredRelatedBlogs = relatedBlogs.filter(
    (blog) => blog.category_id === services?.category_id
  );
  console.log("filter",filteredRelatedBlogs);


  return (
    <div
      className="shadow-equal rounded-md w-[96vw] mb-5"
      style={{ minHeight: "calc(100vh - 140px)" }}
    >
      {services &&(
        <div>
          <div
            style={{
              backgroundImage: 'url("/servicebg.png")',
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="py-9 rounded-t-md"
          >
            
            <div className="w-[75vw] mx-auto flex justify-between ">
              <div className="flex items-center gap-5 pl-0">
                <div className="text-8xl font-thin text-gray-500">|</div>
                <div className="font-bold text-3xl text-gray-800 leading-10 w-44">
                  {services.sub_title}
                </div>
              </div>
              <div>
                <Image src="/service.png" width={100} height={100} alt="service" />
              </div>
            </div>
          </div>

          <div className="w-[75vw] mx-auto pb-14">
            <div className="flex flex-col gap-4 mt-7 w-[50%] mb-11">
              <div className="flex gap-5 font-semibold text-gray-700">
                Services | {services.sub_title}
              </div>
              <div>
                <div className="ql-editor"
                  dangerouslySetInnerHTML={{ __html: services.sub_summary }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 my-7 mb-20">
              <div className="font-semibold text-gray-700">Treatment Process</div>
              <div className="flex justify-between">
                <div className="w-[50%]">
                  <div className="ql-editor"
                      dangerouslySetInnerHTML={{ __html: services.sub_description }}
                    />
                </div>
                <div className="">
                  <video controls className="bg-black w-[30vw] h-72  ">
                    <source src={API_getImage(services.video)} type="video/mp4" />
                  </video>
                </div>
              </div>
            </div>

            <div>
              <div className="mb-7">
                <div className="font-bold text-2xl">Krijal Khadka</div>
                <div className="font-semibold">National Football Team, Striker</div>
              </div>
              <div className="flex justify-between">
                <p className="w-[45%]">
                  ‘’ After a sports injury, their dedicated team guided me through a
                  tailored rehabilitation program. Their personalized approach,
                  coupled with a warm and supportive environment, made the journey
                  to recovery not only effective but enjoyable ‘’
                </p>
                <p className="w-[45%]">
                  ‘’ After a sports injury, their dedicated team guided me through a
                  tailored rehabilitation program. Their personalized approach,
                  coupled with a warm and supportive environment, made the journey
                  to recovery not only effective but enjoyable ‘’
                </p>
              </div>
            </div>

            <div className="my-14 flex gap-3">
              {filteredRelatedBlogs.length > 0 && (
                <Link href={`/blogs/${filteredRelatedBlogs[0].id}`} key={filteredRelatedBlogs[0].id}>
                  <BlogCard5
                    source={API_getImage(filteredRelatedBlogs[0].thumb_image)}
                    title={filteredRelatedBlogs[0].blog_title}
                  />
                </Link>
              )}

              {filteredRelatedBlogs.slice(1, 3).map((blog, index) => (
                <Link href={`/blogs/${blog.id}`} key={blog.id}>
                  <BlogCard4
                    source={API_getImage(blog.thumb_image)}
                    title={blog.blog_title}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
        )}
    </div>
  );
};

export default Details;
