import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { RiCloseCircleLine } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";
import { SlCalender } from "react-icons/sl";
import {
  updateSessionLog,
  updatePatients,
} from "../../../services/apiContract";

const EditSession = ({ onCloseDialog, patientDetails }) => {
  const { register, handleSubmit, setValue, reset } = useForm();
  const [sessionCompleted, setSessionCompleted] = useState("");
  console.log(patientDetails, "ditsession");
  useEffect(() => {
    // Set initial values for the input fields
    setValue("date", patientDetails.Session?.started_date.split("T")[0]);
    setValue("sessionRequired", patientDetails.Session?.total_session);
    setValue("sessionCompleted", patientDetails.Session?.session_Log.length);
    setValue("remarks", patientDetails.Session?.session_Log[0]?.remarks);
  }, [patientDetails]);

  const onEditSubmit = async (data) => {
    console.log(data, "data");
    try {
      if (data.sessionCompleted === data.sessionRequired) {
        await updatePatients({ patient_progress: "done" }, patientDetails.id);
      }
      await updateSessionLog(data, patientDetails.id);
      console.log("Session log updated successfully!", data);

      onCloseDialog();
      window.location.reload();
    } catch (error) {
      console.error("Error in updating session and session log:", error);
    }
  };

  const handleCancel = () => {
    onCloseDialog();
  };

  const handleIncrement = () => {
    const newValue =
      sessionCompleted === "" ? 1 : parseInt(sessionCompleted) + 1;
    setSessionCompleted(newValue.toString());
  };

  const handleDecrement = () => {
    if (sessionCompleted !== "" && parseInt(sessionCompleted) > 0) {
      const newValue = parseInt(sessionCompleted) - 1;
      setSessionCompleted(newValue.toString());
    }
  };

  return (
    <div className="h-[600px] flex items-center w-[700px] justify-center">
      <div className="relative py-6 border w-[450px] px-4 bg-white rounded-md">
        <div
          className="absolute right-[-8px] top-[-8px]  z-10 cursor-pointer"
          onClick={handleCancel}
        >
          <RiCloseCircleLine
            style={{
              fontSize: "28px",
              color: "red",
              background: "white",
              borderRadius: "18px",
            }}
          />
        </div>
        <div>
          <div className="flex items-center gap-2 text-green-600 pb-5 border-b-2 border-gray px-4">
            <AiFillEdit style={{ color: "#36CE00", fontSize: "20px" }} /> Edit
            Session
            <div className="h-5 w-[2px] bg-green"></div>
            <div> {patientDetails.full_name} </div>
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onEditSubmit)}
          className="pt-6 flex justify-center start-new"
        >
          <div className="flex flex-col gap-7 mb-3">
            <div className="flex gap-4">
              <div className="relative appointment-date border rounded-md border-gray-300 py-1.5 w-[200px]">
                <label
                  htmlFor="date"
                  className="absolute text-xs bottom-8 bg-white ml-3 text-gray-500 px-1"
                >
                  Start Date
                </label>
                <input
                  type="date"
                  id="date"
                  {...register("date")}
                  required
                  className="w-[200px] px-1 bg-transparent outline-none cursor-pointer z-1000"
                />
                <SlCalender
                  style={{
                    color: "blue",
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
              </div>
            </div>
            <div className="flex items-start">
              <div className="relative border rounded-md border-gray-300 py-1.5 w-[200px]">
                <label
                  htmlFor="sessionRequired"
                  className="absolute text-xs bottom-7 bg-white ml-3 text-gray-500 px-1"
                >
                  Session Reqd.
                </label>
                <input
                  type="number"
                  id="sessionRequired"
                  {...register("sessionRequired")}
                  required
                  className="w-[200px] px-1 bg-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="relative border rounded-md border-gray-300 py-1.5 w-[200px]">
                <label
                  htmlFor="sessionRequired"
                  className="absolute text-xs bottom-7 bg-white ml-3 text-gray-500 px-1"
                >
                  Session Completed
                </label>
                <input
                  type="number"
                  id="sessionCompleted"
                  {...register("sessionCompleted")}
                  value={sessionCompleted}
                  onChange={(e) => setSessionCompleted(e.target.value)}
                  required
                  className="w-[200px] px-1 bg-transparent outline-none"
                />
              </div>
              <div
                className="border-blue rounded-md py-2 px-3 cursor-pointer"
                onClick={handleIncrement}
              >
                <FaCaretUp size={20} className="blue" />
              </div>
              <div
                className="border-blue rounded-md py-2 px-3 cursor-pointer"
                onClick={handleDecrement}
              >
                <FaCaretDown size={20} className="blue" />
              </div>
            </div>
            <div className="flex items-start">
              <div className="relative border rounded-md border-gray-300 py-1.5 w-[200px]">
                <label
                  htmlFor="remarks"
                  className="absolute text-xs bottom-7 bg-white ml-3 text-gray-500 px-1"
                >
                  Session Remarks
                </label>
                <input
                  type="text"
                  id="remarks"
                  {...register("remarks")}
                  required
                  className="w-[200px] px-1 bg-transparent outline-none"
                />
              </div>
            </div>
            <div className="flex gap-6">
              <button
                type="submit"
                className="text-white p-2 w-[170px] bg-green rounded-md text-sm"
              >
                Confirm
              </button>
              <button
                className="border-blue blue p-2 rounded-md w-[130px] text-sm"
                onClick={() => handleCancel()}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSession;
