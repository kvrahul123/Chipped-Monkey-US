"use client";
import React from "react";
import { getLocalStorageItem } from "@/app/common/LocalStorage";

export default function InvoicePage({ invoice }: any) {
  if (!invoice) return null; // No loading — PDF renderer will never see this

  return (
    <div
      className="container"
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        margin: "0 auto",
        padding: "30px",
        color: "#333",
        width: "100%",
        maxWidth: "900px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          margin: "0",
          padding: "0",
          border: "1px solid #eee",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.05)",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <div style={{ padding: "30px" }}>
          <table
            width="100%"
            cellPadding="0"
            cellSpacing="0"
            style={{ borderCollapse: "collapse", marginBottom: "20px" }}
          >
            <tbody>
              <tr>
                <td
                  style={{
                    verticalAlign: "top",
                    textAlign: "left",
                    paddingBottom: "20px",
                  }}
                >
                  <img
                    src="/assets/images/logo-inside.png"
                    width="200"
                    height="100"
                    alt="Chipped Monkey Logo"
                    style={{ display: "block" }}
                  />
                </td>

                <td
                  style={{
                    verticalAlign: "top",
                    textAlign: "right",
                    paddingBottom: "20px",
                  }}
                >
                  <h2
                    style={{
                      color: "#333",
                      margin: "0",
                      fontSize: "24px",
                      textTransform: "uppercase",
                    }}
                  >
                    INVOICE
                  </h2>

                  <p style={{ margin: "5px 0 0 0", fontWeight: "bold" }}>
                    Invoice No:{" "}
                    <span style={{ fontWeight: "normal" }}>
                      INV-{invoice.orderId}
                    </span>
                  </p>

                  <p style={{ margin: "5px 0 0 0", fontWeight: "bold" }}>
                    Date:{" "}
                    <span style={{ fontWeight: "normal" }}>{invoice.date}</span>
                  </p>
                </td>
              </tr>
            </tbody>
          </table>

          {/* BILL TO */}
          <table
            width="100%"
            cellPadding="0"
            cellSpacing="0"
            style={{
              borderCollapse: "collapse",
              marginBottom: "30px",
              borderTop: "2px solid #213f77",
            }}
          >
            <tbody>
              <tr>
                <td style={{ verticalAlign: "top", width: "50%", paddingTop: "10px" }}>
                  <p
                    style={{
                      margin: "0 0 5px 0",
                      fontWeight: "bold",
                      color: "#555",
                      textTransform: "uppercase",
                      fontSize: "12px",
                    }}
                  >
                    Bill To:
                  </p>

                  <p style={{ margin: "0", fontWeight: "bold", fontSize: "16px" }}>
                    {invoice.customerName}
                  </p>

                  <p style={{ margin: "5px 0 0 0" }}>Email: {invoice.customerEmail}</p>
                  <p style={{ margin: "5px 0 0 0" }}>Phone: {invoice.customerPhone}</p>
                  <p style={{ margin: "5px 0 0 0" }}>{invoice.customerAddress}</p>
                </td>
              </tr>
            </tbody>
          </table>

          {/* ITEM TABLE */}
          <table
            width="100%"
            cellPadding="0"
            cellSpacing="0"
            style={{ borderCollapse: "collapse", marginBottom: "30px" }}
          >
            <thead style={{ backgroundColor: "#213f77", color: "white" }}>
              <tr>
                <th style={{ padding: "10px", textAlign: "left", border: "1px solid #213f77" }}>
                  Description
                </th>
                <th style={{ padding: "10px", textAlign: "center", border: "1px solid #213f77" }}>
                  Qty
                </th>
                <th style={{ padding: "10px", textAlign: "right", border: "1px solid #213f77" }}>
                  Unit Price
                </th>
                <th style={{ padding: "10px", textAlign: "right", border: "1px solid #213f77" }}>
                  Total
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                    borderLeft: "1px solid #eee",
                    borderRight: "1px solid #eee",
                  }}
                >
                  Microchip Order ({invoice.microchipNumber})
                  <br />
                  <span style={{ fontSize: "11px", color: "#777" }}>
                    Package Type: {invoice.packageType}
                  </span>
                </td>

                <td style={{ padding: "10px", textAlign: "center", borderBottom: "1px solid #eee" }}>
                  1
                </td>

                <td style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #eee" }}>
                  £ {invoice.amount}
                </td>

                <td style={{ padding: "10px", textAlign: "right", borderBottom: "1px solid #eee" }}>
                  £ {invoice.amount}
                </td>
              </tr>
            </tbody>
          </table>

          {/* TOTAL */}
          <table width="100%" cellPadding="0" cellSpacing="0" style={{ borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td style={{ width: "60%", verticalAlign: "top", paddingRight: "20px" }}>
                  <p
                    style={{
                      fontWeight: "bold",
                      marginTop: "0",
                      marginBottom: "10px",
                      textTransform: "uppercase",
                      fontSize: "12px",
                      color: "#555",
                    }}
                  >
                    Payment Information
                  </p>

                  <p style={{ margin: "0", fontSize: "13px" }}>
                    Payment Method: {invoice.paymentType}
                  </p>

                  <p style={{ margin: "5px 0 0 0", fontSize: "13px" }}>
                    Status:{" "}
                    <span
                      style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        backgroundColor:
                          invoice.paymentStatus === "paid" ? "#d4edda" : "#f8d7da",
                        color:
                          invoice.paymentStatus === "paid" ? "#155724" : "#721c24",
                        border: "1px solid",
                        borderColor:
                          invoice.paymentStatus === "paid" ? "#c3e6cb" : "#f5c6cb",
                      }}
                    >
                      {invoice.paymentStatus === "paid" ? "PAID" : "UNPAID"}
                    </span>
                  </p>
                </td>

                <td style={{ width: "40%", verticalAlign: "top", textAlign: "right" }}>
                  <table
                    width="100%"
                    cellPadding="0"
                    cellSpacing="0"
                    style={{ borderCollapse: "collapse", textAlign: "right" }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ padding: "5px", borderBottom: "1px solid #eee" }}>
                          Subtotal:
                        </td>
                        <td style={{ padding: "5px", borderBottom: "1px solid #eee", fontWeight: "bold" }}>
                          £ {invoice.amount}
                        </td>
                      </tr>

                      <tr style={{ backgroundColor: "#f7f7f7" }}>
                        <td
                          style={{
                            padding: "10px",
                            borderTop: "2px solid #333",
                            fontWeight: "bold",
                            fontSize: "16px",
                          }}
                        >
                          GRAND TOTAL:
                        </td>
                        <td
                          style={{
                            padding: "10px",
                            borderTop: "2px solid #333",
                            fontWeight: "bold",
                            fontSize: "16px",
                            color: "#213f77",
                          }}
                        >
                          £ {invoice.amount}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          <div
            style={{
              marginTop: "40px",
              borderTop: "1px solid #ddd",
              paddingTop: "20px",
              textAlign: "center",
            }}
          >
            <p style={{ margin: "0", fontSize: "12px", color: "#777" }}>
              Thank you for securing your pets with Chipped Monkey!
            </p>
            <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#999" }}>
              This invoice serves as proof of purchase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
