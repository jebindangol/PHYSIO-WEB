import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import Link from "next/link";
import BlogCard from "./blogcard";
import BlogCard2 from "./blogcard2"
import { Dropdown } from "primereact/dropdown";

import {
  getCategory,
  getAllBlogs,
} from "../../services/apiContract";
import { API_getImage } from "../../services/apiService";


const BlogItem = ({ blog }) => {

  let contents;
  if (blog.layout === "non_featured") {
    contents = (
      <Link href={`/blogs/${blog.id}`}>
        <BlogCard
          source={API_getImage(blog.thumb_image)}
          title={blog.blog_title}
          w={true}
        />
      </Link>
    );
  } else if (blog.layout === "featured") {
    contents = (
      <Link href={`/blogs/${blog.id}`}>
        <BlogCard2
          source={API_getImage(blog.thumb_image)}
          title={blog.blog_title}
          description={renderTextOnly(blog.blog_content)}
          w={true}
        />
      </Link>
    );
  }

  return (
    <div>
      {contents}
    </div>
  );
};

const renderTextOnly = (htmlContent) => {
  const doc = new DOMParser().parseFromString(htmlContent, "text/html");
  const textNodes = doc.body.childNodes;

  const filteredText = Array.from(textNodes).reduce((acc, node) => {
    if (node.nodeName === "#text") {
      acc += node.textContent.replace(/\n/g, " ") + "\n";
    } else if (node.nodeName === "P") {
      acc += node.textContent.replace(/\n/g, " ") + "\n";
    }
    acc += "\n";
    return acc;
  }, "");

  return filteredText;
};


const BlogPage = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const filteredBySearch = blogs.filter((blog) =>
      blog.blog_title.toLowerCase().includes(searchText.toLowerCase())
    );
  
    let filteredByCategory = filteredBySearch;
  
    if (selectedCategory !== "All") {
      filteredByCategory = filteredBySearch.filter(blog => blog.category_id === selectedCategory.id);
    }
  
    const match = filteredByCategory.find(
      (blog) => blog.blog_title.toLowerCase() === searchText.toLowerCase()
    );
  
    if (match) {
      const filteredWithoutMatch = filteredByCategory.filter(
        (blog) => blog.blog_title.toLowerCase() !== searchText.toLowerCase()
      );
      setFilteredBlogs([match, ...filteredWithoutMatch]);
    } else {
      setFilteredBlogs(filteredByCategory);
    }
  }, [searchText, blogs, selectedCategory]);


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
        setBlogs(activeBlogs);
    })
    .catch ((error) => {
        console.error(error);
    })
  },[]);

useEffect(() => {
  getCategory()
      .then((res) => {
          console.log(res);
          setCategory(res.data);
      })
      .catch((error) => {
          console.error(error);
  });
}, []);
  
const handleCategoryChange = (selectedValue) => {
  if (selectedValue.name === "All") {
    setSelectedCategory("All");
  } else {
    setSelectedCategory(selectedValue);
  }
};

  return (
    <div className="shadow-equal rounded-md w-[96vw] mb-5"
    style={{ minHeight: "calc(100vh - 140px)" }}>
      <div
        style={{
          backgroundImage: 'url("/servicebg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="flex justify-between py-9 rounded-t-md"
      >
        <div className="flex items-center gap-5 w-[72vw] mx-auto pl-0">
          <div className="text-8xl font-thin text-gray-500">|</div>
          <div className="font-bold text-3xl text-gray-800 leading-10">
            <h1>NPRC </h1>
            <h1 className="font-medium">BLOGS & ARTICLES</h1>
          </div>
        </div>
      </div>

      <div className="w-[72vw] mx-auto mt-7">
        <div className="flex justify-between mb-5 ">
          <div className="flex items-center">
            <InputText
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search"
              className="w-40 py-3 pl-3 outline-none border border-2 rounded-sm w-96"
              
            />
          </div>
          <div className="py-3 pl-3 border border-2 rounded-sm w-48 text-gray-500 font-semibold">
            {/* Categories */}
            <Dropdown
            options={[{ id: 0, name: "All" }, ...category]}
            value={selectedCategory}
            optionLabel="name"
            onChange={(e) => handleCategoryChange(e.value)}
            placeholder="Categories"
            panelClassName="w-48 -ml-3 shadow-lg rounded-md bg-white p-3"
            className="w-48 category"
          />
          </div>
        </div>
        <div className="flex justify-center w-[72vw]">
          <div className="flex flex-wrap gap-[0.9vw] pb-11">
            {filteredBlogs.map((blog, index) => (
              <BlogItem key={index} blog={blog} />
            ))}

          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
