import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import Editor from "../../wysiwyg/editor";
import { Dropdown } from "primereact/dropdown";
import { TfiPlus } from "react-icons/tfi";
import { ProgressSpinner } from "primereact/progressspinner";
import Swal from "sweetalert2";
import {
    getCategory,
    createServices,
    getServicesById,
    updateServices,
} from "../../../services/apiContract";
const NewService = () => {
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
    const [wysiwygDescription, setWysiwygDescription] = useState("");
    const [category, setCategory] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const router = useRouter();
    const uploadedFiles = {
        video: watch("video"),
        image: watch("image"),
    };
    const { id } = router.query;
    const onSubmit = async (data) => {
        setLoading(true);
        data.category_id = selectedCategory.id;
        console.log("data", data);
        try  {
            if (id) {
                await updateServices(data, id);
            } else {
                await createServices(data);
            }
            await Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Service created successfully!',
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
            getServicesById(id)
                .then((res) => {
                    const initialsummary = res.data.sub_summary;
                    const initialdescription = res.data.sub_description;
                    setWysiwygContent(initialsummary);
                    setWysiwygDescription(initialdescription);
                    const initialCategory = res.data.name;
                    setSelectedCategory(initialCategory);
                    setValue("sub_title", res.data.sub_title);
                    setValue("video", res.data.video);
                    setValue("image",res.data.image);
                })
                .catch((error) => {
                    console.error("Error fetching services by ID:", error);
                });
        }
    }, [id]);
    const handleCategoryChange = (selectedValue) => {
        setSelectedCategory(selectedValue);
    };
    const handleCancel = () => {
        router.back();
    }
    return (
        <div className="min-h-screen bg-blue-100">
            {loading && (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white opacity-75 z-50">
                <ProgressSpinner visible = "true" />
                <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                </div>
            )}
            <div className="flex items-center px-10 py-4 gap-2 bg-white">
                <Link href="/admin/services/service">
                <h3 className="font-bold">Service</h3>
                </Link>
                <div className="h-5 w-[2px] bg-black"></div>
                <h3>Add New</h3>
            </div>
            <div className="p-5">
                <form onSubmit={handleSubmit(onSubmit)} >
                    <div className="flex flex-row px-10 py-5 gap-10">
                        <div className="flex flex-col gap-7 w-[40%]">
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="sub_title"
                                    className="px-3 block text-medium font-medium text-gray-600 "
                                >
                                    Service Title
                                </label>
                                <Controller
                                    name="sub_title"
                                    control={control}
                                    render={({ field }) => (
                                    <>
                                        <input
                                        {...field}
                                        type="text"
                                        className="w-[25vw] border border-gray-300 rounded-md p-2 outline-none"
                                        required
                                        />
                                    </>
                                    )}
                                />
                            </div>
                            {/* blog content  */}
                            <div className="flex flex-col gap-2">
                                <label
                                    htmlFor="summary"
                                    className="px-3 block text-medium font-medium text-gray-600"
                                >
                                    Service Summary
                                </label>
                                <div className="w-full h-full bg-white overflow-y-scroll scrollbar-none">
                                    <Editor
                                    value={wysiwygContent}
                                    onChange={(sub_summary) => {
                                        setWysiwygContent(sub_summary);
                                        setValue("sub_summary", sub_summary);
                                    }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-row pt-3">
                                <button
                                type="submit"
                                className="bg-blue-900 w-[20vw] text-white py-4 px-8 rounded"
                                >
                                    {id ? "Save" : "Create Service"}
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
                        <div className="flex flex-col gap-7 w-[50%] ">
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
                                    <label htmlFor="image">Thumb Image</label>
                                    <div className="relative">
                                    <input
                                        type="file"
                                        placeholder="Thumb Image"
                                        accept=".jpg, .jpeg, .png"
                                        className="border-2 border-gray-300 w-full h-10 absolute left-0 opacity-0 cursor-pointer"
                                        {...register("image")}
                                    />
                                    <div className="flex border bg-white justify-around w-[12vw] py-2 rounded-md items-center border-gray-300 cursor-pointer">
                                        <div className="text-2xl text-gray-400">
                                        <TfiPlus />
                                        </div>
                                        <div>
                                        {uploadedFiles.image && uploadedFiles.image.length > 0
                                        ? id
                                            ? `(${uploadedFiles.image})`
                                            : `(${uploadedFiles.image.length} files)`
                                        : "Upload File"}
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="video">Add video</label>
                                    <div className="relative">
                                    <input
                                        type="file"
                                        placeholder="Add Media"
                                        accept=".mp4"
                                        className="border-2 border-gray-300 h-10 absolute left-0 opacity-0 cursor-pointer"
                                        {...register("video")}
                                    />
                                    <div className="flex border bg-white justify-around w-[12vw] py-2 rounded-md items-center border-gray-300 cursor-pointer">
                                        <div className="text-2xl text-gray-400">
                                        <TfiPlus />
                                        </div>
                                        <div>
                                        {uploadedFiles.video && uploadedFiles.video.length > 0
                                        ? id
                                            ? `(${uploadedFiles.video})`
                                            : `(${uploadedFiles.video.length} files)`
                                        : "Upload File"}
                                        </div>
                                    </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <label
                                    htmlFor="description"
                                    className="px-3 block text-medium font-medium text-gray-600"
                                >
                                    Service Description
                                </label>
                                <div className="w-full h-full bg-white overflow-y-scroll scrollbar-none">
                                    <Editor
                                    value={wysiwygDescription}
                                    onChange={(sub_description) => {
                                        setWysiwygDescription(sub_description);
                                        setValue("sub_description", sub_description);
                                    }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
export default NewService;