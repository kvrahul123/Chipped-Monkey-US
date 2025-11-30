"use client";
import CommonLayout from "../../../../layouts/CommonLayouts";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
import { toast, ToastContainer } from "react-toastify";
import { useParams } from "next/navigation";
import jsPDF from "jspdf";
import axios from "axios";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function MicrochipOrdersPage() {
  const { id } = useParams();
  const [isSaving, setIsSaving] = useState(false);

  const [microchipDetails, setMicrochipDetails] = useState<any>(null);
  const token = getLocalStorageItem("token");
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [showAssignSection, setShowAssignSection] = useState(false);
  const [breeder, setBreeder] = useState({
    name: "",
    email: "",
    phone: "",
  });


const handleSaveBreeder = async () => {
  if (isSaving) return; // Prevent multiple clicks
  setIsSaving(true);

  try {
    if (!breeder.name || !breeder.email || !breeder.phone) {
      toast.error("Please fill all breeder details");
      setIsSaving(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(breeder.email)) {
      toast.error("Please enter a valid email address.");
      setIsSaving(false);
      return;
    }

    const phoneRegex = /^[0-9]{10,}$/;
    if (!phoneRegex.test(breeder.phone)) {
      toast.error("Please enter a valid phone number (at least 10 digits).");
      setIsSaving(false);
      return;
    }

    if (!selectedChips.length) {
      toast.error("No microchips selected");
      setIsSaving(false);
      return;
    }

    const payload = selectedChips.map((chipNumber) => ({
      microchip_number: chipNumber,
      breeder_name: breeder.name,
      breeder_email: breeder.email,
      breeder_phone: breeder.phone,
      status: "Active",
    }));

    const response = await axios.post(
      `${appUrl}microchip_orders/create/implantedMicrochip`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.statusCode === 201) {
      toast.success("Breeder details saved successfully!");
      fetchMicrochipDetails();
      setShowAssignSection(false);
    } else {
      toast.error(response.data.message || "Failed to save breeder");
    }
  } catch (error) {
    console.error("Error saving breeder details:", error);
    toast.error("Server error while saving breeder");
  } finally {
    // ✅ Always re-enable the button
    setIsSaving(false);
  }
};

  const allMicrochipsAssigned = () => {
  return microchipDetails?.assigned_chips?.every(
    (chip) => chip.breeder_name && chip.breeder_email && chip.breeder_phone
  );
};


  const handleDownloadPDF = () => {
    if (!microchipDetails) {
      toast.error("No data available to download");
      return;
    }

    const doc = new jsPDF();
    const logoUrl = "/assets/images/logo-inside.png";

    doc.addImage(logoUrl, "PNG", 15, 10, 40, 20);
    doc.setFontSize(16);
    doc.text("Implanter Address", 15, 45);

    doc.setFontSize(12);
    const address = microchipDetails.address || "No address available";
    const splitAddress = doc.splitTextToSize(address, 180);
    doc.text(splitAddress, 15, 60);

    doc.save(`Implanter_Address_${microchipDetails.order_id}.pdf`);
  };

      const fetchMicrochipDetails = async () => {
      try {
        const response = await fetch(`${appUrl}microchip_orders/views/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data && data.statusCode === 200) {
          setMicrochipDetails(data.data);
        } else {
          toast.error("Failed to load microchip details");
        }
      } catch (error) {
        console.error("Error fetching microchip details:", error);
        toast.error("Error fetching microchip details");
      }
    };
  useEffect(() => {

    fetchMicrochipDetails();
  }, [id]);

  return (
    <CommonLayout>
      <div className="app-content py-4">
        <div className="container-fluid h-100">
          {/* Page Header */}
          <div className="d-flex justify-content-between mb-3">
            <h1 className="fs-4 fw-semibold text-secondary mb-4">
              {showAssignSection
                ? "Implant Microchip"
                : "Microchip Implanter Assignment Dashboard"}
            </h1>

            {!showAssignSection && (
              <button
                className="btn btn-primary me-2"
                onClick={handleDownloadPDF}>
                <i className="bi bi-download me-1"></i> Download Address
              </button>
            )}
          </div>

          {/* ---- Assign Microchip Section ---- */}
          {showAssignSection ? (
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-semibold text-secondary">Assign Microchip</h5>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAssignSection(false)}>
                  ← Back
                </button>
              </div>

              <div className="row gy-3">
                <div className="col-md-4">
                  <label className="form-label fw-semibold">Breeder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={breeder.name}
                    onChange={(e) =>
                      setBreeder({ ...breeder, name: e.target.value })
                    }
                    placeholder="Enter breeder name"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={breeder.email}
                    onChange={(e) =>
                      setBreeder({ ...breeder, email: e.target.value })
                    }
                    placeholder="Enter email"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-semibold">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={breeder.phone}
                    onChange={(e) =>
                      setBreeder({ ...breeder, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="text-end mt-4">
                <button
                  disabled={isSaving}
                  className="btn btn-success px-4"
                  onClick={handleSaveBreeder}>
                    {isSaving ? "Saving..." : "Save"}

                </button>
              </div>
            </div>
          ) : (
            /* ---- Microchip Details Section ---- */
            <div className="row h-100">
              <div className="col-12">
                {/* Order Summary */}
                <div
                  className="card border-0 shadow-sm rounded-4 mb-4"
                  style={{
                    backgroundColor: "#fefefe",
                    border: "1px solid #f0f0f0",
                  }}>
                  <div
                    className="card-header bg-light border-bottom"
                    style={{ padding: "1rem 1.5rem" }}>
                    <h5 className="mb-0 fw-semibold text-secondary">
                      Order Summary
                    </h5>
                  </div>
                  <div className="card-body px-4 py-3">
                    {microchipDetails ? (
                      <div className="row gy-3">
                        <div className="col-md-3 col-6">
                          <small className="text-muted d-block">Order ID</small>
                          <span className="fw-semibold text-dark">
                            {microchipDetails.order_id}
                          </span>
                        </div>
                        <div className="col-md-3 col-6">
                          <small className="text-muted d-block">
                            Implanter Name
                          </small>
                          <span className="fw-semibold text-dark">
                            {microchipDetails.name || "-"}
                          </span>
                        </div>
                        <div className="col-md-3 col-6">
                          <small className="text-muted d-block">Phone</small>
                          <span className="fw-semibold text-dark">
                            {microchipDetails.phone
                              ? `+91 ${microchipDetails.phone}`
                              : "-"}
                          </span>
                        </div>
                        <div className="col-md-3 col-6">
                          <small className="text-muted d-block">Email</small>
                          <span className="fw-semibold text-dark">
                            {microchipDetails.email || "-"}
                          </span>
                        </div>
                        <div className="col-md-6">
                          <small className="text-muted d-block">Address</small>
                          <span className="fw-semibold text-dark">
                            {microchipDetails.address || "-"}
                          </span>
                        </div>
                        <div className="col-md-3 col-6">
                          <small className="text-muted d-block">
                            Chip Count
                          </small>
                          <span className="fw-semibold text-dark">
                            {microchipDetails.microchip_count || 0}
                          </span>
                        </div>
                        <div className="col-md-3 col-6">
                          <small className="text-muted d-block">
                            Order Date
                          </small>
                          <span className="fw-semibold text-dark">
                            {microchipDetails.date || "-"}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted mb-0">
                        Loading order details...
                      </p>
                    )}
                  </div>
                </div>

                {/* Microchip Details Table */}
                <div
                  className="card border-0 shadow-sm rounded-4"
                  style={{
                    backgroundColor: "#fefefe",
                    border: "1px solid #f0f0f0",
                  }}>
                  <div
                    className="card-header bg-light border-bottom"
                    style={{ padding: "1rem 1.5rem" }}>
                    <h5 className="mb-0 fw-semibold text-secondary">
                      Microchip Details
                    </h5>
                  </div>
                  <div className="card-body px-4 py-3">
                    {microchipDetails?.assigned_chips?.length ? (
                  <>
  <div className="table-responsive">
    <table className="table align-middle table-hover mb-0">
      <thead
        style={{
          backgroundColor: "#f8f9fa",
          borderBottom: "1px solid #e9ecef",
        }}>
        <tr>
          <th>
            {/* Show master checkbox only if at least one chip has no breeder */}
            {microchipDetails.assigned_chips.some(
              (chip: any) =>
                !chip.breeder_name && !chip.breeder_email && !chip.breeder_phone
            ) && (
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedChips(
                      microchipDetails.assigned_chips
                        .filter(
                          (chip: any) =>
                            !chip.breeder_name &&
                            !chip.breeder_email &&
                            !chip.breeder_phone
                        )
                        .map((chip: any) => chip.microchipID)
                    );
                  } else {
                    setSelectedChips([]);
                  }
                }}
                checked={
                  selectedChips.length > 0 &&
                  selectedChips.length ===
                    microchipDetails.assigned_chips.filter(
                      (chip: any) =>
                        !chip.breeder_name &&
                        !chip.breeder_email &&
                        !chip.breeder_phone
                    ).length
                }
              />
            )}
          </th>
          <th className="fw-semibold text-secondary small">
            Microchip Number
          </th>
          <th className="fw-semibold text-secondary small">Breeder Name</th>
          <th className="fw-semibold text-secondary small">Breeder Email</th>
          <th className="fw-semibold text-secondary small">Breeder Phone</th>
        </tr>
      </thead>
      <tbody>
        {microchipDetails.assigned_chips.map((chip: any, index: number) => {
          const hasBreeder =
            chip.breeder_name || chip.breeder_email || chip.breeder_phone;

          return (
            <tr key={index}>
              <td>
                {/* Hide checkbox if breeder details exist */}
                {!hasBreeder && (
                  <input
                    type="checkbox"
                    checked={selectedChips.includes(chip.microchipID)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedChips([...selectedChips, chip.microchipID]);
                      } else {
                        setSelectedChips(
                          selectedChips.filter(
                            (num) => num !== chip.microchipID
                          )
                        );
                      }
                    }}
                  />
                )}
              </td>
              <td className="fw-semibold text-dark">
                {chip.microchipNumber}
              </td>
              <td className="fw-semibold text-dark">
                {chip.breeder_name || "-"}
              </td>
              <td className="fw-semibold text-dark">
                {chip.breeder_email || "-"}
              </td>
              <td className="fw-semibold text-dark">
                {chip.breeder_phone || "-"}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>

  {/* Next Button */}
  <div className="text-end mt-4">
    <button
      type="button"
      className="btn btn-primary"
    disabled={allMicrochipsAssigned() || !selectedChips.length}
         onClick={() => {
      // Clear the breeder form
      setBreeder({ name: '', email: '', phone: '' });

      // Show the form section
      setShowAssignSection(true);
    }}>
      Next →
    </button>
  </div>
</>

                    ) : (
                      <p className="text-muted mb-0">
                        No microchip data available.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <ToastContainer
            position="top-right"
            autoClose={1500}
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
