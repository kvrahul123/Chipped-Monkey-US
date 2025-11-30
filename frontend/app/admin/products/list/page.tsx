"use client";
import CommonLayout from "../../layouts/CommonLayouts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaginationComponent from "@/app/common/PaginationComponent";
import Swal from "sweetalert2";
import axios from "axios";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
import Image from "next/image";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function productsOrdersPage() {
  const [productsList, setproductsLists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const token = getLocalStorageItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${appUrl}products/lists`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data && data.statusCode == 200) {
          setproductsLists(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const deleteData = async (id: number) => {
    try {
      // Show confirmation modal
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (!result.isConfirmed) return; // Exit if user cancels

      // Proceed with deletion
      const response = await axios.delete(`${appUrl}products/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.statusCode === 200) {
        // Remove the deleted order from state
        setproductsLists((prevproducts) =>
          prevproducts.filter((products) => products.id !== id)
        );
        Swal.fire("Deleted!", "The products has been deleted.", "success");
      } else {
        Swal.fire("Failed!", "Failed to delete the products.", "error");
      }
    } catch (error) {
      console.error("Error deleting data", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the products.",
        "error"
      );
    }
  };

  const filteredproducts = productsList.filter((products) =>
    products.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastproducts = currentPage * itemsPerPage;
  const indexOfFirstproducts = indexOfLastproducts - itemsPerPage;
  const currentproducts = filteredproducts.slice(indexOfFirstproducts, indexOfLastproducts);

  return (
    <CommonLayout>
      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="row mb-3">
            <div className="col-md-12">
              <h1 className="fs-4">Products Lists</h1>
            </div>
          </div>

          <div className="row h-100">
            <div className="col-md-12">
              <div className="card mb-4 h-100">
                <div className="card-header border-bottom border-light p-3 bg-white">
                  <div className="d-flex flex-wrap justify-content-between gap-3">
                    <div>
                      <input
                        type="text"
                        className="form-control ps-4"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                    <div>
                      <Link href="/admin/products/create">
                        <button className="btn btn-primary">
                          <i className="fa-regular fa-plus"></i> Add
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="page-table-container w-100 ">
                  <table className="table text-nowrap">
                    <thead className="table-primary">
                      <tr>
                        <th scope="col">Image</th>
                        <th scope="col">Product Name</th>
                        <th scope="col">Status </th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentproducts.map((products, index) => (
                        <tr key={index}>
                          <td>
                            <Image
                              src={`${appUrl}uploads/${products.image_file_name}`}
                              quality={100}
                              width={100}
                              height={100}
                              alt={products.pet_name}
                              unoptimized
                            />
                          </td>
                          <td>{products.title}</td>

                          <td className="table_badge">
                            {products.status === "active" ? (
                              <span className="badge bg-success">Active</span>
                            ) : (
                              <span className="badge bg-danger">Inactive</span>
                            )}
                          </td>

                          <td>
                            <Link
                              href={`/admin/products/edit/${products.id}`}
                              className="btn btn-icon btn-sm btn-info-transparent rounded-pill">
                              <i className="fa-regular fa-pen-to-square"></i>
                            </Link>
                            <Link
                              href="#"
                              onClick={() => deleteData(products.id)}
                              className="btn btn-soft-danger btn-icon btn-sm rounded-circle ms-2">
                              <i className="fa-solid fa-trash"></i>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Component */}
                <div className="mb-3 footer-paginator">
                  <PaginationComponent
                    currentPage={currentPage}
                    totalItems={filteredproducts.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </div>

          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
          />
        </div>
      </div>
    </CommonLayout>
  );
}
