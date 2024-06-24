import Link from "next/link";
import { useRouter } from "next/router";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { HiPlus } from "react-icons/hi2";
import Image from "next/image";
import { Dropdown } from "primereact/dropdown";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import {
    getCategory,
    getAllBlogs,
    deleteBlogs,
} from "../../../services/apiContract";
import { API_getImage } from "../../../services/apiService";

const Blog = () => {
    const [searchText, setSearchText] = useState("");
    const [category, setCategory] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [filteredBlogs, setFilteredBlogs] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    
    const handleDeleteClick = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You are about to delete this blog.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
            }).then((result) => {
            if (result.isConfirmed) {
                // User confirmed, proceed with deletion
                deleteBlogs(id)
                .then(() => {
                    // After successfully deleting the blog, update the blogs state
                    setBlogs((prevBlogs) =>
                    prevBlogs.filter((blog) => blog.id !== id)
                    );
                    Swal.fire("Deleted!", "The blog has been deleted.", "success");
                })
                .catch((error) => {
                    console.error("Error deleting blog:", error);
                    // Handle error
                    Swal.fire(
                    "Error!",
                    "An error occurred while deleting the blog.",
                    "error"
                    );
                });
            }
        });
    };

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
        setSelectedCategory(selectedValue);
    };
    
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
            setBlogs(Array.isArray(parsedBlogsData) ? parsedBlogsData : []);
        })
        .catch ((error) => {
            console.error(error);
        })
    },[]);

    useEffect(() => {
        filterBlogsData();
    }, [searchText, selectedCategory, blogs]);

    const filterBlogsData = () => {
        let filteredData = blogs.slice();

        if (searchText.trim() !== "") {
            filteredData = filteredData.filter((blog) =>
                blog.blog_title.toLowerCase().includes(searchText.toLowerCase())
            );
        }
    
        if (selectedCategory && selectedCategory.name !== "All") {
            filteredData = filteredData.filter((blog) => blog.category_id === selectedCategory.id);
        }

        setFilteredBlogs(filteredData.length > 0 ? filteredData : null);
    };
    
    
    return (
        <section className="bg-tableColor w-full">
        <div className="flex justify-between bg-white px-10 py-2">
            <div className="flex flex-row gap-4 items-center">
                <h3 className="font-bold text-medium">Blogs</h3>
                <button className="bg-blue-900 px-2 py-2 rounded-md text-white">
                    <Link
                        href="./new"
                        className="flex flex-row items-center gap-2 px-2 font-semibold"
                    >
                        <HiPlus fontSize={28} />
                        Create New
                    </Link>
                </button>
            </div>
            <div className="flex flex-row gap-5">
                <div className="relative flex flex-row border">
                    <input
                        type="text"
                        placeholder="Search Blogs"
                        className="px-5 py-2 w-[450px] outline-none"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button className="bg-white flex items-center justify-center px-5">
                        <IoSearchOutline className="text-gray-400 text-lg font-bold" />
                    </button>
                </div>
                <div>
                    <Dropdown
                        options={[{ id: 0, name: "All" }, ...category]}
                        value={selectedCategory}
                        optionLabel="name"
                        onChange={(e) => handleCategoryChange(e.value)}
                        placeholder="Filter by Category"
                        className="w-[270px] space-x-5 pr-3 py-2 border rounded z-10 "
                        panelClassName="bg-white border rounded-b px-4 py-2 w-[270px]"
                    />
                </div>
            </div>
        </div>
        {Array.isArray(blogs) && blogs.length >= 0 && (
            <TableComponent
            blogs = { filteredBlogs || blogs  }
            handleDeleteClick={handleDeleteClick}
            />
        )}
        </section>
    );
};

const TableComponent = ({ blogs, handleDeleteClick }) => {

    const titleBodyTemplate = (blog) => {
        return <div className="flex items-center gap-5">
            <Image 
            src={API_getImage(blog.thumb_image)} 
            alt= "image" 
            width={20} 
            height={20}
            />
            {blog.blog_title}
        </div>;
    };
    const categoryBodyTemplate = (blog) => {
        return <span className="py-5 ">{blog.name}</span>;
    };
    const statusBodyTemplate = (blog) => {
        const isActive = blog.status === true;
        return <span className={`py-5 ${isActive ? 'text-green-500' : 'text-red-500'}`}>{isActive ? 'Active' : 'Inactive'}</span>;
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex flex-row gap-4 justify-center">
                <button
                onClick={() => handleEditClick(rowData.id)}
                >
                    <FaEdit className="text-blue-800 text-lg" />
                </button>
                <div className="w-[2px] h-8 bg-gray-500"></div>
                <div
                onClick={() => handleDeleteClick(rowData.id)}
                className="flex flex-row gap-2 justify-center items-center cursor-pointer"
                >
                    <FaTrashAlt className="text-blue-800 text-lg" />
                </div>
            </div>
        )
    };
    
    const router = useRouter();
    const handleEditClick = (id) => {
        console.log(id, "clicked id is");
    
        router.push({
            pathname: "/admin/blogs/new",
            query: { id },
        });
    };
    
    return (
        <div className="p-10 h-screen">
        <div className="card table-list">
            <DataTable
            value={blogs}
            showGridlines
            tableStyle={{ minWidth: "60rem" }}
            scrollable
            scrollHeight="70vh"
            >
            <Column
                field="title"
                header="Blog Title"
                body={titleBodyTemplate}
                headerClassName="px-5 table-align"
                bodyClassName= 'bg-white text-center py-3'
                style={{ minWidth: "150px", maxWidth: "18vw" }}
            ></Column>
            <Column
                field="category"
                header="Category"
                style={{ minWidth: "150px", maxWidth: "18vw" }}
                headerClassName="py-3"
                body={categoryBodyTemplate}
                bodyClassName= 'bg-white text-center px-5 py-3'
            ></Column>
            <Column
                field="status"
                header="Status"
                style={{ minWidth: "90px", maxWidth: "18vw" }}
                body={statusBodyTemplate}
                headerClassName="px-5"
                bodyClassName= 'bg-white text-center px-5 py-3'
            ></Column>
            <Column
                field="action"
                header="Action"
                style={{ minWidth: "280px" }}
                headerClassName="w-full flex justify-center py-3"
                bodyClassName={(rowData) =>
                `${
                    rowData.progress === "new" ? "bg-blue-50" : "bg-white"
                } text-center`
                }
                body={(rowData) => actionBodyTemplate(rowData)}
            ></Column>
            </DataTable>
        </div>
        </div>
    );
};

export default Blog;
