"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [tokenValid, setTokenValid] = useState<boolean | null>(null);

  // 🔍 Verify token on load
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      return;
    }

    fetch(`${appUrl}auth/verify-reset-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTokenValid(data.statusCode === 200);
      })
      .catch(() => setTokenValid(false));
  }, [token]);

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Minimum 8 characters")
      .required("Password required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password required"),
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const response = await fetch(`${appUrl}auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, token }),
      });

      const data = await response.json();

      if (response.status === 200) {
        toast.success("Password reset successful!");
        router.push("/user-login/pet_owner");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Request failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (tokenValid === null) {
    return <p className="text-center mt-5">Verifying link...</p>;
  }

  if (!tokenValid) {
    return (
     <div className="col-lg-6 mx-auto mt-5 ">
        <h4 className="text-center">Invalid or expired reset link</h4>
      </div>
    );
  }

  return (
    <div className="col-lg-6 mx-auto mt-5">
      <h2 className="text-center">Reset Password</h2>

      <Formik
        initialValues={{ password: "", confirm_password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label>New Password</label>
              <Field
                type="password"
                name="password"
                className="form-control"
                disabled={isSubmitting}
              />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>

            <div className="mb-3">
              <label>Confirm Password</label>
              <Field
                type="password"
                name="confirm_password"
                className="form-control"
                disabled={isSubmitting}
              />
              <ErrorMessage
                name="confirm_password"
                component="div"
                className="text-danger"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mb-3"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPassword;
