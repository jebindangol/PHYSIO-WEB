import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRouter } from "next/router";
import Link from "next/link";
import { HiPlus } from "react-icons/hi2";
import Swal from "sweetalert2";
import { getAllServices, deleteServices } from "../../../services/apiContract";
import { FaEdit } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";

const Service = () => {
    const [services, setServices] = useState([""]);
    const router = useRouter();
    useEffect(() => {
        getAllServices()
        .then((res) => {
            console.log("Received data for category :", res.data);
            setServices(res.data);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    const handleDiscardClick = (id) => {
        Swal.fire({
        title: "Are you sure?",
        text: "You are about to delete this service .",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        }).then((result) => {
        if (result.isConfirmed) {
            // User confirmed, proceed with deletion
            deleteServices(id)
            .then(() => {
                // After successfully deleting the category, update the categorys state
                setServices((prevServices) =>
                prevServices.filter((service) => service.id !== id)
                );
                Swal.fire("Deleted!", "The services has been deleted.", "success");
            })
            .catch((error) => {
                console.error("Error deleting services:", error);
                // Handle error
                Swal.fire(
                "Error!",
                "An error occurred while deleting the services.",
                "error"
                );
            });
        }
        });
    };
    const handleEditClick = (id) => {
        console.log(id, "clicked id is");

        router.push({
        pathname: "/admin/services/newService",
        query: { id },
        });
    };

    return (
        <section className="bg-tableColor w-full ">
        <div className="flex justify-between bg-white px-10 py-2">
            <div className="flex flex-row gap-10 items-center">
            <h3 className="font-bold">Services</h3>
            <button className="bg-blue-900 px-4 py-2 rounded-md text-white">
                <Link
                href="./newService"
                className="flex flex-row items-center gap-2 px-2 font-semibold"
                >
                <HiPlus fontSize={28} />
                Create New
                </Link>
            </button>
            </div>
        </div>
        <TableComponent
            services={services}
            handleDiscardClick={handleDiscardClick}
            handleEditClick={handleEditClick}
        />
        </section>
    );
    };

    const TableComponent = ({
    services,
    handleDiscardClick,
    handleEditClick,
    }) => {
    
    const nameBodyTemplate = (service) => {
        return <span className="py-5 ">{service.sub_title}</span>;
    };
    const categoryBodyTemplate = (service) => {
        return <span className="py-5 ">{service.name}</span>;
    };

    const editAndDiscardTemplate = (rowData) => {
        return (
        <div className="flex flex-row gap-5">
            <button
            onClick={() => handleEditClick(rowData.id)}
            >
                <FaEdit className="text-2xl" />
            </button>
            <div className="w-[2px] h-8 bg-gray-500"></div>
            <button
            onClick={() => handleDiscardClick(rowData.id)}
            >
                <FaTrashAlt className="text-2xl" />
            </button>
        </div>
        );
    };

    return (
        <div className="p-10 h-screen">
        <div className="card table-list">
            <DataTable
            value={services}
            showGridlines
            tableStyle={{ minWidth: "60rem" }}
            scrollable
            scrollHeight="67vh"
            >
            <Column
                field="sub_title"
                header="Service List"
                headerClassName="bg-green-100 px-5 py-3 table-align"
                bodyClassName="bg-white px-5 py-3"
                body={nameBodyTemplate}
            ></Column>
            <Column
                field="sub_description"
                header="Service Category"
                headerClassName="bg-green-100 py-3 pl-2 table-align"
                bodyClassName="bg-white py-3 pl-2"
                body={categoryBodyTemplate}
            ></Column>
            <Column
                field="action"
                header="Action"
                headerClassName="bg-green-100 py-3 flex justify-center"
                bodyClassName="bg-white flex justify-center py-3"
                body={editAndDiscardTemplate}
            ></Column>
            </DataTable> 
        </div>
        </div>
    );
};

export default Service;
