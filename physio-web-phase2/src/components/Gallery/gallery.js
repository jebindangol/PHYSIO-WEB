import React from "react";
import Image from "next/image";

const Gallery = () => {

    const contents = [
        { source: "/tips.png" },
        { source: "/muscle.png" },
        { source: "/food.png" },
        { source: "/balanced.png" },
        { source: "/krijal.mp4" },
        { source: "/sports.png" },
        { source: "/orthopedic.png" },
        { source: "/pain.png" },
        { source: "/neural.jpg" },
        { source: "/Homedesign.mp4" },
        { source: "/excercise.png" },
        { source: "/muscle.png" },
        { source: "/triangle.png" },
        { source: "/health.png" },
        { source: "/krijal.mp4" },
        { source: "/excercise.png" },
        { source: "/diet.png" },
        { source: "/excercise2.png" },
        { source: "/excercise1.png" },
        { source: "/Homedesign.mp4" },
    ];
    return (
        <div className="shadow-equal rounded-md w-[96vw] mb-5"
        style={{ minHeight: "calc(100vh - 140px)" }}>
        <div
            style={{
            backgroundImage: 'url("/servicebg.png")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            }}
            className="flex justify-between py-9 rounded-t-md"
        >
            <div className="w-[80vw] mx-auto flex justify-between items-center">
                <div className="flex items-center gap-5">
                    <div className="text-8xl font-thin text-gray-500 ">|</div>
                    <div className="font-bold text-3xl text-gray-800 leading-10">
                        <h1>GALLERY</h1>
                        <h1 className="font-medium">PHOTOS & VIDEOS</h1>
                    </div>
                </div>
                <div>
                    <Image src="/service.png" width={100} height={100} alt="service" />
                </div>
            </div>
        </div>

        <div className="w-[80vw] mx-auto mt-7 flex flex-wrap pb-20 gap-[1vw]">
                {contents.map((content, index) => (
                    <div key={index}>
                        {content.source.endsWith('.mp4') ? (
                            <video controls className="w-[26vw] h-[12vw]">
                                <source src={content.source} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <Image src={content.source} width={200} height={300} alt="image" className="w-[12.5vw] h-[12vw] object-cover"/>
                        )}
                    </div>
                ))}
            </div>
    </div>
    );
};

export default Gallery;