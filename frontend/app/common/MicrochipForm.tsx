"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useEffect, useState, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";
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

export default function MicrochipForm(microchip_number: any) {
  const router = useRouter();
  const [isPaymentCardOpen, setIsPaymentCardOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
              message:
                "Invalid length – 10-character alphanumeric microchips required.",
            });
          }
          return true;
        }

        // 3️⃣ AVID format (letters, numbers, *)
        if (/^[A-Za-z0-9*]+$/.test(value)) {
          const count = value.replace(/\*/g, "").length;
          if (count < 9 || count > 13) {
            return this.createError({
              message:
                "Incorrect length – AVID microchips must be 9–13 characters.",
            });
          }
          return true;
        }

        // If none match
        return this.createError({
          message: "Invalid microchip number format.",
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
    breed: Yup.string(),
    sex: Yup.string().required("Sex is required"),
    color: Yup.string(),
    dob: Yup.date(),
    markings: Yup.string(),
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

        // await Swal.fire({
        //   icon: "success",
        //   title: "Success!",
        //   text: "Microchip registered successfully!",
        //   showConfirmButton: true,
        //   confirmButtonText: "OK",
        // });
        //router.push("/pet-owners/update-pet-microchip");
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

  const handleBuyNow = async (selectedPlan: string) => {
    try {
      let microchip_paymentDetails = DecryptData(
        getLocalStorageItem("microchip_paymentDetails") || "",
        secret
      );
      let token = getLocalStorageItem("token");
      microchip_paymentDetails = JSON.parse(microchip_paymentDetails);
      const microchipId = microchip_paymentDetails?.microchip_number;

      const res = await axios.post(
        `${appUrl}frontend/microchip/payment`,
        {
          microchip_id: microchipId,
          selected_plan: selectedPlan,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Only if API returns 200
      if (res.data.statusCode === 200) {
        const { nextUrl, formFields } = res.data;

        // Auto-submit hidden form
        const form = document.createElement("form");
        form.method = "POST";
        form.action = nextUrl;

        Object.entries(formFields).forEach(([key, value]) => {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = value;
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
      } else {
        // Show toast for errors
        toast.error(res.data.message || "Something went wrong");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to create payment session"
      );
    }
  };

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

      {!isPaymentCardOpen ? (
        <div className="form-lost">
          <p>
            Kindly ensure you provide at least your email address or phone
            number along with a brief message. The more details you share, the
            faster we can assist in reuniting pets with their keepers.
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
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ setFieldValue, values }) => {
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
                    <Field
                      id="microchip_number"
                      name="microchip_number"
                      type="text"
                      className="form-control"
                      placeholder="Microchip number"
                    />
                    <ErrorMessage
                      name="microchip_number"
                      component="div"
                      className="text-danger"
                    />
                    <label htmlFor="microchip_number">Microchip number</label>
                  </div>

                  {/* Pet Keeper */}
                  <div className="form-floating mb-4">
                    <Field
                      id="pet_keeper"
                      name="pet_keeper"
                      type="text"
                      className="form-control"
                      placeholder="Registering pet keeper"
                    />
                    <ErrorMessage
                      name="pet_keeper"
                      component="div"
                      className="text-danger"
                    />
                    <label htmlFor="pet_keeper">Registering pet keeper</label>
                  </div>

                  {/* Phone Number */}
                  <div className="form-floating mb-4">
                    <Field
                      id="phone_number"
                      name="phone_number"
                      type="text"
                      className="form-control"
                      placeholder="Keeper's phone number"
                    />
                    <ErrorMessage
                      name="phone_number"
                      component="div"
                      className="text-danger"
                    />
                    <label htmlFor="phone_number">Keeper's phone number</label>
                  </div>

                  {/* Email */}
                  <div className="form-floating mb-4">
                    <Field
                      id="email"
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="Email address"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                    <label htmlFor="email">Email address</label>
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
                        <Field
                          id="company"
                          name="company"
                          type="text"
                          className="form-control"
                          placeholder="Company (optional)"
                        />
                        <ErrorMessage
                          name="company"
                          component="div"
                          className="text-danger"
                        />
                        <label htmlFor="company">Company (optional)</label>
                      </div>

                      {/* Address Line 1 */}
                      <div className="form-floating mb-4">
                        <Field
                          id="address_line1"
                          name="address_line1"
                          type="text"
                          className="form-control"
                          placeholder="Address Line 1"
                        />
                        <ErrorMessage
                          name="address_line1"
                          component="div"
                          className="text-danger"
                        />
                        <label htmlFor="address_line1">Address Line 1</label>
                      </div>

                      {/* Address Line 2 */}
                      <div className="form-floating mb-4">
                        <Field
                          id="address_line2"
                          name="address_line2"
                          type="text"
                          className="form-control"
                          placeholder="Address Line 2"
                        />
                        <ErrorMessage
                          name="address_line2"
                          component="div"
                          className="text-danger"
                        />
                        <label htmlFor="address_line2">Address Line 2</label>
                      </div>
                    </>
                  )}

                  {/* County */}
                  <div className="form-floating mb-4">
                    <Field
                      id="county"
                      name="county"
                      type="text"
                      className="form-control"
                      placeholder="County"
                    />
                    <ErrorMessage
                      name="county"
                      component="div"
                      className="text-danger"
                    />
                    <label htmlFor="county">County</label>
                  </div>

                  {/* Postcode */}
                  <div className="form-floating mb-4">
                    <Field
                      id="postcode"
                      name="postcode"
                      type="text"
                      className="form-control"
                      placeholder="Postcode"
                    />
                    <ErrorMessage
                      name="postcode"
                      component="div"
                      className="text-danger"
                    />
                    <label htmlFor="country">Postcode</label>
                  </div>

                  {/* Country */}
                  <div className="form-floating mb-4">
                    <Field
                      id="country"
                      name="country"
                      type="text"
                      className="form-control"
                      placeholder="Country"
                    />
                    <ErrorMessage
                      name="country"
                      component="div"
                      className="text-danger"
                    />
                    <label htmlFor="country">Country</label>
                  </div>

                  <h1>Pet's Information</h1>

                  {/* Pet Name */}
                  <div className="form-floating mb-4">
                    <Field
                      id="pet_name"
                      name="pet_name"
                      type="text"
                      className="form-control"
                      placeholder="Pet's name"
                    />
                    <ErrorMessage
                      name="pet_name"
                      component="div"
                      className="text-danger"
                    />
                    <label htmlFor="pet_name">Pet's name</label>
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
                      <option value="lost_or_stolen">Lost or stolen</option>
                    </Field>
                    <ErrorMessage
                      name="pet_status"
                      component="div"
                      className="text-danger"
                    />
                  </div>

                  {/* Type */}
                  <div className="form-floating mb-4">
                    <Field
                      id="type"
                      name="type"
                      type="text"
                      className="form-control"
                      placeholder="Type of animal"
                    />
                    <ErrorMessage
                      name="type"
                      component="div"
                      className="text-danger"
                    />
                    <label htmlFor="type">Type of animal</label>
                  </div>

                  {/* Breed */}
                  <div className="form-floating mb-4">
                    <Field
                      id="breed"
                      name="breed"
                      type="text"
                      className="form-control"
                      placeholder="Breed"
                    />
                    <ErrorMessage
                      name="breed"
                      component="div"
                      className="text-danger"
                    />
                    <label htmlFor="breed">Breed</label>
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
                    <Field
                      id="color"
                      name="color"
                      type="text"
                      className="form-control"
                      placeholder="Color"
                    />
                    <ErrorMessage
                      name="color"
                      component="div"
                      className="text-danger"
                    />
                    <label htmlFor="color">Color</label>
                  </div>

                  {/* Date of Birth */}
                  <div className="form-floating mb-4">
                    <Field
                      id="dob"
                      name="dob"
                      type="date"
                      className="form-control"
                      max={new Date().toISOString().split("T")[0]}
                    />
                    <ErrorMessage
                      name="dob"
                      component="div"
                      className="text-danger"
                    />
                    <label htmlFor="dob">Pet's Date of Birth</label>
                  </div>

                  {/* Markings */}
                  <div className="form-floating mb-4">
                    <Field
                      id="markings"
                      name="markings"
                      type="text"
                      className="form-control"
                      placeholder="Any distinguishing markings?"
                    />
                    <ErrorMessage
                      name="markings"
                      component="div"
                      className="text-danger"
                    />
                    <label htmlFor="markings">
                      Any distinguishing markings?
                    </label>
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

                  <button type="submit" className="btn btn-primary text-white">
                    Register
                  </button>
                </Form>
              );
            }}
          </Formik>
        </div>
      ) : (
        <div className="row mt-5 payment_card">
          <div className="col-lg-12 mb-4">
            <div className="packages-container">
              <div className="package-container-title">
                <h3>Standard</h3>
              </div>
              <div className="package-container-payment">
                <h4 className="d-flex justify-content-center align-items-center payment-middle">
                  <span>£</span>
                  15.00 <span className="packagepayment_type">Lifetime</span>
                </h4>
              </div>

              <div className="package-container-description">
                <ul>
                  <li>Pet microchip registration</li>
                  <li>Demo Video</li>
                </ul>
              </div>
              <div className="package-btn-container">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleBuyNow("standard")}>
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-12 mb-4">
            {" "}
            <div className="packages-container">
              <div className="package-container-title">
                <h3>Premium</h3>
              </div>
              <div className="package-container-payment">
                <h4 className="d-flex justify-content-center align-items-center payment-middle">
                  <span>£</span>
                  50.00 <span className="packagepayment_type">Yearly</span>
                </h4>
              </div>

              <div className="package-container-description">
                <ul>
                  <li>Location pet</li>
                  <li>Contact vet email</li>
                  <li>Lost pet listings</li>
                  <li>24/7 customer care</li>
                  <li>Demo Video</li>
                  <li>Pet microchip registration</li>
                </ul>
              </div>
              <div className="package-btn-container">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleBuyNow("premium")}>
                  Buy Now
                </button>
              </div>
            </div>
          </div>

          <div className="col-lg-12 mb-4">
            {" "}
            <div className="packages-container">
              <div className="package-container-title">
                <h3>Platinum</h3>
              </div>
              <div className="package-container-payment">
                <h4 className="d-flex justify-content-center align-items-center payment-middle">
                  <span>£</span>
                  3.99 <span className="packagepayment_type">Monthly</span>
                </h4>
              </div>

              <div className="package-container-description">
                <ul>
                  <li>Location pet</li>
                  <li>Contact vet email</li>
                  <li>Lost pet listings</li>
                  <li>24/7 customer care</li>
                  <li>Demo Video</li>
                  <li>Pet microchip registration</li>
                </ul>
              </div>
              <div className="package-btn-container">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleBuyNow("platinum")}>
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
