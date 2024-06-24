import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRouter } from "next/router";
import Link from "next/link";
import { HiPlus } from "react-icons/hi2";
import Swal from "sweetalert2";
import { getAllUsers, deleteUsers, updateUsers } from "../../../services/apiContract";

const User = () => {
    const [users, setUsers] = useState([""]);
    useEffect(() => {
        getAllUsers()
        .then((res) => {
            console.log("Received data for users :", res.data);
            setUsers(res.data);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    const handleDiscardClick = (id) => {
        console.log(id,"user id")
        Swal.fire({
        title: "Are you sure?",
        text: "You are about to delete this category.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        }).then((result) => {
        if (result.isConfirmed) {
            // User confirmed, proceed with deletion
            deleteUsers(id)
            .then(() => {
                setUsers((prevUsers) =>
                prevUsers.filter((user) => user.id !== id)
                );
                Swal.fire("Deleted!", "The users has been deleted.", "success");
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error deleting users:", error);
                // Handle error
                Swal.fire(
                "Error!",
                "An error occurred while deleting the users.",
                "error"
                );
            });
        }
        });
    };
    
    return (
        <section className="bg-tableColor w-full ">
        <div className="flex justify-between bg-white px-10 py-2">
            <div className="flex flex-row gap-10 items-center">
            <h3 className="font-bold">Users</h3>
            <button className="bg-blue-900 px-4 py-2 rounded-md text-white">
                <Link
                href="./newUser"
                className="flex flex-row items-center gap-2 px-2 font-semibold"
                >
                <HiPlus fontSize={28} />
                Create New
                </Link>
            </button>
            </div>
        </div>
        {Array.isArray(users) && users.length > 0 && (
            <TableComponent
                users = {users}
                handleDiscardClick={handleDiscardClick}
            />
        )}
        </section>
    );
    };

const TableComponent = ({
    users,
    handleDiscardClick,
    }) => {
        
    const nameBodyTemplate = (user) => {
        return <span className="py-5 ">{user.given_name}</span>;
    };
    const lastBodyTemplate = (user) => {
        return <span className="py-5 ">{user.family_name}</span>;
    };
    const descriptionBodyTemplate = (user) => {
        return <span className="py-5 ">{user.app_metadata?.roles}</span>;
    };
    const emailBodyTemplate = (user) => {
        return <span className="py-5 ">{user.email}</span>;
    };
    const router = useRouter();
    const handleEditClick = (id) => {
        console.log(id, "clicked id is");
        router.push({
        pathname: "/admin/newUser",
        query: { id },
    });
};


    const editAndDiscardTemplate = (rowData) => {
        return (
        <div className="flex flex-row justify-center gap-2 p-4">
            <button
            className="bg-green-600 py-1 px-4 rounded-md text-white"
            onClick={() => handleEditClick(rowData.user_id)}
            >
            Edit
            </button>
            <button
            className="border border-red-500 py-1 px-4 rounded-md text-red-500"
            onClick={() => handleDiscardClick(rowData.user_id)}
            >
            Discard
            </button>
        </div>
        );
    };

    return (
        <div className="p-10 h-screen">
        <div className="table-list">
            <DataTable
            value={users}
            showGridlines
            tableStyle={{ minWidth: "60rem" }}
            scrollable
            scrollHeight="70vh"
            >
            <Column
                field="first_name"
                header="First Name"
                headerClassName="px-5 py-3"
                bodyClassName="bg-white px-5 py-3"
                body={nameBodyTemplate}
            ></Column>
            <Column
                field="last_name"
                header="Last Name"
                headerClassName="px-5 py-3"
                bodyClassName="bg-white px-5 py-3"
                body={lastBodyTemplate}
            ></Column>
            <Column
                field="roles"
                header="User Roles"
                headerClassName="px-5 py-3"
                bodyClassName="bg-white px-5 py-3"
                body={descriptionBodyTemplate}
            ></Column>
            <Column
                field="email"
                header="User Email"
                headerClassName="px-5 py-3"
                bodyClassName="bg-white px-5 py-3"
                body={emailBodyTemplate}
            ></Column>
            <Column
                field="action"
                header="Action"
                headerClassName="py-3"
                bodyClassName="bg-white text-center"
                body={editAndDiscardTemplate}
            ></Column>
            </DataTable> 
        </div>
        </div>
    );
};

export default User;
