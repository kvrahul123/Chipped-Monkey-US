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
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

interface transaction_requestOrder {
  id: number;
  order_id: string;
  user_id: number | null;
  transaction_request_count: number;
  date: string;
  status: "pending" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
}

export default function TransactionRequestPage() {
  const [transaction_requestsList, settransaction_requestLists] = useState<
    transaction_requestOrder[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const token = getLocalStorageItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${appUrl}transaction_request/lists`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data && data.statusCode == 200) {
          settransaction_requestLists(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);



  const filteredtransaction_requests = transaction_requestsList.filter(
    (transaction_request) =>
      transaction_request.account_holders_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const indexOfLasttransaction_requests = currentPage * itemsPerPage;
  const indexOfFirsttransaction_requests =
    indexOfLasttransaction_requests - itemsPerPage;
  const currenttransaction_requests = filteredtransaction_requests.slice(
    indexOfFirsttransaction_requests,
    indexOfLasttransaction_requests
  );

  const toggleFeatured = async (categoryId, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed"; // Toggle between "0" and "1"

    // Optimistically update the state before making the request
    settransaction_requestLists((prevLists) =>
      prevLists.map((transaction_requests) =>
        transaction_requests.id === categoryId
          ? { ...transaction_requests, status: newStatus }
          : transaction_requests
      )
    );

    try {
      const response = await fetch(
        `${appUrl}transaction_request/${categoryId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }), // Send the new status
        }
      );

      const data = await response.json();
      if (data && data.statusCode === 200) {
        toast.success(data.message);
      } else {
        // Revert state if the request fails
        settransaction_requestLists((prevLists) =>
          prevLists.map((transaction_requests) =>
            transaction_requests.id === categoryId
              ? { ...transaction_requests, status: currentStatus }
              : transaction_requests
          )
        );
        toast.error(data.message);
      }
    } catch (error) {
      // Revert state if there's an error
      settransaction_requestLists((prevLists) =>
        prevLists.map((transaction_requests) =>
          transaction_requests.id === categoryId
            ? { ...transaction_requests, status: currentStatus }
            : transaction_requests
        )
      );
      console.error("Failed to update product status", error);
      toast.error("Failed to update product status.");
    }
  };

  return (
    <CommonLayout>
      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="row mb-3">
            <div className="col-md-12">
              <h1 className="fs-4">Transaction Request Lists</h1>
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
                        <th scope="col">Transaction ID</th>
                        <th scope="col">Customer Name</th>
                        <th scope="col">Amount</th>
                        {/* <th scope="col">Sort Code</th>
                        <th scope="col">Account Number</th>
                        <th scope="col">Bank Name</th>
                        <th scope="col">Account Name</th> */}
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currenttransaction_requests.map(
                        (transaction_requests, index) => (
                          <tr key={index}>
                            <td>{transaction_requests.transaction_id}</td>
                            <td>{transaction_requests.user_name}</td>
                            <td>{transaction_requests.requested_amount}</td>
                            {/* <td>{transaction_requests.sort_code}</td>
                            <td>{transaction_requests.account_number}</td>
                            <td>{transaction_requests.bank_name}</td>
                            <td>{transaction_requests.account_holders_name}</td> */}
                            <td>
                              <Link href={`/admin/transaction/details/${transaction_requests.transaction_id}`}>
                              <div
                                data-bs-toggle="modal"
                                data-bs-target="#addOrderModal"
                                className="btn btn-icon btn-sm btn-info-transparent rounded-pill">
                                <i className="fa-regular fa-eye"></i>
                                </div>
                                </Link>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Component */}
                <div className="mb-3 footer-paginator">
                  <PaginationComponent
                    currentPage={currentPage}
                    totalItems={filteredtransaction_requests.length}
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
