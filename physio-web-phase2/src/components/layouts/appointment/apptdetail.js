import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdArrowBackIos } from "react-icons/md";
import { MdArrowForwardIos } from "react-icons/md";
import Link from "next/link";
import { AiFillEdit } from "react-icons/ai";
import { IoLogoWhatsapp } from "react-icons/io";
import { useRouter } from "next/router";
import {
  getAppointmentById,
  updateAppointments,
} from "../../../services/apiContract";
import { API_getImage } from "../../../services/apiService";
import Image from "next/image";
import { RxDownload } from "react-icons/rx";
import emailjs from "emailjs-com";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Dialog } from "primereact/dialog";

const AppointmentDetail = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [appointment, setAppointment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [enlargedImage, setEnlargedImage] = useState(null);
  const formatTime = (time) => {
    console.log(time, "time");
    const [timePart, meridiem] = (time || "").split(" ");
    // Split the time part into hours and minutes
    const [hours, minutes] = timePart.split(":");

    // Convert hours to 24-hour format if it's PM
    let formattedHours = parseInt(hours, 10);
    if (meridiem === "PM" && formattedHours !== 12) {
      formattedHours += 12;
    } else if (meridiem === "AM" && formattedHours === 12) {
      formattedHours = 0;
    }

    // Return the time in "HH:mm" format
    return `${formattedHours.toString().padStart(2, "0")}:${minutes}`;
  };
  const [appointmentDate, setAppointmentDate] = useState(
    appointment ? appointment[0].appointment_date?.split("T")[0] : ""
  );
  const [appointmentTime, setAppointmentTime] = useState(
    appointment ? appointment[0]?.time : ""
  );
  const [filteredMRI, setFilteredMRI] = useState([]);
  const [filteredPrescription, setFilteredPrescription] = useState([]);
  const [filteredXRay, setFilteredXRay] = useState([]);
  const allFilteredImages = [
    ...filteredMRI,
    ...filteredPrescription,
    ...filteredXRay,
  ];

  const router = useRouter();
  const { id } = router.query;
  console.log(id, "id from query is");

  const sendEmail = (templateParams) => {
    emailjs
      .send(
        "service_jstyopf",
        "template_45fkkwv",
        templateParams,
        "KbsBqCvd22NHMRvCG"
      )
      .then(
        (response) => {
          console.log("SUCCESS!", response.status, response.text);
        },
        (error) => {
          console.log("FAILED...", error);
        }
      );
  };

  useEffect(() => {
    if (id) {
      getAppointmentById(id)
        .then((response) => {
          console.log("Fetched appointment details:", response.data);
          setAppointment(response.data);
          setAppointmentTime(response.data[0]?.time);
          setAppointmentDate(response.data[0].appointment_date?.split("T")[0]);
        })
        .catch((error) => {
          console.error("Error fetching appointment:", error);
        });
    }
  }, [id]);

  const onSubmit = (data) => {
    const updatedAppointment = { ...appointment[0] };

    if (data.appointmentTime) {
      updatedAppointment.time = data.appointmentTime;
      updatedAppointment.time = formatTime(updatedAppointment.time);
    } else if (data.appointmentDate) {
      updatedAppointment.appointment_date = data.appointmentDate.split("T")[0];
    } else {
      updatedAppointment.appointment_date =
        appointment[0]?.appointment_date.split("T")[0];

      updatedAppointment.time = appointment[0]?.time || "";
    }

    updatedAppointment.progress = "in_progress";
    console.log(updatedAppointment, "update");

    updateAppointments(updatedAppointment, id)
      .then((response) => {
        console.log("Appointment updated successfully:", response);
        if (data.sendEmail) {
          const templateParams = {
            to_email: appointment[0].email,
            appointment_date: updatedAppointment.appointment_date,
            appointment_time: updatedAppointment.time,
            from_name: "National Physiotherapy & Rehabilitaion Center",
            to_name: appointment[0].full_name,
          };
          sendEmail(templateParams);
        }
        router.back();
      })
      .catch((error) => {
        console.error("Error updating appointment:", error);
      });
  };

  useEffect(() => {
    if (appointment) {
      // Filter MRI images
      const mriImages = JSON.parse(
        appointment[0]?.mri?.replace(/^{(.*)}$/, "[$1]") || "[]"
      );
      setFilteredMRI(mriImages.map((image) => API_getImage(image)));

      // Filter prescription images
      const prescriptionImages = JSON.parse(
        appointment[0]?.prescription?.replace(/^{(.*)}$/, "[$1]") || "[]"
      );
      setFilteredPrescription(
        prescriptionImages.map((image) => API_getImage(image))
      );

      // Filter X-ray images
      const xRayImages = JSON.parse(
        appointment[0]?.x_ray?.replace(/^{(.*)}$/, "[$1]") || "[]"
      );
      setFilteredXRay(xRayImages.map((image) => API_getImage(image)));
    }
  }, [appointment]);
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    console.log(selectedCategory, "category");
  }, [selectedCategory]);

  const getTotalFileCount = () => {
    let totalCount = 0;
    if (selectedCategory === "All") {
      // Calculate total count for all categories
      totalCount +=
        filteredMRI.length + filteredPrescription.length + filteredXRay.length;
    } else if (selectedCategory === "x_ray") {
      // Calculate total count for X-Ray category
      totalCount += filteredXRay.length;
    } else if (selectedCategory === "mri") {
      // Calculate total count for MRI category
      totalCount += filteredMRI.length;
    } else if (selectedCategory === "prescription") {
      // Calculate total count for Prescription category
      totalCount += filteredPrescription.length;
    }
    return totalCount;
  };

  // Function to handle image click and display the dialog
  const handleImageClick = (imageUrl) => {
    setEnlargedImage(imageUrl);
  };

  // Function to hide the dialog
  const hideDialog = () => {
    setEnlargedImage(null);
  };

  const handleCancel = () => {
    router.back();
}

  const downloadImage = (imageUrl) => {
    fetch(imageUrl)
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error("Network response was not ok.");
      })
      .then((blob) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([blob]));
        // Create an anchor element
        const a = document.createElement("a");
        // Set the href attribute to the URL
        a.href = url;
        // Set the download attribute to the image filename
        a.download = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);
        // Programmatically click the anchor element to trigger download
        a.click();
        // Release the object URL
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading image:", error);
      });
  };

  return (
    <section className="bg-tableColor w-full ">
      <div className="min-h-screen">
        <div className="flex text-medium items-center px-10 py-4 gap-5 bg-white">
          <Link href="/admin/appointments">
            <h3 className="font-medium">Appointments</h3>
          </Link>

          <div className="h-5 w-[2px] bg-black"></div>
          <h3>Appointment Details</h3>
        </div>
        <div className="p-10">
          {appointment && (
            <div className="bg-white flex flex-row justify-between p-10">
              <div className="flex flex-col gap-4 text-lg">
                <div className="flex items-center gap-5">
                  <div className="flex flex-row justify-between w-[170px]">
                    <label>Name</label>
                    <p>:</p>
                  </div>
                  <h2 className="font-bold">{appointment[0].full_name}</h2>
                </div>

                <div className="flex items-center gap-5">
                  <div className="flex flex-row justify-between w-[170px]">
                    <label>Address</label>
                    <p>:</p>
                  </div>
                  <h2 className="font-semibold">{appointment[0].address}</h2>
                </div>

                <div className="flex items-center gap-5">
                  <div className="flex flex-row justify-between w-[170px]">
                    <label>Phone No.</label>
                    <p>:</p>
                  </div>
                  <h2 className="font-semibold">
                    {" "}
                    {appointment[0].contact_number}
                  </h2>
                  <div className="flex items-center px-5">
                    <IoLogoWhatsapp style={{ color: "green" }} />
                    <div className="flex flex-row justify-between gap-5 px-2">
                      <label>WhatsApp No.</label>
                      <p>:</p>
                      <p className="font-semibold">
                        {" "}
                        {appointment[0].whatsapp}{" "}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="flex flex-row justify-between w-[170px]">
                    <label>Email</label>
                    <p>:</p>
                  </div>
                  <h2 className="font-semibold"> {appointment[0].email} </h2>
                </div>

                <div className="flex items-center gap-5">
                  <div className="flex flex-row justify-between w-[170px]">
                    <label>Age</label>
                    <p>:</p>
                  </div>
                  <h2 className="font-semibold"> {appointment[0].age} </h2>
                </div>

                <div className="flex items-center gap-5">
                  <div className="flex flex-row justify-between w-[170px]">
                    <label>Complain</label>
                    <p>:</p>
                  </div>
                  <h2 className="font-semibold"> {appointment[0].name} </h2>
                </div>

                <div className="flex items-center gap-5">
                  <div className="flex flex-row justify-between w-[170px]">
                    <label>More Details</label>
                    <p>:</p>
                  </div>
                  <h2 className="font-semibold">
                    {" "}
                    {appointment[0].more_details}
                  </h2>
                </div>

                <div className="py-5">
                  <div className="flex flex-row justify-between">
                    <label className="font-bold">Documents </label>
                    <div>
                      <button
                        className={`px-3 border-r-4 ${
                          selectedCategory === "All" ? "font-bold" : ""
                        }`}
                        onClick={() => handleCategoryChange("All")}
                      >
                        All
                      </button>
                      <button
                        className={`px-3 border-r-4 ${
                          selectedCategory === "x_ray" ? "font-bold" : ""
                        }`}
                        onClick={() => handleCategoryChange("x_ray")}
                      >
                        X-Ray
                      </button>
                      <button
                        className={`px-3 border-r-4 ${
                          selectedCategory === "mri" ? "font-bold" : ""
                        }`}
                        onClick={() => handleCategoryChange("mri")}
                      >
                        MRI
                      </button>
                      <button
                        className={`px-3 ${
                          selectedCategory === "prescription" ? "font-bold" : ""
                        }`}
                        onClick={() => handleCategoryChange("prescription")}
                      >
                        D.P.
                      </button>
                    </div>
                    <div className="flex flex-row gap-5 items-center">
                      <MdArrowBackIos className="text-green-500 text-lg prev cursor-pointer" />
                      <div className="bg-green-500 text-white px-5 py-1 rounded-md">
                        {getTotalFileCount()} Files
                      </div>
                      <MdArrowForwardIos className="text-green-500 text-lg next cursor-pointer" />
                    </div>
                  </div>

                  <div className="flex flex-row gap-4 py-5 w-[800px]">
                    {/* Render images based on selected category */}
                    {selectedCategory === "All" && (
                      <div className="w-[800px]">
                        <Swiper
                          modules={[Navigation]}
                          loop={true}
                          spaceBetween={30}
                          slidesPerView={4}
                          navigation={{
                            prevEl: ".prev",
                            nextEl: ".next",
                          }}
                          grabCursor={true}
                          className="mySwiper"
                        >
                          {allFilteredImages.map((image, index) => (
                            <SwiperSlide key={index}>
                              <div className="relative group">
                                <img
                                  src={image}
                                  alt={`Image ${index + 1}`}
                                  width={150}
                                  height={100}
                                  className="w-[200px] h-[150px] rounded-md object-cover cursor-pointer"
                                  onClick={() => handleImageClick(image)}
                                />
                                <div className="inset-0 flex items-center justify-center">
                                  <div className="absolute bg-black bg-opacity-40 group-hover:opacity-100 opacity-0 transition-opacity bottom-0 right-0 mb-2 mr-2">
                                    {/* Download button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent Swiper from capturing the click event
                                        downloadImage(image);
                                      }}
                                    >
                                      <RxDownload
                                        color="white"
                                        fontSize="42px"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    )}
                    {selectedCategory === "mri" && (
                      <div className="w-[800px]">
                        <Swiper
                          modules={[Navigation]}
                          loop={true}
                          spaceBetween={30}
                          slidesPerView={4}
                          navigation={{
                            prevEl: ".prev",
                            nextEl: ".next",
                          }}
                          grabCursor={true}
                          className="mySwiper"
                        >
                          {filteredMRI.map((image, index) => (
                            <SwiperSlide key={`mri-${index}`}>
                              <div className="relative group">
                                <img
                                  src={image}
                                  alt={`MRI Image ${index + 1}`}
                                  width={150}
                                  height={150}
                                  className="w-[200px] h-[150px] rounded-md object-cover"
                                  onClick={() => handleImageClick(image)}
                                />
                                <div className="inset-0 flex items-center justify-center">
                                  <div className="absolute bg-black bg-opacity-40 group-hover:opacity-100 opacity-0 transition-opacity bottom-0 right-0 mb-2 mr-2">
                                    {/* Download button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent Swiper from capturing the click event
                                        downloadImage(image);
                                      }}
                                    >
                                      <RxDownload
                                        color="white"
                                        fontSize="42px"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    )}
                    {selectedCategory === "prescription" && (
                      <div className="w-[800px]">
                        <Swiper
                          modules={[Navigation]}
                          loop={true}
                          spaceBetween={30}
                          slidesPerView={4}
                          navigation={{
                            prevEl: ".prev",
                            nextEl: ".next",
                          }}
                          grabCursor={true}
                          className="mySwiper"
                        >
                          {filteredPrescription.map((image, index) => (
                            <SwiperSlide key={`prescription-${index}`}>
                              <div className="relative group">
                                <img
                                  src={image}
                                  alt={`Prescription Image ${index + 1}`}
                                  width={150}
                                  height={150}
                                  className="w-[200px] h-[150px] rounded-md object-cover"
                                  onClick={() => handleImageClick(image)}
                                />
                                <div className="inset-0 flex items-center justify-center">
                                  <div className="absolute bg-black bg-opacity-40 group-hover:opacity-100 opacity-0 transition-opacity bottom-0 right-0 mb-2 mr-2">
                                    {/* Download button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent Swiper from capturing the click event
                                        downloadImage(image);
                                      }}
                                    >
                                      <RxDownload
                                        color="white"
                                        fontSize="42px"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    )}
                    {selectedCategory === "x_ray" && (
                      <div className="w-[800px]">
                        <Swiper
                          modules={[Navigation]}
                          loop={true}
                          spaceBetween={30}
                          slidesPerView={4}
                          navigation={{
                            prevEl: ".prev",
                            nextEl: ".next",
                          }}
                          grabCursor={true}
                          className="mySwiper"
                        >
                          {filteredXRay.map((image, index) => (
                            <SwiperSlide key={`x-ray-${index}`}>
                              <div className="relative group">
                                <img
                                  src={image}
                                  alt={`X-ray Image ${index + 1}`}
                                  width={150}
                                  height={150}
                                  className="w-[200px] h-[150px] rounded-md object-cover"
                                  onClick={() => handleImageClick(image)}
                                />
                                <div className="inset-0 flex items-center justify-center">
                                  <div className="absolute bg-black bg-opacity-40 group-hover:opacity-100 opacity-0 transition-opacity bottom-0 right-0 mb-2 mr-2">
                                    {/* Download button */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation(); // Prevent Swiper from capturing the click event
                                        downloadImage(image);
                                      }}
                                    >
                                      <RxDownload
                                        color="white"
                                        fontSize="42px"
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="border flex flex-col items-center justify-center px-3 py-5 gap-5 w-80"
              >
                <h2 className="font-bold text-2xl text-center">
                  Appointment Schedule
                </h2>

                <div className="flex flex-col relative appointment-date">
                  <label className="px-2">Date:</label>
                  <input
                    type="date"
                    className="border w-64 px-5 py-2"
                    value={appointmentDate}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      setAppointmentDate(newDate); // Update appointmentDate state
                      setValue("appointmentDate", newDate); // Update form value
                    }}
                  />
                  <AiFillEdit
                    style={{
                      color: "blue",
                      position: "absolute",
                      right: "25px",
                      top: "70%",
                      transform: "translateY(-50%)",
                    }}
                  />
                </div>

                <div className="flex flex-col relative appointment-time">
                  <label className="px-2">Time:</label>
                  <input
                    type="time"
                    className="border w-64 px-5"
                    value={appointmentTime}
                    onChange={(e) => {
                      const newTime = e.target.value;
                      setAppointmentTime(newTime); // Update appointmentTime state
                      setValue("appointmentTime", newTime); // Update form value
                    }}
                  />
                  <AiFillEdit
                    style={{
                      color: "blue",
                      position: "absolute",
                      right: "25px",
                      top: "70%",
                      transform: "translateY(-50%)",
                    }}
                  />
                </div>

                <div className="py-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      {...register("sendWhatsappMessage")}
                      className="w-4 h-4"
                    />
                    <label className="px-4 text-base">
                      Send WhatsApp Message
                    </label>
                  </div>

                  <div className="">
                    <input
                      type="checkbox"
                      {...register("sendEmail")}
                      className="w-4 h-4"
                    />
                    <label className="px-4 text-base">Send Email</label>
                  </div>
                </div>
                <button className="bg-blue-900 w-64 py-2 rounded-md text-white">
                  {appointment && appointment[0].progress === "new"
                    ? "Schedule Appointment"
                    : "Reschedule Appointment"}
                </button>
                <button 
                  type="button"
                  className="border border-blue-900 w-64 py-2 rounded-md text-blue-900"
                  onClick={() => handleCancel()}
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Image Pop Up */}
      <Dialog
        header=""
        visible={!!enlargedImage}
        style={{
          width: "100vw",
          minHeight: "100vh",
          padding: 0,
          margin: 0,
          backgroundColor: "rgba(0, 0, 0, 0.8)",
        }}
        onHide={hideDialog}
        modal
        headerStyle={{
          color: "white",
          paddingRight: "25px",
          paddingTop: "15px",
        }}
        className="image-popup"
        closeIcon={
          <span
            style={{ fontSize: "50px", fontWeight: "200", outline: "none" }}
          >
            ×
          </span>
        }
      >
        <button
          className="absolute top-7 right-20 rounded-md text-black"
          onClick={() => downloadImage(enlargedImage)}
        >
          <RxDownload style={{ fontSize: "32px", color: "white" }} />
        </button>
        <div className="h-[85vh] flex items-center justify-center relative">
          <img
            src={enlargedImage}
            alt="Enlarged Image"
            className="max-h-[75vh] max-w-[80vw]"
          />
        </div>
      </Dialog>
    </section>
  );
};

export default AppointmentDetail;
