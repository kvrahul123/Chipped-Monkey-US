"use client";

import Link from "next/link";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import { getLocalStorageItem } from "@/app/common/LocalStorage";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

const ForgotPassword = () => {
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);

  const token = getLocalStorageItem("token");

  useEffect(() => {
    if (token) {
      router.push("/customer/dashboard");
    }
  }, [token, router]);

  const forgotPasswordValidationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
  });

  const handleForgotPasswordSubmit = async (
    values: { email: string },
    { setSubmitting }: FormikHelpers<{ email: string }>
  ) => {
    try {
      setSubmitting(true); // 🔒 lock form

      const response = await fetch(`${appUrl}auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success("Password reset link sent to your email!");
        setEmailSent(true);
      } else {
        toast.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Request failed");
    } finally {
      setSubmitting(false); // 🔓 unlock form
    }
  };

  return (
    <div className="col-lg-6 col-12 d-lg-block mt-5">
      <h1 className="text-center">Forgot Password</h1>

      {!emailSent ? (
        <Formik
          initialValues={{ email: "" }}
          validationSchema={forgotPasswordValidationSchema}
          onSubmit={handleForgotPasswordSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="row">
                <div className="col-12 mb-4">
                  <label className="mb-2">Email</label>
                  <Field
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    disabled={isSubmitting} // 🔒 disable input
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="col-12 mb-3 text-start">
                  <Link href="/user-login/pet_owner">
                    <button
                      type="button"
                      className="btn btn-link p-0"
                      disabled={isSubmitting}
                    >
                      Back to Login
                    </button>
                  </Link>
                </div>

                <div className="col-12 mb-2">
                  <button
                    className="btn btn-primary w-100"
                    type="submit"
                    disabled={isSubmitting} // 🔒 disable button
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="text-center mt-4">
          <p className="text-success">
            If this email exists, a password reset link has been sent.
          </p>
          <Link href="/user-login/pet_owner">
            <button className="btn btn-primary mt-2 mb-2">
              Back to Login
            </button>
          </Link>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
