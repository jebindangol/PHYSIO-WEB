import React, { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRouter } from "next/router";
import { BiSolidBinoculars } from "react-icons/bi";
import { FaRegHourglass } from "react-icons/fa6";
import { HiPlus } from "react-icons/hi2";
import Link from "next/link";

import {
  getAllAppointments,
  getNewAppointments,
  getProgressAppointments,
  getDoneAppointments,
  updateAppointments,
  getCancelledAppointments,
  updatePatients,
} from "../../../services/apiContract";
import Swal from "sweetalert2";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [activeButton, setActiveButton] = useState("all");
  const [newCount, setNewCount] = useState(0);
  useEffect(() => {
    fetchAllAppointments();
  }, []);

  useEffect(() => {
    computeNewCount(); // Compute the count of new patients whenever patient data changes
  }, [appointments]);

  const computeNewCount = () => {
    const count = appointments.filter((item) => item.progress === "new").length;
    setNewCount(count);
  };

  const fetchAllAppointments = () => {
    setActiveButton("all");
    getAllAppointments()
      .then((res) => {
        console.log(
          "Received data for appointments on appointments page:",
          res.data
        );
        setAppointments(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchNewAppointments = () => {
    setActiveButton("new");
    getNewAppointments()
      .then((res) => {
        console.log("Received data for new appointments:", res);
        setAppointments(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchProgressAppointments = () => {
    setActiveButton("progress");
    getProgressAppointments()
      .then((res) => {
        console.log("Received data for in progress appointments:", res);
        setAppointments(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchDoneAppointments = () => {
    setActiveButton("done");
    getDoneAppointments()
      .then((res) => {
        console.log("Received data for done appointments:", res);
        setAppointments(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchCancelledAppointments = () => {
    setActiveButton("cancelled");
    getCancelledAppointments()
      .then((res) => {
        console.log("Received data for Cancelled appointments:", res);
        setAppointments(Array.isArray(res.data) ? res.data : []);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleDiscardClick = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to discard this appointment.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, discard it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with discarding
        // Update the appointments state to remove the appointment with the specified id
        setAppointments((prevAppointments) =>
          prevAppointments.filter((appointment) => appointment.id !== id)
        );

        const updateProgress = {
          progress: "cancelled",
        };
        updateAppointments(updateProgress, id)
          .then(() => {
            Swal.fire(
              "Discarded!",
              "The appointment has been discarded.",
              "success"
            );
          })
          .catch((error) => {
            console.error("Error updating appointment progress:", error);
            Swal.fire(
              "Error!",
              "An error occurred while updating appointment progress.",
              "error"
            );
          });
      }
    });
  };

  return (
    <section className="bg-tableColor w-full">
      <div className="flex justify-between bg-white px-10 py-2">
        <div className="flex flex-row gap-3 items-center">
          <h3 className="font-bold">Appointments</h3>
          <button className="bg-green-500 px-4 py-1 rounded-md text-white">
            {newCount} New
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 ">
          <div className="flex flex-row items-center justify-center gap-2">
            <button
              className={`text-gray-600 ${
                activeButton === "all" ? "font-bold" : ""
              }`}
              onClick={fetchAllAppointments}
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
              onClick={fetchNewAppointments}
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
              onClick={fetchProgressAppointments}
            >
              Scheduled
            </button>
            <div className="h-5 w-[2px] bg-black"></div>
          </div>

          <div className="flex flex-row items-center justify-center gap-2">
            <button
              className={`text-gray-600 ${
                activeButton === "done" ? "font-bold" : ""
              }`}
              onClick={fetchDoneAppointments}
            >
              Fulfilled
            </button>
            <div className="h-5 w-[2px] bg-black"></div>
          </div>

          <div>
            <button
              className={`text-red-600 ${
                activeButton === "cancelled" ? "font-bold" : ""
              }`}
              onClick={fetchCancelledAppointments}
            >
              Cancelled
            </button>
          </div>
        </div>

        <button className="bg-blue-900 px-4 py-2 rounded-md text-white">
          <Link
            href="/admin/newappointment"
            className="flex flex-row items-center gap-2 px-2 font-semibold"
          >
            <HiPlus fontSize={28} />
            Create New
          </Link>
        </button>
      </div>
      {Array.isArray(appointments) && appointments.length >= 0 && (
        <TableComponent
          appointments={appointments}
          handleDiscardClick={handleDiscardClick}
        />
      )}
    </section>
  );
};

const TableComponent = ({ appointments, handleDiscardClick }) => {
  const formatTime = (time) => {
    if (!time) return ""; // Null check to handle undefined time
    const [hours, minutes] = time?.split(":");
    let formattedHours = parseInt(hours, 10);
    let amPm = "AM";
    if (formattedHours >= 12) {
      amPm = "PM";
      if (formattedHours > 12) {
        formattedHours -= 12;
      }
    }
    if (formattedHours === 0) {
      formattedHours = 12;
    }
    return `${formattedHours}:${minutes} ${amPm}`;
  };

  const nameBodyTemplate = (appointment) => {
    return <span className="py-5 ">{appointment.full_name}</span>;
  };
  const addressBodyTemplate = (appointment) => {
    return <span className="py-5 ">{appointment.address}</span>;
  };
  const complainBodyTemplate = (appointment) => {
    return <span className="py-5 ">{appointment.name}</span>;
  };
  const phoneBodyTemplate = (appointment) => {
    return <span className="py-5 ">{appointment.contact_number}</span>;
  };
  const appointmentDateBodyTemplate = (appointment) => {
    const datePart = appointment.appointment_date?.split("T")[0];
    return <span className="py-5">{datePart}</span>;
  };

  const timeBodyTemplate = (appointment) => {
    const formattedTime = formatTime(appointment.time);
    return <span className="py-5">{formattedTime}</span>;
  };

  const router = useRouter();

  const handleAddPatient = (id) => {
    // Show SweetAlert confirmation dialog
    Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to update this patient?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with update
        console.log(id);
        const updatedPatient = {
          is_patient: "true",
          progress: "patient",
        };

        updatePatients(updatedPatient, id)
          .then((response) => {
            console.log("Patient is true from appointments", response);
            Swal.fire("Updated!", "The patient has been updated.", "success");
            window.location.reload();
            getAllAppointments();
          })
          .catch((error) => {
            console.log("Error updating patients", error);
            Swal.fire("Error!", "Failed to update the patient.", "error");
          });
      }
    });
  };

  const handleDoneAppointment = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to mark this appointment as done.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, mark it as done!",
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, proceed with marking the appointment as done
        const updatedData = {
          progress: "done",
        };

        // Update the appointment status
        updateAppointments(updatedData, id)
          .then((response) => {
            console.log("Appointment updated successfully:", response);
            // Show success message
            Swal.fire(
              "Done!",
              "The appointment has been marked as done.",
              "success"
            ).then(() => {
              window.location.reload();
            });
          })
          .catch((error) => {
            console.error("Error updating appointment:", error);
            // Show error message
            Swal.fire(
              "Error!",
              "An error occurred while updating the appointment.",
              "error"
            );
          });
      }
    });
  };

  const handleViewClick = (id) => {
    // Navigate to the appointment detail page
    router.push({
      pathname: "/admin/apptdetail",
      query: { id },
    });
  };

  const viewTemplate = (id) => {
    return (
      <div
        onClick={() => handleViewClick(id)}
        className="flex flex-row gap-3 justify-center items-center cursor-pointer py-4"
      >
        <BiSolidBinoculars className="text-blue-800 text-lg" />
        <h1 className="font-semibold text-blue-800">View</h1>
      </div>
    );
  };

  const viewAndDoneTemplate = (id) => {
    return (
      <div className="flex flex-row gap-8 px-5 justify-center items-center py-4">
        <div
          onClick={() => handleViewClick(id)}
          className="py-1 gap-3 rounded-sm flex flex-row justify-center items-center cursor_pointer"
        >
          <FaRegHourglass className="text-blue-800" />
          <h1 className="text-blue-800 font-semibold cursor-pointer">View</h1>
        </div>
        <div className="h-[25px] w-[2px] bg-gray-400"></div>
        <button
          type="button"
          className="border border-green-800  px-5 py-1 rounded-sm text-green-800 cursor_pointer "
          onClick={() => handleDoneAppointment(id)}
        >
          Done
        </button>
      </div>
    );
  };

  const addAndDiscardTemplate = (id) => {
    return (
      <div className="flex flex-row gap-2 px-4 py-4">
        <button
          className="bg-green-600 py-1 px-2 rounded-md text-white"
          onClick={() => handleAddPatient(id)}
        >
          Add patient
        </button>
        <button
          className="border border-red-500 py-1 px-4 rounded-md text-red-500"
          onClick={() => handleDiscardClick(id)}
        >
          Discard
        </button>
      </div>
    );
  };

  const renderActionTemplate = (rowData) => {
    if (rowData.progress === "new") {
      return viewTemplate(rowData.id);
    } else if (rowData.progress === "in_progress") {
      return viewAndDoneTemplate(rowData.id);
    } else if (rowData.progress === "done") {
      return addAndDiscardTemplate(rowData.patient_id);
    } else {
      return <span className="text-red-400">Cancelled</span>;
    }
  };

  return (
    <div className="p-10 h-screen">
      <div className="card table-list">
        <DataTable
          value={appointments}
          showGridlines
          tableStyle={{ minWidth: "60rem" }}
          scrollable
          scrollHeight="70vh"
        >
          <Column
            field="full_name"
            header="Full Name"
            bodyClassName={(rowData) =>
              `${
                rowData.progress === "new" ? "bg-blue-50" : "bg-white"
              } px-5 py-2 font-semibold`
            }
            headerClassName="py-3 px-5 table-align"
            style={{ minWidth: "200px", maxWidth: "18vw" }}
            body={nameBodyTemplate}
          ></Column>
          <Column
            field="address"
            header="Address"
            body={addressBodyTemplate}
            headerClassName="px-5 table-align"
            bodyClassName={(rowData) =>
              `${rowData.progress === "new" ? "bg-blue-50" : "bg-white"} px-5`
            }
            style={{ minWidth: "150px", maxWidth: "18vw" }}
          ></Column>
          <Column
            field="name"
            header="Chief Complaint"
            style={{ minWidth: "150px", maxWidth: "18vw" }}
            headerClassName="py-3"
            bodyClassName={(rowData) =>
              `${
                rowData.progress === "new" ? "bg-blue-50" : "bg-white"
              } text-center`
            }
            body={complainBodyTemplate}
          ></Column>
          <Column
            field="contact_number"
            header="Phone No."
            style={{ minWidth: "90px", maxWidth: "18vw" }}
            body={phoneBodyTemplate}
            headerClassName="px-5 table-align"
            bodyClassName={(rowData) =>
              `${rowData.progress === "new" ? "bg-blue-50" : "bg-white"} px-5`
            }
          ></Column>
          <Column
            field="appointment_date"
            header="Appoint. Date"
            body={appointmentDateBodyTemplate}
            style={{ minWidth: "150px", maxWidth: "18vw" }}
            headerClassName="px-5 table-align"
            bodyClassName={(rowData) =>
              `${rowData.progress === "new" ? "bg-blue-50" : "bg-white"} px-5`
            }
          ></Column>
          <Column
            field="time"
            header="Time"
            body={timeBodyTemplate}
            style={{ minWidth: "120px", maxWidth: "18vw" }}
            headerClassName="px-5 table-align"
            bodyClassName={(rowData) =>
              `${rowData.progress === "new" ? "bg-blue-50" : "bg-white"} px-5`
            }
          ></Column>
          <Column
            field="status"
            header="Status"
            style={{ minWidth: "280px" }}
            headerClassName="w-full flex justify-center py-3"
            bodyClassName={(rowData) =>
              `${
                rowData.progress === "new" ? "bg-blue-50" : "bg-white"
              } text-center`
            }
            body={renderActionTemplate}
          ></Column>
        </DataTable>
      </div>
    </div>
  );
};

export default Appointment;
