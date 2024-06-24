import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { BiSolidBinoculars } from "react-icons/bi";
import { IoSearchOutline } from "react-icons/io5";
import Link from "next/link";
import { HiPlus } from "react-icons/hi2";
import Image from "next/image";
import { Dialog } from "primereact/dialog";
import NewForm from "./newForm";
import {
  getAllPatient,
  getNewPatients,
  getProgressPatients,
  getDonePatient,
  createSessionLogById,
  updateSessionLog,
  updatePatients,
} from "../../../services/apiContract";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const PatientList = () => {
  const [searchText, setSearchText] = useState("");
  const [patient, setPatient] = useState([]);
  const [filteredPatient, setFilteredPatient] = useState(null);
  const [activeButton, setActiveButton] = useState("all");
  const [newPatientCount, setNewPatientCount] = useState(0);

  useEffect(() => {
    fetchAllPatients();
  }, []);
  useEffect(() => {
    computeNewPatientCount();
  }, [patient]);

  const computeNewPatientCount = () => {
    const count = patient.filter(
      (item) => item.patient_progress === "new"
    ).length;
    setNewPatientCount(count);
  };

  const fetchAllPatients = () => {
    setActiveButton("all");
    getAllPatient()
      .then((res) => {
        console.log("Received data for all patient :", res.data);
        setPatient(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchNewPatients = () => {
    setActiveButton("new");
    getNewPatients()
      .then((res) => {
        console.log("Received data for new patients:", res.data);
        setPatient(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchProgressPatients = () => {
    setActiveButton("progress");
    getProgressPatients()
      .then((res) => {
        console.log("Received data for in progress patients:", res.data);
        setPatient(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchDonePatients = () => {
    setActiveButton("done");
    getDonePatient()
      .then((res) => {
        console.log("Received data for done patients:", res.data);
        setPatient(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    filterPatientData();
  }, [searchText, patient]);

  const filterPatientData = () => {
    if (searchText.trim() === "") {
      setFilteredPatient(null);
    } else {
      const filteredData = patient.filter((patient) =>
        patient.full_name.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredPatient(filteredData);
    }
  };

  return (
    <section className="bg-tableColor w-full min-h-screen ">
      <div className="flex justify-between bg-white px-10 py-2">
        <div className="flex flex-row gap-3 items-center">
          <h3 className="font-bold">Patients List</h3>
          <button className="bg-green-500 px-4 py-1 rounded-md text-white">
            {newPatientCount} New
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 ">
          <div className="flex flex-row items-center justify-center gap-2">
            <button
              className={`text-gray-600 ${
                activeButton === "all" ? "font-bold" : ""
              }`}
              onClick={fetchAllPatients}
            >
              All
            </button>
            <div className="h-5 w-[2px] bg-black"></div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2">
            <button
              className={`text-gray-600 ${
                activeButton === "new" ? "font-bold" : ""
              }`}
              onClick={fetchNewPatients}
            >
              New
            </button>
            <div className="h-5 w-[2px] bg-black"></div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2">
            <button
              className={`text-gray-600 ${
                activeButton === "progress" ? "font-bold" : ""
              }`}
              onClick={fetchProgressPatients}
            >
              Running
            </button>
            <div className="h-5 w-[2px] bg-black"></div>
          </div>
          <div className="flex flex-row items-center justify-center gap-2">
            <button
              className={`text-gray-600 ${
                activeButton === "done" ? "font-bold" : ""
              }`}
              onClick={fetchDonePatients}
            >
              Completed
            </button>
          </div>
        </div>

        <button className="bg-blue-900 px-4 py-2 h-10 rounded-md text-white">
          <Link
            href="/admin/newpatient"
            className="flex flex-row items-center gap-2 px-2 font-semibold"
          >
            <HiPlus fontSize={28} />
            Create Patient
          </Link>
        </button>
      </div>

      <div className="px-10 py-5">
        <div className="relative flex flex-row">
          <input
            type="text"
            placeholder="Search patient"
            className="px-5 py-2 w-[450px] outline-none"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className="bg-white flex items-center justify-center px-5">
            <IoSearchOutline className="text-gray-400 text-lg font-bold" />
          </button>
        </div>
      </div>
      {Array.isArray(patient) && patient.length >= 0 && (
        <TableComponent patient={filteredPatient || patient} />
      )}
    </section>
  );
};

const TableComponent = ({ patient }) => {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [patientDetails, setPatientDetails] = useState({});

  const onHideNew = () => {
    setShowNewDialog(false);
  };

  const router = useRouter();

  const handleViewClick = (id) => {
    router.push({
      pathname: "/admin/patientDetail",
      query: { id },
    });
  };

  const handleAddToday = async (id) => {
    router.push({
      pathname: "/admin/patientDetail",
      query: { id }
    });
  };

  const handleFinishClick = async (id) => {
  
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to finish the patient progress?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, finish it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Update patient progress if confirmed
          await updatePatients({ patient_progress: "done" }, id);
          console.log("Patient progress updated to 'done' successfully!");
          router.push("/admin/patient");
        } catch (error) {
          console.error("Error updating patient progress:", error);
        }
      }
    });
  };

  const addTemplate = (id) => {
    return (
      <div className="flex flex-row gap-4 justify-center">
        <button
          className="bg-blue py-1 px-4 rounded-md text-white"
          onClick={() => handleAddToday(id)}
        >
          Add Today
        </button>
        <div className="w-[2px] h-8 bg-gray-500"></div>
        <div
          onClick={() => handleViewClick(id)}
          className="flex flex-row gap-3 justify-center items-center cursor-pointer"
        >
          <BiSolidBinoculars className="text-blue-800 text-lg" />
          <h1 className="font-semibold text-blue-800">View</h1>
        </div>
      </div>
    );
  };
  const finishTemplate = (id) => {
    return (
      <div className="flex flex-row gap-4 justify-center">
        <button
          className="bg-yellow py-1 px-5 rounded-md"
          onClick={() => handleFinishClick(id)}
        >
          Finish
        </button>
        <div className="w-[2px] h-8 bg-gray-500"></div>
        <div
          onClick={() => handleViewClick(id)}
          className="flex flex-row gap-2 justify-center items-center cursor-pointer"
        >
          <BiSolidBinoculars className="text-blue-800 text-lg" />
          <h1 className="font-semibold text-blue-800">View</h1>
        </div>
      </div>
    );
  };
  const viewTemplate = (id) => {
    return (
      <div
        onClick={() => handleViewClick(id)}
        className="flex flex-row gap-3 justify-center items-center cursor-pointer"
      >
        <BiSolidBinoculars className="text-blue-800 text-lg" />
        <h1 className="font-semibold text-blue-800">View</h1>
      </div>
    );
  };

  const handleTodayClick = (rowData) => {
    setPatientDetails(rowData);
    setShowNewDialog(true);
  };

  const addMore = (id) => {
    return (
      <div className="flex flex-row gap-4 justify-center">
        <div
          onClick={() => handleViewClick(id)}
          className="flex flex-row gap-3 justify-center items-center cursor-pointer"
        >
          <BiSolidBinoculars className="text-blue-800 text-lg" />
          <h1 className="font-semibold text-blue-800">View</h1>
        </div>
        <div className="w-[2px] h-8 bg-gray-500"></div>
        <button
          className="bg-green py-1 px-4 rounded-md text-white"
          onClick={() => handleTodayClick(id)}
        >
          Start New
        </button>
        
      </div>
    );
  }

  const renderActionTemplate = (rowData) => {
    const totalSessionsRequired = parseInt(rowData.sessions[0]?.total_session) || 0;
    const sessionLogsCount = rowData.session_logs ? rowData.session_logs.filter((session) => session.action === "done").length : 0;

    if (rowData.patient_progress === "new") {
        return viewTemplate(rowData.id);
    } else if (rowData.patient_progress === "in_progress" && sessionLogsCount === totalSessionsRequired) {
        return finishTemplate(rowData.id);
    } else if (rowData.patient_progress === "in_progress") {
        return addTemplate(rowData.id);
    } else if (rowData.patient_progress === "done") {
        return addMore(rowData.id)
    }
};


  const startBodytemplate = (rowData) => {
    const today =
      rowData.sessions && rowData.sessions.length > 0
        ? rowData.sessions[0]?.started_date?.split("T")[0]
        : null;

    return (
      <div>
        {!today ? (
          <button
            onClick={() => handleTodayClick(rowData)}
            className="bg-green rounded-md px-3 py-1"
          >
            Today
          </button>
        ) : (
          <span className="ml-2">{today}</span>
        )}
      </div>
    );
  };

  const sessionBodyTemplate = (patients) => {
    return (
      <span className="py-2 px-5 font-bold">
        {patients.sessions[0]?.total_session}
      </span>
    );
  };
  const completedBodyTemplate = (patients) => {
    return (
      <span className="py-2 px-5 font-bold">
        {" "}
        {patients.session_logs &&
        patients.session_logs.filter((session) => session.action === "done")
          .length > 0
          ? patients.session_logs.filter((session) => session.action === "done")
              .length
          : "0"}{" "}
      </span>
    );
  };
  const nameBodyTemplate = (patients) => {
    return <span className="py-5 ">{patients.full_name}</span>;
  };
  const complainBodyTemplate = (patients) => {
    return <span className="py-5 ">{patients.name}</span>;
  };

  return (
    <>
      <Dialog
        visible={showNewDialog}
        onHide={onHideNew}
        contentStyle={{ padding: "0", borderRadius: "7px" }}
        modal
        dismissableMask={true}
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        closable={false}
      >
        <NewForm onCloseDialog={onHideNew} patientDetails={patientDetails} />
      </Dialog>
      <div className="px-10 py-5 h-screen">
        <div className="table-list">
          <DataTable
            value={patient}
            showGridlines
            tableStyle={{ minWidth: "60rem" }}
            scrollable
            scrollHeight="67vh"
          >
            <Column
              field="full_name"
              header="Full Name"
              headerClassName="px-5 table-align"
              bodyClassName={(rowData) =>
                `${
                  rowData.progress === "new" ? "bg-blue-50" : "bg-white"
                } px-5 py-4`
              }
              style={{ minWidth: "200px", maxWidth: "18vw" }}
              body={nameBodyTemplate}
            ></Column>
            <Column
              field="name"
              header="Chief Complaint"
              headerClassName="py-5"
              bodyClassName={(rowData) =>
                `${
                  rowData.progress === "new" ? "bg-blue-50" : "bg-white"
                } text-center`
              }
              style={{ minWidth: "100px", maxWidth: "18vw" }}
              body={complainBodyTemplate}
            ></Column>
            <Column
              field="start_date"
              header="Start Date"
              headerClassName="px-5 py-5"
              bodyClassName={(rowData) =>
                `${
                  rowData.progress === "new" ? "bg-blue-50" : "bg-white"
                } text-center`
              }
              style={{ minWidth: "100px" }}
              body={startBodytemplate}
            ></Column>
            <Column
              field="session_required"
              header="Sessions Required"
              headerClassName="px-5"
              bodyClassName={(rowData) =>
                `${
                  rowData.progress === "new" ? "bg-blue-50" : "bg-white"
                } text-center font-bold`
              }
              style={{ minWidth: "110px", maxWidth: "110px" }}
              body={sessionBodyTemplate}
            ></Column>
            <Column
              field="sessions_completed"
              header="Sessions Completed"
              headerClassName="px-4"
              bodyClassName={(rowData) =>
                `${
                  rowData.progress === "new" ? "bg-blue-50" : "bg-white"
                } text-center font-bold`
              }
              style={{ minWidth: "120px", maxWidth: "120px" }}
              body={completedBodyTemplate}
            ></Column>
            <Column
              field="action"
              header="Action"
              headerClassName="py-5"
              bodyClassName={(rowData) =>
                `${
                  rowData.progress === "new" ? "bg-blue-50" : "bg-white"
                } text-center`
              }
              style={{ minWidth: "200px", maxWidth: "20vw" }}
              body={renderActionTemplate}
            ></Column>
          </DataTable>
        </div>
      </div>
    </>
  );
};
export default PatientList;
