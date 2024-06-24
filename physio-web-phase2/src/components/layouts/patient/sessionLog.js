import React, { useState, useEffect } from "react";
import { SlCalender } from "react-icons/sl";
import Switch from "@mui/material/Switch";
import Swal from "sweetalert2";
import {
    getPatientById,
    createSessionLogById,
    getSessionLogBySessionId,
    createPaymentBySessionLog,
    getPaymentById,
    updatePaymentById,
    updateSessionLog,
} from "../../../services/apiContract";
import { useForm } from "react-hook-form";
import { RiCloseCircleLine } from "react-icons/ri";
import { AiFillEdit } from "react-icons/ai";

export const InputDate = ({ rowData, register }) => {
    console.log("InputDate component rendered");
    return (
        <div>
            <label htmlFor="date">Session Date</label>
            <div className="appointment-date border p-2 relative" >
                <input
                    type="date"
                    {...register(`date_${rowData.id}`)}
                    className="outline-none"
                />
                <SlCalender
                    style={{
                        color: "blue",
                        position: "absolute",
                        right: 10,
                        top: "50%",
                        transform: "translateY(-50%)",
                    }}
                />
            </div>
        </div>
    );
};

export const InputRemarks = ({ rowData, register }) => {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="remarks" className="px-2">Session Remarks</label>
            <textarea
                {...register(`remarks_${rowData.id}`)}
                className="outline-none px-2 border h-[20vh]"
            />
        </div>
    );
};



export const PaymentBody = ({rowData, patient }) => {
    const rowDataId = rowData.id;
    const [paymentStatus, setPaymentStatus] = useState(false);
    const id = patient.Session.id;
    
    useEffect(() => {
        const fetchPaymentStatus = async () => {
            try {
            const response = await getSessionLogBySessionId(id);
            const paymentData = response.data.find(
                (payment) => payment.id === parseInt(rowDataId)
            );
            if (paymentData) {
                // console.log("Payment status fetched:", paymentData.status);
                setPaymentStatus(paymentData.status === "paid" ? true : false);
            } else {
                // console.error("Payment data not found for session ID:", rowDataId);
            }
            } catch (error) {
            console.error("Error fetching payment data:", error);
            }
        };
        fetchPaymentStatus();
    }, [rowDataId]);

    const handleToggleChange = async (event) => {
    const newStatus = event.target.checked ? "paid" : "unpaid";
    setPaymentStatus(event.target.checked);
    
    try {
        await updatePaymentById({ status: newStatus }, rowDataId);
        console.log("Payment status updated successfully");
        } catch (error) {
            console.error("Error updating payment status:", error);
        }
    };
    
    return (
        <div className="card flex justify-content-center px-2">
            <Switch checked={paymentStatus} onChange={handleToggleChange} />
            <div>{paymentStatus ? "paid" : "unpaid"}</div>
        </div>
    );
};

const SessionLog = ({rowData, patient, onCloseDialog }) => {
    const { register, handleSubmit } = useForm();
    const handleCancel = () => {
        onCloseDialog();
    };
    console.log("rowata",rowData)

    const onSubmit = async (formData, event) => {
        event.preventDefault();
        console.log(formData,"data")
        const totalSessionCount = parseInt(patient.Session?.total_session); 
        const doneSessions = patient.Session?.session_Log.filter((session) => session.action === "done");
        const sessionDoneCount = doneSessions.length;
        
        if (sessionDoneCount >= totalSessionCount) {
            console.error("Session done count exceeds total session count.");
            return;
        }
        
        const dateKey = `date_${rowData.id}`;
    const remarksKey = `remarks_${rowData.id}`;

    // Extracting values from formData using keys
    const dateValue = formData[dateKey];
    const remarksValue = formData[remarksKey];

    // Log extracted values for debugging
    console.log(dateValue, remarksValue, "date");  
        
        const sessionLogData = {
            date: dateValue,
            remarks: remarksValue,
            action: "done",
        };
        
        try {
            await updateSessionLog(sessionLogData, rowData.id);
            console.log("Session log updated successfully:", sessionLogData);
            const updatedSessionLogs = patient.Session.session_Log.map(session => {
                if (session.id === rowData.id) {
                return { ...session, action: "done" };
                }
                return session;
            });
            onCloseDialog();
            Swal.fire({
                icon: "success",
                title: "Session Log Updated",
                text: "Session log has been successfully updated.",
            }).then(() => {
                const updatedPatient = {
                ...patient,
                Session: {
                    ...patient.Session,
                    session_Log: updatedSessionLogs,
                },
                };
                console.log(updatedPatient,"update")
                window.location.reload();
            });      
        
            } catch (error) {
            console.error("Error updating session log:", error);
            // Show error alert
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred while updating session log. Please try again later.",
            });
        }
    };

    return(
        <div className="h-[750px] flex items-center w-[700px] justify-center">
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
                    <div> {patient.full_name} </div>
                    </div>
                </div>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="pt-6 flex justify-center start-new"
                >
                    <div className="flex flex-col gap-7 mb-3">
                        <InputDate rowData = {rowData} register={register} />
                        <InputRemarks rowData = {rowData} register={register} />
                                
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
    )
}

export default SessionLog;