"use client";
import CommonLayout from ".././../../layouts/CommonLayouts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaginationComponent from "@/app/common/PaginationComponent";
import Swal from "sweetalert2";
import axios from "axios";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
import { useParams } from "next/navigation";
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

export default function TransactionSummaryPage() {
  const token = getLocalStorageItem("token");
  const [searchTerm, setSearchTerm] = useState("");
  const [isMoneySent, setIsMoneySent] = useState(false);
  const [isMoneySending, setIsMoneySending] = useState(false);

  const [transactionDetails, setTransactionDetails] = useState<
    transaction_requestOrder[]
  >([]);
  const [month, setMonth] = useState("");
  const { id } = useParams();
  const [summary, setSummary] = useState<any>({});
  const [transactions, setTransactions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleSubmitTransaction = async () => {
    setIsMoneySending(true);
    if (!summary.reason || summary.reason.trim() === "") {
      setIsMoneySending(false)
      toast.error("Please enter a reason before submitting.");
      return;
    }
    // if (!summary.amount || Number(summary.amount) <= 0) {
    //   toast.error("Please enter a valid transfer amount.");
    //   return;
    // }

    Swal.fire({
      title: "Confirm Submission",
      text: `Are you sure you want to send £${summary.totalRevenue}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const payload = {
            transactionRequest_id: String(id),
            amount: Number(summary.totalRevenue),
            message: summary.reason,
            status: "Completed",
          };

          const response = await axios.post(
            `${appUrl}microchip_orders/create/transactionDetails`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.data?.statusCode === 201) {
            toast.success("Transaction created successfully!");
            setSummary((prev: any) => ({
              ...prev,
              reason: "",
            }));
            setIsMoneySent(true);
          } else {
            toast.error(
              response.data?.message || "Failed to create transaction"
            );
          }
          setIsMoneySending(false);
        } catch (error: any) {
          setIsMoneySending(false)
          console.error("Transaction creation failed:", error);
          toast.error(
            error.response?.data?.message || "Error submitting transaction"
          );
        }
      }
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${appUrl}microchip_orders/assigned/details/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (data && data.statusCode == 200) {
          setSummary(data.data && data.data[0] ? data.data[0] : []);
          setTransactionDetails(
            data.data && data.data[0] ? data.data[0].microchiDetails : []
          );
          setIsMoneySent(
            data.data && data.data[0] ? data.data[0].isMoneySent : false
          );
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const filteredtransaction_requests = transactionDetails.filter(
    (transaction_request) => transaction_request
  );

  const indexOfLasttransaction_requests = currentPage * itemsPerPage;
  const indexOfFirsttransaction_requests =
    indexOfLasttransaction_requests - itemsPerPage;
  const currenttransaction_requests = filteredtransaction_requests.slice(
    indexOfFirsttransaction_requests,
    indexOfLasttransaction_requests
  );

  return (
    <CommonLayout>
      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="row mb-3">
            <div className="col-md-12">
              <h1 className="fs-4">Transaction Summary</h1>
            </div>
          </div>
          {/* Summary Cards */}
          <div className="row mb-4">
            <div className="col-md-3 col-sm-6">
              <div className="page-dashboard-inner-cards bg-lightBlue text-center p-3">
                <h6>Total Microchips</h6>
                <h3>{summary.totalMicrochip || 0}</h3>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="page-dashboard-inner-cards bg-lightYellow text-center p-3">
                <h6>Registered Microchip</h6>
                <h3>{summary.registeredMicrochip || 0}</h3>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="page-dashboard-inner-cards bg-lightGreen text-center p-3">
                <h6>Pending Microchip</h6>
                <h3>{summary.pendingMicrochip || 0}</h3>
              </div>
            </div>
            <div className="col-md-3 col-sm-6">
              <div className="page-dashboard-inner-cards bg-pink text-center p-3">
                <h6>Total Revenue</h6>
                <h3>{summary.totalRevenue || 0}</h3>
              </div>
            </div>
          </div>
          {/* Transaction Info Section */}
          {summary && (
            <div className="row mb-4">
              <div className="col-md-12">
                <div className="card p-3 bg-white shadow-sm border-light">
                  <h5 className="mb-3">Transaction Details</h5>
                  <div className="row">
                    <div className="col-md-4 col-sm-6 mb-2">
                      <strong>Transaction ID:</strong>{" "}
                      {summary.trasactionId || "—"}
                    </div>
                    <div className="col-md-4 col-sm-6 mb-2">
                      <strong>Account Holder Name:</strong>{" "}
                      {summary.accountHolderName || "—"}
                    </div>
                    <div className="col-md-4 col-sm-6 mb-2">
                      <strong>Sort Code:</strong> {summary.sortCode || "—"}
                    </div>
                    <div className="col-md-4 col-sm-6 mb-2">
                      <strong>Bank Name:</strong> {summary.bankName || "—"}
                    </div>
                    <div className="col-md-4 col-sm-6 mb-2">
                      <strong>Request Amount:</strong> £
                      {summary.requestedAmount || 0}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* Add Reason and Transfer Amount Section */}
          <div className="row mb-4">
            <div className="col-md-12">
              <div className="card p-3 bg-white shadow-sm border-light">
                <h5 className="mb-3">Send Money Details</h5>

                {!isMoneySent ? (
                  summary.totalRevenue > 0 ? (
                    <div className="row g-3 align-items-center">
                      {/* Reason Field */}
                      <div className="col-md-6">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter reason to send money"
                          value={summary.reason || ""}
                          onChange={(e) =>
                            setSummary({ ...summary, reason: e.target.value })
                          }
                        />
                      </div>

                      {/* Transfer Amount Field */}
                      {/* <div className="col-md-4">
        <input
          type="number"
          className="form-control"
          placeholder="Enter transfer amount"
          value={summary.amount || ""}
          onChange={(e) => setSummary({ ...summary, amount: e.target.value })}
        />
      </div> */}

                      {/* Submit Button */}
                      <div className="col-md-2 text-end">
                        <button
                          className="btn btn-primary w-100"
                          onClick={handleSubmitTransaction}
                        disabled={isMoneySending}
                        >
                           {isMoneySending ? "Submitted" : "Submit"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>Revenue not generated</div>
                  )
                ) : (
                  <div className="alert alert-info" role="alert">
                    Money has already been sent for this transaction.
                  </div>
                )}
              </div>
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
                        <th scope="col">Date</th>
                        <th scope="col">Microchip Number</th>
                        <th scope="col">Used By</th>
                        {/* <th scope="col">Action</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {currenttransaction_requests.map(
                        (transaction_requests, index) => (
                          <tr key={index}>
                            <td>{transaction_requests.date}</td>
                            <td>{transaction_requests.microchip_number}</td>
                            <td>{transaction_requests.used_by}</td>
                            {/* <td>
                              <Link
                                href={`/admin/transaction/details/${transaction_requests.transaction_id}`}>
                                <div
                                  data-bs-toggle="modal"
                                  data-bs-target="#addOrderModal"
                                  className="btn btn-icon btn-sm btn-info-transparent rounded-pill">
                                  <i className="fa-regular fa-eye"></i>
                                </div>
                              </Link>
                            </td> */}
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
