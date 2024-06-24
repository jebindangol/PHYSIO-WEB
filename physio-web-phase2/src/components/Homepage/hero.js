import React from "react";

const Hero = () => {
  return (
    <div className="mt-5 w-[96%] relative">
      <div>
        <div className="absolute w-[96vw] inset-0">
          <img
            src="/hero.png"
            alt="image"
            className="rounded-md h-[619px] object-cover w-full"
          />
          <div className="absolute inset-0 bg rounded-md"></div>
        </div>
        <div className="relative flex flex-col h-[619px] justify-center text-white gap-7 ml-40">
          <div className="font-bold text-5xl">About NPRC</div>
          <div className="text-lg w-[500px]">
            From personalized musculoskeletal care to specialized neurological
            rehabilitation, we offer a holistic approach to empower your journey
            towards a pain-free, active life. Discover the art of movement and
            experience the transformative magic of NPC today.
          </div>
          <div>
            <button className="text-gray-500 bg-white rounded-md py-4 w-60 shadow-lg">
              Learn More
            </button>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Hero;
