"use client";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { DecryptData, EncryptData } from "../../common/HashData";
import { verifyToken } from "@/app/customer/common/api";
import Router, { useRouter } from "next/navigation";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@/app/common/LocalStorage";
import Link from "next/link";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const secret = process.env.NEXT_PUBLIC_HASH_SECRET as string;

export const ChangeOwnerShipForm = () => {
  const token = getLocalStorageItem("token");
  const [showSuccessBox, setShowSuccessBox] = useState(false);

        // removeLocalStorageItem( "transfer_microchip");
        // removeLocalStorageItem("transfer_microchip_time");
        // removeLocalStorageItem("transfer_phonenumber");
  
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpNumber, setOtpNumber] = useState("");
  const [account_type, setAcountType] = useState("");
  const [microchipNumber, setMicrochipNumber] = useState("");
  const [timer, setTimer] = useState(60); // in seconds
  const [otpValues, setOtpValues] = useState(Array(5).fill(""));
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const [pageData, setPageData] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    microchip_number: Yup.string()
      .required("Microchip number is required")
      .matches(/^\d+$/, "Microchip number must be numeric"),
    confirm_microchip_number: Yup.string()
      .oneOf([Yup.ref("microchip_number")], "Microchip numbers must match")
      .required("Please confirm the microchip number"),
  });

  // ✅ Initial Values
  const initialValues = {
    microchip_number: "",
    confirm_microchip_number: "",
  };

  // ✅ Submit Handler
  const handleSubmit = async (
    values: typeof initialValues,
    { setFieldError }: FormikHelpers<typeof initialValues>
  ) => {
    try {
      const res = await axios.post(
        `${appUrl}frontend/transfer/check-microchip`,
        {
          microchip_number: values.microchip_number,
        }
      );

      if (res.data.statusCode === 200) {
        setLocalStorageItem(
          "transfer_microchip",
          EncryptData(values.microchip_number, secret)
        );
        setLocalStorageItem("transfer_microchip_time", Date.now());

        setLocalStorageItem(
          "transfer_phonenumber",
          EncryptData(res.data.data.phone_number, secret)
        );
        setMicrochipNumber(values.microchip_number);

                
        

        setShowOtp(true);
        setTimer(60); // 2 mins
      } else {
        setFieldError("microchip_number", res.data.message);
      }
    } catch (err) {
      console.error(err);
      setFieldError("microchip_number", "Server error, try again");
    }
  };

  // ✅ OTP input handling
  const handleOtpChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (!/^\d*$/.test(value)) {
      e.target.value = "";
      return;
    }

    const newOtp = [...otpValues];
    newOtp[index] = value;
    setOtpValues(newOtp);

    if (value && index < otpRefs.current.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }

    if (!value && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const fetchUserType = async () => {
    const type = await verifyToken();
    if (type) {
      setAcountType(type.account_type);
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = otpRefs.current.map((el) => el?.value).join("");
    let microchipNumber = getLocalStorageItem("transfer_microchip");

    let decryptMicrochip;
    if (microchipNumber) {
      decryptMicrochip = DecryptData(microchipNumber, secret);
    }
    if (enteredOtp.length !== 5) {
      toast.error("Please enter the full OTP");
      //setPopupMessage("Please enter the full OTP");
      //setShowPopup(true);
      return;
    }

    try {
      const res = await axios.post(
        `${appUrl}frontend/transfer/verify-otp`,
        {
          microchip_number: decryptMicrochip,
          otp: enteredOtp,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.statusCode === 200) {
        const token = localStorage.getItem("token");
        removeLocalStorageItem("transfer_microchip");
        removeLocalStorageItem("transfer_phonenumber");
        if (token) {
          //setPopupMessage("Microchip Assigned Successfully!");
          //router.push('/customer/microchip/list');
          toast.success("Microchip Assigned Successfully!");
        removeLocalStorageItem("transfer_microchip_time");
          setShowSuccessBox(true);
        }

        // setShowPopup(true);
      } else {
        //  setPopupMessage(res.data.message);
        toast.error(res.data.message);
        //setShowPopup(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error, please try again");
      //setPopupMessage("Server error, please try again");
      // setShowPopup(true);
    }
  };

  // ✅ Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (showOtp && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showOtp, timer]);

  const handleResendOtp = () => {
    console.log("Resending OTP...");
    setTimer(60); // reset 2 mins
    // Call API to resend OTP here
  };

  // ✅ Mask function
  const maskedNumber = (num: string) => {
    if (num == null || num == "") return "";
    if (num.length <= 5) return num;
    const start = num.slice(0, 2);
    const end = num.slice(-3);
    const masked = "*".repeat(num.length - 5);
    return `${start}${masked}${end}`;
  };

  const isComplete = otpValues.every((val) => val !== "");

  useEffect(() => {
    fetchUserType();
    let transfer_microchip = getLocalStorageItem("transfer_microchip");
    let transfered_phonenumber = getLocalStorageItem("transfer_phonenumber");

    const fetchPageData = async () => {
      try {
        const res = await fetch(`${appUrl}frontend/pages/list/?id=14`);
        const json = await res.json();

        if (json?.statusCode === 200 && json.data.length > 0) {
          const page = json.data[0];
          setPageData(page);
        }
      } catch (error) {
        console.error("Error fetching FAQ page:", error);
      }
    };
    let decryptMicrochip = DecryptData(transfer_microchip ?? "", secret);
    let decryptMobileNumber = DecryptData(transfered_phonenumber ?? "", secret);
    if (decryptMicrochip) {
      setShowOtp(true);
      removeLocalStorageItem( "transfer_microchip");
        removeLocalStorageItem("transfer_microchip_time");
        removeLocalStorageItem("transfer_phonenumber");
    }
    if (decryptMobileNumber) {
      setOtpNumber(decryptMobileNumber);
    }
    fetchPageData();
  }, []);

  return (
    <>
      <div className="col-lg-12 col-md-12">
        <h2 className="mb-0 page-title-h2 mb-3">{pageData?.title}</h2>
        {pageData?.content && (
          <div
            className="faq-intro"
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          />
        )}
      </div>
      {showPopup && (
        <div className="modal-backdrop d-flex justify-content-center align-items-center">
          <div className="modal-content p-4 text-center shadow-lg rounded transfer_popup">
            <h4>{popupMessage}</h4>
            <button
              className="btn btn-primary mt-3"
              onClick={() => setShowPopup(false)}>
              OK
            </button>
          </div>
        </div>
      )}

      {!showOtp ? (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {() => (
            <Form className="form-lost">
              <h2>Transfer my new pet to my name</h2>

              {/* Microchip Number */}
              <div className="form-floating mb-4">
                <Field
                  id="microchip_number"
                  name="microchip_number"
                  type="text"
                  className="form-control"
                  placeholder="Microchip number"
                />
                <label htmlFor="microchip_number">Microchip number</label>
                <ErrorMessage
                  name="microchip_number"
                  component="span"
                  className="text-danger"
                />
              </div>

              {/* Confirm Microchip Number */}
              <div className="form-floating mb-4">
                <Field
                  id="confirm_microchip_number"
                  name="confirm_microchip_number"
                  type="text"
                  className="form-control"
                  placeholder="Confirm Microchip number"
                />
                <label htmlFor="confirm_microchip_number">
                  Confirm Microchip number
                </label>
                <ErrorMessage
                  name="confirm_microchip_number"
                  component="span"
                  className="text-danger"
                />
              </div>

              <button type="submit" className="btn btn-primary text-white">
                Submit
              </button>

              <p className="mt-3">
                If you're having any trouble logging in, please contact our
                support team at 07734616466. We're here to help!
              </p>
            </Form>
          )}
        </Formik>
      ) : (
        <>
          {/* SUCCESS BOX */}
          {showSuccessBox && (
            <div className="alert alert-info p-4 rounded shadow text-center mt-4">
              <h4 className="fw-bold mb-2">OTP Verified Successfully!</h4>
              <p className="mb-3">
                Your microchip has been assigned successfully.
                <br />
                <b>Please click below to continue.</b>
              </p>

              <button
                className="btn btn-primary"
                onClick={() => router.push("/customer/microchip/list")}>
                Go to Assigned Microchip Page
              </button>
            </div>
          )}

          {/* OTP BLOCK */}
          {account_type && !showSuccessBox ? (
            <div className="otp-section text-center">
              <h3 className="mb-3">
                OTP sent to this registered mobile number{" "}
                <b>{maskedNumber(otpNumber)}</b>
              </h3>

              <div className="d-flex justify-content-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={otpValues[i]}
                    className="form-control text-center"
                    style={{ width: "70px", fontSize: "24px" }}
                    onChange={(e) => handleOtpChange(e, i)}
                    ref={(el) => (otpRefs.current[i] = el!)}
                  />
                ))}
                </div>
                {timer > 0 ? (
                  <p
                    className="fw-bold text-primary resendOtp_timer"
                    style={{ fontSize: "18px" }}>
                     Resend OTP in{" "}
                    {String(Math.floor(timer / 60)).padStart(2, "0")}:
                    {String(timer % 60).padStart(2, "0")}
                  </p>
                ) : (
                  <button
                    className="btn btn-link fw-bold resendOtp_timerBtn"
                    onClick={handleResendOtp}>
                    Resend OTP
                  </button>
                )}

              <div className="mt-4 d-flex justify-content-center gap-3">
                <button
                  className="btn btn-success"
                  onClick={verifyOtp}
                  disabled={!isComplete}>
                  Verify OTP
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => setShowOtp(false)}>
                  Back
                </button>
              </div>


            </div>
          ) : (
            !showSuccessBox && (
              <p>
                To proceed with the transfer of keepership, please log in to
                your account.{" "}
                <Link href="/user-login/pet_owner">Click here to log in</Link>.
              </p>
            )
          )}
        </>
      )}
    </>
  );
};
