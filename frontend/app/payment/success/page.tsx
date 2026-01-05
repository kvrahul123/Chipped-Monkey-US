"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CommonLayout from "@/app/frontend/layouts/CommonLayouts";
import Certificate from "@/app/common/certificate";
import html2canvas from "html2canvas";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
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

type PaymentType = "microchip" | "checkout";

/* ================= CLIENT CONTENT ================= */

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentType | null>(null);
  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const certificateRef = useRef<HTMLDivElement>(null);
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
          let data = res.data;
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

        setPaymentType(data.type); // 🔥 KEY LINE
                console.log("data.payment.contact`::" + JSON.stringify(data.payment));
        console.log("data.payment.contact"+JSON.stringify(data.payment.contact))
        setContact(data.payment.contact || null);

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

  /* ================= DOWNLOAD CERTIFICATE ================= */

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `Chipped-Monkey-Certificate-${payment?.orderId}.png`;
    link.click();
  };

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
            <h1 className="payment-failure-title">Payment Details Not Found</h1>
            <p className="payment-success-subtitle">{error}</p>
          </div>
        </div>
      </CommonLayout>
    );
  }

  const isPaid = payment.paymentStatus === "paid";
  const isMicrochip = paymentType === "microchip";

  /* ================= UI ================= */

  return (
    <CommonLayout>
      <div className="payment-success-container">
        <div className="payment-success-card">
          {!isPaid ? (
            <>
              <div className="payment-failure-icon">✕</div>
              <h1 className="payment-failure-title">Payment Failed</h1>
              <p className="payment-success-subtitle">
                Your payment could not be completed.
              </p>
            </>
          ) : (
            <>
              <div className="payment-success-icon">✓</div>
              <h1 className="payment-success-title">
                {isMicrochip
                  ? "Microchip Payment Successful"
                  : "Order Placed Successfully"}
              </h1>
              <p className="payment-success-subtitle">
                {isMicrochip
                  ? "Your microchip purchase has been completed successfully."
                  : "Your order has been placed successfully."}
              </p>
            </>
          )}

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
              <span>Amount Paid</span>
              <strong>$ {payment.amountPaid}</strong>
            </div>

            <div className="payment-row">
              <span>Status</span>
              <strong className="status-success">
                {payment.paymentStatus.toUpperCase()}
              </strong>
            </div>
          </div>

          {isPaid ? (
            <div className="flex gap-4 mt-6 d-flex">
              <button
                className="payment-success-button"
                onClick={() => (window.location.href = "/")}>
                Continue
              </button>

              {isMicrochip && (
                <button
                  onClick={downloadCertificate}
                  className="payment-success-button bg-green-600 hover:bg-green-700">
                  📄 Download Certificate
                </button>
              )}
            </div>
          ) : (
            <div className="payment-failure-actions">
              <button
                className="retry-button"
                 onClick={() => handleBuyNow(payment.product, contact?.microchip_number)}
                disabled={isLoading}>
                {isLoading ? "Processing..." : "Retry Payment"}
              </button>

              <button
                className="secondary-button"
                onClick={() => (window.location.href = "/support")}>
                Contact Support
              </button>
            </div>
          )}
        </div>

        {/* Hidden Certificate (ONLY MICROCHIP) */}
        {isMicrochip && (
          <div
            style={{ position: "absolute", left: "-9999px", top: "-9999px" }}>
            <div ref={certificateRef}>
              <Certificate contact={contact} />
            </div>
          </div>
        )}
      </div>
    </CommonLayout>
  );
}

/* ================= PAGE EXPORT ================= */

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <CommonLayout>
          <div className="payment-success-container">
            <p>Loading...</p>
          </div>
        </CommonLayout>
      }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
