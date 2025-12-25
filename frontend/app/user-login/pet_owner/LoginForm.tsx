"use client";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@/app/common/LocalStorage";
import { useRouter } from "next/navigation";
const secret = process.env.NEXT_PUBLIC_HASH_SECRET as string;

const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL
import withAuth from "@/app/common/withAuth";
import { DecryptData } from "@/app/common/HashData";
export const LoginForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  let token = getLocalStorageItem("token");
  useEffect(() => {
    if (token) {
      router.push("/customer/dashboard");
    }
  }, [token]);
  // Validation schema using Yup
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleSubmit = async (
    values: { email: string; password: string; user_type: string }, // Make sure to define user_type in values
    {
      setSubmitting,
      setFieldError,
    }: FormikHelpers<{ email: string; password: string; user_type: string }> // Use FormikHelpers type
  ) => {
    try {
      let microchipNumber = "";

      const response = await fetch(`${appUrl}auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          user_type: "pet_owner", // add user type here
          microchipNumber: microchipNumber,
        }),
      });

      const data = await response.json();

      if (response.status === 200 && data.token) {
        let encryptedMicrochip = getLocalStorageItem("microchip_number");
        let transferMicrochip = getLocalStorageItem("transfer_microchip");

        let microchipTime = Number(
          getLocalStorageItem("microchip_number_time") || 0
        );
        let transferTime = Number(
          getLocalStorageItem("transfer_microchip_time") || 0
        );

        setLocalStorageItem("token", data.token);

        // removeLocalStorageItem( "transfer_microchip");
        // removeLocalStorageItem("transfer_microchip_time");
        // removeLocalStorageItem("transfer_phonenumber");
        // Decide last set
        if (microchipTime > transferTime && encryptedMicrochip) {
          router.push(
            `/pet-owners/pet-microchip-registration?microchip=${encodeURIComponent(
              encryptedMicrochip
            )}`
          );
          return;
        }

        if (transferTime > microchipTime && transferMicrochip) {
          router.push("/pet-owners/change-ownership");
          return;
        }

        // Default route
        router.push("/customer/dashboard");
      } else if (data.message === "Invalid Email") {
        setFieldError("email", data.message); // Set error for email
      } else if (data.message === "Invalid Password") {
        setFieldError("password", data.message); // Set error for password
      } else if (data.message === "Invalid user type") {
        setFieldError("password", data.message); // Set error for password
      } else if (data.message === "Account is not active") {
        setFieldError("password", data.message); // Set error for password
      }
    } catch (error) {
      console.error("Login Error::" + error);
      toast.error("Logged In Failed");
    }
  };
  return (
    <div className="col-lg-6 col-12 d-lg-block mt-5">
      <h1 className="text-center">Login</h1>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {() => (
          <Form>
            <div className="row">
              <div className="col-lg-12 col-md-12 mb-4">
                <label className="mb-2">Email</label>
                <Field
                  type="text"
                  className="form-control"
                  id="email"
                  name="email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="col-lg-12 col-md-12 mb-4">
                <label className="mb-2">Password</label>
                <Field
                  type={showPassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  name="password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="col-lg-12 col-md-12">
                <input
                  type="checkbox"
                  id="show_password"
                  className="mx-2"
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label htmlFor="show_password">Show Password</label>
              </div>
              {/* Forgot Password link */}
              <div className="col-lg-12 col-md-12 mb-3 text-end">
                <Link
                  href="/user-login/forgot-password"
                  className="text-primary"
                  style={{ textDecoration: "underline", cursor: "pointer" }}>
                  Forgot Password?
                </Link>
              </div>

              <div className="col-lg-12 col-md-12 mb-2">
                <button className="btn btn-primary w-100" type="submit">
                  Login
                </button>
              </div>

              <div className="col-lg-12 col-md-12 mb-4 text-center">
                <Link href="/user-register/register-pet-microchip">
                  Need an account?
                </Link>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
