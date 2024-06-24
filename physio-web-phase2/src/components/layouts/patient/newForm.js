import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { RiCloseCircleLine } from "react-icons/ri";
import { SlCalender } from "react-icons/sl";
import { FaCaretDown } from "react-icons/fa";
import { FaCaretUp } from "react-icons/fa";
import {
  createSessionById,
  updatePatients,
  getAllPatient,
} from "../../../services/apiContract";

const NewForm = ({ onCloseDialog, patientDetails }) => {
  const { register, handleSubmit, setValue } = useForm();
  const [totalSession, setSessionCompleted] = useState("");

  const onNewSubmit = async (data) => {
    const newData = { ...data, type: patientDetails.name };
    console.log(patientDetails, "patient");

    try {
      await createSessionById(newData, patientDetails.id);
      console.log("Session created successfully");

      await updatePatients(
        { patient_progress: "in_progress" },
        patientDetails.id
      );

      const updatedPatient = await getAllPatient();

      window.location.reload();

      onCloseDialog();
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  const handleTodayClick = () => {
    const today = new Date().toISOString().split("T")[0];
    setValue("started_date", today);
    console.log(today, "newform");
  };

  const handleCancel = () => {
    onCloseDialog();
  };

  const handleIncrement = () => {
    const newValue =
      totalSession === "" ? 1 : parseInt(totalSession) + 1;
    setSessionCompleted(newValue.toString());
  };

  const handleDecrement = () => {
    if (totalSession !== "" && parseInt(totalSession) > 0) {
      const newValue = parseInt(totalSession) - 1;
      setSessionCompleted(newValue.toString());
    }
  };

  return (
    <div className="h-[500px] flex items-center justify-center">
      <div className="relative py-6 border px-4 bg-white rounded-md">
        <div className="absolute right-0 top-0  z-10 cursor-pointer" onClick={handleCancel}>
          <RiCloseCircleLine
            style={{
              fontSize: "32px",
              color: "red",
              background: "white",
              borderRadius: "18px",
            }}
          />
        </div>
        <div className="flex justify-between pb-6 border-b-2 border-gray px-4 ">
          <div className="flex items-center gap-4 blue">
            <Image src="/clock.png" alt="clock" width={15} height={15} /> Start
            New Session
            <div className="h-5 w-[2px] bg-blue"></div>
            <div> {patientDetails.full_name} </div>
          </div>
          
          <div className="relative border rounded-md border-gray-300 py-1.5 w-[250px] text-gray-400">
            <input
              type="text"
              id="type"
              {...register("type")}
              required
              className="w-[250px] px-2 bg-transparent outline-none"
              placeholder="Program Name"
            />
          </div>
        </div>
        <form
          onSubmit={handleSubmit(onNewSubmit)}
          className="pt-6 flex justify-center start-new"
        >
          <div className="flex gap-10">
            <div className="flex flex-col gap-7 mb-3">
              <div className="flex gap-4">
                <div className="relative appointment-date border rounded-md border-gray-300 py-1.5 w-[250px]">
                  <label
                    htmlFor="started_date"
                    className="absolute text-xs bottom-7 bg-white ml-3 text-gray-500 px-1"
                  >
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="started_date"
                    {...register("started_date")}
                    required
                    className="w-[250px] px-1 bg-transparent outline-none"
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
                <div
                  className="rounded-md bg-blue flex justify-center items-center w-[110px] text-sm cursor-pointer"
                  onClick={handleTodayClick}
                >
                  Today
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="relative border rounded-md border-gray-300 py-1.5 w-[250px]">
                  <label
                    htmlFor="total_session"
                    className="absolute text-xs bottom-7 bg-white ml-3 text-gray-500 px-1"
                  >
                    Session Reqd.
                  </label>
                  <input
                    type="number"
                    id="total_session"
                    {...register("total_session")}
                    value={totalSession}
                    onChange={(e) => setSessionCompleted(e.target.value)}
                    required
                    className="w-[250px] px-1 bg-transparent outline-none"
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
              <div className="flex gap-6">
                <button
                  type="submit"
                  className="text-white p-2 w-[170px] bg-green rounded-md text-sm"
                >
                  Confirm
                </button>
                <button
                  className="border-blue blue p-2 rounded-md w-[130px] text-sm"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex flex-row gap-10">
                <div className="flex items-start">
                  <div className="relative border rounded-md border-gray-300 py-1.5 w-[250px]">
                    <label
                      htmlFor="package_type"
                      className="absolute text-xs bottom-7 bg-white ml-3 text-gray-500 px-1"
                    >
                      Package Type
                    </label>
                    <select
                      id="package_type"
                      {...register("package_type")}
                      required
                      className="w-[250px] px-1 bg-transparent outline-none"
                    >
                      <option value=""></option>
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                      <option value="session">Session</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="relative border rounded-md border-gray-300 py-1.5 w-[250px]">
                    <label
                      htmlFor="payment_for"
                      className="absolute text-xs bottom-7 bg-white ml-3 text-gray-500 px-1"
                    >
                      Payment Type
                    </label>
                    <select
                      id="payment_for"
                      {...register("payment_for")}
                      required
                      className="w-[250px] px-1 bg-transparent outline-none"
                    >
                      <option value=""></option>
                      <option value="pre">Pre-paid</option>
                      <option value="post">Post-paid</option>
                      <option value="session">Session</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-10">
                <div className="flex items-start">
                  <div className="relative border rounded-md border-gray-300 py-1.5 w-[250px]">
                    <label
                      htmlFor="per_session"
                      className="absolute text-xs bottom-7 bg-white ml-3 text-gray-500 px-1"
                    >
                      Per Session Charge
                    </label>
                    <input
                      type="number"
                      id="per_session"
                      {...register("per_session")}
                      required
                      className="w-[250px] px-1 bg-transparent outline-none"
                    />
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="relative border rounded-md border-gray-300 py-1.5 w-[250px]">
                    <label
                      htmlFor="amount"
                      className="absolute text-xs bottom-7 bg-white ml-3 text-gray-500 px-1"
                    >
                      Total Charge
                    </label>
                    <input
                      type="number"
                      id="amount"
                      {...register("amount")}
                      required
                      className="w-[250px] px-1 bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewForm;
