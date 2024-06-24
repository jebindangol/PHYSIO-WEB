import React from "react";

const ExcerciseDetails = () => {
  return (
    <div className="">
      <div className="flex flex-col gap-7 text-gray-700">
        <h2 className="font-semibold text-xl text-black">Pain Management</h2>
        <div>
          Pain management is a branch of medicine that focuses on alleviating
          pain, whether acute or chronic, in patients. It involves various
          techniques and approaches to help individuals cope with and reduce
          their pain levels, thereby improving their quality of life.
        </div>
        <img
          src="/excerciselibrary.png"
          className="object-cover"
        />
        <div>Some common methods of pain management include:</div>
        <div>
          Medications: Over-the-counter (OTC) pain relievers such as ibuprofen
          or acetaminophen can help manage mild to moderate pain. For more
          severe pain, prescription medications like opioids, muscle relaxants,
          or nerve pain medications may be prescribed.
        </div>
        <div>
          Physical therapy: Physical therapy aims to improve mobility, strength,
          and flexibility while reducing pain through exercises, stretches, and
          manual techniques.
        </div>
        <div className="flex gap-5">
          <img src="workout.png" />
          <img src="/excercise1.png" />
          <img src="/excercise2.png" />
        </div>
      </div>
    </div>
  );
};

export default ExcerciseDetails;
