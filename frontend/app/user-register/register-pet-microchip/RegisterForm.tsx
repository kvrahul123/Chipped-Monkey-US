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

interface FormValues {
  first_name: string;
  surf_name: string;
  email: string;
  phone: string;
  emergency_number: string;
  password: string;
  confirm_password: string;
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


  let token = getLocalStorageItem("token");
  useEffect(() => {
    if (token) {
      router.push("/customer/dashboard");
    }
  }, [token]);




  const validationSchema = Yup.object({
    first_name: Yup.string().required("First name is required"),
    surf_name: Yup.string().required("Surname is required"),

    email: Yup.string().email("Invalid email").required("Email is required"),

    phone: Yup.string()
      .matches(/^[0-9]{10,15}$/, "Enter valid phone number")
      .required("Phone number is required"),

    emergency_number: Yup.string()
      .matches(/^[0-9]{10,15}$/, "Enter valid emergency number")
      .nullable("Emergency number is required"),

    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),

    confirm_password: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (
    values: FormValues, // Make sure to define user_type in values
    { setSubmitting, setFieldError, resetForm }: FormikHelpers<FormValues> // Use FormikHelpers type
  ) => {
    const formData = new FormData();
  formData.append("first_name", values.first_name);
  formData.append("surf_name", values.surf_name);
  formData.append("email", values.email);
  formData.append("phone", values.phone);
  formData.append("emergency_number", values.emergency_number);
  formData.append("password", values.password);
  formData.append("confirm_password", values.confirm_password);

  // 🔹 Backend-required fields (send empty/default)
  formData.append("account_type", "0");          // default: Pet keeper
  formData.append("title", "");                  // empty
  formData.append("date_of_birth", "");          // empty
  formData.append("address_1", "");
  formData.append("address_2", "");
  formData.append("address_3", "");
  formData.append("city", "");
  formData.append("county", "");
  formData.append("country", "United Kingdom");  // safe default
  formData.append("postcode", "");
  formData.append("breeder_check", "0");         // false
  formData.append("implanter_radio", "");        // empty

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
      } else if (
        data.message ===
        "Registration successful but account is inactive. Please wait for approval."
      ) {
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
          first_name: "",
          surf_name: "",
          email: "",
          phone: "",
          emergency_number: "",
          password: "",
          confirm_password: "",
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
              <div className="mb-3">
                <label>First Name</label>
                <Field name="first_name" className="form-control" />
                <ErrorMessage
                  name="first_name"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label>Surname</label>
                <Field name="surf_name" className="form-control" />
                <ErrorMessage
                  name="surf_name"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label>Email</label>
                <Field name="email" type="email" className="form-control" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label>Phone Number</label>
                <Field name="phone" className="form-control" />
                <ErrorMessage
                  name="phone"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label>Emergency Number</label>
                <Field name="emergency_number" className="form-control" />
                <ErrorMessage
                  name="emergency_number"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label>Password</label>
                <Field
                  name="password"
                  type="password"
                  className="form-control"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="mb-3">
                <label>Confirm Password</label>
                <Field
                  name="confirm_password"
                  type="password"
                  className="form-control"
                />
                <ErrorMessage
                  name="confirm_password"
                  component="div"
                  className="text-danger"
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Register
              </button>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
