"use client";
import { useState, useEffect } from "react";
import CommonLayout from "@/app/frontend/layouts/CommonLayouts";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
} from "@/app/common/LocalStorage";
import Loader from "@/app/loader/page";
const apiUrl = process.env.NEXT_PUBLIC_APP_URL;

const PaymentSuccess = () => {
  const searchParams = useSearchParams();

  const crypt = searchParams.get("crypt");
  const router = useRouter();
  const { orderID } = useParams();
  const [orderData, setOrderData] = useState<any>(null);
  const [paymentResponse, setPaymentResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const token = getLocalStorageItem("token");

  const fetchOrderDetails = async (orderID: string) => {
    try {
      const response = await fetch(
        `${apiUrl}frontend/microchip/payment/details`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            microchipID: orderID,
            crypt: crypt,
          }),
        }
      );

      removeLocalStorageItem("microchip_paymentDetails");
      if (!response.ok) throw new Error("Failed to fetch order details");
      const result = await response.json();
      let paymentResponse;
      try {
        // Make sure it exists and is a string before parsing
        if (result.data?.order?.payment_response) {
          paymentResponse = JSON.parse(
            result.data.order.payment_response
          )?.Status;
        } else {
          // fallback if undefined
          paymentResponse = "FAILED";
        }
      } catch (error) {
        console.error("Failed to parse payment_response:", error);
        paymentResponse = "FAILED";
      }

      setPaymentResponse(paymentResponse);

      if (!result.data || result.statusCode !== 200) {
        router.push("/");
        return;
      }

      setOrderData(result.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  useEffect(() => {
    if (orderID) fetchOrderDetails(orderID);
  }, [orderID]);

  if (loading) return <Loader />;

  // Extract dynamic data
  const order = orderData.order;
  const items = orderData.items;
  const packageDetails = orderData.packageDetails;

  const generatePDF = () => {
    const doc = new jsPDF();

    // HEADER
    const logo =

    doc.setFontSize(12);
    doc.text("Microchip Purchase Receipt", 105, 30, { align: "center" });
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);

    doc.text(`Microchip Number: ${order.microchip_number}`, 20, 50);
    doc.text(
      `Date: ${new Date(order.created_at).toLocaleDateString("en-GB")}`,
      20,
      57
    );
    doc.text(`Payment Method: ${order.payment_type}`, 20, 64);
    doc.text(`Amount Paid: £${packageDetails.price}`, 20, 71);

    doc.setFontSize(10);
    doc.text("Thank you for purchasing your microchip with us!", 20, 90);
    doc.text("CHIPPEDMONKEY LTD All rights reserved", 20, 97);

    doc.save(`Microchip_Receipt_${order.microchip_number}.pdf`);
  };

  return (
    <CommonLayout>
      <div className="paymentPage-body">
        {paymentResponse == "OK" ? (
          <div className="mpaymentPage-container">
            <div className="mpaymentPage-success">
              <h1 className="mpaymentPage-header-h1">Purchase Complete</h1>

              <main className="mpaymentPage-success-box">
                <i className="fas fa-check-circle mpaymentPage-success-icon"></i>

                <div className="mpaymentPage-message-section">
                  <h2 className="mpaymentPage-message-h2">
                    Microchip Successfully Purchased!
                  </h2>
                  <p className="mpaymentPage-message-p">
                    Your microchip payment was processed successfully. Your
                    order details are below.
                  </p>
                </div>

                <div className="mpaymentPage-summary-details-section">
                  <div className="mpaymentPage-detail-item">
                    <span>Microchip Number:</span>
                    <span>{order.microchip_number}</span>
                  </div>
                  <div className="mpaymentPage-detail-item">
                    <span>Date:</span>
                    <span>
                      {new Date(order.created_at).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                  <div className="mpaymentPage-detail-item">
                    <span>Payment Method:</span>
                    <span>{order.payment_type}</span>
                  </div>
                  <div className="mpaymentPage-detail-item mpaymentPage-detail-item-total">
                    <span>Total Paid:</span>
                    <span className="mpaymentPage-detail-value-total">
                      ${packageDetails.price}
                    </span>
                  </div>
                </div>

                <div className="mpaymentPage-btn-group">
                  <button
                    onClick={generatePDF}
                    className="mpaymentPage-btn-base mpaymentPage-btn-primary">
                    Download Receipt (PDF)
                  </button>
                </div>
              </main>
            </div>
          </div>
        ) : (
          <div className="mpaymentPage-container">
            <div className="mpaymentPage-failed">
              <h1 className="mpaymentPage-header-h1">Payment Failed</h1>

              <main className="mpaymentPage-error-box">
                <div className="mb-5">
                  <i className="fas fa-times-circle mpaymentPage-error-icon"></i>
                </div>

                <div className="mpaymentPage-message-section">
                  <h2 className="mpaymentPage-message-h2">Payment Failed</h2>
                  <p className="mpaymentPage-message-p">
                    We were unable to verify your payment. Please try again or
                    contact support.
                  </p>
                </div>

                <div className="mpaymentPage-btn-group">
                  <Link
                    href="/"
                    className="mpaymentPage-btn-base mpaymentPage-btn-primary">
                    Go Back Home
                  </Link>
                </div>
              </main>
            </div>
          </div>
        )}
      </div>
    </CommonLayout>
  );
};

export default PaymentSuccess;
