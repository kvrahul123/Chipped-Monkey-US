"use client";

import React, { forwardRef } from "react";
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL

type CertificateProps = {
  contact: any; // You can type this properly later
};

const Certificate = forwardRef<HTMLDivElement, CertificateProps>(({ contact }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        width: "800px",
        height: "1050px",
        background: "#fff",
        padding: "40px",
        border: "3px solid #1C3B71",
        position: "relative",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* Inner Border */}
      <div
        style={{
          position: "absolute",
          inset: "10px",
          border: "1.5px solid #1C3B71",
          pointerEvents: "none",
        }}
      />

      {/* HEADER */}
      <div style={{ position: "relative", textAlign: "center" }}>
        <img
          src="/assets/images/logo-inside.png"
          alt="Chipped Monkey"
          style={{
            width: "230px",
            height: "110px",
            objectFit: "contain",
          }}
        />

        {/* QR */}
        <div style={{ position: "absolute", right: 0, top: 0 }}>
          <div style={{ width: 80, height: 80, background: "#000" }} />
          <p style={{ fontSize: 12, color: "#1C3B71", marginTop: 4 }}>
            Scan to Verify
          </p>
        </div>
      </div>

      {/* TITLE */}
      <h2
        style={{
          textAlign: "center",
          marginTop: "30px",
          fontSize: "32px",
          fontWeight: 800,
          color: "#1C3B71",
          letterSpacing: "0.8px",
        }}
      >
        CERTIFICATE OF REGISTRATION
      </h2>

      {/* MICROCHIP + ANIMAL DETAILS */}
      <div
        style={{
          display: "flex",
          position: "relative",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginTop: "50px",
        }}
      >
        {/* Microchip */}
        <div>
          <div style={{ fontSize: "24px", fontWeight: 800, color: "#1C3B71" }}>
            MICROCHIP NUMBER:
          </div>
          <div
            style={{
              fontSize: "38px",
              fontWeight: 900,
              color: "#1C3B71",
              letterSpacing: "1px",
            }}
          >
            {contact?.microchip_number || "N/A"}
          </div>
        </div>

        {/* Animal Details */}
        <div
          style={{
            width: "300px",
            position: "absolute",
            right: "0px",
            top: "2em",
          }}
        >
          <div
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#1C3B71",
              textTransform: "uppercase",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            Animal Details
          </div>

          <div>
            <div className="w-100" style={{ display: "flex", justifyContent: "end" }}>
              <img
                src={`${appUrl}uploads/${contact.photo}`}
                 crossOrigin="anonymous"
                alt="Animal"
                style={{
                  width: "95px",
                  height: "105px",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                columnGap: "12px",
                rowGap: "6px",
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              <div>
                <span style={{ fontWeight: 700, color: "#1C3B71" }}>
                  Registered Name:
                </span>
                <br />
                <span style={{ color: "#333" }}>{contact?.pet_name || "N/A"}</span>
                <br />
                <br />

                <span style={{ fontWeight: 700, color: "#1C3B71" }}>
                  DOB / Estimated Age
                </span>
                <br />
                <span style={{ color: "#333" }}>{contact?.dob || "N/A"}</span>
              </div>

              <div>
                <span style={{ fontWeight: 700, color: "#1C3B71" }}>Species</span>
                <br />
                <span style={{ color: "#333" }}>{contact?.type || "N/A"}</span>
                <br />
                <br />

                <span style={{ fontWeight: 700, color: "#1C3B71" }}>Sex:</span>
                <br />
                <span style={{ color: "#333" }}>{contact?.sex || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTRATION DETAILS */}
      <div style={{ marginTop: "45px" }}>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#1C3B71",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          Registration Details:
        </div>

        <div style={{ fontSize: 14, lineHeight: 1.7 }}>
          <span style={{ fontWeight: 700, color: "#1C3B71" }}>Certificate ID:</span>{" "}
          <span style={{ color: "#333" }}>{contact?.vendorTxCode || "N/A"}</span>
          <br />
          {/* <span style={{ fontWeight: 700, color: "#1C3B71" }}>CM-ID:</span>{" "}
          <span style={{ color: "#333" }}>{contact?.id || "N/A"}</span>
          <br /> */}
          {/* <span style={{ fontWeight: 700, color: "#1C3B71" }}>ChippedMonkey ID</span>
          <br /> */}
          <span style={{ fontWeight: 700, color: "#1C3B71" }}>Date of Registration:</span>{" "}
          <span style={{ color: "#333" }}>{contact?.created_at?.split("T")[0] || "N/A"}</span>
          <br />
          <span style={{ fontWeight: 700, color: "#1C3B71" }}>Registration Status:</span>
<span
  style={{
    display: "inline-block",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    backgroundColor:
      contact?.status === "active"
        ? "#E6F4EA"
        : contact?.status === "in_active"
        ? "#FDECEA"
        : "#EEE",
    color:
      contact?.status === "active"
        ? "#1E7E34"
        : contact?.status === "in_active"
        ? "#C0392B"
        : "#555",
  }}
>
  {contact?.status?.replace("_", " ") || "N/A"}
</span>
          <br />
          <span
            style={{
              fontWeight: 700,
              color: "#1C3B71",
              letterSpacing: "0.3px",
            }}
          >
            {contact?.selected_plan || ""}
          </span>
        </div>
      </div>

      {/* OWNER */}
      <div style={{ marginTop: "60px", textAlign: "center" }}>
        <div
          style={{
            fontSize: "16px",
            fontWeight: 700,
            color: "#1C3B71",
            textTransform: "uppercase",
            borderBottom: "1px solid #ddd",
            paddingBottom: "5px",
          }}
        >
          Owner & Issuer Details
        </div>

        <div style={{ marginTop: "15px", fontSize: 15, lineHeight: 1.8 }}>
          Registered Owner: {contact?.pet_keeper || "N/A"}
          <br />
          Contact Phone: {contact?.phone_number || "N/A"}
          <br />
          Contact Email: {contact?.email || "N/A"}
          <br />
          Issuing Monkey.com
        </div>

        <div style={{ marginTop: "30px" }}>
          <div
            style={{
              fontFamily: "cursive",
              fontSize: 32,
              color: "#1C3B71",
              borderBottom: "1px solid #000",
              display: "inline-block",
              padding: "0 30px",
            }}
          >
            {contact?.pet_keeper || "N/A"}
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              marginTop: 6,
              textTransform: "uppercase",
            }}
          >
            Registrar
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          marginTop: "60px",
          fontSize: 11,
          color: "#444",
          lineHeight: 1.4,
        }}
      >
        <b>VERIFICATION STATEMENT:</b>
        <br />
        This Certificate verifies that the above Microchip ID is officially
        and permanently recorded in ChippedMonkey.com database, providing 24/7
        lookup visibility compliant with AAHA standards for high-value
        identification.
      </div>
    </div>
  );
});

export default Certificate;
