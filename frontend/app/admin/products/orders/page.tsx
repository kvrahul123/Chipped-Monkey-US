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

export default function ordersOrdersPage() {
  const [ordersList, setordersLists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const token = getLocalStorageItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${appUrl}products/orders/lists`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data && data.statusCode == 200) {
          setordersLists(data.data);
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
      const response = await axios.delete(`${appUrl}products/order/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.statusCode === 200) {
        // Remove the deleted order from state
        setordersLists((prevorders) =>
          prevorders.filter((orders) => orders.id !== id)
        );
        Swal.fire("Deleted!", "The orders has been deleted.", "success");
      } else {
        Swal.fire("Failed!", "Failed to delete the orders.", "error");
      }
    } catch (error) {
      console.error("Error deleting data", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the orders.",
        "error"
      );
    }
  };

  const filteredorders = ordersList.filter((orders) =>
    orders.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastorders = currentPage * itemsPerPage;
  const indexOfFirstorders = indexOfLastorders - itemsPerPage;
  const currentorders = filteredorders.slice(
    indexOfFirstorders,
    indexOfLastorders
  );

  return (
    <CommonLayout>
      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="row mb-3">
            <div className="col-md-12">
              <h1 className="fs-4">Product Orders Lists</h1>
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
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="page-table-container w-100 ">
                  <table className="table text-nowrap">
                    <thead className="table-primary">
                      <tr>
                        <th scope="col">Order ID</th>
                        <th scope="col">Customer Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Phone</th>
                        <th scope="col">Date</th>
                        <th scope="col">Total Amount</th>
                        <th scope="col">Payment Type</th>
                        <th scope="col">Payment Status</th>
                        <th scope="col">Status </th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentorders.map((orders, index) => (
                        <tr key={index}>
                          <td>{orders.order_id}</td>
                          <td>{orders.name}</td>
                          <td>{orders.email}</td>
                          <td>{orders.phone_number}</td>
                          <td>{orders.date}</td>
                          <td>{orders.total_amount}</td>
                          <td>{orders.payment_type}</td>
                          <td  className="table_badge">
                            {orders.payment_status === "paid" ? (
                              <span className="badge bg-success">Paid</span>
                            ) : (
                              <span className="badge bg-danger">Unpaid</span>
                            )}
                          </td>

                          <td className="table_badge">
                            {orders.status === "delivered" ? (
                              <span className="badge bg-success">Delivered</span>
                            ) : (
                              <span className="badge bg-warning">Ordered</span>
                            )}
                          </td>

                          <td>
                            <Link
                              href={`/admin/products/orders/details/${orders.id}`}
                              className="btn btn-icon btn-sm btn-info-transparent rounded-pill">
                              <i className="fa-regular fa-pen-to-square"></i>
                            </Link>
                            <Link
                              href="#"
                              onClick={() => deleteData(orders.id)}
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
                    totalItems={filteredorders.length}
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
