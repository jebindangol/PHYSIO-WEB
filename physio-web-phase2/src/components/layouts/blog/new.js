import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import Editor from "../../wysiwyg/editor";
import { Dropdown } from "primereact/dropdown";
import { TfiPlus } from "react-icons/tfi";
import Image from "next/image";
import Card from "../../../../public/card.png";
import Bottom from "../../../../public/bottom.png";
import { ProgressSpinner } from "primereact/progressspinner";
import Swal from "sweetalert2";
import Switch from '@mui/material/Switch';
import {
    getCategory,
    createBlogs,
    getBlogById,
    updateBlogs,
} from "../../../services/apiContract";
const NewBlog = () => {
    const {
        handleSubmit,
        control,
        watch,
        setValue,
        register,
        formState: { errors },
    } = useForm();
    const [loading, setLoading] = useState(false);
    const [wysiwygContent, setWysiwygContent] = useState("");
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [isChecked, setIsChecked] = useState(false); 
    const router = useRouter();
    const uploadedFiles = {
        thumb_image: watch("thumb_image"),
        cover_image_web: watch("cover_image_web"),
        cover_image_mobile: watch("cover_image_mobile"),
    };
    const { id } = router.query;
    
    const onSubmit = async (data) => {
        setLoading(true);
        data.wysiwygContent = wysiwygContent;
        data.category_id = selectedCategory.id;
        data.status = isChecked;
        console.log("data", data);
        try  {
            
            if (id) {
                await updateBlogs(data, id);
            } else {
                await createBlogs(data);
            }

            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Blog created successfully!',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    router.back();
                }
            });
        } catch (error) {
            console.log("Error when creating blogs:", error);
        }
        setLoading(false);
    }
    
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

    useEffect(() => {
        if (id) {
            getBlogById(id)
                .then((res) => {
                    const data = {
                        thumb_image: res.data.thumb_image ? res.data.thumb_image.replace(/^{\"(.*)\"}$/, "$1") : null,
                        cover_image_mobile : res.data.cover_image_mobile ? res.data.cover_image_mobile.replace(/^{\"(.*)\"}$/, "$1") : null,
                        cover_image_web : res.data.cover_image_web ? res.data.cover_image_web.replace(/^{\"(.*)\"}$/, "$1") : null,
                    }
                    console.log(data)
                    const initialcontent = res.data.blog_content;
                    setWysiwygContent(initialcontent);
                    const initialCategory = res.data.category_id;
                    console.log(initialCategory,"fetch by id")
                    setSelectedCategory(initialCategory);
                    setValue("blog_title", res.data.blog_title);
                    setValue("blog_content", res.data.blog_content);
                    setValue("thumb_image", data.thumb_image);
                    setValue("cover_image_web", data.cover_image_web);
                    setValue("cover_image_mobile", data.cover_image_mobile);
                    setValue("author", res.data.author);
                    setIsChecked("status", res.data.status);
                    setValue("layout",res.data.layout);
                })
                .catch((error) => {
                    console.error("Error fetching blog by ID:", error);
                });
        }
    }, [id]);
        
    const handleCategoryChange = (selectedValue) => {
        setSelectedCategory(selectedValue);
    };
    

    const handleCancel = () => {
        router.back();
    }
    const label = { inputProps: { 'aria-label': 'Status' } };
    const handleSwitchToggle = () => {
        setIsChecked((prevChecked) => !prevChecked); 
    };
    return (
        <div className="min-h-screen bg-blue-100">
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white opacity-75 z-50">
                <ProgressSpinner visible = "true" />
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                </div>
            )}
            <div className="flex items-center px-10 py-4 gap-2 bg-white">
                <Link href="/admin/blogs/blog">
                <h3 className="font-bold">Blog</h3>
                </Link>

                <div className="h-5 w-[2px] bg-black"></div>
                <h3>Add New</h3>

                <Switch 
                    checked={isChecked}
                    onChange={handleSwitchToggle} 
                    {...label} 
                />
            </div>

            <div className="p-5">
                <form onSubmit={handleSubmit(onSubmit)} >
                    <div className="flex flex-row px-10 py-5 gap-10">
                        <div className="flex flex-col gap-5 w-[50%]">
                            <div className="w-full flex flex-col gap-2">
                                <label
                                    htmlFor="blog_title"
                                    className="px-3 block text-medium font-medium text-gray-600 "
                                >
                                    Blog Title
                                </label>
                                <Controller
                                    name="blog_title"
                                    control={control}
                                    render={({ field }) => (
                                    <>
                                        <input
                                        {...field}
                                        type="text"
                                        className="border border-gray-300 rounded-md w-full p-2 outline-none"
                                        required
                                        />
                                    </>
                                    )}
                                />
                            </div>

                            {/* blog content  */}
                            <div className="w-full flex flex-col gap-2">
                                <label
                                    htmlFor="content"
                                    className="px-3 block text-medium font-medium text-gray-600"
                                >
                                    Blog Content
                                </label>
                                <div className="w-full h-full bg-white overflow-y-scroll scrollbar-none">
                                    <Editor
                                    value={wysiwygContent}
                                    onChange={(blog_content) => {
                                        setWysiwygContent(blog_content);
                                        setValue("blog_content", blog_content);
                                    }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row">
                                <button  
                                type="submit"
                                className="bg-blue-900 w-[20vw] text-white py-4 px-8 rounded"
                                >
                                    {id ? "Save" : "Create Blog"}
                                </button>
                                <button
                                type="button"
                                onClick={() => handleCancel()}
                                className="text-blue-800 p-2 w-[20vw] rounded border border-blue-800 ml-3"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                        {/* second part  */}
                        <div className="flex flex-col gap-9">
                            <div className="flex flex-row gap-5">
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="category" className="text-medium px-2">
                                        Category
                                    </label>
                                    <Dropdown
                                        options={[{ id: 0, name: "All" }, ...category]}
                                        value={selectedCategory}
                                        optionLabel="name"
                                        onChange={(e) => handleCategoryChange(e.value)}
                                        placeholder="--Select--"
                                        className="w-[15vw] space-x-5 pr-3 py-2 border rounded z-10 bg-white"
                                        panelClassName="bg-white border rounded-b px-4 py-2 max-w-[15vw]"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="thumb_image">Thumbnail</label>
                                    <div className="relative">
                                    <input
                                        type="file"
                                        placeholder="Thumb Image"
                                        accept=".jpg, .jpeg, .png, .pdf"
                                        className="border-2 border-gray-300 w-28 h-10 absolute left-0 opacity-0 cursor-pointer"
                                        {...register("thumb_image")}
                                        // onChange={(e) => handleImageUpload(e, "THUMB")}
                                    />

                                    <div className="flex border bg-white justify-around w-[15vw] py-2 rounded-md items-center border-gray-300">
                                        <div className="text-2xl text-gray-400">
                                        <TfiPlus />
                                        </div>
                                        <div>
                                        {uploadedFiles.thumb_image && uploadedFiles.thumb_image.length > 0
                                        ? id
                                            ? `(${uploadedFiles.thumb_image} )` 
                                            : `(${uploadedFiles.thumb_image})`
                                        : "Upload Image"}
                                        </div>
                                    </div>
                                    {/* {thumbImgUrl && (
                                        <div>
                                        <img
                                            src={thumbImgUrl}
                                            alt="Thumbnail Preview"
                                            className="absolute inset-0 w-[18vw] h-[15vh] object-cover"
                                        />
                                        <button
                                            className="absolute  top-[-18px] right-[-10px] bg-slate-300 rounded-full "
                                            onClick={(e) => handleRemoveImage(e, "THUMB")}
                                        >
                                            <MdCancel size={30} />
                                        </button>
                                        </div>
                                    )} */}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-row gap-5">
                                {/* cover image for web  */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="coverImg">Cover Image For Web</label>
                                    <div className="relative">
                                    <input
                                        type="file"
                                        className="absolute opacity-0 cursor-pointer w-full h-full"
                                        {...register("cover_image_web")}
                                        // onChange={(e) => handleImageUpload(e, "Web")}
                                    />

                                    <div className="flex border bg-white justify-around w-[15vw] py-2 rounded-md items-center border-gray-300">
                                        <div className="text-2xl text-gray-400">
                                        <TfiPlus />
                                        </div>
                                        <div>
                                        {uploadedFiles.cover_image_web && uploadedFiles.cover_image_web.length > 0
                                        ? id
                                            ? `(${uploadedFiles.cover_image_web} )` 
                                            : `(${uploadedFiles.cover_image_web})`
                                        : "Upload Image"}
                                        </div>
                                    </div>
                                    {/* {thumbImgUrl && (
                                        <div>
                                        <img
                                            src={thumbImgUrl}
                                            alt="Thumbnail Preview"
                                            className="absolute inset-0 w-[18vw] h-[15vh] object-cover"
                                        />
                                        <button
                                            className="absolute  top-[-18px] right-[-10px] bg-slate-300 rounded-full "
                                            onClick={(e) => handleRemoveImage(e, "THUMB")}
                                        >
                                            <MdCancel size={30} />
                                        </button>
                                        </div>
                                    )} */}
                                    </div>
                                </div>
                                {/* cover image for mobile  */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="mobileImg">Cover Image for Mobile</label>
                                    <div className="relative">
                                    <input
                                        type="file"
                                        className="absolute opacity-0 cursor-pointer w-full h-full"
                                        {...register("cover_image_mobile")}
                                        // onChange={(e) => handleImageUpload(e, "Mobile")}
                                    />

                                    <div className="flex border bg-white justify-around w-[15vw] py-2 rounded-md items-center border-gray-300">
                                        <div className="text-2xl text-gray-400">
                                        <TfiPlus />
                                        </div>
                                        <div>
                                        {uploadedFiles.cover_image_mobile && uploadedFiles.cover_image_mobile.length > 0
                                        ? id
                                            ? `(${uploadedFiles.cover_image_mobile})` 
                                            : `(${uploadedFiles.cover_image_mobile})`
                                        : "Upload Image"}
                                        </div>
                                    </div>
                                    {/* {thumbImgUrl && (
                                        <div>
                                        <img
                                            src={thumbImgUrl}
                                            alt="Thumbnail Preview"
                                            className="absolute inset-0 w-[18vw] h-[15vh] object-cover"
                                        />
                                        <button
                                            className="absolute  top-[-18px] right-[-10px] bg-slate-300 rounded-full "
                                            onClick={(e) => handleRemoveImage(e, "THUMB")}
                                        >
                                            <MdCancel size={30} />
                                        </button>
                                        </div>
                                    )} */}
                                    </div>
                                </div>
                            </div>

                            {/* featured  */}
                            <div className="flex flex-col gap-2">
                                <h1>Thumbnail</h1>
                                <div className="flex flex-row gap-5">
                                    <div className={`layout-container ${watch("layout") === "non_featured" ? "selected border-2 border-gray-900" : "border-none"}`}>
                                        <input
                                        type="radio"
                                        id="card"
                                        value="non_featured"
                                        {...register("layout")}
                                        className="hidden"
                                        />
                                        <label
                                        htmlFor="card"
                                        className=" border-2 flex items-center justify-center"
                                        >
                                        <Image
                                            src= {Card}
                                            width={35}
                                            height={65}
                                            alt="card"
                                        />
                                        </label>
                                    </div>
                                    <div className={`layout-container ${watch("layout") === "featured" ? "selected border-2 border-gray-900" : "border-none"}`}>
                                        <input
                                        type="radio"
                                        id="bottom"
                                        {...register("layout")}
                                        value="featured"
                                        className="hidden"
                                        />
                                        <label
                                        htmlFor="bottom"
                                        className=" border-2 flex items-center justify-center"
                                        >
                                        <Image
                                            src= {Bottom}
                                            width={65}
                                            height={65}
                                            alt="bottom"
                                        />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* author  */}
                            <div className="flex flex-col gap-2">
                                <label htmlFor="author" className="text-medium">
                                    Author
                                </label>
                                <Controller 
                                    name="author"
                                    control={control}
                                    render={({ field }) => (
                                    <>
                                        <input
                                        {...field}
                                        type="text"
                                        className="border border-gray-300 rounded-md w-full p-2 outline-none"
                                        required
                                        />
                                    </>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default NewBlog;