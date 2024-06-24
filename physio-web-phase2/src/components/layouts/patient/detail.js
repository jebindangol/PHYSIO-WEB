import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IoLogoWhatsapp } from "react-icons/io";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  getPatientById,
  createSessionLogById,
  getSessionLogBySessionId,
} from "../../../services/apiContract";

import { Dialog } from "primereact/dialog";
import NewForm from "./newForm";
import EditSession from "./editSession";
import Image from "next/image";
import Swal from "sweetalert2";
import SessionLog, { PaymentBody } from "./sessionLog";
import Files from "../../../../public/Layer_1.png";
import ActivityPage from "./current";

const PatientDetail = () => {
  const { handleSubmit, register } = useForm();
  const [patient, setPatient] = useState([]);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [fetchedSessionData, setFetchedSessionData] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      getPatientById(id)
        .then((response) => {
          console.log("Fetched patient details:", response.data);
          setPatient(response.data);
        })
        .catch((error) => {
          console.error("Error fetching patient:", error);
        });
    }
  }, [id]);

  const totalRows = patient.Session?.total_session;

  const generateRows = () => {
    const emptyRows = [];
    const sessionLogLength = patient.Session?.session_Log?.length || 0;
    const remainingRows = totalRows - sessionLogLength;

    for (let i = 0; i < remainingRows; i++) {
      emptyRows.push({
        id: sessionLogLength + i + 1,
        date: "",
        remarks: "",
        sessions: i + 1,
      });
    }
    return emptyRows;
  };

  const createSessionLogsForEmptyRows = async () => {
    const emptyRows = generateRows();
    let sessionDoneCount = patient.Session?.session_Log.length || 0;
  
    try {
      const updatedSessionLogs = [];
      for (const row of emptyRows) {
        const sessionLogData = {
          session_done: sessionDoneCount + 1,
        };
  
        const createdSessionLog = await createSessionLogById(
          sessionLogData,
          patient.Session.id
        );
        console.log(
          "Session log created successfully for empty row",
          sessionLogData
        );
  
        updatedSessionLogs.push(createdSessionLog);
        sessionDoneCount++; 
      }
  
      const updatedPatient = {
        ...patient,
        Session: {
          ...patient.Session,
          session_Log: [...patient.Session.session_Log, ...updatedSessionLogs],
        },
      };
  
      setPatient(updatedPatient);
      // console.log("Patient updated with new session logs:", updatedPatient);
    } catch (error) {
      console.error("Error creating session logs for empty rows:", error);
    }
  };
  

  useEffect(() => {
    if (patient.Session?.total_session) {
      createSessionLogsForEmptyRows();
    }
  }, [patient.Session?.total_session]);

  const openDialog = (rowData) => {
    setSelectedRowData(rowData);
    setShowDialog(true);
  };
  
  const closeDialog = () => {
    setShowDialog(false);
  };


  const payment = (rowData, patient) => {
    return (
      <PaymentBody rowData={rowData} patient={patient} />
    )
  }

  const action = (rowData) => {
    return(
      <button
        className= "flex rounded-full py-2 px-4 items-center justify-center text-xs text-white bg-green cursor-pointer"
        type="button"
        onClick={() => openDialog(rowData)}
      >
        Done
      </button>
    )
  };
  

  const onHideNew = () => {
    setShowNewDialog(false);
  };

  const onHideEdit = () => {
    setShowEditDialog(false);
  };

  const sessionId = patient.Session?.id;

  useEffect(() => {
    if (sessionId) {
      getSessionLogBySessionId(sessionId)
        .then((res) => {
          setFetchedSessionData(res.data);
        })
        .catch(error => {
          console.error("Error fetching session data:", error);
        });
    }
  }, [sessionId]); 


  const modifiedFetchedSessionData = fetchedSessionData?.map(
    (sessions) => ({
      ...sessions
    })
  );
  

  return (
    <section className="light-blue w-full ">
      <div className="min-h-screen">
        <div className="flex text-lg items-center px-10 py-3.5 gap-5">
          <Link href="/admin/patient">
            <h3 className="font-medium">Patients List</h3>
          </Link>

          <div className="h-5 w-[2px] bg-black"></div>
          <h3>Patient Details</h3>
        </div>

        <div className="bg-white px-10 min-h-screen py-6">
          <div className="flex flex-row justify-between pb-5 border-b border-gray-600">
            <div className="flex flex-col gap-5 text-gray-500">
              <div className="flex flex-row gap-5 text-xl font-medium">
                <p>{patient.full_name}</p>
                <div className="w-[2px] h-7 bg-gray-500"></div>
                <p> {patient.age} </p>
              </div>
              <div className="flex flex-row gap-7 text-gray-500">
                <p>
                  Address :{" "}
                  <span className="font-medium"> {patient.address} </span>
                </p>
                <p className="flex flex-row">
                  Phone No. :{" "}
                  <span className="font-medium flex flex-row gap-2 items-center">
                    {" "}
                    {patient.contact_number}
                    <IoLogoWhatsapp
                      style={{ color: "#3F86AD", fontSize: "24px" }}
                      className="pl-1"
                    />{" "}
                    {patient.whatsapp}
                  </span>
                </p>
                <p className="blue">
                  Complaint :{" "}
                  <span className="font-medium"> {patient.name} </span>
                </p>
                <p className="flex flex-row gap-2 blue">
                  <Image src = {Files} width={25} height={20} alt="file" />{" "}
                  5 files
                </p>
              </div>
              <p>
                More Details :{" "}
                <span className=""> {patient.more_details} </span>
              </p>
            </div>

            <div>
              <button className="flex flex-row gap-3 w-36 py-2 items-center px-3 rounded-md bg-blue">
                <AiFillEdit style={{ color: "white" }} /> Edit Patient
              </button>
            </div>
          </div>

          {/* physiotherapy section  */}
          <div className="pt-5">
            <div className="flex justify-between pb-3">
              <div className="font-medium text-lg text-gray-500">
                Physiotherapy Session
              </div>
              <div>
                <button
                  className="flex flex-row gap-3 w-36 py-2 items-center px-3 rounded-md border-blue blue"
                  onClick={() => setShowNewDialog(true)}
                  disabled={patient.patient_progress === "in_progress"}
                >
                  <Image src="/clock.png" alt="clock" width={15} height={15} />{" "}
                  Start New
                </button>
              </div>
            </div>

            <div>
              <ActivityPage patient = {patient} />
            </div>

          </div>   
        </div>
      </div>

      {/* StartNew */}
      <Dialog
        visible={showNewDialog}
        onHide={onHideNew}
        contentStyle={{ padding: "0", borderRadius: "7px" }}
        modal
        dismissableMask={true}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        closable={false}
      >
        <NewForm onCloseDialog={onHideNew} patientDetails={patient} />
      </Dialog>

      {/* EditSession */}
      <Dialog
        visible={showEditDialog}
        onHide={onHideEdit}
        contentStyle={{ padding: "0", borderRadius: "5px" }}
        modal
        dismissableMask={true}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        closable={false}
      >
        <EditSession onCloseDialog={onHideEdit} patientDetails={patient} />
      </Dialog>
      
      {/* session log  */}
      <Dialog
        visible={showDialog}
        onHide={closeDialog}
        contentStyle={{ padding: "0", borderRadius: "5px" }}
        modal
        dismissableMask={true}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        closable={false}
      >
        <SessionLog 
          onCloseDialog = {closeDialog} 
          patient = {patient} 
          rowData={selectedRowData} 
        />
      </Dialog>
    </section>
  );
};

export default PatientDetail;
