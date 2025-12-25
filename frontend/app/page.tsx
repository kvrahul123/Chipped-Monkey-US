"use client";
import { useCallback, useEffect, useState } from "react";
import Slider from "react-slick";
import parse from "html-react-parser";
import Script from "next/script";
import "slick-carousel/slick/slick.css";
import { Html5Qrcode } from "html5-qrcode";
import "slick-carousel/slick/slick-theme.css";
import CommonLayout from "./frontend/layouts/CommonLayouts";
import Link from "next/link";
import Image from "next/image";
import { EncryptData } from "./common/HashData";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { toast, ToastContainer } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import { useRouter } from "next/navigation";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const secret = process.env.NEXT_PUBLIC_HASH_SECRET as string;

export default function Home() {

  const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How do I register a pet microchip with Chipped Monkey?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Visit ChippedMonkey.com and enter your pet’s microchip ID. Our national registry supports all brands, including HomeAgain, Avid, and AKC Reunite, providing lifetime protection."
      }
    },
    {
      "@type": "Question",
      "name": "Is Chipped Monkey part of the AAHA network?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, Chipped Monkey is a participant in the AAHA Universal Pet Microchip Lookup. This allows veterinarians and shelters nationwide to find owner information instantly."
      }
    },
    {
      "@type": "Question",
      "name": "Does Chipped Monkey work for all microchip brands?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we are a universal registry. We support all chip frequencies including 125kHz, 128kHz, and 134.2kHz ISO standards."
      }
    }
  ]
};
  
  const route = useRouter();
  const [microchipData, setMicrochipData] = useState<any>(null); // store fetched data

  const [openAAhaMicrochip, setopenAAhaMicrochip] = useState(false);
  const [checkedMicrochipData, setcheckedMicrochipData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataMessage, setMessage] = useState(false);
  const [IsRegistered, setIsRegistered] = useState(false);
  // Define all cards with their account type
  const [blogs, setBlogs] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${appUrl}frontend/blogs/list`)
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.data || []); // adjust key depending on your API response
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);

  const handleBuyNow = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to proceed with the purchase?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, buy now",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          "Purchased!",
          "Your order has been placed successfully.",
          "success"
        );
        // You can also trigger your purchase API or navigation here
      }
    });
  };

  const cards = [
    {
      id: "0",
      title: "Pet owner",
      description: "Easy to update your pets' information.",
      type: "pet_owner",
      icon: "/assets/images/icons12.png",
    },
    {
      id: "3",
      title: "Vet surgery",
      description:
        "24/7, all year round customer service to answer all your questions.",
      type: "vet",
      icon: "/assets/images/icons13.png",
    },
    {
      id: "2",
      title: "Breeder",
      description:
        "Your Dog and Cat Information will be verified frequently and stored securely.",
      type: "breeder",
      icon: "/assets/images/icons14.png",
    },
    {
      id: "4",
      title: "Warden",
      description:
        "Your Dog and Cat Information will be verified frequently and stored securely.",
      type: "warden",
      icon: "/assets/images/icons15.png",
    },
    // {
    //   id: "5",
    //   title: "Govt officials",
    //   description:
    //     "Your Dog and Cat Information will be verified frequently and stored securely.",
    //   type: "govt_officials",
    //   icon: "/assets/images/icons101.png",
    // },
  ];

  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [html5QrCode, setHtml5QrCode] = useState<Html5Qrcode | null>(null);
  const [scannedCode, setScannedCode] = useState("");

  const openScanner = (setFieldValue: string) => {
    setIsScannerOpen(true);

    setTimeout(() => {
      const qrCodeScanner = new Html5Qrcode("scanner-popup");
      setHtml5QrCode(qrCodeScanner);

      qrCodeScanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 250 },
          (decodedText) => {
            // Stop scanner after successful scan
            qrCodeScanner.stop().finally(() => {
              setIsScannerOpen(false);
            });

            // ✅ Update Formik field instantly
            setFieldValue("microchip_number", decodedText);

            // Optional: show toast or auto-submit
          },
          (errorMessage) => {
            console.warn("QR scan error:", errorMessage);
          }
        )
        .catch((err) => {
          console.error("Unable to start scanner", err);
          setIsScannerOpen(false);
        });
    }, 100);
  };

  const closeScanner = async () => {
    if (html5QrCode) {
      await html5QrCode.stop();
      setHtml5QrCode(null);
    }
    setIsScannerOpen(false);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };
  const toggleContent = useCallback(() => {
    const btnContent = document.querySelector("#moreContent");
    const btn = document.querySelector("#readMoreBtn");

    if (!btnContent || !btn) return;

    btnContent.classList.toggle("active");

    if (btnContent.classList.contains("active")) {
      btn.textContent = "Read Less";
    } else {
      btn.textContent = "Read More";
    }
  }, []);

  const initialValues = { microchip_number: "" };
  const initialValues2 = { microchip_number: "" };

  const validationSchema = Yup.object({
    microchip_number: Yup.string()
      .required("Microchip number is required")
      .test("microchip-format", function (value) {
        if (!value) return false;

        const len = value.length;

        // 1️⃣ 15-digit numeric (ISO FDX-B)
        if (/^\d+$/.test(value)) {
          if (len !== 15) {
            return this.createError({
              message:
                "The length appears to be incorrect. A microchip number is typically 15 digits long", //for this exact 15 digits only numbers
            });
          }
          return true;
        }

        // 2️⃣ 10-character alphanumeric (ISO format)
        if (/^\d{9}[A-Za-z0-9]$/.test(value)) {
          // <-- updated regex
          if (len !== 10) {
            return this.createError({
              message:
                "The length appears to be incorrect. An Alpha numeric microchip number is typically 10 digits long", // for this exact 9 digits numbers and one numeric
            });
          }
          return true;
        }

        // 3️⃣ AVID format (legacy / non-ISO)
        if (/^[A-Za-z]{4}(\d{5}|\d{9})$/.test(value)) {
          const count = value.replace(/\*/g, "").length;
          if (count < 9 || count > 13) {
            return this.createError({
              message:
                "The length appears to be incorrect. An AVID microchip number is typically 9/13 digits long", //for tis exact 4 alpha and 5 numeric or 4 alpha and 9 numeric
            });
          }
          return true;
        }
        // If none match
        return this.createError({
          message:
            "The length appears to be incorrect. A microchip number is typically 15 digits long",
        });
      }),
  });

  const validationSchema2 = Yup.object({
    microchip_number: Yup.string()
      .required("Microchip number is required")
      .test("microchip-format", function (value) {
        if (!value) return false;

        const len = value.length;

        // 1️⃣ 15-digit numeric (ISO FDX-B)
        if (/^\d+$/.test(value)) {
          if (len !== 15) {
            return this.createError({
              message:
                "The length appears to be incorrect. A microchip number is typically 15 digits long", //for this exact 15 digits only numbers
            });
          }
          return true;
        }

        // 2️⃣ 10-character alphanumeric (ISO format)
        if (/^\d{9}[A-Za-z0-9]$/.test(value)) {
          // <-- updated regex
          if (len !== 10) {
            return this.createError({
              message:
                "The length appears to be incorrect. An Alpha numeric microchip number is typically 10 digits long", // for this exact 9 digits numbers and one numeric
            });
          }
          return true;
        }

        // 3️⃣ AVID format (legacy / non-ISO)
        if (/^[A-Za-z]{4}(\d{5}|\d{9})$/.test(value)) {
          const count = value.replace(/\*/g, "").length;
          if (count < 9 || count > 13) {
            return this.createError({
              message:
                "The length appears to be incorrect. An AVID microchip number is typically 9/13 digits long", //for tis exact 4 alpha and 5 numeric or 4 alpha and 9 numeric
            });
          }
          return true;
        }
        // If none match
        return this.createError({
          message:
            "The length appears to be incorrect. A microchip number is typically 15 digits long",
        });
      }),
  });
  const [serverError, setServerError] = useState("");
  const [serverError2, setServerError2] = useState("");
  // Reusable function
  const fetchMicrochipDetails = async (
    values: typeof initialValues,
    setError: (msg: string) => void,
    formType: String
  ) => {
    try {
      setopenAAhaMicrochip(false);
      setIsRegistered(false);
      const response = await fetch(`${appUrl}frontend/microchip/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      const encryptedMicrochip = EncryptData(values.microchip_number, secret);
      if (data.statusCode === 200) {
        setMicrochipData({
          ...data.data.existingMicrochip,
          message: data.message,
          exists: data.exists,
          externalDatabase: data.externalDatabase,
        });

        setMessage(data.message);
        if (formType != "registerForm") {
          setIsModalOpen(true);
        } else {
          setIsRegistered(true);
        }
      } else {
        if (formType == "registerForm") {
          route.push(
            `/pet-owners/pet-microchip-registration?microchip=${encodeURIComponent(
              encryptedMicrochip
            )}`
          );
          return;
        }
        setcheckedMicrochipData(data.data);
        setopenAAhaMicrochip(true);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong!");
    }
  };

  // Updated handleSubmit
  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>
  ) => {
    setServerError(""); // reset error
    setServerError2("");
    try {
      await fetchMicrochipDetails(values, setServerError, "registerForm"); // <-- await here
    } finally {
      setSubmitting(false); // ensure button re-enables
    }
  };

  const handleSubmit2 = async (
    values: typeof initialValues2,
    { setSubmitting }: FormikHelpers<typeof initialValues2>
  ) => {
    setServerError2(""); // reset error
    setServerError("");
    try {
      await fetchMicrochipDetails(values, setServerError2, "detailsForm"); // <-- await here
    } finally {
      setSubmitting(false); // ensure button re-enables
    }
  };

  return (
    <div>
              <Script
    id="faq-schema"
    type="application/ld+json"
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(faqSchema),
    }}
  />
      <CommonLayout>
        <div className="banner-main-container">
          {/* Modal */}
          {/* Bootstrap Modal */}
          <Modal
            show={isModalOpen}
            onHide={() => setIsModalOpen(false)}
            centered
            style={{ zIndex: 9999 }}>
            <Modal.Header closeButton>
              <Modal.Title>Microchip Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Modal.Body>
                {microchipData ? (
                  microchipData.externalDatabase ? (
                    // External DB
                    <div>
                      <p>{microchipData.message}</p>
                    </div>
                  ) : microchipData.exists ? (
                    // Local DB data
                    <div>
                      <p>
                        <strong>Pet Name:</strong> {microchipData.pet_name}
                      </p>
                      <p>
                        <strong>Microchip Number:</strong>{" "}
                        {microchipData.microchip_number}
                      </p>
                      <p>
                        <strong>Pet Owner:</strong> {microchipData.pet_owner}
                      </p>
                      <p>
                        <strong>Phone:</strong> {microchipData.phone_number}
                      </p>
                      <p>
                        <strong>Email:</strong> {microchipData.email}
                      </p>
                      <p>
                        <strong>Address:</strong> {microchipData.address}
                      </p>
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
                        <strong>Color:</strong> {microchipData.color}
                      </p>
                      <p>
                        <strong>DOB:</strong> {microchipData.dob}
                      </p>
                      <p>
                        <strong>Markings:</strong> {microchipData.markings}
                      </p>
                      {microchipData.photo && (
                        <Image
                          src={`${appUrl}uploads/${microchipData.photo}`}
                          alt="Pet"
                          width={100}
                          height={100}
                          className="img-fluid rounded mt-2"
                        />
                      )}
                    </div>
                  ) : (
                    // Not found
                    <p>{microchipData.message || "Microchip not found."}</p>
                  )
                ) : null}
              </Modal.Body>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
          <div className="row">
            <div className="col-12 col-md-2">
              <div className="header-main-icon-container mobile-none">
                <span className="header-main-icon-1"></span>
                <span className="header-main-icon-2"></span>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="banner-heading-title">
                <h4>
                  The Smart Choice
                  <br /> for Your Pet's <b>Forever ID</b>
                </h4>
                                <span>Start Your Registration</span>
              </div>
              <div className="banner-heading-form-container">
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                  validateOnChange={false}
                  validateOnBlur={false}>
                  {({ isSubmitting, errors, setFieldValue }) => (
                    <div className="microchip-form-wrapper">
                      {IsRegistered && (
                        <div className="alert alert-success">
                          {microchipData?.message ??
                            "Microchip already registered"}
                        </div>
                      )}
                      {(serverError || Object.keys(errors).length > 0) && (
                        <div className="error-msg alert alert-danger mb-3">
                          {serverError || Object.values(errors).join(", ")}
                        </div>
                      )}
                      <Form className="banner-main-input d-flex">
                        <Field
                          type="text"
                          name="microchip_number"
                          placeholder="Enter the MicroChip number to get started"
                          className="banner-input-box"
                        />
                        {isScannerOpen && (
                          <div
                            style={{
                              position: "fixed",
                              top: 0,
                              left: 0,
                              width: "100vw",
                              height: "100vh",
                              backgroundColor: "rgba(0,0,0,0.7)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              zIndex: 9999,
                            }}>
                            <div
                              style={{
                                position: "relative",
                                background: "#fff",
                                padding: "20px",
                              }}>
                              <button
                                onClick={closeScanner}
                                style={{
                                  position: "absolute",
                                  top: 10,
                                  right: 10,
                                  background: "transparent",
                                  border: "none",
                                }}>
                                <i className="fas fa-times"></i>
                              </button>
                              <div
                                id="scanner-popup"
                                style={{ width: 300, height: 300 }}
                              />
                            </div>
                          </div>
                        )}

                        <div className="header-form-btn-container">
                          <button
                            type="submit"
                            className="btn-register2"
                            disabled={isSubmitting}>
                            {isSubmitting ? "Processing..." : "Register"}
                          </button>

                          <button
                            type="button"
                            className="btn-register"
                            onClick={() => openScanner(setFieldValue)}>
                            <i
                              className="fas fa-qrcode"
                              style={{ marginRight: "8px" }}></i>
                            Scan
                          </button>
                        </div>
                      </Form>
                    </div>
                  )}
                </Formik>

                <div className="banner-container-content">
                  <p className="index_hightlight banner-heading-title"><h4>Don't Just Love Your <b>Pet—Safeguard Them.</b></h4></p>
                  <p>
                    As a devoted pet owner, you take every step to ensure your
                    furry family member is happy and healthy. But what happens
                    if the unexpected occurs and they slip out? Collars can
                    break or fall off. That's where ChippedMonkey steps in,
                    offering the permanent, reliable identification your dog or
                    cat needs for a safe return home.
                  </p>
                  <p>
                    Our microchip is tiny—about the size of a grain of rice—but
                    it provides a lifetime of peace of mind. Implanted quickly
                    and safely by a veterinarian, it contains a unique,
                    non-repeating ID number that links directly to your contact
                    information in our secure national pet recovery database.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <Image
                src="/assets/images/banner_dog.png"
                alt="Banner Img"
                width="400"
                height="400"
                className="mobile-none"
              />
            </div>
          </div>

          <div className="row">
            <div className="banner-popular-container">
              <div className="banner-popular-title">
                <h4>Popular:</h4>
              </div>

              <div className="banner-popular-lists">
                <ul className="banner-popular-lists-ul">
                  <li className="banner-popular-title-li">
                    <div className="banner-popular-title-inner-li">
                      <Link href="/pet-owners/change-ownership">
                        Transfer Keepership
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </li>
                  <li className="banner-popular-title-li">
                    <div className="banner-popular-title-inner-li">
                      <Link href="/pet-owners/lost-found-pets">
                        Report Lost Pet
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </li>
                  <li className="banner-popular-title-li">
                    <div className="banner-popular-title-inner-li">
                      <Link href="/pet-owners/lost-found-pets">
                        Found A Lost Pet?
                        <i className="fa-solid fa-arrow-right"></i>
                      </Link>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="lookup-microchip-container h-100">
            <div className="lookup-microchip-title">
              <h1 className="text-white mb-3 mt-2">
                Chipped Monkey Lookup Tool
              </h1>
              <p>
                Easily search for a microchip across the Chipped Monkey Database
                and other major U.S. pet microchip registries, including those
                integrated with AAHA. Instantly access registration details to
                help reunite lost pets with their families.
              </p>
            </div>
            <div className="row justify-content-center">
              <div className="col-12 col-lg-8 lookup-search">
                <Formik
                  initialValues={initialValues2}
                  validationSchema={validationSchema2}
                  validateOnChange={false}
                  validateOnBlur={false}
                  onSubmit={handleSubmit2}>
                  {({ isSubmitting, errors }) => (
                    <div className="microchip-form-wrapper">
                      {(serverError2 || Object.keys(errors).length > 0) && (
                        <div
                          className="error-msg alert alert-danger mb-3"
                          dangerouslySetInnerHTML={{
                            __html:
                              serverError2 || Object.values(errors).join(", "),
                          }}></div>
                      )}
                      <Form className="d-flex lookup-search gap-2">
                        <Field
                          id="microchip_number"
                          name="microchip_number"
                          type="text"
                          className="form-control"
                          placeholder="MicroChip Number..."
                          aria-label="MicroChip Number"
                        />

                        <button
                          className="btn btn-success w-100 save_btn form-search"
                          type="submit"
                          disabled={isSubmitting}>
                          <span>Search</span>
                        </button>
                      </Form>
                    </div>
                  )}
                </Formik>
              </div>
              <div className="col-12">
                <p className="lookup-microchip-content">
                  Enter the microchip number to check any microchip database and
                  find out who holds the information.
                </p>
              </div>
            </div>
          </div>
        </div>

        {openAAhaMicrochip && (
          <div className="container">
            <div className="aaha-search-results">
              <div className="aaha-header">
                <div className="aaha-logo-container">
                  <span className="aaha-logo">AAHA</span>
                  <span className="aaha-text">AAHA Search results:</span>
                </div>
                <Link
                  href={`https://www.aaha.org/petmicrochiplookup?microchip_id=${checkedMicrochipData?.microchipNumber}`}
                  className="aaha-visit-link">
                  Visit AAHA &nbsp;→
                </Link>
              </div>

              <div className="microchip-info">
                <p className="microchip-title">
                  The Microchip is distributed or manufactured by:
                  {checkedMicrochipData?.isRegistered ||
                  checkedMicrochipData?.isDistributed
                    ? registeredWith
                    : ""}
                </p>
                <p className="microchip-subtitle">
                  This is most likely a microchip from one of the following:
                </p>

                <ul className="registry-list">
                  <li>Banfield (800-838-6738)</li>
                  <li>HomeAgain (888-466-3242)</li>
                  <li>Petstablished (855-684-3184 Ext.3)</li>
                  <li>Save This Life (855-777-CHIP or 855-777-2447)</li>
                  <li>SmartTag (866-603-6863)</li>
                </ul>
              </div>

              <Link
                href={`https://www.aaha.org/petmicrochiplookup?microchip_id=${checkedMicrochipData?.microchipNumber}`}
                className="visit-aaha-now-link">
                Visit AAHA now →
              </Link>
            </div>
          </div>
        )}

        {/* <div className="container">
          <div className="row bg-light-a p-4">
            <div className="col-lg-12 mb-3 pe-2 pe-lg-5">
              <h2 className="fs-3">Microchip numbers can appear in several formats:</h2>
              <div className="ps-0 mt-4 d-flex flexcol">
                <ul className="mb-3 list-icons-new2 pe-3 pe-lg-5">
                  <li>15-digit numeric (ISO Standard) - e.g. 900765678765678</li>
                  <li>
                    10-character alphanumeric - e.g. 122322321D
                  </li>
                  <li>AVID format (9–13 characters) — may include `*`, e.g. AVID*012*345*378</li>
                </ul>
              </div>
            </div>
          </div>
        </div> */}
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-4 mb-3">
              <Link href="/microchip-your-pet">
                <section className="text-center index-section-1">
                  <div className="text-center ">
                    <Image
                      src="/assets/images/icons8.png"
                      alt="Why Microchip your pet"
                      width={85}
                      height={85}
                      quality={100}
                    />
                  </div>
                  <h4 className="mb-2 mt-3">Why Microchip your Pet</h4>

                  <button className="btn btn-primary">Read More</button>
                </section>
              </Link>
            </div>

            <div className="col-12 col-md-4 mb-3">
              <Link href="/pet-owners/pet-microchip-registration">
                <section className="text-center index-section-1 ">
                  <div className="text-center">
                    <Image
                      src="/assets/images/icons9.png"
                      alt="Why Microchip your pet"
                      width={85}
                      height={85}
                      quality={100}
                    />
                  </div>
                  <h4 className="mb-2 mt-3">Registering the Microchip</h4>

                  <button className="btn btn-primary">Read More</button>
                </section>
              </Link>
            </div>

            <div className="col-12 col-md-4 mb-3">
              <Link href="/user-login/pet_owner">
                <section className="text-center index-section-1 ">
                  <div className="text-center">
                    <Image
                      src="/assets/images/icons10.png"
                      alt="Why Microchip your pet"
                      width={85}
                      height={85}
                      quality={100}
                    />
                  </div>
                  <h4 className="mb-2 mt-3">Keep the Information</h4>

                  <button className="btn btn-primary">Read More</button>
                </section>
              </Link>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row mt-5">
            <div className="col-lg-6 col-md-12 mb-5 why-choose-container">
              <h3 className="why-choose-title underline-title">
                Your Pet’s Safest Path Home, <b>Worldwide</b>
              </h3>

              <h1 className="why-choose-subtitle">
                Trusted International Pet Microchip Database – ChippedMonkey.com
              </h1>

              <p className="why-choose-intro">
                For over{" "}
                <strong className="cm-highlight-secondary">25 years</strong>,
                ChippedMonkey has been the trusted name in pet identification,
                helping reunite lost pets with their families across the USA,
                UK, Europe, and Australia. Your pet's microchip is their
                lifelong, unloseable ID, and our world-class, multi-country
                database is the essential link that ensures they are found and
                returned quickly, no matter where you are.
              </p>

              <section id="moreContent" className="why-choose-more">
                <h4 className="why-choose-heading">
                  A Quarter Century of Global Pet Safety
                </h4>

                <p className="why-choose-text">
                  When life takes you and your furry companion across borders—or
                  just around the corner—you need an identification system that
                  works everywhere. ChippedMonkey.com is built on 25+ years of
                  experience in the pet industry, providing a secure, compliant,
                  and internationally recognized database for pet owners in the
                  UK, USA, Australia, and throughout Europe.
                </p>

                <ul className="why-choose-list">
                  <li>
                    <strong className="cm-highlight-secondary">
                      Global Peace of Mind:
                    </strong>{" "}
                    Register once and your pet's ID is instantly accessible to
                    vets and shelters in four major international regions.
                  </li>
                  <li>
                    <strong className="cm-highlight-secondary">
                      Compliant & Current:
                    </strong>{" "}
                    We adhere to evolving laws, including the UK's compulsory
                    microchipping requirements, helping you avoid legal
                    penalties.
                  </li>
                  <li>
                    <strong className="cm-highlight-secondary">
                      Seamless Transfers:
                    </strong>{" "}
                    Effortlessly handle microchip keepershhip transfers when
                    rehoming, adopting, or selling a pet, ensuring the new
                    owner's details are instantly compliant.
                  </li>
                </ul>

                <h4 className="why-choose-heading">
                  Why Choose ChippedMonkey for Registration?
                </h4>

                <p className="why-choose-text">
                  Fast, Secure, and Trusted UK Pet Microchip Registration &
                  Global Updates ​Your pet is family. Their safety is our
                  singular focus. We combine cutting-edge security with a deeply
                  humanized approach, making the technical process of
                  registration simple and stress-free for you.
                </p>

                <div className="why-choose-cards">
                  <div className="why-choose-card">
                    <h5>Quick & Easy Online Registration</h5>
                    <p>
                      Register a new puppy, kitten, or update existing microchip
                      details through our simple, user-friendly online process —
                      completed in just minutes.
                    </p>
                  </div>

                  <div className="why-choose-card">
                    <h5>Trusted by Vets and Shelters Worldwide</h5>
                    <p>
                      Integrated with veterinary clinics, shelters, and rescue
                      centers globally, ensuring lost pets are identified
                      quickly and owners contacted without delay.
                    </p>
                  </div>

                  <div className="why-choose-card">
                    <h5>Secure & Private Data Handling</h5>
                    <p>
                      Your data is protected using advanced encryption and
                      secure protocols, safeguarding both your personal
                      information and your pet’s lifelong identification record.
                    </p>
                  </div>

                  <div className="why-choose-card">
                    <h5>Update Details Anytime, Anywhere</h5>
                    <p>
                      Update contact information 24/7 when you move, change
                      numbers, or travel internationally — accurate details
                      ensure faster reunions.
                    </p>
                  </div>

                  <div className="why-choose-card">
                    <h5>Dedicated USA & Global Support</h5>
                    <p>
                      Our knowledgeable support team assists with registration,
                      compliance, and keepership transfers via phone or email
                      whenever you need help.
                    </p>
                  </div>
                </div>

                <h4 className="why-choose-heading">
                  The Lifesaving Power of a Microchip
                </h4>

                <p className="why-choose-text">
                  Microchipping is Your Pet's Permanent, Unloseable ID
                  ​Microchipping your pet with a registered 15-digit
                  ISO-standard chip is the most reliable way to guarantee their
                  safety and aid in their return if they ever go missing.
                </p>

                <ul className="why-choose-list">
                  <li>
                    <strong>Permanent ID:</strong> Unlike collars or tags that
                    can fall off or become illegible, a microchip is a permanent
                    form of identification implanted safely under the skin
                    (often between the shoulder blades).
                  </li>
                  <li>
                    <strong>Proof of Ownership:</strong> A registered microchip
                    is indisputable proof of ownership, providing essential
                    support in cases of theft or dispute. ​Significantly Higher
                    Reunion Rates: Studies consistently show that microchipped
                    pets are significantly more likely to be reunited with their
                    owners compared to non-chipped animals.
                  </li>
                  <li>
                    <strong>Higher Reunion Rates:</strong> Microchipped pets are{" "}
                    significantly more likely to be returned home than those
                    without.
                  </li>
                </ul>

                <p className="why-choose-cta">
                  ​Join the thousands of pet owners across the USA, canada,
                  Europe, and Australia who trust ChippedMonkey.com to protect
                  their family. Your pet's safe return is just a few clicks
                  away.
                </p>
              </section>

              <button
                id="readMoreBtn"
                style={{ margin: "10px 0px" }}
                onClick={toggleContent}
                className="btn btn-primary read_more_btn">
                Read More
              </button>
            </div>

            <div className="col-lg-6 col-md-12">
              <div className="col-12 mb-3">
                <h3 className="index-head-3 ">Register Your Account Today</h3>
              </div>
              <div className="row">
                {cards.map((card) => {
                  const encoded = Buffer.from(card.id).toString("base64"); // dynamically encode account type
                  return (
                    <div key={card.type} className="col-6 col-md-6 mb-10">
                      <Link
                        href={{
                          pathname: "/user-register/register-pet-microchip",
                          query: { token: encoded }, // pass encoded token
                        }}>
                        <div className="d-flex flex-column">
                          <div>
                            <Image
                              src={card.icon}
                              width={65}
                              height={65}
                              alt={card.title}
                            />
                          </div>
                          <div className="index-section-2">
                            <h4>{card.title}</h4>
                            <p>{card.description}</p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row mt-5 lost-found-container">
            <div className="col-md-12">
              <div className="indexpagelost p-3 text-center">
                <p>
                  to discover the facts about something to discover the facts
                  about something.
                </p>
                <a className="btn-lost">Lost &amp; Found</a>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row mt-3">
            <div className="col-lg-6 col-md-6 petdetails">
              <div className="index-petsdetails-container">
                <div className="index-petsdetails-container-img">
                  <Image
                    src="/assets/images/lost-img.png"
                    width={600}
                    height={350}
                    quality={100}
                    alt="Lost Img"
                  />
                </div>

                <div className="p-3 bg-1 petdetailsBg">
                  <Link href="/pet-owners/lost-found-pets">
                    <button>My Pet is Lost</button>
                  </Link>
                  <p>
                    Losing a pet can be a heart-wrenching experience. We
                    understand the emotional distress and worry that comes with
                    it.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-lg-6 col-md-6 petdetails">
              <div className="index-petsdetails-container">
                <div className="index-petsdetails-container-img">
                  <Image
                    src="/assets/images/found.png"
                    width={400}
                    height={350}
                    quality={100}
                    alt="Lost Img"
                  />
                </div>

                <div className="p-3 petdetailsBg">
                  <Link href="/pet-owners/lost-found-pets">
                    <button>I have Found a Pet</button>
                  </Link>
                  <p>
                    If you have found an animal there are quite a few things
                    that you can do which may help you reunite the pet with
                    it&apos;s keepers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-12">
            <div className="testimonial-container">
              <div className="testimonial-title">
                <p>Our Testimonial</p>
                <h4>What People Say About Us</h4>
              </div>
              <section className="testimonial-section">
                <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                  <Slider {...settings}>
                    <div>
                      <i className="fa-solid fa-quote-left"></i>
                      <p style={{ fontSize: "1.2rem", textAlign: "center" }}>
                        My dog lives for the outdoors! She’s got a comfy spot
                        inside with all the toys she could want, but she insists
                        on being outside—catching some sun, keeping an eye on
                        the neighborhood, and saying hi to neighbors and their
                        dogs. She&apos;s basically a celebrity in our community;
                        everyone stops to greet her through our gate
                      </p>
                    </div>
                    <div>
                      <i className="fa-solid fa-quote-left"></i>
                      <p style={{ fontSize: "1.2rem", textAlign: "center" }}>
                        My dog lives for the outdoors! She’s got a comfy spot
                        inside with all the toys she could want, but she insists
                        on being outside—catching some sun, keeping an eye on
                        the neighborhood, and saying hi to neighbors and their
                        dogs. She&apos;s basically a celebrity in our community;
                        everyone stops to greet her through our gate
                      </p>
                    </div>
                    <div>
                      <i className="fa-solid fa-quote-left"></i>
                      <p style={{ fontSize: "1.2rem", textAlign: "center" }}>
                        My dog lives for the outdoors! She’s got a comfy spot
                        inside with all the toys she could want, but she insists
                        on being outside—catching some sun, keeping an eye on
                        the neighborhood, and saying hi to neighbors and their
                        dogs. She&apos;s basically a celebrity in our community;
                        everyone stops to greet her through our gate
                      </p>
                    </div>
                  </Slider>
                </div>
              </section>
            </div>
          </div>
        </div>
      </CommonLayout>
    </div>
  );
}
