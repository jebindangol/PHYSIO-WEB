import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategory, createAppointments } from "../../services/apiContract";
import { useRouter } from "next/router";
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { SlCalender } from "react-icons/sl";
import { PiTimerLight } from "react-icons/pi";
import Swal from "sweetalert2";
import { ProgressSpinner } from "primereact/progressspinner";

const AppointmentForm = () => {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    register,
    formState: { errors },
  } = useForm();
  const [category, setCategory] = useState([]);
  const [isTodaySelected, setIsTodaySelected] = useState(false);
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

  const onSubmit = async (data, event) => {
    setLoading(true);
    console.log(data, "data");
    try {
      const success = await createAppointments(data);
      if (success) {
        console.log("appointment created successfully");
        await Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Appointment created successfully.",
          timer: 3000,
          showConfirmButton: false,
        });
        setLoading(false);
        router.push("/");
      } else {
        console.error("Error creating appointment");
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: "Error in creating appointment.",
          timer: 3000,
          showConfirmButton: false,
        });
        setLoading(false);
      }
    } catch (error) {
      console.error("Error in createAppointment:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Error in creating appointment.",
        timer: 3000,
        showConfirmButton: false,
      });
      setLoading(false);
    }
  };

  const watchPhoneNumber = watch("contact_number");

  const handleTodayClick = () => {
    const today = new Date().toISOString().split("T")[0];
    if (!isTodaySelected) {
      setValue("appointment_date", today);
    } else {
      setValue("appointment_date", "");
    }
    setIsTodaySelected(!isTodaySelected);
  };

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

  const handleAppointmentDateChange = (event) => {
    const selectedDate = event.target.value;
    const today = new Date().toISOString().split("T")[0];
    if (selectedDate !== today && isTodaySelected) {
      setIsTodaySelected(false);
    }
    setValue("appointment_date", selectedDate);
  };

  return (
    <div
      className="mb-5 shadow-equal rounded-md w-[96vw]"
      style={{ minHeight: "calc(100vh - 140px)" }}
    >
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white opacity-75 z-50">
          <ProgressSpinner visible />
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        </div>
      )}
      <div>
        <div
          style={{
            backgroundImage: 'url("/appointmentbg.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          className="flex justify-between py-9 px-[8vw] rounded-t-md"
        >
          <div className="flex justify-center items-center gap-5">
            <div className="text-8xl font-thin text-gray-500">|</div>
            <div className="font-bold text-3xl w-44 text-gray-800 leading-10">
              Request an Appointment
            </div>
          </div>
          <div>
            <Image
              src="/appointment1.png"
              width={100}
              height={100}
              alt="calender"
            />
          </div>
        </div>
        <div className="mt-7 px-[8vw]">
          <div className="border-b border-black pb-2">
            Fill up the form below to request for an appointment.
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-7 mt-7">
                <div className="flex justify-between">
                  {/* Full Name */}
                  <div className="w-[25.5vw] flex flex-col gap-2">
                    <label htmlFor="full_name" className="px-2 block text-sm ">
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
                            className="border border-gray-300 rounded-md w-full bg-input h-12"
                            required
                          />
                        </>
                      )}
                    />
                  </div>

                  {/* Address */}
                  <div className="w-[25.5vw] flex flex-col gap-2">
                    <label htmlFor="address" className="px-2 block text-sm ">
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
                            className="border border-gray-300 rounded-md w-full bg-input h-12"
                            required
                          />
                        </>
                      )}
                    />
                  </div>

                  {/* Phone no. */}
                  <div className="w-[13vw] flex flex-col gap-2">
                    <label
                      htmlFor="contact_number"
                      className="px-2 block text-sm"
                    >
                      Phone No.
                    </label>
                    <Controller
                      name="contact_number"
                      control={control}
                      rules={{
                        required: "Phone neumber is required.",
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Phone number must be 10 digits.",
                        },
                      }}
                      render={({ field }) => (
                        <>
                          <input
                            {...field}
                            type="text"
                            className="border border-gray-300 rounded-md w-full bg-input h-12"
                            onChange={(e) => {
                              field.onChange(e);
                              handlePhoneChange(e);
                            }}
                            required
                          />
                        </>
                      )}
                    />
                    {errors.contact_number && (
                      <p className="text-red-500 text-sm">
                        {errors.contact_number.message}
                      </p>
                    )}
                  </div>

                  {/* WhatsApp */}
                  <div className="w-[13vw] flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="whatsappNumber"
                        className="block text-sm px-2 h-12 -mt-7 flex items-end"
                      >
                        WhatsApp No.
                      </label>
                      <div className="flex flex-row gap-2 items-center">
                        <input
                          type="checkbox"
                          id="whatsappCheckbox"
                          className="appearance-none h-4 w-4 border border-gray-300 rounded-full checked:bg-blue-500 checked:border-transparent focus:outline-none"
                          onClick={handleCheckboxChange}
                          checked={isSameNumberSelected}
                        />
                        <label htmlFor="whatsappCheckbox" className="text-sm ">
                          Same
                        </label>
                      </div>
                    </div>
                    <Controller
                      name="whatsapp"
                      control={control}
                      rules={{
                        required: "Phone neumber is required.",
                        pattern: {
                          value: /^\d{10}$/,
                          message: "Phone number must be 10 digits.",
                        },
                      }}
                      render={({ field }) => (
                        <>
                          <input
                            {...field}
                            type="text"
                            className="border border-gray-300 rounded-md w-full bg-input h-12"
                            required
                            disabled = {isSameNumberSelected}
                          />
                        </>
                      )}
                    />
                    {errors.whatsapp && (
                      <p className="text-red-500 text-sm">
                        {errors.whatsapp.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  {/* Email ID */}
                  <div className="w-[25.5vw] flex flex-col gap-2">
                    <label htmlFor="email" className="px-2 block text-sm">
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
                            type="email"
                            className="border border-gray-300 rounded-md w-full bg-input h-12"
                            required
                          />
                          {errors.email && (
                            <p className="text-red-500">
                              {errors.email.message}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  {/* Chief Complain */}
                  <div className="w-[25.5vw] flex flex-col gap-2">
                    <label htmlFor="name" className="px-2 block text-sm">
                      Chief Complaint
                    </label>
                    <Controller
                      name="category_appointment_id"
                      control={control}
                      render={({ field }) => (
                        <>
                          <select
                            {...field}
                            className="border border-gray-300 bg-white rounded-md w-full bg-input h-12"
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

                  {/* More Details */}
                  <div className="w-[27vw] flex flex-col gap-2">
                    <label
                      htmlFor="more_details"
                      className="px-2 block text-sm"
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
                            className="border border-gray-300 rounded-md w-full bg-input h-12 more-details"
                            placeholder="Tell us more about your condition"
                            required
                          />
                        </>
                      )}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  {/* Age */}
                  <div className="relative w-[25.5vw] flex flex-col gap-2">
                    <label htmlFor="age" className="px-2 block text-sm">
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
                              className="border border-gray-300 rounded-md w-full bg-input h-12"
                              required
                            />
                          </div>
                        </>
                      )}
                    />
                  </div>

                  {/* Upload File */}
                  <div className="pb-5 flex flex-col gap-2">
                    <div className="flex gap-2 items-center">
                      <label htmlFor="upload" className="block px-2 text-sm">
                        Upload File
                      </label>
                      <Image
                        src="/upload.png"
                        alt="Logo"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div>
                      <div className="flex flex-row">
                        <div className="relative flex items-center">
                          <input
                            {...register("x_ray")}
                            type="file"
                            placeholder="xray"
                            accept=".jpg, .jpeg, .png, .pdf"
                            className="border-y border-l border-gray-300 rounded-l-md w-[8.5vw] absolute left-0 opacity-0 cursor-pointer h-12"
                            multiple
                            required
                          />
                          <div className="border-y border-l border-gray-300 rounded-l-md w-[8.5vw] text-gray-500 flex items-center text-sm gap-5 bg-input h-12 justify-center">
                            <div className="border-gray-300">
                              {uploadedFiles.x_ray &&
                              uploadedFiles.x_ray.length > 0
                                ? `(${uploadedFiles.x_ray.length} files uploaded)`
                                : "X-Ray"}
                            </div>
                          </div>
                        </div>
                        <div className="relative flex items-center">
                          <input
                            {...register("mri")}
                            type="file"
                            placeholder="mri"
                            accept=".jpg, .jpeg, .png, .pdf"
                            className="border-2 border-gray-300 w-[8.5vw] absolute  opacity-0 cursor-pointer h-12"
                            multiple
                            required
                          />
                          <div className="border border-gray-300 w-[8.5vw] text-gray-500 flex items-center text-sm gap-5 bg-input h-12 justify-center">
                            <div className="border-gray-300">
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
                            className="border-y border-r border-gray-300 rounded-r-md w-[8.5vw] absolute opacity-0 cursor-pointer h-12"
                            multiple
                            required
                          />
                          <div className="border-y border-r border-gray-300 rounded-r-md w-[8.5vw] text-gray-500 flex items-center text-sm gap-5 bg-input h-12 justify-center">
                            <div className="border-gray-300">
                              {uploadedFiles.prescription &&
                              uploadedFiles.prescription.length > 0
                                ? `(${uploadedFiles.prescription.length} files uploaded)`
                                : "Doctor's Prescription"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date of Appointment */}
                  <div className="w-[13vw] flex flex-col relative gap-2">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="appointment_date"
                        className="px-2 block text-sm h-12 -mt-7 flex items-end "
                      >
                        Date of Appointment
                      </label>
                    </div>
                    <Controller
                      name="appointment_date"
                      control={control}
                      render={({ field }) => (
                        <>
                          <div className=" appointment-date">
                          <img src="/calendar.png" className="calendar" />
                            <input
                              {...field}
                              type="date"
                              className="border border-gray-300 rounded-md w-full bg-input h-12 z-10"
                              onChange={handleAppointmentDateChange}
                              required
                            />
                          </div>
                        </>
                      )}
                    />
                  </div>

                  {/* Time */}
                  <div className="w-[13vw] flex flex-col relative gap-2">
                    <div className="flex items-center justify-between">
                      <label htmlFor="time" className="px-2 block text-sm">
                        Time
                      </label>
                    </div>
                    <Controller
                      name="time"
                      control={control}
                      render={({ field }) => (
                        <>
                          <PiTimerLight className="time" />
                          <div className="appointment-time">
                            <input
                              {...field}
                              type="time"
                              className="border border-gray-300 rounded-md w-full bg-input h-12"
                              // onChange={handleTimeChange}
                              required
                            />
                          </div>
                        </>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="w-48 text-white py-3 rounded button shadow-md mb-11"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
