"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CommonLayout from "@/app/frontend/layouts/CommonLayouts";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL
const authorizeUrl = process.env.NEXT_PUBLIC_AUTHORIZE_URL || "";
/* ================= TYPES ================= */

type PaymentDetails = {
  product: string;
  orderId: string;
  paymentMethod: string | null;
  amountPaid: string;
  paymentStatus: string;
};

/* ================= CLIENT UI ================= */

 

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
     const handleBuyNow = async (selectedPlan: string, microchip: string) => {
    try {
      const usertoken = getLocalStorageItem("token");
      setIsLoading(true); 
      const res = await axios.post(
        `${appUrl}frontend/microchip/payment`,
        {
          microchip_id: microchip,
          selected_plan: selectedPlan,
        },
        {
          headers: { Authorization: `Bearer ${usertoken}` },
        }
      );

      if (res.data.statusCode === 200) {
        let data=res.data;
        if (data.paymentToken) {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = authorizeUrl;

          const input = document.createElement("input");
          input.type = "hidden";
          input.name = "token";
          input.value = data.paymentToken;

          form.appendChild(input);
          document.body.appendChild(form);
          form.submit();
        } else {
          toast.info("Microchip created successfully.");
        }
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
  useEffect(() => {
    if (!token) {
      setError("No payment token provided.");
      setLoading(false);
      return;
    }



    const fetchPayment = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}frontend/microchip/payment-details`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ vendor_tx_code: token }),
          }
        );

        const data = await res.json();

        if (!res.ok || !data.payment) {
          throw new Error(data.message || "Payment not found");
        }
        setContact(data.payment.contact || null);
        console.log("data.payment.contact`::" + JSON.stringify(data.payment));
        console.log("data.payment.contact"+JSON.stringify(data.payment.contact))

        setPayment({
          product: data.payment.product,
          orderId: data.payment.orderId,
          paymentMethod: data.payment.paymentMethod,
          amountPaid: data.payment.amountPaid,
          paymentStatus: data.payment.paymentStatus,
        });
      } catch (err: any) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [token]);

  /* ================= STATES ================= */

  if (loading) {
    return (
      <CommonLayout>
        <div className="payment-success-container">
          <p>Loading payment details...</p>
        </div>
      </CommonLayout>
    );
  }

  if (error || !payment) {
    return (
      <CommonLayout>
        <div className="payment-success-container">
          <div className="payment-success-card">
            <div className="payment-failure-icon">✕</div>
            <h1 className="payment-failure-title">Payment Cancelled</h1>
            <p className="payment-success-subtitle">
              {error || "Unable to fetch payment details."}
            </p>
          </div>
        </div>
      </CommonLayout>
    );
  }

  /* ================= UI ================= */

  return (
    <CommonLayout>
      <div className="payment-success-container">
        <div className="payment-success-card">
          <div className="payment-failure-icon">✕</div>

          <h1 className="payment-failure-title">Payment Cancelled</h1>

          <p className="payment-success-subtitle">
            You cancelled the payment before completion.
          </p>

          <div className="payment-details-for-microchip">
            <div className="payment-row">
              <span>Product</span>
              <strong>{payment.product || "-"}</strong>
            </div>

            <div className="payment-row">
              <span>Order ID</span>
              <strong>{payment.orderId}</strong>
            </div>

            <div className="payment-row">
              <span>Payment Method</span>
              <strong>{payment.paymentMethod || "-"}</strong>
            </div>

            <div className="payment-row">
              <span>Amount</span>
              <strong>$ {payment.amountPaid}</strong>
            </div>

            <div className="payment-row">
              <span>Status</span>
              <strong className="status-failed">CANCELLED</strong>
            </div>
          </div>

          <div className="payment-failure-actions">
            <button
              className="retry-button"
              onClick={() => handleBuyNow(payment.product, contact?.microchip_number)}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Retry Payment"}
            </button>

            <button
              className="secondary-button"
              onClick={() => (window.location.href = "/")}
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}

/* ================= PAGE EXPORT ================= */

export default function PaymentCancelPage() {
  return (
    <Suspense
      fallback={
        <CommonLayout>
          <div className="payment-success-container">
            <p>Loading...</p>
          </div>
        </CommonLayout>
      }
    >
      <PaymentCancelContent />
    </Suspense>
  );
}
