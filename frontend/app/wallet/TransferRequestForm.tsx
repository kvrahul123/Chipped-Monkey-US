"use client";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
import { toast, ToastContainer } from "react-toastify";
import {  useRouter } from "next/navigation";
import { useEffect } from "react";
export default function TransferRequestForm(token: any) {
  const route=useRouter()
  const formik = useFormik({
    initialValues: {
      sort_code: "",
      requested_amount: "",
      account_number: "",
      account_number_confirmation: "",
      bank_name: "",
      account_holders_name: "",
    },
    validationSchema: Yup.object({
      sort_code: Yup.string()
        .matches(/^\d+$/, "Sort code must contain only digits")
        .required("Sort code is required"),
      requested_amount: Yup.number()
        .typeError("Amount must be a number")
        .positive("Amount must be greater than 0")
        .required("Amount is required"),
      account_number: Yup.string()
        .matches(/^\d+$/, "Account number must contain only digits")
        .required("Account number is required"),
      account_number_confirmation: Yup.string()
        .matches(/^\d+$/, "Account number must contain only digits")
        .oneOf([Yup.ref("account_number")], "Account numbers must match")
        .required("Please confirm account number"),
      bank_name: Yup.string().required("Bank name is required"),
      account_holders_name: Yup.string().required(
        "Account holder name is required"
      ),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        const response = await axios.post(
          `${appUrl}frontend/transaction/request`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token?.token}`, // if JWT needed
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.statusCode == 200) {
                  toast.success("Transfer request submitted successfully!");
        resetForm();
          route.push("/wallet");
          return;
        }
                  toast.error(response.data.message);
          return;

      } catch (error: any) {
        toast.error("Failed to submit transfer request. Please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

 
  return (
    <div className="wallet-table-inner-container">
      <form id="paymentSubmit" onSubmit={formik.handleSubmit}>
        <div className="row g-3">
          {/* Sort Code */}
          <div className="col-md-6">
            <label htmlFor="sortCode" className="form-label">
              Sort Code
            </label>
            <input
              type="text"
              className="form-control"
              id="sortCode"
              {...formik.getFieldProps("sort_code")}
              placeholder="Enter sort code"
            />
            {formik.touched.sort_code && formik.errors.sort_code && (
              <span className="text-danger">{formik.errors.sort_code}</span>
            )}
          </div>

          {/* Amount */}
          <div className="col-md-6">
            <label htmlFor="requested_amount" className="form-label">
              Amount
            </label>
            <input
              type="text"
              className="form-control"
              id="requested_amount"
              {...formik.getFieldProps("requested_amount")}
              placeholder="Enter Amount"
            />
            {formik.touched.requested_amount &&
              formik.errors.requested_amount && (
                <span className="text-danger">
                  {formik.errors.requested_amount}
                </span>
              )}
          </div>

          {/* Account Number */}
          <div className="col-md-6">
            <label htmlFor="accountNumber" className="form-label">
              Account Number
            </label>
            <input
              type="text"
              className="form-control"
              id="accountNumber"
              {...formik.getFieldProps("account_number")}
              placeholder="Enter account number"
            />
            {formik.touched.account_number && formik.errors.account_number && (
              <span className="text-danger">
                {formik.errors.account_number}
              </span>
            )}
          </div>

          {/* Confirm Account Number */}
          <div className="col-md-6">
            <label htmlFor="accountNumberConfirmation" className="form-label">
              Confirm Account Number
            </label>
            <input
              type="text"
              className="form-control"
              id="accountNumberConfirmation"
              {...formik.getFieldProps("account_number_confirmation")}
              placeholder="Enter account number again"
            />
            {formik.touched.account_number_confirmation &&
              formik.errors.account_number_confirmation && (
                <span className="text-danger">
                  {formik.errors.account_number_confirmation}
                </span>
              )}
          </div>

          {/* Bank Name */}
          <div className="col-md-6">
            <label htmlFor="bankName" className="form-label">
              Bank Name
            </label>
            <input
              type="text"
              className="form-control"
              id="bankName"
              {...formik.getFieldProps("bank_name")}
              placeholder="Enter bank name"
            />
            {formik.touched.bank_name && formik.errors.bank_name && (
              <span className="text-danger">{formik.errors.bank_name}</span>
            )}
          </div>

          {/* Account Holder Name */}
          <div className="col-md-6">
            <label htmlFor="accountHolderName" className="form-label">
              Account Holder Name
            </label>
            <input
              type="text"
              className="form-control"
              id="accountHolderName"
              {...formik.getFieldProps("account_holders_name")}
              placeholder="Enter account holder name"
            />
            {formik.touched.account_holders_name &&
              formik.errors.account_holders_name && (
                <span className="text-danger">
                  {formik.errors.account_holders_name}
                </span>
              )}
          </div>

          {/* Submit */}
          <div className="col-md-12 text-center">
            <button
              className="btn btn-success save_btn"
              type="submit"
              id="btnSearch"
              name="btnSearch">
              <span>Submit</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
