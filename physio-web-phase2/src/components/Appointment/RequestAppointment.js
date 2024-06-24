import React from "react";
import Link from "next/link";
import Image from "next/image";

const RequestAppointment = () => {
    return (
        <div className="h-screen w-full -mb-[120px] pb-[138px]">
            <div className="h-full rounded-md shadow-equal w-[96vw]">
                <div
                style={{
                    backgroundImage: 'url("/appointmentbg.png")',
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                className="flex justify-between px-36 py-9"
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
                <div className="mt-10 pl-36">
                    <Link href="/appointment-form">
                        <div className="cursor-pointer p-5 text-white rounded-md button w-96 text-center mb-5">
                        Patient
                        </div>
                    </Link>
                    <div className="border border-black rounded-md text-gray-500 w-96 p-5 text-center font-semibold cursor-pointer">
                        Health Care Personnel -{" "}
                        <span className="font-normal">I want to refer</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestAppointment;
