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
import { Modal, Button } from "react-bootstrap";
import Image from "next/image";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

declare global {
  interface Window {
    appendHelcimPayIframe?: (
      checkoutToken: string,
      allowExit?: boolean
    ) => void;
  }
}

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
  const [microchipsList, setmicrochipLists] = useState<MicrochipOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const token = getLocalStorageItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMicrochip, setSelectedMicrochip] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${appUrl}microchip/lists`, {
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
      const response = await axios.delete(`${appUrl}microchip/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.statusCode === 200) {
        // Remove the deleted order from state
        setmicrochipLists((prevmicrochips) =>
          prevmicrochips.filter((microchips) => microchips.id !== id)
        );
        Swal.fire("Deleted!", "The Microchip has been deleted.", "success");
      } else {
        Swal.fire("Failed!", "Failed to delete the microchip.", "error");
      }
    } catch (error) {
      console.error("Error deleting data", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the microchip.",
        "error"
      );
    }
  };

  const filteredmicrochips = microchipsList.filter((microchip) =>
    microchip.microchip_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastmicrochips = currentPage * itemsPerPage;
  const indexOfFirstmicrochips = indexOfLastmicrochips - itemsPerPage;
  const currentmicrochips = filteredmicrochips.slice(
    indexOfFirstmicrochips,
    indexOfLastmicrochips
  );
  const handleBuyNow = async (selectedPlan: string, microchip: string) => {
    try {
      setIsLoading(true);
      const token = getLocalStorageItem("token");

      const res = await axios.post(
        `${appUrl}frontend/microchip/payment`,
        {
          microchip_id: microchip,
          selected_plan: selectedPlan,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.statusCode === 200) {
        setIsModalOpen(false);
        openHelcimModal(res.data.checkoutToken);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Payment initialization error", err);
      toast.error("Payment initialization failed");
    } finally {
      setIsLoading(false); // stop loading
    }
  };
  const openHelcimModal = (checkoutToken: string) => {
    if (!window.appendHelcimPayIframe) {
      toast.error("Payment service not loaded. Please refresh.");
      return;
    }
    window.appendHelcimPayIframe(checkoutToken, true);
  };

  const getPackageStyle = (type: string) => {
    switch (type?.toLowerCase()) {
      case "standard":
        return { background: "#d1fae5", color: "#065f46" }; // green light

      case "premium":
        return { background: "#fef3c7", color: "#92400e" }; // amber/gold-ish

      case "platinum":
        return { background: "#e0e7ff", color: "#3730a3" }; // premium bluish
      case "":
        return { background: "#f3f4f6", color: "#6b7280" }; // no package gray

      default:
        return { background: "#e5e7eb", color: "#374151" }; // gray default
    }
  };

  return (
    <CommonLayout>
      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="row mb-3">
            <div className="col-md-12">
              <h1 className="fs-4">Microchips Pets Lists</h1>
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
                    <div>
                      <Link href="/customer/microchip/create">
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
                        <th scope="col">Microchip number</th>
                        <th scope="col">Petkeeper's name </th>
                        <th scope="col">Pet's name </th>
                        <th scope="col">Package Type </th>
                        <th scope="col">Payment Status</th>
                        <th scope="col">Status </th>
                        <th scope="col">Purchase</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentmicrochips.map((microchips, index) => (
                        <tr key={index}>
                          <td>
                            <Image
                              src={`${appUrl}uploads/${microchips.photo}`}
                              quality={100}
                              width={100}
                              height={100}
                              alt={microchips.pet_name}
                              unoptimized
                            />
                          </td>
                          <td>{microchips.microchip_number}</td>
                          <td>{microchips.pet_keeper}</td>
                          <td>{microchips.pet_name}</td>

                          <td>
                            <span
                              style={{
                                padding: "4px 10px",
                                borderRadius: "6px",
                                fontWeight: "600",
                                ...getPackageStyle(microchips.package_type),
                              }}>
                              {microchips.package_type}
                            </span>
                          </td>
                          <td>
                            {microchips.payment_status === "paid" ? (
                              <span className="badge bg-success status_txt">
                                Paid
                              </span>
                            ) : (
                              <span className="badge bg-danger status_txt">
                                Un Paid
                              </span>
                            )}
                          </td>
                          <td>
                            {microchips.status === "active" ? (
                              <span className="badge bg-success status_txt">
                                Active
                              </span>
                            ) : (
                              <span className="badge bg-danger status_txt">
                                In Active
                              </span>
                            )}
                          </td>

                          <td>
                                                        {microchips.payment_status !== "paid" &&
                              microchips.status != "active" && (
                                <span
                                  onClick={() => {
                                    setSelectedMicrochip(
                                      microchips.microchip_number
                                    );
                                    setIsModalOpen(true);
                                  }}
                                  className="btn btn-icon">
                                  <button className="btn btn-primary">Buy Now</button>
                                </span>
                              )}
                          </td>
                          <td>

                            <Link
                              href={`/customer/microchip/edit/${microchips.id}`}
                              className="btn btn-icon btn-sm btn-info-transparent rounded-pill">
                              <i className="fa-regular fa-pen-to-square"></i>
                            </Link>
                            <Link
                              href="#"
                              onClick={() => deleteData(microchips.id)}
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
                    totalItems={filteredmicrochips.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </div>

          <Modal
            show={isModalOpen}
            onHide={() => setIsModalOpen(false)}
            centered
            size="xl"
            style={{ zIndex: 9999 }}>
            <Modal.Header closeButton>
              <Modal.Title>Select a Plan</Modal.Title>
            </Modal.Header>

            <Modal.Body>
              <div className="row mt-5 payment_card">
                {/* Lifetime Registration */}
                <div className="col-lg-6 mb-4">
                  <div className="packages-container">
                    <div className="package-container-title">
                      <h3>Lifetime Registration (One-Time Payment)</h3>
                    </div>

                    <div className="package-container-description">
                      <ul>
                        <li>Includes everything in Free +</li>
                        <li>Lost animal instant alerts (email/SMS)</li>
                        <li>Printable “FOUND” posters with QR</li>
                        <li>Vet / shelter notes</li>
                        <li>Ownership transfer history</li>
                        <li>Certificate of registration (PDF)</li>
                        <li>Priority lookup visibility</li>
                      </ul>
                    </div>

                    <div className="package-container-payment">
                      <h4 className="d-flex justify-content-center align-items-center payment-middle">
                        <span>$</span>49
                      </h4>
                    </div>

                    <div className="package-btn-container">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                          handleBuyNow("lifetime", selectedMicrochip)
                        }>
                        {isLoading ? "Purchasing..." : "Buy Now"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Annual Protection Plan */}
                <div className="col-lg-6 mb-4">
                  <div className="packages-container">
                    <div className="package-container-title">
                      <h3>Annual Protection Plan (Recurring Revenue)</h3>
                    </div>

                    <div className="package-container-description">
                      <ul>
                        <li>Includes everything above +</li>
                        <li>24/7 lost animal response workflow</li>
                        <li>SMS + WhatsApp alerts</li>
                        <li>WhatsApp lost/found report</li>
                        <li>Geo-alert radius</li>
                        <li>Theft / dispute timestamped records</li>
                        <li>Insurance-ready documentation</li>
                        <li>Multi-animal dashboard</li>
                        <li>Concierge ownership transfer</li>
                      </ul>
                    </div>

                    <div className="package-container-payment">
                      <h4 className="d-flex justify-content-center align-items-center payment-middle">
                        <span>$</span>19.99
                      </h4>
                    </div>

                    <div className="package-btn-container">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() =>
                          handleBuyNow("annual", selectedMicrochip)
                        }>
                        {isLoading ? "Purchasing..." : "Enable auto-renewal"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>

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
