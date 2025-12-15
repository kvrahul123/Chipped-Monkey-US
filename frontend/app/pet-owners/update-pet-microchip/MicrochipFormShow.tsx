"use client";

import MicrochipInput from "./MicrochipInput";
import MicrochipForm from "@/app/common/MicrochipForm";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@/app/common/LocalStorage";
import { verifyToken } from "@/app/customer/common/api";
import { RegisterForm } from "@/app/user-register/pet_owner/RegisterForm";
import { DecryptData } from "../../common/HashData";
import Link from "next/link";
import Loader from "@/app/loader/page";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const secret = process.env.NEXT_PUBLIC_HASH_SECRET as string;

// Extracted logic into a separate component that will be wrapped in <Suspense>
function MicrochipFormContent() {
  const [isValid, setIsValid] = useState(false);
  const [microchipNumber, setMicrochipNumber] = useState("");
  const [loadingUser, setLoadingUser] = useState(true);
  const searchParams = useSearchParams();
  const [isLoggedIn, setisLoggedIn] = useState(false);
  let userToken = getLocalStorageItem("token");
  const [accountType, setAcountType] = useState<string | null>(null);
  const [isPaymentCardOpen, setIsPaymentCardOpen] = useState(false);
  const Decryptmicrochip_payment = DecryptData(
    getLocalStorageItem("microchip_paymentDetails") || "",
    secret
  );
  useEffect(() => {
    let microchipFromUrl = searchParams.get("microchip");
    if (microchipFromUrl) {
      setLocalStorageItem("microchip_number", microchipFromUrl ?? "");
      setLocalStorageItem("microchip_number_time", Date.now());
    }
    microchipFromUrl = DecryptData(microchipFromUrl ?? "", secret);
    if (microchipFromUrl) {
      setMicrochipNumber(microchipFromUrl);
      setIsValid(true); // directly show form if param present
    }
  }, [searchParams]);

  useEffect(() => {
    if (Decryptmicrochip_payment != null && Decryptmicrochip_payment != "") {
      setIsValid(true);
    }
  }, [Decryptmicrochip_payment]);

  const [userDetails, setuserDetails] = useState([]);
  const fetchUserType = async () => {
    const type = await verifyToken();
    if (type) {
      setAcountType(type.account_type);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${appUrl}auth/validate-token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = await response.json();

      if (data && data.statusCode === 200) {
        setLoadingUser(false);
        setisLoggedIn(true);
        removeLocalStorageItem("microchip_number");
        removeLocalStorageItem("microchip_number_time");
        setuserDetails((prevDetails) => ({
          ...prevDetails,
          user_name: data.data.user_name,
          user_type: data.data.user_type,
        }));
      } else {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    if (userToken) {
      fetchData();
    }
    setLoadingUser(false);

    fetchUserType();
  }, []);
  return (
    <>
      {!isValid ? (
        // <MicrochipInput
        //   onValid={(number: string) => {
        //     setMicrochipNumber(number);
        //     setIsValid(true);
        //   }}
        // />

        <div>
          <p className="text-lg" style={{ color: "#ffffff", fontSize: "18px" }}>
            <span className="updateregister_header_content">Create account to enroll your pet</span>
            <br />
            <Link
              href="/user-register/register-pet-microchip"
              style={{ color: "#f8a131", fontSize: "20px" }}>
              <button className="btn btn-primary my-2">
                Create and enroll
              </button>
            </Link>{" "}
          </p>

          <p className="text-lg" style={{ color: "#ffffff", fontSize: "18px" }}>
            Already have an account?{" "}
            <Link
              href="/user-login/pet_owner"
              style={{ color: "#f8a131", fontSize: "20px" }}>
              Sign in here
            </Link>{" "}
          </p>
        </div>
      ) : (
        <div>
          {loadingUser ? (
            <Loader /> // ⬅️ Show loader until token check finishes
          ) : isLoggedIn ? (
            <MicrochipForm microchipNumber={microchipNumber} />
          ) : (
        <div>
          <p className="text-lg" style={{ color: "#ffffff", fontSize: "18px" }}>
            <span className="updateregister_header_content">Create account to enroll your pet</span>
            <br />
            <Link
              href="/user-register/register-pet-microchip"
              style={{ color: "#f8a131", fontSize: "20px" }}>
              <button className="btn btn-primary my-2">
                Create and enroll
              </button>
            </Link>{" "}
          </p>

          <p className="text-lg" style={{ color: "#ffffff", fontSize: "18px" }}>
            Already have an account?{" "}
            <Link
              href="/user-login/pet_owner"
              style={{ color: "#f8a131", fontSize: "20px" }}>
              Sign in here
            </Link>{" "}
          </p>
        </div>
          )}
        </div>
      )}
    </>
  );
}

export default function MicrochipFormShow() {
  return (
    <Suspense
      fallback={
        <div>
          <Loader />
        </div>
      }>
      <MicrochipFormContent />
    </Suspense>
  );
}
