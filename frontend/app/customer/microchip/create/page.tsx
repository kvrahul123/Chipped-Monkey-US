// app/dashboard/page.tsx
"use client";

import CommonLayout from "../../layouts/CommonLayouts"; // Import your common layout component
import Link from "next/link"; // Import Link for navigation
import { useState, useRef, useEffect } from "react"; // Import useState and useRef from React
import { useFormik } from "formik"; // Formik for form handling
import * as Yup from "yup"; // Yup for validation
import { toast, ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import axios from "axios";
import Select from "react-select";
import { breedsByType, colorOptions } from "@/app/common/data";
import { Loader } from "@googlemaps/js-api-loader";
import CreatableSelect from "react-select/creatable";

import ReactSelect from "react-select";
const secret = process.env.NEXT_PUBLIC_HASH_SECRET as string;
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL
const authorizeUrl = process.env.NEXT_PUBLIC_AUTHORIZE_URL || "";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
import { EncryptData, DecryptData } from "@/app/common/HashData";

declare global {
  interface Window {
    appendHelcimPayIframe?: (
      checkoutToken: string,
      allowExit?: boolean
    ) => void;
  }
}

export default function MicrochipCreatePage() {
  const router = useRouter();
  const token = getLocalStorageItem("token");
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentCardOpen, setIsPaymentCardOpen] = useState(false);
  const addressRef = useRef(null);
  const address2Ref = useRef(null);
  const [microchip_paymentDetails, setmicrochip_paymentDetails] = useState([]);
  const animalOptions = [
    { value: "Dog", label: "Dog" },
    { value: "Cat", label: "Cat" },
    { value: "Rabbit", label: "Rabbit" },
    { value: "Exotic", label: "Exotic animal" },
  ];
  // Options for Pet Status
  const petStatusOptions = [
    { value: "", label: "Select Pet status" },
    { value: "not_lost_or_stolen", label: "Not lost or stolen" },
    { value: "lost_or_stolen", label: "Lost or stolen" },
  ];

  // Options for Sex
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
    address_2: string;
    county: string;
    postcode: string;
    country: string;
    pet_name: string;
    pet_status: string;
    type: string;
    breed: string;
    sex: string;
    color: string;
    dob: string;
    markings: string;
    photo: string;
  };

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    microchipNumber: Yup.string()
      .required("Microchip number is required")
      .test("microchip-format", function (value) {
        if (!value) return false;

        const len = value.length;

        // 1️⃣ 15-digit numeric (ISO FDX-B)
        if (/^\d+$/.test(value)) {
          if (len !== 15) {
            return this.createError({
              message:
                "The length appears to be incorrect. A microchip number is typically 15 digits long", //for this exact 15 digits only numbers
            });
          }
          return true;
        }

        // 2️⃣ 10-character alphanumeric (ISO format)
        if (/^\d{9}[A-Za-z0-9]$/.test(value)) {
          // <-- updated regex
          if (len !== 10) {
            return this.createError({
              message:
                "The length appears to be incorrect. An Alpha numeric microchip number is typically 10 digits long", // for this exact 9 digits numbers and one numeric
            });
          }
          return true;
        }

        // 3️⃣ AVID format (legacy / non-ISO)
        if (/^[A-Za-z]{4}(\d{5}|\d{9})$/.test(value)) {
          const count = value.replace(/\*/g, "").length;
          if (count < 9 || count > 13) {
            return this.createError({
              message:
                "The length appears to be incorrect. An AVID microchip number is typically 9/13 digits long", //for tis exact 4 alpha and 5 numeric or 4 alpha and 9 numeric
            });
          }
          return true;
        }
        // If none match
        return this.createError({
          message:
            "The length appears to be incorrect. A microchip number is typically 15 digits long",
        });
      }),
    pet_keeper: Yup.string().required("Pet Keeper is required"),
    phone_number: Yup.string()
      .matches(/^\d+$/, "Phone Number must contain only digits")
      .required("Phone Number is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    address: Yup.string().required("Address Line 1 is required"),
    address_2: Yup.string().required("Address Line 2 is required"),
    county: Yup.string().required("County is required"),
    postcode: Yup.string().required("Postcode is required"),
    country: Yup.string().required("Country is required"),
    pet_name: Yup.string().required("Pet Name is required"),
    pet_status: Yup.string().required("Pet Status is required"),
    type: Yup.string().required("Type is required"),
    breed: Yup.string().required("Breed is required"),
    sex: Yup.string().required("Sex is required"),
    color: Yup.string().required("Color is required"),
    dob: Yup.string().required("Date of Birth is required"),
    markings: Yup.string().required("Markings are required"),
    selected_plan: Yup.string().required("Please select a payment plan"),
    photo: Yup.mixed()
      .required("Pet image is required")
      .test("fileType", "Only image files are allowed", (value) => {
        return (
          !value ||
          (value &&
            ["image/jpeg", "image/png", "image/webp"].includes(value.type))
        );
      })
      .test("fileSize", "Image size must be less than 2MB", (value) => {
        return !value || (value && value.size <= 2 * 1024 * 1024);
      }),
  });

  // Formik setup
  const formik = useFormik({
    initialValues: {
      microchipNumber: "",
      pet_keeper: "",
      phone_number: "",
      email: "",
      address: "",
      address_2: "",
      county: "",
      postcode: "",
      country: "",
      pet_name: "",
      pet_status: "",
      type: "",
      breed: "",
      sex: "",
      color: "",
      dob: "",
      markings: "",
      selected_plan: "",
      photo: null,
    },

    validationSchema,
    onSubmit: async (values: Values, { setSubmitting }) => {
      setSubmitting(true);
      const formData = new FormData();

      formData.append("microchipNumber", values.microchipNumber);
      formData.append("pet_keeper", values.pet_keeper);
      formData.append("phone_number", values.phone_number);
      formData.append("email", values.email);
      formData.append("address", values.address);
      formData.append("address_2", values.address_2);
      formData.append("county", values.county);
      formData.append("postcode", values.postcode);
      formData.append("country", values.country);
      formData.append("pet_name", values.pet_name);
      formData.append("pet_status", values.pet_status);
      formData.append("type", values.type);
      formData.append("breed", values.breed);
      formData.append("sex", values.sex);
      formData.append("color", values.color);
      formData.append("dob", values.dob);
      formData.append("selected_plan", values.selected_plan);
      formData.append("markings", values.markings);

      if (values.photo) {
        formData.append("photo", values.photo); // file object
      }

      try {
        const response = await axios.post(
          `${appUrl}microchip/create`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.statusCode === 201) {
          let data = response.data;
          if (data.paymentToken) {
            const form = document.createElement("form");
            form.method = "POST";
            form.action = authorizeUrl;

            const input = document.createElement("input");
            input.type = "hidden";
            input.name = "token";
            input.value = data.paymentToken;

            form.appendChild(input);
            document.body.appendChild(form);
            form.submit();
          } else {
            toast.info("Microchip created successfully.");
          }
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const openHelcimModal = (checkoutToken: string) => {
    if (!window.appendHelcimPayIframe) {
      toast.error("Payment service not loaded. Please refresh.");
      return;
    }
    window.appendHelcimPayIframe(checkoutToken, true);
  };

  //useEffect(() => {
  //   const loader = new Loader({
  //     apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  //     libraries: ["places"],
  //   });

  //   loader.load().then(() => {
  //     if (!addressRef.current) return;

  //     const autocomplete = new google.maps.places.Autocomplete(
  //       addressRef.current,
  //       {
  //         fields: ["address_components", "formatted_address", "geometry"],
  //         componentRestrictions: { country: "us" }, // 🔥 Restrict to UK
  //         types: ["address"], // 🔥 Use "address" not "geocode"
  //       }
  //     );

  //     autocomplete.addListener("place_changed", () => {
  //       const place = autocomplete.getPlace();
  //       if (!place.address_components) return;

  //       const comp = {};
  //       place.address_components.forEach((c) => {
  //         comp[c.types[0]] = c.long_name;
  //       });

  //       const postcode = comp.postal_code || "";
  //       const city = comp.post_town || comp.locality || "";
  //       const county =
  //         comp.administrative_area_level_2 ||
  //         comp.administrative_area_level_1 ||
  //         "";
  //       const country = comp.country || "United Kingdom";

  //       formik.setFieldValue("address", place.formatted_address);
  //       formik.setFieldValue("county", county);
  //       formik.setFieldValue("postcode", postcode);
  //       formik.setFieldValue("country", country);
  //     });
  //   });
  // }, [addressRef]);

  return (
    <CommonLayout>
      {formik.isSubmitting && (
        <div className="loader-overlay">
          <div className="spinner"></div>
        </div>
      )}
      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="page-header-container mb-3 d-flex align-items-center justify-content-between">
            <div className="page-header-title">
              <h1 className="fs-4 mb-0">Create Pet Microchip</h1>
            </div>
            <div className="page-header-button">
              <Link href="/customer/microchip/list">
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
                    <div className="input-field-main-container">
                      <div className="input-label-container">
                        <label htmlFor="microchipNumber" className="form-label">
                          Microchip Number{" "}
                          <span className="text-danger">*</span>
                        </label>
                      </div>
                      <div className="input-field-container">
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
                    </div>
                  </div>

                  {/* Pet Keeper */}
                  <div className="col-12 mb-3">
                    <div className="input-field-container">
                      <label htmlFor="pet_keeper" className="form-label">
                        Pet Keeper <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="pet_keeper"
                        {...formik.getFieldProps("pet_keeper")}
                      />
                    </div>
                    {formik.touched.pet_keeper && formik.errors.pet_keeper && (
                      <div className="text-danger">
                        {formik.errors.pet_keeper}
                      </div>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="col-12 mb-3">
                    <div className="input-field-container">
                      <label htmlFor="phone_number" className="form-label">
                        Phone Number <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="phone_number"
                        {...formik.getFieldProps("phone_number")}
                      />
                    </div>
                    {formik.touched.phone_number &&
                      formik.errors.phone_number && (
                        <div className="text-danger">
                          {formik.errors.phone_number}
                        </div>
                      )}
                  </div>

                  {/* Email */}
                  <div className="col-12 mb-3">
                    <div className="input-field-container">
                      <label htmlFor="email" className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        {...formik.getFieldProps("email")}
                      />
                    </div>
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-danger">{formik.errors.email}</div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="col-12 mb-3">
                    <div className="input-field-container">
                      <label htmlFor="address" className="form-label">
                        Address Line 1<span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        id="address"
                        autoComplete="off"
                        ref={addressRef}
                        {...formik.getFieldProps("address")}
                      />
                    </div>
                    <span className="mt-1">
                      Street address,P.O. box, company name, c/o
                    </span>
                    {formik.touched.address && formik.errors.address && (
                      <div className="text-danger">{formik.errors.address}</div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="col-12 mb-3">
                    <div className="input-field-container">
                      <label htmlFor="address_2" className="form-label">
                        Address Line 2<span className="text-danger">*</span>
                      </label>
                      <input
                        className="form-control"
                        id="address_2"
                        autoComplete="off"
                        ref={address2Ref}
                        {...formik.getFieldProps("address_2")}
                      />
                    </div>
                    <span className="mt-1">
                      Apartment, suite, unit, building, floor, etc
                    </span>
                    {formik.touched.address_2 && formik.errors.address_2 && (
                      <div className="text-danger">
                        {formik.errors.address_2}
                      </div>
                    )}
                  </div>

                  {/* County */}
                  <div className="col-12 mb-3">
                    <div className="input-field-container">
                      <label htmlFor="county" className="form-label">
                        County <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="county"
                        {...formik.getFieldProps("county")}
                      />
                    </div>
                    {formik.touched.county && formik.errors.county && (
                      <div className="text-danger">{formik.errors.county}</div>
                    )}
                  </div>

                  {/* Postcode */}
                  <div className="col-12 mb-3">
                    <div className="input-field-container">
                      <label htmlFor="postcode" className="form-label">
                        Zip/Postcode <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="postcode"
                        {...formik.getFieldProps("postcode")}
                      />
                    </div>
                    {formik.touched.postcode && formik.errors.postcode && (
                      <div className="text-danger">
                        {formik.errors.postcode}
                      </div>
                    )}
                  </div>

                  {/* Country */}
                  <div className="col-12 mb-3">
                    <div className="input-field-container">
                      <label htmlFor="country" className="form-label">
                        Country <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="country"
                        {...formik.getFieldProps("country")}
                      />
                    </div>
                    {formik.touched.country && formik.errors.country && (
                      <div className="text-danger">{formik.errors.country}</div>
                    )}
                  </div>

                  {/* Pet Name */}
                  <div className="col-12 mb-3">
                    <div className="input-field-container">
                      <label htmlFor="pet_name" className="form-label">
                        Pet Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="pet_name"
                        {...formik.getFieldProps("pet_name")}
                      />
                    </div>
                    {formik.touched.pet_name && formik.errors.pet_name && (
                      <div className="text-danger">
                        {formik.errors.pet_name}
                      </div>
                    )}
                  </div>

                  {/* Pet Status */}
                  <div className="col-12 mb-3">
                    <div className="input-field-container">
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
                        onBlur={() =>
                          formik.setFieldTouched("pet_status", true)
                        }
                      />
                    </div>
                    {formik.touched.pet_status && formik.errors.pet_status && (
                      <div className="text-danger">
                        {formik.errors.pet_status}
                      </div>
                    )}
                  </div>

                  {/* Type */}
                  <div className="col-12 mb-3">
                    <div className="input-field-container">
                      <label htmlFor="type" className="form-label">
                        Type <span className="text-danger">*</span>
                      </label>
                      <ReactSelect
                        id="type"
                        name="type"
                        options={animalOptions}
                        value={animalOptions.find(
                          (option) => option.value === formik.values.type
                        )}
                        onChange={(selectedOption: any) => {
                          formik.setFieldValue(
                            "type",
                            selectedOption?.value || ""
                          );
                          formik.setFieldValue("breed", ""); // reset breed when type changes
                        }}
                        onBlur={() => formik.setFieldTouched("type", true)}
                        placeholder="Select an animal"
                        menuPortalTarget={
                          typeof window !== "undefined" ? document.body : null
                        }
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          menu: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                    </div>
                    {formik.touched.type && formik.errors.type && (
                      <div className="text-danger">{formik.errors.type}</div>
                    )}
                  </div>

                  {/* Breed */}
                  <div className="col-12 mb-3">
                    <div className="input-field-container">
                      <label htmlFor="breed" className="form-label">
                        Breed <span className="text-danger">*</span>
                      </label>

                      <CreatableSelect
                        id="breed"
                        name="breed"
                        options={
                          formik.values.type && breedsByType[formik.values.type]
                            ? breedsByType[formik.values.type].map((breed) => ({
                                value: breed,
                                label: breed,
                              }))
                            : []
                        }
                        value={
                          formik.values.breed
                            ? {
                                value: formik.values.breed,
                                label: formik.values.breed,
                              }
                            : null
                        }
                        onChange={(selectedOption: any) =>
                          formik.setFieldValue(
                            "breed",
                            selectedOption?.value || ""
                          )
                        }
                        onCreateOption={(inputValue: string) => {
                          // manual breed entry
                          formik.setFieldValue("breed", inputValue);
                        }}
                        onBlur={() => formik.setFieldTouched("breed", true)}
                        placeholder={
                          formik.values.type
                            ? "Select or type a breed"
                            : "Select animal first"
                        }
                        isDisabled={!formik.values.type}
                        isClearable
                        menuPortalTarget={
                          typeof window !== "undefined" ? document.body : null
                        }
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          menu: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                    </div>

                    {formik.touched.breed && formik.errors.breed && (
                      <div className="text-danger">{formik.errors.breed}</div>
                    )}
                  </div>

                  {/* Sex */}
                  <div className="col-12 mb-3">
                    <div className="input-field-container">
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
                          formik.setFieldValue(
                            "sex",
                            selectedOption?.value || ""
                          )
                        }
                        onBlur={() => formik.setFieldTouched("sex", true)}
                      />
                    </div>
                    {formik.touched.sex && formik.errors.sex && (
                      <div className="text-danger">{formik.errors.sex}</div>
                    )}
                  </div>

                  {/* Color */}
                  <div className="col-12 mb-3">
                    <div className="input-field-container">
                      <label htmlFor="color" className="form-label">
                        Color <span className="text-danger">*</span>
                      </label>
                      <Select
                        id="color"
                        name="color"
                        options={colorOptions}
                        value={colorOptions.find(
                          (option) => option.value === formik.values.color
                        )}
                        onChange={(selectedOption) =>
                          formik.setFieldValue(
                            "color",
                            selectedOption?.value || ""
                          )
                        }
                        onBlur={() => formik.setFieldTouched("color", true)}
                        menuPortalTarget={
                          typeof window !== "undefined" ? document.body : null
                        }
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                          menu: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                    </div>
                    {formik.touched.color && formik.errors.color && (
                      <div className="text-danger">{formik.errors.color}</div>
                    )}
                  </div>

                  {/* DOB */}
                  <div className="col-12 mb-3">
                    <div className="input-field-container">
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
                    </div>
                    {formik.touched.dob && formik.errors.dob && (
                      <div className="text-danger">{formik.errors.dob}</div>
                    )}
                  </div>

                  {/* Markings */}
                  <div className="col-12 mb-3">
                    <div className="input-field-container">
                      <label htmlFor="markings" className="form-label">
                        Markings <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className="form-control"
                        id="markings"
                        {...formik.getFieldProps("markings")}
                      />
                    </div>
                    {formik.touched.markings && formik.errors.markings && (
                      <div className="text-danger">
                        {formik.errors.markings}
                      </div>
                    )}
                  </div>

                  {/* Photo */}
                  <div className="col-12 mb-3">
                    <div className="input-field-container">
                      <label htmlFor="photo" className="form-label">
                        Photo <span className="text-danger">*</span>
                      </label>
                      <input
                        type="file"
                        name="photo"
                        className="form-control"
                        onChange={(e) =>
                          formik.setFieldValue(
                            "photo",
                            e.currentTarget.files[0]
                          )
                        }
                      />
                    </div>

                    {formik.touched.photo && formik.errors.photo && (
                      <div className="text-danger">{formik.errors.photo}</div>
                    )}
                  </div>
                <p>
                  Every year, millions of pets go missing. A microchip is their
                  "silent ticket" home—but it only works if it’s registered! By
                  enrolling your pet with ChippedMonkey, you ensure that vets
                  and shelters can find you the moment your furry friend is
                  scanned.
                </p>
                <div className="row mt-5 payment-options">
                  {/* Lifetime Registration */}
                  <div className="col-lg-6 mb-4">
                    <div
                      className={`payment-option-card ${
                        formik.values.selected_plan === "lifetime" ? "selected" : ""
                      }`}
                      onClick={() =>
                        formik.setFieldValue("selected_plan", "lifetime")
                      }>
                      {/* Badge */}
                      <div className="plan-badge">Best Value</div>

                      <div className="payment-option-header">
                        <div className="radio-indicator" />
                        <div>
                          <h4>Lifetime Registration</h4>
                          <p>One-time payment. Forever protection.</p>
                        </div>
                      </div>

                      <div className="payment-option-body">
                        <p className="plan-subtext">
                          Our most popular choice for pet parents who want to
                          “set it and forget it.”
                        </p>

                        <ul className="feature-list">
                          <li>
                            Permanent Enrollment: Your pet is in our national
                            database for life.
                          </li>
                          <li>
                            Printable QR Tag: Instantly generate a custom QR
                            code for your pet's collar.
                          </li>
                          <li>
                            Ownership History: Solid digital proof of ownership
                            records.
                          </li>
                          <li>
                            Vet & Shelter Notes: Keep critical medical or
                            behavioral info accessible to rescuers.
                          </li>
                          <li>
                            Priority Lookup: Faster processing in our emergency
                            database.
                          </li>
                        </ul>
                      </div>

                      <div className="payment-option-price">
                        <span className="price">$49</span>
                        <span className="billing">(Once)</span>
                      </div>
                    </div>
                  </div>

                  {/* Annual Protection Plan */}
                  <div className="col-lg-6 mb-4">
                    <div
                      className={`payment-option-card ${
                        formik.values.selected_plan === "annual" ? "selected" : ""
                      }`}
                      onClick={() => formik.setFieldValue("selected_plan", "annual")}>
                      <div className="payment-option-header">
                        <div className="radio-indicator" />
                        <div>
                          <h4>🛡️ Annual Protection Plan</h4>
                          <p>Premium features for the ultimate safety net.</p>
                        </div>
                      </div>

                      <div className="payment-option-body">
                        <p className="plan-subtext">
                          For the proactive pet parent who wants real-time
                          alerts and advanced tools.
                        </p>

                        <ul className="feature-list">
                          <li>
                            Includes Lifetime Registration: All the benefits of
                            our standard plan.
                          </li>
                          <li>
                            Instant Multi-Channel Alerts: Receive emergency
                            notifications via SMS and WhatsApp the second your
                            pet is found.
                          </li>
                          <li>
                            Geo-Shelter Radius: We notify shelters and vet
                            clinics in your specific geographic area if your pet
                            is reported lost.
                          </li>
                          <li>
                            Multi-Animal Dashboard: Manage all your pets' safety
                            profiles from one easy-to-use screen.
                          </li>
                          <li>Pet lost and found image match up tool</li>
                        </ul>
                      </div>

                      <div className="payment-option-price">
                        <span className="price">$19.99</span>
                        <span className="billing">(Billed Annually)</span>
                      </div>
                    </div>
                  </div>
                    {formik.touched.selected_plan && formik.errors.selected_plan && (
                      <div className="text-danger">{formik.errors.selected_plan}</div>
                    )}
                </div>

                  <div className="page-bottom-actions">
                    <button type="submit" className="btn btn-primary">
                      Save Microchip
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
