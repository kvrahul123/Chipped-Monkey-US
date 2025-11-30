"use client";

import CommonLayout from "../../../layouts/CommonLayouts";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Select from "react-select";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
import Image from "next/image";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function MicrochipEditPage() {
  const didFetch = useRef(false);
  const router = useRouter();
  const { id } = useParams();
  const token = getLocalStorageItem("token");
  const [photoPath, setPhotoPath] = useState("");
  const [loading, setLoading] = useState(true);

  const petStatusOptions = [
    { value: "", label: "Select Pet status" },
    { value: "not_lost_or_stolen", label: "Not lost or stolen" },
    { value: "lost_or_stolen", label: "Lost or stolen" },
  ];

  const sexOptions = [
    { value: "", label: "Select sex" },
    { value: "male", label: "Male" },
    { value: "male_neutered", label: "Male neutered" },
    { value: "female", label: "Female" },
    { value: "female_spayed", label: "Female spayed" },
    { value: "undetermined", label: "Undetermined" },
  ];

  type Values = {
    microchipNumber: string;
    pet_keeper: string;
    phone_number: string;
    email: string;
    address: string;
    country: string;
    pet_name: string;
    pet_status: string;
    type: string;
    breed: string;
    sex: string;
    color: string;
    dob: string;
    markings: string;
    photo: any;
  };

  const validationSchema = Yup.object().shape({
 microchipNumber: Yup.string()
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
            message: "Invalid length – 10-character alphanumeric microchips required.",
          });
        }
        return true;
      }

      // 3️⃣ AVID format (letters, numbers, *)
      if (/^[A-Za-z0-9*]+$/.test(value)) {
        const count = value.replace(/\*/g, "").length;
        if (count < 9 || count > 13) {
          return this.createError({
            message: "Incorrect length – AVID microchips must be 9–13 characters.",
          });
        }
        return true;
      }

      // If none match
      return this.createError({
        message: "Invalid microchip number format.",
      });
    }),
    pet_keeper: Yup.string().required("Pet Keeper is required"),
    phone_number: Yup.string()
      .matches(/^\d+$/, "Phone Number must contain only digits")
      .required("Phone Number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    address: Yup.string().required("Address is required"),
    country: Yup.string().required("Country is required"),
    pet_name: Yup.string().required("Pet Name is required"),
    pet_status: Yup.string().required("Pet Status is required"),
    type: Yup.string().required("Type is required"),
    breed: Yup.string().required("Breed is required"),
    sex: Yup.string().required("Sex is required"),
    color: Yup.string().required("Color is required"),
    dob: Yup.string().required("Date of Birth is required"),
    markings: Yup.string().required("Markings are required"),
  });

  const formik = useFormik<Values>({
    initialValues: {
      microchipNumber: "",
      pet_keeper: "",
      phone_number: "",
      email: "",
      address: "",
      country: "",
      pet_name: "",
      pet_status: "",
      type: "",
      breed: "",
      sex: "",
      color: "",
      dob: "",
      markings: "",
      photo: null,
    },
    validationSchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value);
      });

      try {
        const response = await axios.put(
          `${appUrl}microchip/update/${id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.statusCode === 200) {
          toast.success(
            response.data.message || "Microchip updated successfully"
          );
          router.push("/admin/microchip/list");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    },
  });

  useEffect(() => {
    if (!id || didFetch.current) return;

    didFetch.current = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(`${appUrl}microchip/edit/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data.data;

        formik.setValues({
          microchipNumber: data.microchip_number || "",
          pet_keeper: data.pet_keeper || "",
          phone_number: data.phone_number || "",
          email: data.email || "",
          address: data.address || "",
          country: data.country || "",
          pet_name: data.pet_name || "",
          pet_status: data.pet_status || "",
          type: data.type || "",
          breed: data.breed || "",
          sex: data.sex || "",
          color: data.color || "",
          dob: data.dob ? data.dob.split("T")[0] : "",
          markings: data.markings || "",
          photo: null,
        });

        setPhotoPath(data.photo);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load microchip data");
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <CommonLayout>
      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="page-header-container mb-3 d-flex align-items-center justify-content-between">
            <div className="page-header-title">
              <h1 className="fs-4 mb-0">Edit Pet Microchip</h1>
            </div>
            <div className="page-header-button">
              <Link href="/admin/microchip/list">
                <button className="btn btn-primary">
                  <i className="fa-solid fa-arrow-left"></i> Back
                </button>
              </Link>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <div className="page-table-container w-100">
              <div className="card-body">
                <div className="row">
                  {/* Microchip Number */}
                  <div className="col-12 mb-3">
                    <label htmlFor="microchipNumber" className="form-label">
                      Microchip Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="microchipNumber"
                      {...formik.getFieldProps("microchipNumber")}
                    />
                    {formik.touched.microchipNumber &&
                      formik.errors.microchipNumber && (
                        <div className="text-danger">
                          {formik.errors.microchipNumber}
                        </div>
                      )}
                  </div>

                  {/* Pet Keeper */}
                  <div className="col-12 mb-3">
                    <label htmlFor="pet_keeper" className="form-label">
                      Pet Keeper <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="pet_keeper"
                      {...formik.getFieldProps("pet_keeper")}
                    />
                    {formik.touched.pet_keeper && formik.errors.pet_keeper && (
                      <div className="text-danger">
                        {formik.errors.pet_keeper}
                      </div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="col-12 mb-3">
                    <label htmlFor="phone_number" className="form-label">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone_number"
                      {...formik.getFieldProps("phone_number")}
                    />
                    {formik.touched.phone_number &&
                      formik.errors.phone_number && (
                        <div className="text-danger">
                          {formik.errors.phone_number}
                        </div>
                      )}
                  </div>

                  {/* Email */}
                  <div className="col-12 mb-3">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      {...formik.getFieldProps("email")}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-danger">{formik.errors.email}</div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="col-12 mb-3">
                    <label htmlFor="address" className="form-label">
                      Address <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="address"
                      {...formik.getFieldProps("address")}
                    />
                    {formik.touched.address && formik.errors.address && (
                      <div className="text-danger">{formik.errors.address}</div>
                    )}
                  </div>

                  {/* Country */}
                  <div className="col-12 mb-3">
                    <label htmlFor="country" className="form-label">
                      Country <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="country"
                      {...formik.getFieldProps("country")}
                    />
                    {formik.touched.country && formik.errors.country && (
                      <div className="text-danger">{formik.errors.country}</div>
                    )}
                  </div>

                  {/* Pet Name */}
                  <div className="col-12 mb-3">
                    <label htmlFor="pet_name" className="form-label">
                      Pet Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="pet_name"
                      {...formik.getFieldProps("pet_name")}
                    />
                    {formik.touched.pet_name && formik.errors.pet_name && (
                      <div className="text-danger">
                        {formik.errors.pet_name}
                      </div>
                    )}
                  </div>

                  {/* Pet Status */}
                  <div className="col-12 mb-3">
                    <label htmlFor="pet_status" className="form-label">
                      Pet Status <span className="text-danger">*</span>
                    </label>
                    <Select
                      id="pet_status"
                      name="pet_status"
                      options={petStatusOptions}
                      value={petStatusOptions.find(
                        (option) => option.value === formik.values.pet_status
                      )}
                      onChange={(selectedOption) =>
                        formik.setFieldValue(
                          "pet_status",
                          selectedOption?.value || ""
                        )
                      }
                      onBlur={() => formik.setFieldTouched("pet_status", true)}
                    />
                    {formik.touched.pet_status && formik.errors.pet_status && (
                      <div className="text-danger">
                        {formik.errors.pet_status}
                      </div>
                    )}
                  </div>

                  {/* Type */}
                  <div className="col-12 mb-3">
                    <label htmlFor="type" className="form-label">
                      Type <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="type"
                      {...formik.getFieldProps("type")}
                    />
                    {formik.touched.type && formik.errors.type && (
                      <div className="text-danger">{formik.errors.type}</div>
                    )}
                  </div>

                  {/* Breed */}
                  <div className="col-12 mb-3">
                    <label htmlFor="breed" className="form-label">
                      Breed <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="breed"
                      {...formik.getFieldProps("breed")}
                    />
                    {formik.touched.breed && formik.errors.breed && (
                      <div className="text-danger">{formik.errors.breed}</div>
                    )}
                  </div>

                  {/* Sex */}
                  <div className="col-12 mb-3">
                    <label htmlFor="sex" className="form-label">
                      Sex <span className="text-danger">*</span>
                    </label>
                    <Select
                      id="sex"
                      name="sex"
                      options={sexOptions}
                      value={sexOptions.find(
                        (option) => option.value === formik.values.sex
                      )}
                      onChange={(selectedOption) =>
                        formik.setFieldValue("sex", selectedOption?.value || "")
                      }
                      onBlur={() => formik.setFieldTouched("sex", true)}
                    />
                    {formik.touched.sex && formik.errors.sex && (
                      <div className="text-danger">{formik.errors.sex}</div>
                    )}
                  </div>

                  {/* Color */}
                  <div className="col-12 mb-3">
                    <label htmlFor="color" className="form-label">
                      Color <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="color"
                      {...formik.getFieldProps("color")}
                    />
                    {formik.touched.color && formik.errors.color && (
                      <div className="text-danger">{formik.errors.color}</div>
                    )}
                  </div>

                  {/* DOB */}
                  <div className="col-12 mb-3">
                    <label htmlFor="dob" className="form-label">
                      Date of Birth <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="dob"
                      {...formik.getFieldProps("dob")}
                       max={new Date().toISOString().split("T")[0]}
                    />
                    {formik.touched.dob && formik.errors.dob && (
                      <div className="text-danger">{formik.errors.dob}</div>
                    )}
                  </div>

                  {/* Markings */}
                  <div className="col-12 mb-3">
                    <label htmlFor="markings" className="form-label">
                      Markings <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="markings"
                      {...formik.getFieldProps("markings")}
                    />
                    {formik.touched.markings && formik.errors.markings && (
                      <div className="text-danger">
                        {formik.errors.markings}
                      </div>
                    )}
                  </div>

                  {/* Photo */}
                  <div className="col-12 mb-3">
                    <label htmlFor="photo" className="form-label">
                      Photo <span className="text-danger">*</span>
                    </label>
                    <input
                      type="file"
                      name="photo"
                      className="form-control"
                      onChange={(e) =>
                        formik.setFieldValue("photo", e.currentTarget.files[0])
                      }
                    />
                    <Image
                      src={`${appUrl}uploads/${photoPath}`}
                      quality={100}
                      width={100}
                      height={100}
                      alt={formik?.pet_name}
                      unoptimized
                    />

                    {formik.touched.photo && formik.errors.photo && (
                      <div className="text-danger">{formik.errors.photo}</div>
                    )}
                  </div>

                  <div className="page-bottom-actions">
                    <button type="submit" className="btn btn-primary">
                      Update Microchip
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          <ToastContainer
            position="top-right"
            autoClose={1000}
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
