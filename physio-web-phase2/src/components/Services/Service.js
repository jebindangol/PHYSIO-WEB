import React, { useState, useEffect, useRef } from "react";
import ServiceCard from "../Homepage/servicecard";
import Image from "next/image";
import { IoCaretForwardSharp } from "react-icons/io5";
import { IoCaretBackSharp } from "react-icons/io5";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import { getAllServices } from "../../services/apiContract";
import { API_getImage } from "../../services/apiService";

const Service = () => {
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
      className="shadow-equal rounded-md w-[96vw] mb-5"
      style={{ minHeight: "calc(100vh - 140px)" }}
    >
      <div
        style={{
          backgroundImage: 'url("/servicebg.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="flex justify-between py-9 rounded-t-md"
      >
        <div className="w-[75vw] mx-auto flex justify-between ">
          <div className="flex items-center gap-5 pl-0">
            <div className="text-8xl font-thin text-gray-500">|</div>
            <div className="font-bold text-3xl text-gray-800 leading-10 w-44">
              NPRC<br/>SERVICES
            </div>
          </div>
          <div>
            <Image src="/service.png" width={100} height={100} alt="service" />
          </div>
        </div>
      </div>
      <div className="w-[75vw] mx-auto pt-11 mb-14">
        <div className="text-2xl font-semibold mb-3">
          Our Specialized Services
        </div>
        <div className="w-[800px] text-gray-700 text-base">
          Pain management is a branch of medicine that focuses on alleviating
          pain, whether acute or chronic, in patients. It involves various
          techniques and approaches to help individuals cope with and reduce
          their pain levels, thereby improving their quality of life.
        </div>
      </div>
      <div className="pb-20 flex justify-center items-center gap-10">
        <div className="shadow-lg border py-5 px-1 rounded-md cursor-pointer serviceprev">
          <IoCaretBackSharp className="text-red-500 text-3xl" />
        </div>
        <div
          className="flex overflow-hidden w-[75vw]"
        >
          <Swiper
            modules={[Navigation]}
            loop={true}
            spaceBetween={0}
            slidesPerView='auto'
            navigation={{
              prevEl: ".serviceprev",
              nextEl: ".servicenext",
            }}
            grabCursor={true}
            className=""
          >
            {services.map((service, index) => (
              <SwiperSlide key={index}>
                <Link href={`/services/${service.id}`}>
                  <ServiceCard
                    imageUrl={API_getImage(service.image)}
                    title={service.sub_title}
                    description={service.sub_description}
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="shadow-lg border py-5 px-1 rounded-md cursor-pointer servicenext">
          <IoCaretForwardSharp className="text-red-500 text-3xl" />
        </div>
      </div>
    </div>
  );
};

export default Service;
