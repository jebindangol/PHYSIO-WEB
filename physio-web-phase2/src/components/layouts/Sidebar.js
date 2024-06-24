import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/router";
import { HiUsers } from "react-icons/hi2";
import PhysioLogo from "../../../public/physionlogo.png";
import Dashboard from "../../../public/dashboard.png";
import Patient from "../../../public/patient.png";
import Appointment from "../../../public/appointment.png";
import Services from '../../../public/services.png';
import Blog from "../../../public/blog.png";
import { BiCategory } from "react-icons/bi";

const Sidebar = () => {
  const router = useRouter();
  const [activeLink, setActiveLink] = useState("");

  // const handleLinkClick = (route) => {
  //   setActiveLink(route);
  // };

  const isActive = (route) => {
    return activeLink === route || router.pathname === route
      ? "bg-hoverColor w-full text-white"
      : "text-color";
  };

  return (
    <div className="bg-sidebar h-screen w-[270px] py-4 fixed z-10">
      <Link
        href="/admin"
        className=" flex justify-center items-center h-[55px] border-b-4 border-color"
      >
        <Image
          src={PhysioLogo}
          alt=""
          width={1000}
          height={1000}
          className="px-5"
        />
      </Link>
      <div className="flex flex-col items-center">
        <Link
          href="/admin"
          className={`flex items-center flex-start pl-10 gap-5 w-full h-[70px] cursor-pointer hover:bg-hoverColor ${isActive(
            "/admin"
          )}`}
        >
          <Image
            src={Dashboard}
            alt="Dashboard"
            width={20}
            height={20}
            className=""
          />
          <div className="">Dashboard</div>
        </Link>

        <Link
          href="/admin/appointments"
          className={`flex items-center pl-10 gap-5 w-full h-[70px] cursor-pointer hover:bg-hoverColor ${isActive(
            "/admin/appointments"
          )}`}
        >
          <Image
            src={Appointment}
            alt="Appointment"
            width={20}
            height={20}
            className=""
          />
          <div className="">Appointments</div>
        </Link>

        <Link
          href="/admin/patient"
          className={`flex items-center pl-10 gap-5 w-full h-[70px] cursor-pointer hover:bg-hoverColor ${isActive(
            "/admin/patient"
          )}`}
        >
          <Image
            src={Patient}
            alt="Patient"
            width={25}
            height={20}
            className=""
          />
          <div className="">Patient List</div>
        </Link>

        <Link
          href="/admin/category"
          className={`flex items-center gap-5 pl-10 w-full h-[70px] cursor-pointer  hover:bg-hoverColor ${isActive(
            "/admin/category"
          )}`}
        >
          <BiCategory fontSize={28} />
          <div className="">Category</div>
        </Link>

        <Link
          href="/admin/user"
          className={`flex items-center gap-5 pl-10 w-full h-[70px] cursor-pointer  hover:bg-hoverColor ${isActive(
            "/admin/user"
          )}`}
        >
          <HiUsers fontSize= {28} />
          <div className="">Users</div>
        </Link>

        <Link
          href="/admin/blogs/blog"
          className={`flex items-center gap-5 pl-10 w-full h-[70px] cursor-pointer  hover:bg-hoverColor ${isActive(
            "/admin/blogs/blog"
          )}`}
        >
          <Image 
            src={Blog} 
            alt="Blog"
            width={25} 
            height={20} 
          />
          <div className="">Blog</div>
        </Link>
        <Link
          href="/admin/services/service"
          className={`flex items-center gap-5 pl-10 w-full h-[70px] cursor-pointer  hover:bg-hoverColor ${isActive(
            "/admin/services/service"
          )}`}
        >
          <Image 
            src={Services} 
            alt="Services" 
            width={25} 
            height={20} 
            className="" 
          />
          Services
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
