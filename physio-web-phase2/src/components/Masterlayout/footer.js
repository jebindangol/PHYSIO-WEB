import React from "react";

const Footer = () => {
    return (
        <div
        style={{
            backgroundImage: 'url("/footerbg.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
        className="bg-white"
        >
        <div className="flex justify-between items-center w-[80%] mx-auto py-28">
            <div className="flex flex-col justify-center items-start gap-11">
            <img src="/logo1.png" className="h-20" />
            <div className="w-[300px]">
                Welcome to MotionMenders Physiotherapy Center, where healing meets
                expertise.{" "}
            </div>
            <div className="flex items-center gap-10">
                <img src="/telegram.png" className="h-7" />
                <img src="/messenger.png" className="h-5" />
                <img src="/mail.png" className="h-5" />
            </div>
            </div>
            <div>Footer</div>
        </div>
        </div>
    );
};

export default Footer;
