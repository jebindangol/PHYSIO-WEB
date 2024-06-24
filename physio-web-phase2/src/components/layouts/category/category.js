import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useRouter } from "next/router";
import Link from "next/link";
import { HiPlus } from "react-icons/hi2";
import Swal from "sweetalert2";
import { getCategory, deleteCategory } from "../../../services/apiContract";

const Category = () => {
  const [categories, setCategories] = useState([""]);
  const router = useRouter();
  useEffect(() => {
    getCategory()
      .then((res) => {
        console.log("Received data for category :", res.data);
        setCategories(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleDiscardClick = (id) => {
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
        deleteCategory(id)
          .then(() => {
            // After successfully deleting the category, update the categorys state
            setCategories((prevCategories) =>
              prevCategories.filter((category) => category.id !== id)
            );
            Swal.fire("Deleted!", "The category has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Error deleting category:", error);
            // Handle error
            Swal.fire(
              "Error!",
              "An error occurred while deleting the category.",
              "error"
            );
          });
      }
    });
  };
  const handleEditClick = (id) => {
    console.log(id, "clicked id is");

    router.push({
      pathname: "/admin/newcategory",
      query: { id },
    });
  };

  return (
    <section className="bg-tableColor w-full ">
      <div className="flex justify-between bg-white px-10 py-2">
        <div className="flex flex-row gap-10 items-center">
          <h3 className="font-bold">Categories</h3>
          <button className="bg-blue-900 px-4 py-2 rounded-md text-white">
            <Link
              href="/admin/newcategory"
              className="flex flex-row items-center gap-2 px-2 font-semibold"
            >
              <HiPlus fontSize={28} />
              Create New
            </Link>
          </button>
        </div>
      </div>
      <TableComponent
        categories={categories}
        handleDiscardClick={handleDiscardClick}
        handleEditClick={handleEditClick}
      />
    </section>
  );
};

const TableComponent = ({
  categories,
  handleDiscardClick,
  handleEditClick,
}) => {
  const idBodyTemplate = (category) => {
    return <span className="py-5 ">{category.id}</span>;
  };
  const nameBodyTemplate = (category) => {
    return <span className="py-5 ">{category.name}</span>;
  };
  const descriptionBodyTemplate = (category) => {
    return <span className="py-5 ">{category.description}</span>;
  };

  const editAndDiscardTemplate = (rowData) => {
    return (
      <div className="flex flex-row gap-2 px-4">
        <button
          className="bg-green-600 py-1 px-4 rounded-md text-white"
          onClick={() => handleEditClick(rowData.id)}
        >
          Edit
        </button>
        <button
          className="border border-red-500 py-1 px-4 rounded-md text-red-500"
          onClick={() => handleDiscardClick(rowData.id)}
        >
          Discard
        </button>
      </div>
    );
  };

  return (
    <div className="p-10 h-screen">
      <div className="card table-list">
        <DataTable
          value={categories}
          showGridlines
          tableStyle={{ minWidth: "60rem" }}
          scrollable
          scrollHeight="67vh"
        >
          <Column
            field="id"
            header="Category Id"
            headerClassName="bg-green-100 px-5"
            bodyClassName="bg-white px-5"
            body={idBodyTemplate}
          ></Column>
          <Column
            field="name"
            header="Category Name"
            headerClassName="bg-green-100 px-5 py-3"
            bodyClassName="bg-white px-5 py-3"
            body={nameBodyTemplate}
          ></Column>
          <Column
            field="description"
            header="Category Description"
            headerClassName="bg-green-100 px-5 py-3"
            bodyClassName="bg-white px-5 py-3"
            body={descriptionBodyTemplate}
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

export default Category;
