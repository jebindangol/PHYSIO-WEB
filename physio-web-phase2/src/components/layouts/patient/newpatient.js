import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { getCategory, createAppointments } from "../../../services/apiContract";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import { ProgressSpinner } from "primereact/progressspinner";

const NewPatient1 = () => {
    const {
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        register,
        formState: { errors },
    } = useForm();
    const [category, setCategory] = useState([]);
    const [isSameNumberSelected, setIsSameNumberSelected] = useState(false);
    const [loading, setLoading] = useState(false);
    const uploadedFiles = {
        x_ray: watch("x_ray"),
        mri: watch("mri"),
        prescription: watch("prescription"),
    };
    const router = useRouter();

    useEffect(() => {
        getCategory()
        .then((res) => {
            console.log("Received data for category :", res.data);
            setCategory(res.data);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    const onSubmit = async (data) => {   
        setLoading(true);
        console.log(data,"console");
        data.is_patient = true;
        try {
            const success = await createAppointments(data);
            if (success) {
                console.log("Patient created successfully");
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Patient created successfully!',
                }).then(() => {
                    setLoading(false);
                    router.back();
                });
            } else {
                console.error("Error creating patient");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error in sendpatient:", error);
            setLoading(false);
        }
    };
    

    const watchPhoneNumber = watch("contact_number");

    const handlePhoneChange = (e) => {
        const phoneNumber = e.target.value;
        if (isSameNumberSelected) {
        setValue("whatsapp", phoneNumber);
        }
    };

    const handleCheckboxChange = () => {
        setIsSameNumberSelected(!isSameNumberSelected);
        const phoneNumber = watchPhoneNumber;
        if (isSameNumberSelected) {
        setValue("whatsapp", "");
        } else {
        setValue("whatsapp", phoneNumber);
        }
    };

    const handleCancel = () => {
        router.back();
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
                <Link href="/admin/patientlist">
                <h3 className="font-bold">Patients</h3>
                </Link>

                <div className="h-5 w-[2px] bg-black"></div>
                <h3>Create New</h3>
            </div>

            <div className="p-10">
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-5 rounded-md" >
                    <div className="text-lg font-semibold px-10 pt-5">Basic Details</div>
                    <div className="flex flex-row justify-between py-5 px-10">
                        <div className="w-[23vw] flex flex-col gap-2">
                            <label
                                htmlFor="full_name"
                                className="px-3 block text-sm font-medium text-gray-600 "
                            >
                                Full Name
                            </label>
                            <Controller
                                name="full_name"
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
                            <div className="w-[23vw] flex flex-col gap-2">
                            <label
                                htmlFor="address"
                                className="px-3 block text-sm font-medium text-gray-600"
                            >
                                Address
                            </label>
                            <Controller
                                name="address"
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

                            {/* Date of Birth */}
                            <div className="relative w-[23vw] flex flex-col gap-2">
                            <label
                                htmlFor="age"
                                className="px-3 block text-sm font-medium text-gray-600"
                            >
                                Age
                            </label>
                            <Controller
                                name="age"
                                control={control}
                                render={({ field }) => (
                                <>
                                    <div className="relative">
                                    <input
                                        {...field}
                                        type="nmber"
                                        className="border border-gray-300 rounded-md w-full bg-input"
                                        required
                                    />
                                    </div>
                                </>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row justify-between px-10">
                        <div className="w-[23vw] flex flex-col gap-2">
                        <label
                            htmlFor="contact_number"
                            className="px-3 block text-sm font-medium text-gray-600"
                        >
                            Phone No.
                        </label>
                        <Controller
                            name="contact_number"
                            control={control}
                            render={({ field }) => (
                            <>
                                <input
                                {...field}
                                type="text"
                                className="border border-gray-300 rounded-md w-full bg-input"
                                onChange={(e) => {
                                    field.onChange(e);
                                    handlePhoneChange(e);
                                }}
                                required
                                />
                            </>
                            )}
                        />
                        </div>

                        {/* WhatsApp Number */}
                        <div className="w-[23vw] flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-row gap-1">
                            <Image
                                src="/whatsapp.png"
                                className="px-3"
                                alt="WhatsApp Icon"
                                width={20}
                                height={20}
                            />
                            <label
                                htmlFor="whatsappNumber"
                                className="block text-sm font-medium text-gray-600"
                            >
                                WhatsApp No.
                            </label>
                            </div>
                            <div className="flex flex-row gap-2 items-center px-4">
                            <input
                                type="checkbox"
                                id="whatsappCheckbox"
                                className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none"
                                onClick={handleCheckboxChange}
                                checked={isSameNumberSelected}
                            />
                            <label
                                htmlFor="whatsappCheckbox"
                                className="text-sm text-gray-600"
                            >
                                Same
                            </label>
                            </div>
                        </div>
                        <Controller
                            name="whatsapp"
                            control={control}
                            render={({ field }) => (
                            <>
                                <input
                                {...field}
                                type="text"
                                className="border border-gray-300 rounded-md w-full bg-input"
                                required
                                disabled = {isSameNumberSelected}
                                />
                            </>
                            )}
                        />
                        </div>

                        {/* Email ID */}
                        <div className="w-[23vw] flex flex-col gap-2">
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
                    </div>

                    <div className="flex flex-row justify-between px-10">
                    <div className="flex flex-col gap-5 pt-5">
                        <div className="w-[23vw] flex flex-col gap-2">
                            <label
                                htmlFor="name"
                                className="px-3 block text-sm font-medium text-gray-600"
                            >
                                Chief Complaint
                            </label>
                            <Controller
                                name="category_appointment_id"
                                control={control}
                                render={({ field }) => (
                                <>
                                    <select
                                    {...field}
                                    className="border border-gray-300 bg-white rounded-md w-full bg-input"
                                    >
                                    <option value="">Select</option>
                                    {category.map((category) => (
                                        <option key={category.id} value={category.id}>
                                        {category.name}
                                        </option>
                                    ))}
                                    </select>
                                </>
                                )}
                            />
                        </div>



                        <div className="pb-5">
                            <div className="flex gap-2 items-center">
                                <label
                                htmlFor="upload"
                                className="block text-medium font-medium text-gray-600"
                                >
                                Upload File
                                </label>
                                <Image 
                                src="/upload.png" 
                                alt="Logo" 
                                width={20}
                                height={20}
                                />
                            </div>
                            <div className="pt-3">
                                <div className="flex flex-row">
                                    <div className="relative flex items-center">
                                        <input
                                        {...register("x_ray")}
                                        type="file"
                                        placeholder="xray"
                                        accept=".jpg, .jpeg, .png, .pdf"
                                        className="border-2 border-gray-300 w-28 h-10 absolute left-0 opacity-0 cursor-pointer"
                                        multiple
                                        required
                                        />
                                        <div className="border border-gray-300 w-28 h-10 text-gray-500 flex items-center text-sm gap-5 bg-input">
                                            <div className="border-gray-300 px-3">
                                                {uploadedFiles.x_ray && uploadedFiles.x_ray.length > 0
                                                ? `(${uploadedFiles.x_ray.length} files uploaded)`
                                                : "Xray"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative flex items-center">
                                        <input
                                        {...register("mri")}
                                        type="file"
                                        placeholder="mri"
                                        accept=".jpg, .jpeg, .png, .pdf"
                                        className="border-2 border-gray-300 w-28 h-10 absolute  opacity-0 cursor-pointer"
                                        multiple
                                        required
                                        />
                                        <div className="border border-gray-300 w-28 h-10 text-gray-500 flex items-center text-sm gap-5 bg-input">
                                            <div className="border-gray-300 px-6">
                                                {uploadedFiles.mri && uploadedFiles.mri.length > 0
                                                ? `(${uploadedFiles.mri.length} files uploaded)`
                                                : "MRI"}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="relative flex items-center">
                                        <input
                                        {...register("prescription")}
                                        type="file"
                                        placeholder="dp"
                                        accept=".jpg, .jpeg, .png, .pdf"
                                        className="border-2 border-gray-300 w-28 h-10 absolute opacity-0 cursor-pointer"
                                        multiple
                                        required
                                        />
                                        <div className="border border-gray-300 w-28 h-10 text-gray-500 flex items-center text-sm gap-5 bg-input">
                                            <div className="border-gray-300 px-2">
                                                {uploadedFiles.prescription && uploadedFiles.prescription.length > 0
                                                ? `(${uploadedFiles.prescription.length} files uploaded)`
                                                : "Doctor's Prescription"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

{/* more details  */}
                    <div className="w-[23vw] flex flex-col gap-2 pt-5">
                        <label
                            htmlFor="more_details"
                            className="px-3 block text-sm font-medium text-gray-600"
                        >
                            More Detail
                        </label>
                        <Controller
                            name="more_details"
                            control={control}
                            render={({ field }) => (
                            <>
                                <textarea
                                {...field}
                                className="border border-gray-300 rounded-md w-full h-32 bg-input"
                                required
                                />
                            </>
                            )}
                        />
                    </div>
                    

                    <div className="flex flex-col gap-5 pt-5">
                        <div className="w-[23vw] flex flex-col gap-2"></div>
                        <div className="w-[23vw] flex flex-col gap-2"></div>
                    </div>
                    </div>

                    <div className="flex flex-row gap-5 py-5 px-10">
                        <button
                        type="submit"
                        className="bg-green w-56 text-white py-2 px-8 rounded"
                        >
                        Create Patient
                        </button>

                        <button
                        type="button"
                        onClick={() => handleCancel()}
                        className="bg-white text-black p-2 w-56 rounded border border-black ml-3"
                        >
                        Cancel
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default NewPatient1;
