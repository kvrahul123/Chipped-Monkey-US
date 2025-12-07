"use client";
import { useCallback, useEffect, useState } from "react";
import Slider from "react-slick";
import parse from "html-react-parser";
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
  const route = useRouter();
  const [microchipData, setMicrochipData] = useState<any>(null); // store fetched data
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
      id: "1",
      title: "Implanter",
      description: "Online Access to your Dog and Cat Microchip Information",
      type: "implanter",
      icon: "/assets/images/icons11.png",
    },
    {
      id: "0",
      title: "Pet keeper",
      description: "Easy to update your pets' information.",
      type: "pet_keeper",
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

        // 1️⃣ 15-digit numeric
        if (/^\d+$/.test(value)) {
          if (len !== 15) {
            return this.createError({
              message: "Invalid length – 15-digit numeric microchips required.",
            });
          }
          return true;
        }

        // 2️⃣ 10-character alphanumeric
        if (/^[A-Za-z0-9]+$/.test(value)) {
          if (len !== 10) {
            return this.createError({
              message:
                "Invalid length – 10-character alphanumeric microchips required.",
            });
          }
          return true;
        }

        // 3️⃣ AVID format (letters, numbers, *)
        if (/^[A-Za-z0-9*]+$/.test(value)) {
          const count = value.replace(/\*/g, "").length;
          if (count < 9 || count > 13) {
            return this.createError({
              message:
                "Incorrect length – AVID microchips must be 9–13 characters.",
            });
          }
          return true;
        }

        // If none match
        return this.createError({
          message: "Invalid microchip number format.",
        });
      }),
  });

  const validationSchema2 = Yup.object({
    microchip_number: Yup.string()
      .required("Microchip number is required")
      .test("microchip-format", function (value) {
        if (!value) return false;

        const len = value.length;

        // 1️⃣ 15-digit numeric
        if (/^\d+$/.test(value)) {
          if (len !== 15) {
            return this.createError({
              message: "Invalid length – 15-digit numeric microchips required.",
            });
          }
          return true;
        }

        // 2️⃣ 10-character alphanumeric
        if (/^[A-Za-z0-9]+$/.test(value)) {
          if (len !== 10) {
            return this.createError({
              message:
                "Invalid length – 10-character alphanumeric microchips required.",
            });
          }
          return true;
        }

        // 3️⃣ AVID format (letters, numbers, *)
        if (/^[A-Za-z0-9*]+$/.test(value)) {
          const count = value.replace(/\*/g, "").length;
          if (count < 9 || count > 13) {
            return this.createError({
              message:
                "Incorrect length – AVID microchips must be 9–13 characters.",
            });
          }
          return true;
        }

        // If none match
        return this.createError({
          message: "Invalid microchip number format.",
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
          ...data.data,
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
            `/pet-owners/update-pet-microchip?microchip=${encodeURIComponent(
              encryptedMicrochip
            )}`
          );
          return;
        }
        setError(
          `${
            data.message || "MicroChip check failed"
          } <a href="/pet-owners/update-pet-microchip?microchip=${encodeURIComponent(
            encryptedMicrochip
          )}">Click here to register</a>`
        );
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
                        <strong>Pet Keeper:</strong> {microchipData.pet_keeper}
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
                <span>Start Your Registration</span>
                <h4>
                  The Smart Choice
                  <br /> for Your Pet's <b>Forever ID</b>
                </h4>
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
                  <p>Don't Just Love Your Pet—Safeguard Them.</p>
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
              <h1 className="text-white mb-3 mt-2">Lookup Microchip</h1>
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
              <Link href="/pet-owners/update-pet-microchip">
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
            <div className="col-lg-6 col-md-12 mb-5">
              <h3 className="index-head-3">Why Choose us ?</h3>
              <p>
                Microchipping your pet ensures their safety and aids in their
                return if they go missing. The chip stores only a unique
                15-digit number, required for pet insurance and serving as
                lifelong identification.
              </p>
              <section id="moreContent">
                <p>
                  At{" "}
                  <a
                    href="http://localhost/chipped_monkey"
                    target="_blank"
                    rel="noopener noreferrer">
                    ChippedMonkey.com
                  </a>
                  , we understand that your pet’s safety and identification are
                  of utmost importance. Choosing the right pet microchip
                  database service is essential for ensuring your beloved
                  companion can be quickly and safely reunited with you if lost.
                </p>

                <ol style={{ paddingLeft: "12px" }}>
                  <li>
                    <h3>Easy and Fast Pet Microchip Registration UK</h3>
                    <p>
                      Our platform offers a simple, user-friendly process to
                      register your pet’s microchip online in the UK quickly.
                      Whether you have a new puppy, kitten, or are updating your
                      existing pet’s microchip details, ChippedMonkey.com lets
                      you do it all with just a few clicks, saving you time and
                      hassle.
                    </p>
                  </li>

                  <li>
                    <h3>Secure and Trusted Microchip Database UK</h3>
                    <p>
                      Security and privacy are our top priorities. Our system
                      uses the latest encryption and secure data handling
                      protocols to protect your personal information and your
                      pet’s microchip registration data. You can rest assured
                      your details are safe with us.
                    </p>
                  </li>

                  <li>
                    <h3>Update Microchip Details Anytime, Anywhere</h3>
                    <p>
                      Life changes — and so can your contact information. We
                      make it easy for UK pet keepers to update microchip
                      details online at any time, ensuring your pet’s microchip
                      record stays current. Accurate contact details improve the
                      chances of a speedy reunion if your pet is lost.
                    </p>
                  </li>

                  <li>
                    <h3>Hassle-Free Microchip keepership Transfers</h3>
                    <p>
                      If you’re rehoming, adopting, or selling a pet,
                      transferring microchip keepership is vital. Our quick and
                      straightforward keepership transfer process means new
                      keepers can immediately take responsibility for the pet’s
                      microchip record, keeping your pet protected for life.
                    </p>
                  </li>

                  <li>
                    <h3>Dedicated UK-Based Customer Support</h3>
                    <p>
                      Got questions about pet microchip registration in the UK?
                      Need help with updating your details or keepership
                      transfer? Our friendly, knowledgeable UK-based customer
                      service team is ready to assist you by phone or email —
                      ensuring you never feel alone in managing your pet’s
                      microchip registration.
                    </p>
                  </li>

                  <li>
                    <h3>Comprehensive Compliance with UK Microchipping Laws</h3>
                    <p>
                      We stay fully up-to-date with evolving UK pet
                      microchipping legislation, including compulsory
                      microchipping requirements for dogs and cats.
                      ChippedMonkey.com ensures your pet’s microchip
                      registration meets legal standards, helping you avoid
                      fines and penalties.
                    </p>
                  </li>

                  <li>
                    <h3>
                      Trusted by UK Vets, Shelters, and Animal Welfare
                      Organisations
                    </h3>
                    <p>
                      Our database is integrated with UK veterinary clinics,
                      animal shelters, and rescue centres nationwide, making it
                      easier than ever for lost pets to be scanned and
                      identified quickly. When you register with
                      ChippedMonkey.com, you’re joining a network dedicated to
                      improving pet recovery rates across the UK.
                    </p>
                  </li>

                  <li>
                    <h3>Compatible with All ISO-Compliant Pet Microchips</h3>
                    <p>
                      Whether your pet’s microchip was implanted by your vet, a
                      shelter, or a breeder, ChippedMonkey.com supports all ISO
                      11784/11785-compliant microchips widely used in the UK and
                      internationally, ensuring your pet’s chip can be
                      registered and found.
                    </p>
                  </li>
                </ol>
              </section>
              <button
                id="readMoreBtn"
                style={{ margin: "10px 0px;" }}
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
                          pathname: "/user-register/pet_owner",
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
