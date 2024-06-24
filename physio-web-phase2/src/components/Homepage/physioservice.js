import React from "react";
import ServiceCard from "./servicecard";
import { IoCaretForward } from "react-icons/io5";
import { useState, useEffect } from "react";
import { getAllServices } from "../../services/apiContract";
import { API_getImage } from "../../services/apiService";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Link from "next/link";

const PhysioServicePage = () => {
  const [services, setServices] = useState([""]);

  useEffect(() => {
    getAllServices()
    .then((res) => {
        console.log("Received data for category :", res.data);
        setServices(res.data);
    })
    .catch((error) => {
        console.error(error);
    });
}, []);

  return (
    <div
      className="mt-8 w-[96vw]"
      style={{
        backgroundImage: 'url("/bg-1.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex p-5">
        <div className=" w-[400px] ml-40 flex flex-col justify-center mr-20">
          <div className="text-5xl">
            <b>PHYSIOTHERAPY</b>
          </div>
          <div className="text-[40px]">& REHABILITATION SERVICES</div>
        </div>
        <div className="flex overflow-hidden">
        <Swiper
            modules={[Navigation]}
            loop={true}
            spaceBetween={0}
            slidesPerView='auto'
            navigation={{
              prevEl: ".prev",
              nextEl: ".next",
            }}
            grabCursor={true}
            className=""
          >
          {services.map((service, index) => (
            <SwiperSlide key={index}>
              <Link href={`/services/${service.id}`}>
                <ServiceCard
                  key={index}
                  imageUrl={API_getImage(service.image)}
                  title={service.sub_title}
                  description={service.sub_description}
                />
              </Link>
            </SwiperSlide>
          ))}
          </Swiper>
        </div>
        <div className="bg-white min-w-[120px] rounded-md ml-4 flex justify-center items-center text-gray-500 text-5xl cursor-pointer next">
          <IoCaretForward />
        </div>
      </div>
    </div>
  );
};

export default PhysioServicePage;
