"use client";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { setLocalStorageItem } from "@/app/common/LocalStorage";
import { EncryptData } from "@/app/common/HashData";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const secret = process.env.NEXT_PUBLIC_HASH_SECRET as string;

interface Props {
  onValid: (microchipNumber: string) => void;
}

interface FormValues {
  microchip: string;
  confirmMicrochip: string;
}

export default function MicrochipInput({ onValid }: Props) {
  const [apiError, setApiError] = useState<string>("");

  const initialValues: FormValues = { microchip: "", confirmMicrochip: "" };

  const validationSchema = Yup.object({
    microchip: Yup.string()
      .matches(/^\d{15}$/, "MicroChip number must be exactly 15 digits")
      .required("MicroChip number is required"),
    confirmMicrochip: Yup.string()
      .oneOf([Yup.ref("microchip")], "MicroChip numbers must match")
      .required("Confirm MicroChip number is required"),
  });

  const checkMicrochip = async (values: FormValues) => {
    try {
      const response = await fetch(`${appUrl}frontend/microchip/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          microchip_number: values.microchip,
        }),
      });
      const data = await response.json();

      // ✅ Proceed if microchip is valid
      if (!data.exists && !data.externalDatabase) {
        return true;
      } else {
        throw new Error( data.message??"Microchip already registered");
      }
    } catch (err: any) {
      throw new Error(err.message || "Something went wrong!");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
      ) => {
        setApiError(""); // reset previous error
        try {
          const valid = await checkMicrochip(values);
          if (valid) {
            onValid(values.microchip); // notify parent
            if (values.microchip) {
              setLocalStorageItem("microchip_number", EncryptData(values.microchip, secret));
              setLocalStorageItem("microchip_number_time", Date.now());

                }
          }
        } catch (err: any) {
          setApiError(err.message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="register-monkey-new mb-2">
            <Field
              type="text"
              name="microchip"
              className="form-control"
              placeholder="MicroChip Number..."
              maxLength={16}
            />
            <ErrorMessage
              name="microchip"
              component="div"
              className="text-danger"
            />
          </div>

          <div className="register-monkey-confirm-input mb-2">
            <Field
              type="text"
              name="confirmMicrochip"
              className="form-control"
              placeholder="Confirm MicroChip Number..."
              maxLength={16}
            />
            <ErrorMessage
              name="confirmMicrochip"
              component="div"
              className="text-danger"
            />
          </div>

          {apiError && <div className="text-danger mb-2">{apiError}</div>}

          <div className="register-monkey-new">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Checking..." : "Register"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
