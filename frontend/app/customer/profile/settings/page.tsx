"use client";
import CommonLayout from "../../layouts/CommonLayouts";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
import { useRouter } from "next/navigation";
import { useState } from "react";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function ChangePasswordPage() {
  const router = useRouter();
  const token = getLocalStorageItem("token");
  const [loading, setLoading] = useState(false);

  // ✅ Yup validation schema
  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Confirm password is required"),
  });

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      password: "",
      confirm_password: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const payload = {
          password: values.password,
            confirm_password: values.confirm_password,
          token: token || "",
        };

        const response = await axios.post(`${appUrl}profile/change/password`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.statusCode === 200 || response.data.statusCode === 201) {
          toast.success(response.data.message || "Password updated successfully!");
          resetForm();
        } else {
          toast.error(response.data.message || "Failed to update password");
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <CommonLayout>
      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="page-header-container mb-3 d-flex align-items-center justify-content-between">
            <div className="page-header-title">
              <h1 className="fs-4 mb-0">Change Password</h1>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="page-table-container w-100">
              <div className="card-body">
                <div className="row">

                  {/* Password */}
                  <div className="col-12 mb-3">
                    <label htmlFor="password" className="form-label">
                      New Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      {...formik.getFieldProps("password")}
                    />
                    {formik.touched.password && formik.errors.password && (
                      <div className="text-danger">{formik.errors.password}</div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="col-12 mb-3">
                    <label htmlFor="confirm_password" className="form-label">
                      Confirm Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirm_password"
                      {...formik.getFieldProps("confirm_password")}
                    />
                    {formik.touched.confirm_password && formik.errors.confirm_password && (
                      <div className="text-danger">{formik.errors.confirm_password}</div>
                    )}
                  </div>

                  {/* Submit */}
                  <div className="page-bottom-actions">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Update Password"}
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </form>

          <ToastContainer
            position="top-right"
            autoClose={1500}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
          />
        </div>
      </div>
    </CommonLayout>
  );
}
