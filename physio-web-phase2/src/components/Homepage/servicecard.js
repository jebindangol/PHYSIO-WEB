import React from "react";
import Image from "next/image";

const ServiceCard = ({ imageUrl, title, description }) => {
    return (
        <div>
        <div className="w-80 bg-blue-100">
            <Image src={imageUrl} width={324} height={35} alt={title} className="object-cover h-44" />
            <div className="h-32 overflow-auto p-4">
            <div className="font-semibold text-2xl pb-2">{title}</div>
            <div className="text-gray-500 text-sm line-clamp-2"><div
                dangerouslySetInnerHTML={{ __html: description }}
                /></div>
            </div>
        </div>
        </div>
    );
};

export default ServiceCard;