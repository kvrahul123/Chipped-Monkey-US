"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Suspense } from "react";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
  setLocalStorageItem,
} from "@/app/common/LocalStorage";
import withAuth from "@/app/common/withAuth";
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL
const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
import { Loader } from "@googlemaps/js-api-loader";
import { DecryptData } from "@/app/common/HashData";
const secret = process.env.NEXT_PUBLIC_HASH_SECRET as string;

interface FormValues {
  breeder_check: boolean;
  account_type: string;
  title: string;
  first_name: string;
  surf_name: string;
  email: string;
  phone: string;
  emergency_number: string;
  date_of_birth: string;
  address_1: string;
  address_2: string;
  city: string;
  county: string;
  country: string;
  address_3?: string | null;
  postcode: string;
  password: string;
  confirm_password: string;

  implanter_radio: string;
  implanter_certificate: string;
  implanter_pin: string;

  breeder_licence_no: string;
  breeder_local_authority: string;
  dealer_licence_no: string;
  dealer_local_authority: string;

  local_authority: string;
}

export const RegisterForm = () => {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      try {
        const decoded = atob(token);
        setSelectedType(decoded);
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const [selected, setSelected] = useState("implanter_pin");
  const [genders, setGenders] = useState<{ id: string; title: string }[]>([]);
  const [isBreeder, setIsBreeder] = useState(false);

  let token = getLocalStorageItem("token");
  useEffect(() => {
    if (token) {
      router.push("/customer/dashboard");
    }
  }, [token]);
  useEffect(() => {
    fetch(`${appUrl}frontend/gender/list`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.data) {
          setGenders(data.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching genders:", err);
      });
  }, []);

  const accountType = (value: string) => {};

  const toggleBreeder = (val) => {};

  const validationSchema = Yup.object({
    account_type: Yup.string().required("Account Type is required"),
    title: Yup.string().required("Title is required"),
    first_name: Yup.string().required("First name is required"),
    surf_name: Yup.string().required("Surname is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must contain only digits")
      .required("Phone is required"),
    emergency_number: Yup.string()
      .matches(/^[0-9]+$/, "Emergency number must contain only digits")
      .required("Emergency number is required"),
    date_of_birth: Yup.string().required("DOB is required"),
    address_1: Yup.string().required("Address 1 is required"),
    address_2: Yup.string().nullable(),
    city: Yup.string().required("City is required"),
    county: Yup.string().required("County is required"),
    country: Yup.string().required("Country is required"),
    address_3: Yup.string().nullable(),
    postcode: Yup.string().required("Postcode is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),

    implanter_radio: Yup.string().when("account_type", {
      is: (val: string) => val === "1",
      then: (schema) => schema.required("Implanter is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    implanter_certificate: Yup.mixed().when(
      ["account_type", "implanter_radio"],
      {
        is: (account_type: string, implanter_radio: string) =>
          account_type === "1" && implanter_radio === "implanter_certificate",
        then: (schema) => schema.required("Implanter Certificate is required"),
        otherwise: (schema) => schema.notRequired(),
      }
    ),

    implanter_pin: Yup.string().when(["account_type", "implanter_radio"], {
      is: (account_type: string, implanter_radio: string) =>
        account_type === "1" && implanter_radio === "implanter_pin",
      then: (schema) => schema.required("Implanter PIN is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

    // Conditional fields
    breeder_licence_no: Yup.string().when("breeder_check", {
      is: true,
      then: (schema) => schema.required("Breeder Licence No. is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    breeder_local_authority: Yup.string().when("breeder_check", {
      is: true,
      then: (schema) => schema.required("Breeder Local Authority is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    dealer_licence_no: Yup.string().when("breeder_check", {
      is: true,
      then: (schema) => schema.required("Dealer Licence No. is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    dealer_local_authority: Yup.string().when("breeder_check", {
      is: true,
      then: (schema) => schema.required("Dealer Local Authority is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    local_authority: Yup.string().when("account_type", {
      is: "4", // ✅ only required when account_type is "5"
      then: (schema) => schema.required("Local Authority is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const handleSubmit = async (
    values: FormValues, // Make sure to define user_type in values
    { setSubmitting, setFieldError, resetForm }: FormikHelpers<FormValues> // Use FormikHelpers type
  ) => {
    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      // @ts-ignore
      if (key === "implanter_certificate" && values[key]) {
        formData.append(key, values[key]); // actual File object
      } else {
        // @ts-ignore
        formData.append(key, values[key]);
      }
    });

    try {
      const response = await fetch(`${appUrl}auth/register`, {
        method: "POST",
        body: formData, // send FormData directly
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
            `/pet-owners/update-pet-microchip?microchip=${encodeURIComponent(
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
      } else if (data.message === "Email is already registered") {
        setFieldError("email", data.message); // Set error for email
      } else if (data.message === "Invalid Password") {
        setFieldError("password", data.message); // Set error for password
      } else if (data.message === "Invalid user type") {
        setFieldError("password", data.message); // Set error for password
      }else if (data.message === "Registration successful but account is inactive. Please wait for approval.") {
        toast.error(data.message);
        resetForm();
      }
    } catch (error) {
      toast.error("Logged In Failed");
    }
  };

  return (
    <div className="col-lg-6 col-12 d-lg-block mt-5">
      <h1 className="text-center">Register</h1>

      <Formik
        enableReinitialize={true}
        initialValues={{
          breeder_check: false, // default unchecked
          account_type: selectedType,
          title: "",
          first_name: "",
          surf_name: "",
          email: "",
          phone: "",
          emergency_number: "",
          date_of_birth: "",
          address_1: "",
          address_2: "",
          city: "",
          county: "",
          country: "United Kingdom",
          address_3: "",
          postcode: "",
          password: "",
          confirm_password: "",
          implanter_radio: "implanter_pin",
          implanter_certificate: null,
          implanter_pin: "",
          breeder_licence_no: "",
          breeder_local_authority: "",
          dealer_licence_no: "",
          dealer_local_authority: "",
          local_authority: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ setFieldValue, values }) => {
          const addressRef = useRef<HTMLInputElement | null>(null);

          useEffect(() => {
            if (!googleMapsKey || !addressRef.current) return;

            const loader = new Loader({
              apiKey: googleMapsKey,
              libraries: ["places"],
            });

            let autocomplete: google.maps.places.Autocomplete | null = null;

            loader.load().then((google) => {
              if (!addressRef.current) return;

              // ✅ Create autocomplete
              autocomplete = new google.maps.places.Autocomplete(
                addressRef.current,
                {
                  fields: ["formatted_address", "address_components"],
                  types: ["geocode"],
                  componentRestrictions: { country: "uk" }, // Restrict to the UK only
                }
              );

              // ✅ On selection
              autocomplete.addListener("place_changed", () => {
                const place = autocomplete?.getPlace();
                if (!place || !place.address_components) return;

                const components: Record<string, string> = {};
                for (const comp of place.address_components) {
                  for (const type of comp.types) {
                    components[type] = comp.long_name;
                  }
                }

                // 🏡 UK-specific mapping logic
                const city =
                  components.post_town || // Common for UK
                  components.locality ||
                  components.sublocality ||
                  components.administrative_area_level_2 || // sometimes used as city
                  "";

                const county =
                  components.administrative_area_level_2 || // County like "Greater London"
                  components.administrative_area_level_1 || // fallback
                  "";

                const postcode = components.postal_code || "";
                const country = components.country || "United Kingdom";

                // ✅ Update Formik values
                setFieldValue("address_1", place.formatted_address || "");
                setFieldValue("city", city);
                setFieldValue("county", county);
                setFieldValue("postcode", postcode);
                setFieldValue("country", country);
              });
            });

            // ✅ Cleanup on unmount
            return () => {
              if (autocomplete) {
                google.maps.event.clearInstanceListeners(autocomplete);
              }
            };
          }, [googleMapsKey, addressRef.current, setFieldValue]);

          return (
            <Form>
              <div className="row">
                <div className="col-lg-12 col-md-12 mb-4">
                  <label className="mb-2 d-block" style={{ fontWeight: "500" }}>
                    Account Type
                  </label>

                  <div className="d-flex flex-wrap">
                    {[
                      { label: "Pet keeper", value: "0" },
                      { label: "Microchip implanter", value: "1" },
                      { label: "Pet breeder", value: "2" },
                      {
                        label: "Veterinary surgery",
                        value: "3",
                      },
                      { label: "Animal warden", value: "4" },
                    ].map((item) => (
                      <div
                        key={item.value}
                        className="form-check form-check-inline w-100"
                        style={{ marginRight: "20px" }}>
                        <Field
                          type="radio"
                          name="account_type"
                          id={`account_type_${item.value}`}
                          value={item.value}
                          className="form-check-input"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            const value = e.target.value;
                            setFieldValue("account_type", value);
                            setFieldValue("breeder_check", false);
                            accountType(value);
                          }}
                        />
                        <label
                          htmlFor={`account_type_${item.value}`}
                          className="form-check-label"
                          style={{
                            fontSize: "16px",
                            marginLeft: "6px",
                          }}>
                          {item.label}
                        </label>
                      </div>
                    ))}
                  </div>

                  <ErrorMessage
                    name="account_type"
                    component="div"
                    className="text-danger mt-1"
                  />
                </div>

                {values.account_type != "" && (
                  <>
                    <div className="row register-form">
                      {(values.account_type == "1" ||
                        values.account_type == "2" ||
                        values.account_type == "4") && (
                        <div
                          className="col-lg-12 col-md-12 mb-4 breeder_checkbox"
                          data-id="1">
                          <Field
                            type="checkbox"
                            id="breeder_check"
                            name="breeder_check"
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setFieldValue("breeder_check", e.target.checked); // ✅ update Formik
                              toggleBreeder(e.target.checked); // ✅ your custom function
                            }}
                          />
                          <label className="mb-2 mx-2" htmlFor="breeder_check">
                            If you are also a breeder please tick this box.
                          </label>
                        </div>
                      )}

                      <div className="col-lg-12 col-md-12 mb-4">
                        <label className="mb-2">Title</label>
                        <Field
                          as="select"
                          name="title"
                          className="form-select"
                          id="title">
                          <option value="">Select Title</option>
                          {genders.map((gender) => (
                            <option key={gender.id} value={gender.id}>
                              {gender.title}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage
                          name="title"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="col-lg-12 col-md-12 mb-4">
                        <label className="mb-2">First Name</label>
                        <Field
                          type="text"
                          className="form-control"
                          name="first_name"
                        />
                        <ErrorMessage
                          name="first_name"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="col-lg-12 col-md-12 mb-4">
                        <label className="mb-2">SurName</label>
                        <Field
                          type="text"
                          className="form-control"
                          name="surf_name"
                        />
                        <ErrorMessage
                          name="surf_name"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="col-lg-12 col-md-12 mb-4">
                        <label className="mb-2">Email</label>
                        <Field
                          type="text"
                          className="form-control"
                          name="email"
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="col-lg-12 col-md-12 mb-4">
                        <label className="mb-2">Mobile Number</label>
                        <Field
                          type="text"
                          className="form-control"
                          name="phone"
                        />
                        <ErrorMessage
                          name="phone"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="col-lg-12 col-md-12 mb-4">
                        <label className="mb-2">Emergency Number:</label>
                        <Field
                          type="text"
                          className="form-control"
                          id="emergency_number"
                          name="emergency_number"
                        />
                        <ErrorMessage
                          name="emergency_number"
                          component="div"
                          className="text-danger"
                        />
                        <span className="text-danger emergency_number"></span>
                      </div>

                      <div className="col-lg-12 col-md-12 mb-4">
                        <label className="mb-2">Date of Birth:</label>
                        <Field
                          type="date"
                          className="form-control"
                          id="date_of_birth"
                          name="date_of_birth"
                          max={new Date().toISOString().split("T")[0]}
                        />
                        <ErrorMessage
                          name="date_of_birth"
                          component="div"
                          className="text-danger"
                        />
                        <span className="text-danger date_of_birth"></span>
                      </div>

                      <div className="col-lg-12 col-md-12 mb-4">
                        <label className="mb-2">Address Line 1:</label>
                        <textarea
                          id="address_1"
                          name="address_1"
                          className="form-control"
                          placeholder="Full address"
                          autoComplete="off"
                          ref={addressRef}
                          style={{ height: "100px" }}
                          value={values.address_1}
                          onChange={(e) =>
                            setFieldValue("address_1", e.target.value)
                          }
                        />

                        <ErrorMessage
                          name="address_1"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div className="col-lg-12 col-md-12 mb-4">
                        <label className="mb-2">Address Line 2:</label>
                        <Field
                          type="text"
                          className="form-control"
                          id="address_2"
                          name="address_2"
                        />
                        <ErrorMessage
                          name="address_2"
                          component="div"
                          className="text-danger"
                        />
                        <span className="text-danger address_2"></span>
                      </div>

                      <div className="col-lg-12 col-md-12 mb-4">
                        <label className="mb-2">Address Line 3:</label>
                        <Field
                          type="text"
                          className="form-control"
                          id="address_3"
                          name="address_3"
                        />
                        <ErrorMessage
                          name="address_3"
                          component="div"
                          className="text-danger"
                        />
                        <span className="text-danger address_3"></span>
                      </div>

                      <div className="col-lg-12 col-md-12 mb-4">
                        <label className="mb-2">Town or City:</label>
                        <Field
                          type="text"
                          className="form-control"
                          id="city"
                          name="city"
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="text-danger"
                        />
                        <span className="text-danger city"></span>
                      </div>

                      <div className="col-lg-12 col-md-12 mb-4">
                        <label className="mb-2">County:</label>
                        <Field
                          type="text"
                          className="form-control"
                          id="county"
                          name="county"
                        />
                        <ErrorMessage
                          name="county"
                          component="div"
                          className="text-danger"
                        />
                        <span className="text-danger county"></span>
                      </div>

                      <div className="col-lg-12 col-md-12 mb-4">
                        <label className="mb-2">Country or Region:</label>
                        <Field
                          type="text"
                          className="form-control"
                          id="country"
                          name="country"
                          value="United Kingdom"
                          readOnly
                        />
                        <ErrorMessage
                          name="country"
                          component="div"
                          className="text-danger"
                        />
                        <span className="text-danger country"></span>
                      </div>

                      <div className="col-lg-12 col-md-12 mb-4">
                        <label className="mb-2">Postcode:</label>
                        <Field
                          type="text"
                          className="form-control"
                          id="postcode"
                          name="postcode"
                        />
                        <ErrorMessage
                          name="postcode"
                          component="div"
                          className="text-danger"
                        />
                        <span className="text-danger postcode"></span>
                      </div>

                      <div className="col-lg-12 col-md-12 mb-4">
                        <label className="mb-2">Password:</label>
                        <Field
                          type="password"
                          className="form-control"
                          id="password"
                          name="password"
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-danger"
                        />
                        <span className="text-danger password"></span>
                      </div>

                      <div className="col-lg-12 col-md-12 mb-4">
                        <label className="mb-2">Confirm Password:</label>
                        <Field
                          type="password"
                          className="form-control"
                          id="confirm_password"
                          name="confirm_password"
                        />
                        <ErrorMessage
                          name="confirm_password"
                          component="div"
                          className="text-danger"
                        />
                        <span className="text-danger confirm_password"></span>
                      </div>
                    </div>

                    {values.account_type == "1" && (
                      <div className="implanter_information_container">
                        <div className="register_inner_form_container_title">
                          <h4>Implanter Information</h4>
                          <p>
                            Please provide us with your implanter PIN or
                            reference.
                          </p>
                        </div>
                        <div className="row">
                          <div className="d-flex">
                            <div className="col-lg-6 col-md-6 mb-4">
                              <label htmlFor="radio_pin" className="mb-2">
                                <Field
                                  type="radio"
                                  id="radio_pin"
                                  name="implanter_radio"
                                  value="implanter_pin" // ✅ Formik handles this value
                                />
                                Implanter Pin
                              </label>
                            </div>

                            <div className="col-lg-6 col-md-6 mb-4">
                              <label htmlFor="radio_cert" className="mb-2">
                                <Field
                                  type="radio"
                                  id="radio_cert"
                                  name="implanter_radio"
                                  value="implanter_certificate" // ✅ Formik handles this value
                                />
                                Implanter Certificate
                              </label>
                            </div>
                            <ErrorMessage
                              name="implanter_radio"
                              component="div"
                              className="text-danger"
                            />
                          </div>
                          <ErrorMessage
                            name="implanter_radio"
                            component="div"
                            className="text-danger"
                          />

                          {values.implanter_radio ===
                            "implanter_certificate" && (
                            <div
                              className="col-lg-12 col-md-12 mb-4"
                              id="certificate_file_group">
                              <label className="mb-2">
                                Implanter Certificate (File)
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                name="implanter_certificate"
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  if (
                                    e.target.files &&
                                    e.target.files.length > 0
                                  ) {
                                    setFieldValue(
                                      "implanter_certificate",
                                      e.target.files[0]
                                    ); // ✅ store file in Formik
                                  } else {
                                    setFieldValue(
                                      "implanter_certificate",
                                      null
                                    ); // cleared
                                  }
                                }}
                              />

                              <ErrorMessage
                                name="implanter_certificate"
                                component="div"
                                className="text-danger"
                              />
                              <span className="text-danger implanter_certificate"></span>
                            </div>
                          )}

                          {values.implanter_radio === "implanter_pin" && (
                            <div
                              className="col-lg-12 col-md-12 mb-4"
                              id="pin_text_group">
                              <label className="mb-2">
                                Implanter PIN or REF
                              </label>
                              <Field
                                type="text"
                                className="form-control"
                                name="implanter_pin"
                              />
                              <ErrorMessage
                                name="implanter_pin"
                                component="div"
                                className="text-danger"
                              />
                              <span className="text-danger implanter_pin"></span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {values.breeder_check && (
                      <div className={`microchip_breeder_container`}>
                        <div className="register_inner_form_container_title">
                          <h4>Breeder Information</h4>
                          <p>
                            If you are a licensed breeder please enter your
                            licence number and the name of your local authority.
                          </p>
                        </div>
                        <div className="row">
                          <div className="col-lg-12 col-md-12 mb-4">
                            <label className="mb-2">Breeder Licence No.</label>
                            <Field
                              type="text"
                              className="form-control"
                              id="breeder_licence_no"
                              name="breeder_licence_no"
                            />
                            <ErrorMessage
                              name="breeder_licence_no"
                              component="div"
                              className="text-danger"
                            />
                            <span className="text-danger breeder_licence_no"></span>
                          </div>
                          <div className="col-lg-12 col-md-12 mb-4">
                            <label className="mb-2">Local Authority</label>
                            <Field
                              type="text"
                              className="form-control"
                              id="breeder_local_authority"
                              name="breeder_local_authority"
                            />
                            <ErrorMessage
                              name="breeder_local_authority"
                              component="div"
                              className="text-danger"
                            />
                            <span className="text-danger breeder_local_authority"></span>
                          </div>
                          <p>
                            If you are licensed in Scotland by a local authority
                            under the Licensing of Animal Dealers please enter
                            your animal dealing licence number and the name of
                            the issuing local authority.
                          </p>
                          <div className="col-lg-12 col-md-12 mb-4">
                            <label className="mb-2">Dealer Licence No.</label>
                            <Field
                              type="text"
                              className="form-control"
                              id="dealer_licence_no"
                              name="dealer_licence_no"
                            />
                            <ErrorMessage
                              name="dealer_licence_no"
                              component="div"
                              className="text-danger"
                            />
                            <span className="text-danger dealer_licence_no"></span>
                          </div>
                          <div className="col-lg-12 col-md-12 mb-4">
                            <label className="mb-2">Local Authority</label>
                            <Field
                              type="text"
                              className="form-control"
                              id="dealer_local_authority"
                              name="dealer_local_authority"
                            />
                            <ErrorMessage
                              name="dealer_local_authority"
                              component="div"
                              className="text-danger"
                            />
                            <span className="text-danger dealer_local_authority"></span>
                          </div>
                        </div>
                      </div>
                    )}

                    {values.account_type == "4" && (
                      <div className="microchip_authority_container register_inner_form_container">
                        <div className="register_inner_form_container_title">
                          <h4>Local Authority</h4>
                          <p>
                            Please enter the name of your local authority below.
                          </p>
                        </div>
                        <div className="row">
                          <div className="col-lg-12 col-md-12 mb-4">
                            <label className="mb-2">Local Authority</label>
                            <Field
                              type="text"
                              className="form-control"
                              id="local_authority"
                              name="local_authority"
                            />
                            <ErrorMessage
                              name="local_authority"
                              component="div"
                              className="text-danger"
                            />
                            <span className="text-danger local_authority"></span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="col-lg-12 col-md-12 mb-2">
                  <button className="btn btn-primary w-100" type="submit">
                    Register
                  </button>
                </div>
                <div className="col-lg-12 col-md-12 mb-4 text-center">
                  <Link href="/user-login/pet_owner">
                    Already have an account?
                  </Link>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
