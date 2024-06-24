import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { createUsers, getUserById, updateUsers } from "../../../services/apiContract";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import { useRouter } from "next/router";

const NewUser = () => {
    const {
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm();
    const router = useRouter();
    const options = [
        { value: '', label: 'Select' },
        { value: 'admin', label: 'Admin' },
        { value: 'super_admin', label: 'Super Admin' },
    ];
    const [user, setUser] = useState();
    const { id } = router.query;
    console.log(id,"id query")
    useEffect(() => {
        if (id) {
            getUserById(id)
                .then((user) => {
                    console.log("User byId",user.data)
                    setValue("first_name", user.data.given_name);
                    setValue("last_name", user.data.family_name);
                    setValue("phone_number", user.data.app_metadata.phone_number);
                    setValue("role", user.data.app_metadata.roles);
                    setValue("email", user.data.email);
                })
                .catch((error) => {
                    console.error("Error fetching user:", error);
                });
        }
    }, [id, setValue]);

    const onSubmit = async (data) => {
        if (data.phone_number && !data.phone_number.startsWith("+977")) {
            data.phone_number = "+977" + data.phone_number;
        }
    
        // Validate password complexity
        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(data.password)) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Password',
                text: 'Password must contain at least 8 characters, including uppercase, lowercase, symbol, and number.',
            });
            return;
        }
    
        console.log(data, "console");
        try {
            if (id) {
                const success = await updateUsers(data, id);
                if (success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'User Updated',
                        text: 'User has been updated successfully.',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            console.log("User updated successfully");
                            router.back();
                        }
                    });
                } else {
                    console.error("Error updating user");
                }
            } else {
                const success = await createUsers(data);
                if (success) {
                    Swal.fire({
                        icon: 'success',
                        title: 'User Created',
                        text: 'User has been created successfully.',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            console.log("User created successfully");
                            router.back();
                        }
                    });
                } else {
                    console.error("Error creating user");
                }
            }
        } catch (error) {
            console.error("Error in sendpatient:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while creating user. Please try again later.',
            });
        }
    };
    

    const handleCancel = () => {
        router.back();
    };


    return (
        <div className="min-h-screen bg-blue-100">
            <div className="flex items-center px-10 py-4 gap-2 bg-white">
                <Link href="/admin/user">
                <h3 className="font-bold">Users</h3>
                </Link>

                <div className="h-5 w-[2px] bg-black"></div>
                <h3>Create New</h3>
            </div>

            <div className="p-10">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-5" >
                    <div className="text-lg font-semibold">Basic Details</div>
                    <div className="flex flex-row justify-between gap-5 py-5">
                        <div className="w-96 flex flex-col gap-2">
                            <label
                                htmlFor="first_name"
                                className="px-3 block text-sm font-medium text-gray-600 "
                            >
                                First Name
                            </label>
                            <Controller
                                name="first_name"
                                control={control}
                                render={({ field }) => (
                                <>
                                    <input
                                    {...field}
                                    type="text"
                                    className="border border-gray-300 rounded-md w-full bg-input"
                                    required
                                    />
                                </>
                                )}
                            />
                        </div>

                            {/* Address */}
                        <div className="w-96 flex flex-col gap-2">
                            <label
                                htmlFor="last_name"
                                className="px-3 block text-sm font-medium text-gray-600"
                            >
                                Last Name
                            </label>
                            <Controller
                                name="last_name"
                                control={control}
                                render={({ field }) => (
                                <>
                                    <input
                                    {...field}
                                    type="text"
                                    className="border border-gray-300 rounded-md w-full bg-input"
                                    required
                                    />
                                </>
                                )}
                            />
                        </div>
                        <div className="w-96 flex flex-col gap-2">
                            <label
                                htmlFor="role"
                                className="px-3 block text-sm font-medium text-gray-600"
                            >
                                User Roles
                            </label>
                            <Controller
                                name="role"
                                control={control}
                                render={({ field }) => (
                                <>
                                    <select
                                        {...field}
                                        className="border border-gray-300 rounded-md w-full bg-input"
                                        >
                                        
                                        {options.map((option) => (
                                            <option key={option.value} value={option.value}>
                                            {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </>
                                )}
                            />
                        </div>
                            
                    </div>

                    <div className="flex flex-row justify-between">
                        <div className="w-96 flex flex-col gap-2">
                        <label
                            htmlFor="phone_number"
                            className="px-3 block text-sm font-medium text-gray-600"
                        >
                            Phone No.
                        </label>
                        <Controller
                            name="phone_number"
                            control={control}
                            render={({ field }) => (
                            <>
                                <input
                                {...field}
                                type="text"
                                className="border border-gray-300 rounded-md w-full bg-input"
                                
                                required
                                />
                            </>
                            )}
                        />
                        </div>


                        {/* Email ID */}
                        <div className="w-96 flex flex-col gap-2">
                        <label
                            htmlFor="email"
                            className="px-3 block text-sm font-medium text-gray-600"
                        >
                            Email ID
                        </label>
                        <Controller
                            name="email"
                            control={control}
                            rules={{
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Invalid email address",
                            },
                            }}
                            render={({ field }) => (
                            <>
                                <input
                                {...field}
                                type="text"
                                className="border border-gray-300 rounded-md w-full bg-input"
                                required
                                />
                                {errors.email && (
                                <p className="text-red-500">{errors.email.message}</p>
                                )}
                            </>
                            )}
                        />
                        </div>

                        <div className="w-96 flex flex-col gap-2">
                        <label
                            htmlFor="password"
                            className="px-3 block text-sm font-medium text-gray-600"
                        >
                            Password
                        </label>
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                            <>
                                <input
                                {...field}
                                type="password"
                                className="border border-gray-300 rounded-md w-full bg-input"
                                required
                                />
                                {errors.password && (
                                <p className="text-red-500">{errors.password.message}</p>
                                )}
                            </>
                            )}
                        />
                        </div>
                    </div>

                    
                    <div className="flex flex-row gap-5 py-5">
                        <button
                        type="submit"
                        className="bg-green w-56 text-white py-2 px-8 rounded"
                        >
                            {id ? "Save" : "Create Users"}
                        </button>

                        <button
                        type="button"
                        className="bg-white text-black p-2 w-56 rounded border border-black ml-3"
                        onClick={() => handleCancel()}
                        >
                        Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default NewUser;
