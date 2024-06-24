import React from "react";
import Sidebar from "./Sidebar";
import Link from "next/link";

const MasterLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-[270px]">
        <div className="h-[75px] flex justify-between items-center bg-white border-b-4 border-color1">
          <Link href="/">
            <span className="text-black text-lg font-semibold cursor-pointer px-10">
              Admin panel
            </span>
          </Link>
          <div className="flex items-center">
            <img src="/usericon.png" alt="User Icon" className="mr-2" />
            <span className="text-gray-600 text-sm mx-7 my-3 font-bold">Super Admin</span>
          </div>
        </div>

        <main className="">{children}</main>
      </div>
    </div>
  );
};

export default MasterLayout;
