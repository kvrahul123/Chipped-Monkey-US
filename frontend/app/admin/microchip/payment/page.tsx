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
import { verifyToken } from "../../common/api";
import html2canvas from "html2canvas";
import { renderToString } from "react-dom/server";
import { jsPDF } from "jspdf";
import InvoicePage from "./invoice/[orderID]/page";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

interface MicrochipOrder {
  id: number;
  order_id: string;
  user_id: number | null;
  microchip_count: number;
  date: string;
  status: "pending" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
}

export default function MicrochipOrdersPage() {
  const [userType, setUserType] = useState<string | null>(null);
  const [microchipsList, setmicrochipLists] = useState<MicrochipOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const token = getLocalStorageItem("token");

  useEffect(() => {
    const fetchUserType = async () => {
      const type = await verifyToken();
      if (type) {
        setUserType(type);
      }
    };

    fetchUserType();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${appUrl}microchip/payment/lists`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data && data.statusCode == 200) {
          setmicrochipLists(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);



  const filteredmicrochips = microchipsList.filter((microchip) =>
    microchip.order_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastmicrochips = currentPage * itemsPerPage;
  const indexOfFirstmicrochips = indexOfLastmicrochips - itemsPerPage;
  const currentmicrochips = filteredmicrochips.slice(
    indexOfFirstmicrochips,
    indexOfLastmicrochips
  );

const downloadInvoice = async (row: any) => {
  const token = getLocalStorageItem("token");

  // 1️⃣ Fetch invoice data FIRST
  const response = await fetch(`${appUrl}microchip/payment/invoice/${row.order_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!data || data.statusCode !== 200) {
    toast.error(data.message || "Failed to fetch invoice data");
    console.error("Invoice fetch failed");
    return;
  } 

  const invoiceData = data.data; // <-- proper invoice JSON

  // 2️⃣ Render the JSX with invoice data (no loading state)
  const invoiceHtmlString = renderToString(
    <InvoicePage invoice={invoiceData} />
  );

  const tempContainer = document.createElement("div");
  tempContainer.style.position = "absolute";
  tempContainer.style.top = "-9999px";
  tempContainer.style.width = "800px";
  tempContainer.innerHTML = invoiceHtmlString;
  document.body.appendChild(tempContainer);

  try {
    const canvas = await html2canvas(tempContainer, { scale: 2 });
    const imgData = canvas.toDataURL("image/jpeg", 1.0);

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${row.order_id}-invoice.pdf`);
  } catch (err) {
    console.error("PDF creation failed:", err);
  }

  document.body.removeChild(tempContainer);
};


  return (
    <CommonLayout>
      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="row mb-3">
            <div className="col-md-12">
              <h1 className="fs-4">Microchips Payment Lists</h1>
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
                        placeholder="Search Microchip..."
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
                        <th scope="col">User Name</th>
                        <th scope="col">User Email </th>
                        {/* <th scope="col">Microchip Number</th> */}
                        <th scope="col">Payment Type </th>
                        <th scope="col">Total Amount </th>
                        <th scope="col">Date</th>
                        <th scope="col">Package Type </th>
                        <th scope="col">Payment Status </th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentmicrochips.map((microchips, index) => (
                        <tr key={index}>
                          <td>{microchips.order_id}</td>
                          <td>{microchips.pet_keeper}</td>
                          <td>{microchips.pet_keeper_email}</td>
                          {/* <td>{microchips.microchip_id}</td> */}

                          <td>{microchips.payment_type}</td>
                           <td>${microchips.total_amount}</td>
                          <td>{microchips.date}</td>
                          <td>{microchips.package_type}</td>
                          <td style={{ fontSize: '18px' }}>
                            {microchips.payment_status === "paid" ? (
                              <span className="badge bg-success">Paid</span>
                            ) : (
                              <span className="badge bg-danger">Unpaid</span>
                            )}
                          </td>

                          <td>
                            {/* Download PDF Invoice */}
                            <button
                              onClick={() => downloadInvoice(microchips)}
                              className="btn btn-icon btn-sm btn-info-transparent rounded-pill"
                              title="Download Invoice">
                              <i className="fa-solid fa-download"></i>
                            </button>
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
                    totalItems={filteredmicrochips.length}
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
