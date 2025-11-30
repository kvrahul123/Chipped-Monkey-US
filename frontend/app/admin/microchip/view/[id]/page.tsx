"use client";
import CommonLayout from "../../../layouts/CommonLayouts";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
import { useParams } from "next/navigation";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

interface MicrochipOrder {
  id: number;
  microchip_number: string;
  user_id: string;
  pet_name: string;
  pet_keeper: string;
  phone_number: string;
  email: string;
  address: string;
  country: string;
  pet_status: string;
  payment_status: string | null;
  type: string;
  breed: string;
  sex: string;
  color: string;
  dob: string;
  medical_condition: string | null;
  markings: string;
  otp: string | null;
  is_claimed: string;
  photo: string;
  form_type: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function MicrochipOrdersPage() {
  const [microchipData, setMicrochipData] = useState<MicrochipOrder | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const token = getLocalStorageItem("token");
  const { id } = useParams();

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

        if (data && data.statusCode === 200) {
          const matchedItem = data.data.find(
            (item: MicrochipOrder) => item.microchip_number === id
          );

          if (matchedItem) {
            setMicrochipData(matchedItem);
          } else {
            toast.error("No microchip found with this number");
          }
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to fetch microchip details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <CommonLayout>
        <div className="app-content py-4 text-center">
          <h5>Loading microchip details...</h5>
        </div>
      </CommonLayout>
    );
  }

  // ✅ Action handler for Unregister / Unassign / Free
  const handleAction = async (actionType: string) => {
    if (!microchipData) return;

    try {
      const response = await fetch(
        `${appUrl}microchip/dashboard/update/${actionType}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            microchip_number: microchipData.microchip_number,
          }),
        }
      );

      const data = await response.json();

      if (data.statusCode === 200) {
          toast.success(`${actionType} successful`);
                setMicrochipData((prev) => {
        if (!prev) return prev;

        let updated = { ...prev };

        if (actionType === "unregister") {
          updated.status = "in_active"; // make inactive
        } else if (actionType === "unassign") {
          updated.user_id = "0"; // clear user_id
        } else if (actionType === "free") {
          updated.status = "free"; // or whatever your API sets
        }

        return updated;
      });
      } else {
        toast.error(data.message || `${actionType} failed`);
      }
    } catch (error) {
      console.error(`${actionType} failed`, error);
      toast.error(`Failed to ${actionType} microchip`);
    }
  };

  if (!microchipData) {
    return (
      <CommonLayout>
        <div className="app-content py-4 text-center">
          <h5>No microchip details found</h5>
        </div>
      </CommonLayout>
    );
  }

  return (
    <CommonLayout>
      <div className="app-content py-4">
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="mb-4">Microchip Order Details</h3>

            <div className="d-flex gap-2">
              <div className="d-flex gap-2">
                {/* Unregister Button */}
                <button
                  className="btn btn-danger btn-sm fw-semibold px-3"
                  onClick={() => handleAction("unregister")}
                  disabled={microchipData.status === "in_active"} // disable if inactive
                >
                  Unregister
                </button>

                {/* Unassign Button */}
                <button
                  className="btn btn-warning btn-sm fw-semibold px-3"
                  onClick={() => handleAction("unassign")}
                  disabled={
                    microchipData?.user_id == "0" || !microchipData?.user_id
                  } // disable if no user assigned
                >
                  Unassign
                </button>

                {/* Free Button */}
                <button
                  className="btn btn-success btn-sm fw-semibold px-3"
                  onClick={() => handleAction("free")}>
                  Free
                </button>
              </div>
            </div>
          </div>
          {/* Microchip & Pet Info */}
          <div className="card mb-3">
            <div className="card-header">Pet & Owner Details</div>
            <div className="card-body d-flex align-items-center">
              <div className="microchipDetails-view">
                {microchipData.photo && (
                  <img
                    src={`${appUrl}uploads/${microchipData.photo}`}
                    alt="Pet Image"
                    className="img-thumbnail me-3"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                    }}
                  />
                )}
                <p>
                  <strong>Chip Number:</strong> {microchipData.microchip_number}
                </p>
                <p>
                  <strong>Pet Name:</strong> {microchipData.pet_name}
                </p>
                <p>
                  <strong>Pet Keeper:</strong> {microchipData.pet_keeper}
                </p>
                <p>
                  <strong>Phone Number:</strong> {microchipData.phone_number}
                </p>
                <p>
                  <strong>Email:</strong> {microchipData.email}
                </p>
                <p>
                  <strong>Address:</strong> {microchipData.address}
                </p>
                <p>
                  <strong>Country:</strong> {microchipData.country}
                </p>
                <p>
                  <strong>Lost / Stolen:</strong>{" "}
                  {microchipData.pet_status == "not_lost_or_stolen"
                    ? "No"
                    : "Yes"}
                </p>
                <p>
                  <strong>Registered:</strong>{" "}
                  {microchipData.status === "active" ? "✔" : "❌"}
                </p>

                <p>
                  <strong>Implanted:</strong>{" "}
                  {microchipData.user_id && microchipData.user_id !== "0"
                    ? "✔"
                    : "❌"}
                </p>

                <p>
                  <strong>Assigned:</strong>{" "}
                  {new Date(microchipData.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Microchip Details */}
          <div className="card mb-3">
            <div className="card-header">Microchip Details</div>
            <div className="card-body">
              <p>
                <strong>Type:</strong> {microchipData.type}
              </p>
              <p>
                <strong>Breed:</strong> {microchipData.breed}
              </p>
              <p>
                <strong>Sex:</strong> {microchipData.sex}
              </p>
              <p>
                <strong>Color:</strong> {microchipData.color || "-"}
              </p>
              <p>
                <strong>Date of Birth:</strong> {microchipData.dob}
              </p>
              <p>
                <strong>Medical Condition:</strong>{" "}
                {microchipData.medical_condition || "-"}
              </p>
              <p>
                <strong>Markings:</strong> {microchipData.markings}
              </p>
              <p>
                <strong>Is Claimed:</strong> {microchipData.is_claimed}
              </p>
              <p>
                <strong>Status:</strong> {microchipData.status}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(microchipData.created_at).toLocaleString()}
              </p>
            </div>
          </div>

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
