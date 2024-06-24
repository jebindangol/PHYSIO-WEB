import React from "react";

const ExcerciseLibrary = ({ children }) => {
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
        className="py-9 rounded-t-md"
      >
        <div className="w-[75vw] mx-auto flex">
          <div className="flex items-center gap-5 pl-0">
            <div className="text-8xl font-thin text-gray-500">|</div>
            <div className="font-bold text-3xl text-gray-800 leading-10">
              SPORTS <br /> INJURY
            </div>
          </div>
        </div>
      </div>

      <div className="w-[75vw] mx-auto mt-7 pb-20 flex gap-7">
        {/* Sidebar */}
        <div className="flex flex-col gap-5 border-r-2 pr-7 pb-20 w-96 h-fit">
          <div className="font-semibold">Filter Library</div>
          <ul className="flex flex-col gap-5 text-sm text-gray-500">
            <li>Sports Injury</li>
            <li>Orthopedic</li>
            <li>Pain Management</li>
            <li>Athletic Performance Enh.</li>
            <li>Neurological Injuries</li>
            <li>Strength Building</li>
            <li>Endurance Building</li>
          </ul>
        </div>

        {/* Details */}
        <main>{children}</main>
      </div>
    </div>
  );
};

export default ExcerciseLibrary;
