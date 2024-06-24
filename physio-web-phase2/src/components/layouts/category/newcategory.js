import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { sendCategory, getCategoryByID, updateCategory } from "../../../services/apiContract";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const NewCategory = () => {
    const { register, handleSubmit , reset, setValue} = useForm();

    const router = useRouter();
    const { id } = router.query;

    console.log(id, "id from query is");

    useEffect(() => {
        if (id) {
            getCategoryByID(id)
                .then((category) => {
                    setValue("name", category.data.name);
                    setValue("description", category.data.description);
                })
                .catch((error) => {
                    console.error("Error fetching category:", error);
                });
        }
    }, [id, setValue]);


    const onSubmit = async (data) => {
        try {
            if (id) {
                await updateCategory(data, id);
            } else {
                await sendCategory(data);
            }
            console.log("Category saved successfully");
    
            // Show success SweetAlert
            await Swal.fire({
                icon: 'success',
                title: 'Category Saved',
                text: 'Category has been saved successfully.',
            });
    
            // Redirect to the category page
            router.push("/admin/category");
        } catch (error) {
            console.error("Error saving category:", error);
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <section className="bg-tableColor w-full ">
        <div className="min-h-screen">
            <div className="flex items-center px-10 py-4 gap-2 bg-white">
            <Link href="/admin/category">
                <h3 className="font-bold">Category</h3>
            </Link>

            <div className="h-5 w-[2px] bg-black"></div>
            <h3>{id ? "Edit" : "Create New"}</h3>
            </div>
            <div className="p-10">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white flex flex-col gap-5 p-10"
            >
                <div className="flex flex-col gap-4">
                    <label className="font-semibold px-2">Category Name</label>
                    <input 
                        type="text" 
                        className="w-[250px] h-[50px] border-2 px-2" 
                        {...register("name")}
                    />
                </div>
                <div className="flex flex-col gap-4">
                    <label className="font-semibold px-2">Category Description</label>
                    <textarea
                        id="categoryDescription"
                        className="w-[350px] h-[150px] border-2 px-2" 
                        {...register("description")}
                    />
                </div>
                <div className="flex flex-row gap-5">
                    <button 
                    type="submit" 
                    className="border-2 px-7 py-2 bg-blue-800 text-white">
                        {id ? "SAVE" : "ADD"}
                    </button>
                    <button 
                    type = "button"
                    className="border border-blue-800 text-blue-800 px-5 py-2"
                    onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </form>
            </div>
        </div>
        </section>
    );
};

export default NewCategory;
