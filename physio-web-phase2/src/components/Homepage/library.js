import React from "react";
import Image from "next/image";

const Library = () => {
  return (
    <div className="w-[90%] mx-auto">
      <div
        style={{
          backgroundImage: 'url("/bg-2.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="rounded-md shadow-2xl"
      >
        <div className="flex rounded-md ">
          <div className="w-[50%]">
            <div className="rounded-l-md h-full bg-white">
              <iframe
                height="560"
                src="https://www.youtube.com/embed/3wx5KxPVcbk?si=gtWGQpYule_IMP1a&amp;start=145"
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
                className="w-[100%] rounded-l-md"
              ></iframe>
            </div>
          </div>
          <div className=" w-[50%] p-20 flex flex-col justify-center items-start overflow-auto">
            <div className="font-semibold text-3xl">Dr. Nabina Shrestha</div>
            <div className="text-sm mt-2">
              Health Specialist for Nepal Womens Football Team
            </div>
            <div className="text-gray-500 text-lg mt-5">
              From personalized musculoskeletal care to specialized neurological
              rehabilitation, we offer a holistic approach to empower your
              journey towards a pain-free, active life. Discover the art of
              movement and experience the transformative magic of NPC today.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 flex justify-center items-center gap-11">
        <div>
          <div className="text-4xl font-semibold mb-2">Exercise Library</div>
          <div className="text-gray-500 w-96 mb-7">
            Short Description about this section, the explore button will take
            you to the page
          </div>
          <button className="py-4 w-40 bg-blue-500 text-white rounded-md">
            Explore
          </button>
        </div>
        <div className="flex gap-7 overflow-auto">
          <Image
            src="/library1.png"
            height={10}
            width={150}
            alt="library_images"
          />
          <Image
            src="/library2.png"
            height={10}
            width={200}
            alt="library_images"
          />
          <Image
            src="/library3.png"
            height={10}
            width={250}
            alt="library_images"
          />
        </div>
      </div>

      <div
        style={{
          backgroundImage: 'url("/bg3.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="rounded-md my-16 p-12"
      >
        <div className="flex rounded-md items-center">
          <div className="">
            <video controls className="bg-white w-[35vw] h-[26vw]  ">
              <source src="./krijal.mp4" type="video/mp4" />
            </video>
          </div>
          <div className=" w-[70%] py-16 pr-16 px-24 flex flex-col justify-center items-start overflow-auto">
            <div className="font-semibold text-3xl">Krijal Khadka</div>
            <div className="text-base mt-2">
              National Football Team, Striker
            </div>
            <div className="mt-7 w-[90%]">
              ‘’ After a sports injury, their dedicated team guided me through a
              tailored rehabilitation program. Their personalized approach,
              coupled with a warm and supportive environment, made the journey
              to recovery not only effective but enjoyable ‘’
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
