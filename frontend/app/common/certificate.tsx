"use client";

import React, { useRef } from "react";
import html2canvas from "html2canvas";
import Image from "next/image";
import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";

export default function Certificate() {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    const canvas = await html2canvas(certificateRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "Chipped-Monkey-Certificate.png";
    link.click();
  };

  return (
    <div className="flex flex-col items-center bg-gray-600 py-10 min-h-screen">
      <button
        onClick={downloadCertificate}
        className="mb-8 px-6 py-3 bg-orange-500 text-white font-bold rounded-lg shadow-lg hover:bg-orange-600">
        Download Certificate (PNG)
      </button>

      {/* CERTIFICATE */}
      <div
        ref={certificateRef}
        style={{
          width: "800px",
          height: "1050px",
          background: "#fff",
          padding: "40px",
          border: "3px solid #1C3B71",
          position: "relative",
          fontFamily: "Arial, sans-serif",
          boxSizing: "border-box",
        }}>
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
          }}>
          CERTIFICATE OF REGISTRATION
        </h2>

        {/* MICROCHIP + ANIMAL DETAILS (KEY FIX) */}
        <div
          style={{
            display: "flex",
            position: "relative",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginTop: "50px",
          }}>
          {/* Microchip */}
          <div>
            <div
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#1C3B71",
              }}>
              MICROCHIP NUMBER:
            </div>
            <div
              style={{
                fontSize: "38px",
                fontWeight: 900,
                color: "#1C3B71",
                letterSpacing: "1px",
              }}>
              981 000000123456
            </div>
          </div>

          {/* Animal Details */}
          <div
            style={{
              width: "300px",
              position: "absolute",
              right: "0px",
              top: "2em",
            }}>
            <div
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#1C3B71",
                textTransform: "uppercase",
                marginBottom: "10px",
                textAlign: "center",
              }}>
              Animal Details
            </div>

            <div>
              <div className="w-100" style={{ display: "flex",justifyContent:'end' }}>
                <img
                  src="/assets/images/monkey-sample.webp"
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
                }}>
                <div>
                  <span style={{ fontWeight: 700, color: "#1C3B71" }}>
                    Registered Name:
                  </span>
                  <br />
                  <span style={{ color: "#333" }}>Pip</span>
                  <br />
                  <br />

                  <span style={{ fontWeight: 700, color: "#1C3B71" }}>
                    DOB / Estimated Age
                  </span>
                  <br />
                  <span style={{ color: "#333" }}>01/15/2023 (1.5 years)</span>
                </div>

                <div>
                  <span style={{ fontWeight: 700, color: "#1C3B71" }}>
                    Species
                  </span>
                  <br />
                  <span style={{ color: "#333" }}>Capacuh Monkey</span>
                  <br />
                  <br />

                  <span style={{ fontWeight: 700, color: "#1C3B71" }}>
                    Sex:
                  </span>
                  <br />
                  <span style={{ color: "#333" }}>
                    Small brown patch above left eye
                  </span>
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
            }}>
            Registration Details:
          </div>

          <div style={{ fontSize: 14, lineHeight: 1.7 }}>
            <span style={{ fontWeight: 700, color: "#1C3B71" }}>
              Certificate ID:
            </span>{" "}
            <span style={{ color: "#333" }}>CM-2024-0078</span>
            <br />
            <span style={{ fontWeight: 700, color: "#1C3B71" }}>
              CM-ID:
            </span>{" "}
            <span style={{ color: "#333" }}>54321</span>
            <br />
            <span style={{ fontWeight: 700, color: "#1C3B71" }}>
              ChippedMonkey ID
            </span>
            <br />
            <span style={{ fontWeight: 700, color: "#1C3B71" }}>
              Date of Registration:
            </span>{" "}
            <span style={{ color: "#333" }}>July 26, 2024</span>
            <br />
            <span style={{ fontWeight: 700, color: "#1C3B71" }}>
              Registration Status:
            </span>
            <br />
            <span
              style={{
                fontWeight: 700,
                color: "#1C3B71",
                letterSpacing: "0.3px",
              }}>
              LIFETIME PROTECTION PLAN
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
            }}>
            Owner & Issuer Details
          </div>

          <div style={{ marginTop: "15px", fontSize: 15, lineHeight: 1.8 }}>
            Registered Owner: Dr. Eleanor Vance
            <br />
            Contact Phone: +1 (555) 123-567
            <br />
            Contact Email: dr.vance@email.com
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
              }}>
              Eleanor Vance
            </div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                marginTop: 6,
                textTransform: "uppercase",
              }}>
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
          }}>
          <b>VERIFICATION STATEMENT:</b>
          <br />
          This Certificate verifies that the above Microchip ID is officially
          and permanently recorded in ChippedMonkey.com database, providing 24/7
          lookup visibility compliant with AAHA standards for high-value
          identification.
        </div>
      </div>
    </div>
  );
}
