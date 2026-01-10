"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useEffect, useState, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import { Autocomplete, Select, TextField } from "@mui/material";
import Script from "next/script";
import ReactSelect from "react-select"; // default import
import { breedsByType, colorOptions } from "./data";
import ReCAPTCHA from "react-google-recaptcha";
import CreatableSelect from "react-select/creatable";

import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "./LocalStorage";
import { useRouter } from "next/navigation";
import { DecryptData, EncryptData } from "./HashData";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL
const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const secret = process.env.NEXT_PUBLIC_HASH_SECRET as string;
const authorizeUrl = process.env.NEXT_PUBLIC_AUTHORIZE_URL || "";

declare global {
  interface Window {
    appendHelcimPayIframe?: (
      checkoutToken: string,
      allowExit?: boolean
    ) => void;
  }
}

export default function MicrochipForm(microchip_number: any) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";
  const router = useRouter();
  const [isPaymentCardOpen, setIsPaymentCardOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const animalOptions = [
    { value: "Dog", label: "Dog" },
    { value: "Cat", label: "Cat" },
    { value: "Rabbit", label: "Rabbit" },
    { value: "Exotic", label: "Exotic animal" },
  ];

  const Decryptmicrochip_payment = DecryptData(
    getLocalStorageItem("microchip_paymentDetails") || "",
    secret
  );
  const fileInputRef = useRef(null);
  let token = getLocalStorageItem("token");
  const validationSchema = Yup.object({
    microchip_number: Yup.string()
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
    pet_keeper: Yup.string().required("Pet keeper is required"),
    phone_number: Yup.string().required("Phone number is required"),
    email: Yup.string().email("Invalid email"),

    address: Yup.string(),
    country: Yup.string().required("Country is required"),
    county: Yup.string().required("County is required"),
    postcode: Yup.string().required("Postcode is required"),
    pet_name: Yup.string().required("Pet name is required"),
    pet_status: Yup.string().required("Pet status is required"),
    type: Yup.string().required("Type of animal is required"),
    breed: Yup.string().required("Breed is required"),
    sex: Yup.string().required("Sex is required"),
    color: Yup.string(),
    dob: Yup.date(),
    markings: Yup.string(),
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
    company: Yup.string(),
    address_line1: Yup.string(),
    address_line2: Yup.string(),
    recaptcha: Yup.string().required("Please verify you are not a robot"),
  });

  const handleSubmit = async (
    values: any,
    { setFieldError, resetForm }: any
  ) => {
    try {
      const formData = new FormData();
      setIsSubmitting(true);
      // Append all fields to FormData
      Object.keys(values).forEach((key) => {
        if (key === "photo" && values.photo) {
          formData.append("photo", values.photo);
        } else {
          formData.append(key, values[key]);
        }
      });

      const res = await fetch(`${appUrl}frontend/microchip/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ attach token here
        },
        body: formData, // ✅ FormData should NOT have "Content-Type" manually set
      });

      const data = await res.json();

      if (data.statusCode === 200) {
        setLocalStorageItem(
          "microchip_paymentDetails",
          EncryptData(JSON.stringify(data.data), secret)
        );
        removeLocalStorageItem("microchip_number");

        if (data.paymentToken) {
          const form = document.createElement("form");
          form.method = "POST";
          form.action = authorizeUrl ;

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
        resetForm();
        setIsPaymentCardOpen(true);
        fileInputRef.current.value = "";
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message,
        });
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Something went wrong while submitting the form!",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openHelcimModal = (checkoutToken: string) => {
    if (!window.appendHelcimPayIframe) {
      toast.error("Payment service not loaded. Please refresh.");
      return;
    }

    window.appendHelcimPayIframe(checkoutToken, true);
  };

  const handleBuyNow = async (selectedPlan: string) => {
    try {
      const microchip_paymentDetails = JSON.parse(
        DecryptData(
          getLocalStorageItem("microchip_paymentDetails") || "",
          secret
        )
      );

      setIsLoading(true);
      const token = getLocalStorageItem("token");

      // 🔥 Choose API based on plan
      const url =
        selectedPlan === "annual"
          ? `${appUrl}frontend/microchip/subscription`
          : `${appUrl}frontend/microchip/payment`;

      const payload =
        selectedPlan === "annual"
          ? {
              microchip_id: microchip_paymentDetails.microchip_number,
              plan: "annual",
            }
          : {
              microchip_id: microchip_paymentDetails.microchip_number,
              selected_plan: selectedPlan, // lifetime
            };

      const res = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.statusCode === 200) {
        openHelcimModal(res.data.checkoutToken);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Payment initialization error", err);
      toast.error("Payment initialization failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (!event.data?.eventName) return;

      if (event.data.eventStatus === "SUCCESS") {
        console.log("✅ Payment success", JSON.parse(event.data.eventMessage));
        toast.success("Payment successful!");
        removeHelcimIframe();
      }

      if (event.data.eventStatus === "ABORTED") {
        console.error("❌ Payment failed", event.data.eventMessage);
        toast.error("Payment failed");
      }

      if (event.data.eventStatus === "HIDE") {
        console.log("ℹ️ Payment modal closed");
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    if (Decryptmicrochip_payment != null && Decryptmicrochip_payment !== "") {
      setIsPaymentCardOpen(true);
    }
  }, [Decryptmicrochip_payment]);

  return (
    <>
      {isSubmitting && (
        <div className="loader-overlay">
          <div className="spinner"></div>
        </div>
      )}

      <div className="form-lost">
        <p>
          Kindly ensure you provide at least your email address or phone number
          along with a brief message. The more details you share, the faster we
          can assist in reuniting pets with their keepers.
        </p>

        <Formik
          initialValues={{
            manualEntry: false,
            microchip_number: microchip_number?.microchipNumber,
            pet_keeper: "",
            phone_number: "",
            email: "",
            address: "",
            country: "",
            county: "", // <-- add this
            postcode: "", // <-- add this
            pet_name: "",
            pet_status: "",
            type: "",
            breed: "",
            sex: "",
            color: "",
            dob: "",
            markings: "",
            photo: null,
            company: "",
            address_line1: "",
            address_line2: "",
            recaptcha: "",
            selected_plan: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ setFieldValue, values, isSubmitting: formikSubmitting }) => {
            const addressRef = useRef<HTMLInputElement | null>(null);
            const manualEntry = values.manualEntry;

            useEffect(() => {
              // 👇 Skip setting up Google Autocomplete when in manual mode
              if (!googleMapsKey || values.manualEntry) return;

              const loader = new Loader({
                apiKey: googleMapsKey,
                libraries: ["places"],
              });

              loader.load().then((google) => {
                if (!addressRef.current) return;

                const autocomplete = new google.maps.places.Autocomplete(
                  addressRef.current,
                  {
                    types: ["geocode"],
                  }
                );

                autocomplete.addListener("place_changed", () => {
                  const place = autocomplete.getPlace();
                  const components: any = {};
                  place.address_components?.forEach((c: any) => {
                    const type = c.types[0];
                    components[type] = c.long_name;
                  });

                  setFieldValue("address", place.formatted_address || "");
                  setFieldValue(
                    "city",
                    components.locality || components.sublocality || ""
                  );
                  setFieldValue(
                    "state",
                    components.administrative_area_level_1 || ""
                  );
                  setFieldValue("postcode", components.postal_code || "");
                  setFieldValue("country", components.country || "");
                  setFieldValue(
                    "county",
                    components.administrative_area_level_2 || ""
                  );
                });
              });
            }, [setFieldValue, googleMapsKey, values.manualEntry]); // 👈 include manualEntry in deps

            return (
              <Form autoComplete="off">
                {/* Microchip Number */}
                <div className="form-floating mb-4">
                  <TextField
                    label="Microchip number"
                    fullWidth
                    value={values.microchip_number}
                    onChange={(e) =>
                      setFieldValue("microchip_number", e.target.value)
                    }
                  />

                  <ErrorMessage
                    name="microchip_number"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Pet Keeper */}
                <div className="form-floating mb-4">
                  <TextField
                    label="Registering pet keeper"
                    fullWidth
                    value={values.pet_keeper}
                    onChange={(e) =>
                      setFieldValue("pet_keeper", e.target.value)
                    }
                  />
                  <ErrorMessage
                    name="pet_keeper"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Phone Number */}
                <div className="form-floating mb-4">
                  <TextField
                    label="Keeper's phone number"
                    fullWidth
                    value={values.phone_number}
                    onChange={(e) =>
                      setFieldValue("phone_number", e.target.value)
                    }
                  />
                  <ErrorMessage
                    name="phone_number"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Email */}
                <div className="form-floating mb-4">
                  <TextField
                    label="Email address"
                    fullWidth
                    value={values.email}
                    onChange={(e) => setFieldValue("email", e.target.value)}
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Google Address or Manual Entry Toggle */}
                <div className="form-floating">
                  <textarea
                    id="address"
                    name="address"
                    className="form-control"
                    placeholder="Full address"
                    autoComplete="off"
                    ref={addressRef}
                    style={{ height: "100px" }}
                    value={values.address}
                    onChange={(e) => setFieldValue("address", e.target.value)}
                  />
                  <ErrorMessage
                    name="address"
                    component="div"
                    className="text-danger"
                  />
                  <label htmlFor="address">Full address</label>
                </div>

                {/* Toggle Button */}
                <div className="mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary manualEnter"
                    onClick={() =>
                      setFieldValue("manualEntry", !values.manualEntry)
                    }>
                    {manualEntry
                      ? "Use Google Autocomplete"
                      : "Enter Address Manually"}
                  </button>
                </div>

                {/* Manual Fields (shown only if manualEntry = true) */}
                {manualEntry && (
                  <>
                    {/* Company */}
                    <div className="form-floating mb-4">
                      <TextField
                        label="Company (optional)"
                        fullWidth
                        value={values.company}
                        onChange={(e) =>
                          setFieldValue("company", e.target.value)
                        }
                      />
                      <ErrorMessage
                        name="company"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    {/* Address Line 1 */}
                    <div className="form-floating mb-4">
                      <TextField
                        label="Address Line 1"
                        fullWidth
                        value={values.address_line1}
                        onChange={(e) =>
                          setFieldValue("address_line1", e.target.value)
                        }
                      />
                      <ErrorMessage
                        name="address_line1"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    {/* Address Line 2 */}
                    <div className="form-floating mb-4">
                      <TextField
                        label="Address Line 2"
                        fullWidth
                        value={values.address_line2}
                        onChange={(e) =>
                          setFieldValue("address_line2", e.target.value)
                        }
                      />
                      <ErrorMessage
                        name="address_line2"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                  </>
                )}

                {/* County */}
                <div className="form-floating mb-4">
                  <TextField
                    label="County"
                    fullWidth
                    value={values.county}
                    onChange={(e) => setFieldValue("county", e.target.value)}
                  />
                  <ErrorMessage
                    name="county"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Postcode */}
                <div className="form-floating mb-4">
                  <TextField
                    label="Postcode"
                    fullWidth
                    value={values.postcode}
                    onChange={(e) => setFieldValue("postcode", e.target.value)}
                  />
                  <ErrorMessage
                    name="postcode"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Country */}
                <div className="form-floating mb-4">
                  <TextField
                    label="Country"
                    fullWidth
                    value={values.country}
                    onChange={(e) => setFieldValue("country", e.target.value)}
                  />
                  <ErrorMessage
                    name="country"
                    component="div"
                    className="text-danger"
                  />{" "}
                </div>

                <h1>Pet's Information</h1>

                {/* Pet Name */}
                <div className="form-floating mb-4">
                  <TextField
                    name="pet_name"
                    label="Pet Name"
                    fullWidth
                    value={values.pet_name}
                    onChange={(e) => setFieldValue("pet_name", e.target.value)}
                  />

                  <ErrorMessage
                    name="pet_name"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Pet Status */}
                <div className="form-floating mb-4">
                  <Field
                    as="select"
                    id="pet_status"
                    name="pet_status"
                    className="form-control">
                    <option value="">Select Pet status</option>
                    <option value="not_lost_or_stolen">
                      Not lost or stolen
                    </option>
                    <option value="lost">Lost</option>
                    <option value="stolen">Stolen</option>
                  </Field>
                  <ErrorMessage
                    name="pet_status"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Type */}
                <div className="form-floating mb-4">
                  <ReactSelect
                    options={animalOptions}
                    value={animalOptions.find(
                      (option) => option.value === values.type
                    )}
                    onChange={(selectedOption: any) => {
                      setFieldValue("type", selectedOption?.value);
                      setFieldValue("breed", ""); // reset breed when type changes
                    }}
                    placeholder="Select an animal"
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      menu: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />

                  <ErrorMessage
                    name="type"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Breed */}
                <div className="form-floating mb-4">
                  <CreatableSelect
                    options={
                      values.type && breedsByType[values.type]
                        ? breedsByType[values.type].map((breed) => ({
                            value: breed,
                            label: breed,
                          }))
                        : []
                    }
                    value={
                      values.breed
                        ? { value: values.breed, label: values.breed }
                        : null
                    }
                    onChange={(selectedOption: any) =>
                      setFieldValue("breed", selectedOption?.value || "")
                    }
                    onCreateOption={(inputValue: string) => {
                      // allow manual breed entry
                      setFieldValue("breed", inputValue);
                    }}
                    placeholder={
                      values.type
                        ? "Select or type a breed"
                        : "Select animal first"
                    }
                    isDisabled={!values.type}
                    isClearable
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      menu: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />

                  <ErrorMessage
                    name="breed"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Sex */}
                <div className="form-floating mb-4">
                  <Field
                    as="select"
                    id="sex"
                    name="sex"
                    className="form-control">
                    <option value="">Select sex</option>
                    <option value="male">Male</option>
                    <option value="male_neutered">Male neutered</option>
                    <option value="female">Female</option>
                    <option value="female_spayed">Female spayed</option>
                    <option value="undetermined">Undetermined</option>
                  </Field>
                  <ErrorMessage
                    name="sex"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Color */}
                <div className="form-floating mb-4">
                  <ReactSelect
                    options={colorOptions}
                    value={colorOptions.find(
                      (option) => option.value === values.color
                    )}
                    onChange={(selectedOption: any) =>
                      setFieldValue("color", selectedOption?.value || "")
                    }
                    placeholder="Select color"
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      menu: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                  />
                  <ErrorMessage
                    name="color"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Date of Birth */}
                <div className="form-floating mb-4">
                  <TextField
                    label="Pet's Date of Birth"
                    fullWidth
                    type="date"
                    value={values.dob}
                    onChange={(e) => setFieldValue("dob", e.target.value)}
                  />
                  <ErrorMessage
                    name="dob"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Markings */}
                <div className="form-floating mb-4">
                  <TextField
                    label=" Any distinguishing markings?"
                    fullWidth
                    value={values.markings}
                    onChange={(e) => setFieldValue("markings", e.target.value)}
                  />
                  <ErrorMessage
                    name="markings"
                    component="div"
                    className="text-danger"
                  />
                </div>

                {/* Photo */}
                <div className="form-floating mb-4">
                  <input
                    ref={fileInputRef}
                    id="photo"
                    name="photo"
                    type="file"
                    className="form-control"
                    onChange={(event) => {
                      setFieldValue("photo", event.currentTarget.files?.[0]);
                    }}
                  />
                  <ErrorMessage
                    name="photo"
                    component="div"
                    className="text-danger"
                  />
                </div>
                <div className="mb-3">
                  <ReCAPTCHA
                    sitekey={siteKey}
                    onChange={(value) => setFieldValue("recaptcha", value)}
                  />
                  <ErrorMessage
                    name="recaptcha"
                    component="div"
                    className="text-danger"
                  />
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
                        values.selected_plan === "lifetime" ? "selected" : ""
                      }`}
                      onClick={() =>
                        setFieldValue("selected_plan", "lifetime")
                      }>
                      {/* Badge */}
                      <div className="plan-badge">Best Value</div>

                      <div className="payment-option-header">
                        <div className="radio-indicator" />
                        <div  className="banner-heading-title">
                          <h4><b>Lifetime Registration</b></h4>
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
                            <span className="payment_li_title">Permanent Enrollment:</span> Your pet is in our national
                            database for life.
                          </li>
                          <li>
                            <span className="payment_li_title">Printable QR Tag:</span> Instantly generate a custom QR
                            code for your pet's collar.
                          </li>
                          <li>
                            <span className="payment_li_title">Ownership History:</span> Solid digital proof of ownership
                            records.
                          </li>
                          <li>
                            <span className="payment_li_title">Vet & Shelter Notes:</span> Keep critical medical or
                            behavioral info accessible to rescuers.
                          </li>
                          <li>
                            <span className="payment_li_title">Priority Lookup:</span> Faster processing in our emergency
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
                        values.selected_plan === "annual" ? "selected" : ""
                      }`}
                      onClick={() => setFieldValue("selected_plan", "annual")}>
                      <div className="payment-option-header">
                        <div className="radio-indicator" />
                        <div className="banner-heading-title">
                          <h4>🛡️ Ann<b>ual Protection Plan</b></h4>
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
                            <span className="payment_li_title">Includes Lifetime Registration:</span> All the benefits of
                            our standard plan.
                          </li>
                          <li>
                            <span className="payment_li_title">Instant Multi-Channel Alerts:</span> Receive emergency
                            notifications via SMS and WhatsApp the second your
                            pet is found.
                          </li>
                          <li>
                            <span className="payment_li_title">Geo-Shelter Radius:</span> We notify shelters and vet
                            clinics in your specific geographic area if your pet
                            is reported lost.
                          </li>
                          <li>
                            <span className="payment_li_title">Multi-Animal Dashboard:</span> Manage all your pets' safety
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

                  <ErrorMessage
                    name="selected_plan"
                    component="div"
                    className="text-danger text-center mt-2"
                  />
                </div>

                <button type="submit" className="btn btn-primary text-white"  disabled={isSubmitting || formikSubmitting}>
                  Register
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
}
