"use client";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import CommonLayout from "../frontend/layouts/CommonLayouts";
import Image from "next/image";
import { DecryptData } from "../common/HashData";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import { Loader } from "@googlemaps/js-api-loader";
import {
  getLocalStorageItem,
  removeLocalStorageItem,
} from "../common/LocalStorage";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
const secret = process.env.NEXT_PUBLIC_HASH_SECRET as string;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const googleMapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
const authorizeUrl = process.env.NEXT_PUBLIC_AUTHORIZE_URL || "";

declare global {
  interface Window {
    appendHelcimPayIframe?: (
      checkoutToken: string,
      allowExit?: boolean
    ) => void;
  }
}

export default function Checkout() {
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [selectedOption, setSelectedOption] = useState("new");
  const [existingAddress, setExistingAddress] = useState<any>(null);

  const [isCartData, setIsCartData] = useState(false);
  const router = useRouter();
  const addressRef = useRef<HTMLInputElement | null>(null);
  const token = getLocalStorageItem("token");
  const [products, setProducts] = useState([]);
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone_number: Yup.string().required("Phone number is required"),
    address: Yup.string().required("Address is required"),
    county: Yup.string().required("County is required"),
    city: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"),
    pincode: Yup.string().required("Postcode is required"),
    payment_type: Yup.string().nullable(),
    terms: Yup.boolean().oneOf([true], "You must accept terms"),
  });

  const openHelcimModal = (checkoutToken: string) => {
    if (!window.appendHelcimPayIframe) {
      toast.error("Payment service not loaded. Please refresh.");
      return;
    }

    window.appendHelcimPayIframe(checkoutToken, true);
  };

  const fetchExistingAddress = async (setFieldValue: any) => {
    try {
      const res = await fetch(`${appUrl}frontend/order/addresses`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.statusCode === 200 && data.data.length > 0) {
        const addr = data.data[0]; // assuming only one default address for now
        setExistingAddress(addr);

        // 🏡 Set values in Formik fields
        setFieldValue("name", addr.name || "");
        setFieldValue("email", addr.email || "");
        setFieldValue("phone_number", addr.phone_number || "");
        setFieldValue("address", addr.address || "");
        setFieldValue("county", addr.county || "");
        setFieldValue("city", addr.city || "");
        setFieldValue("country", addr.country || "uk");
        setFieldValue("pincode", addr.pincode || "");
      } else {
        toast.info("No saved address found. Please add a new one.");
        setSelectedOption("new");
      }
    } catch (err) {
      console.error("❌ Error fetching existing address:", err);
      toast.error("Failed to load saved address");
    }
  };

  const handleSubmit = async (
    values: any,
    { setSubmitting }: FormikHelpers<any>
  ) => {
    try {
      // get cart from localStorage
      let cartData = getLocalStorageItem("cart");
      if (!cartData) {
        return;
      }
      setIsCartData(true);

      let decryptedCart = JSON.parse(DecryptData(cartData, secret));

      const res = await fetch(`${appUrl}frontend/order/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          phone_number: values.phone_number,
          address: values.address,
          county: values.county,
          city: values.city,
          country: values.country,
          pincode: values.pincode,
          discount_amount: values.discount_amount || 0,
          payment_type: values.payment_type,
          cart: decryptedCart,
          default_address: values.default_address,
        }),
      });

      const data = await res.json();
      if (data.statusCode == 200) {
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
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };
  const fetchData = async () => {
    try {
      const response = await fetch(`${appUrl}auth/validate-token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (data && data.statusCode === 200) {
        setisLoggedIn(true);
      } else {
        router.push("/user-login/pet_owner");
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };
  useEffect(() => {
    let productData = getLocalStorageItem("cart");

    setIsCartData(true);

    let DproductData: any = null;

    try {
      const decrypted = DecryptData(productData, secret);

      if (typeof decrypted === "string" && decrypted.trim() !== "") {
        DproductData = JSON.parse(decrypted);
      } else {
        console.warn(
          "⚠️ DecryptData returned empty or invalid string:",
          decrypted
        );
        DproductData = null;
      }
    } catch (e) {
      console.error("❌ Failed to parse decrypted product data:", e);
      DproductData = null;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${appUrl}frontend/cart/details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(DproductData), // ⬅ send your decrypted productData
        });

        const data = await res.json();

        if (data.statusCode === 200) {
          setProducts(data.data);
        } else {
          console.error("❌ Failed:", data.message);
        }
      } catch (err) {
        console.error("Error fetching cart details:", err);
      }
    };
    fetchProduct();
    fetchData();
  }, []);

  return (
    <>
      {isLoggedIn && isCartData && (
        <CommonLayout>
          <div className="main-page-container">
            <section>
              <div className="container pt-7 pt-md-7 pb-8">
                <h3>Checkout Page</h3>

                {products.length === 0 ? (
                  <p>
                    Your cart is empty. Please add products to proceed to
                    checkout.
                  </p>
                ) : (
                  <Formik
                    initialValues={{
                      name: "",
                      email: "",
                      phone_number: "",
                      address: "",
                      county: "",
                      city: "",
                      country: "",
                      pincode: "",
                      payment_type: "",
                      terms: false,
                      default_address: false,
                    }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}>
                    {({ setFieldValue, resetForm }) => {
                      useEffect(() => {
                        if (selectedOption === "existing") {
                          fetchExistingAddress(setFieldValue);
                        } else if (selectedOption === "new") {
                          // clear form fields
                          resetForm({
                            values: {
                              name: "",
                              email: "",
                              phone_number: "",
                              address: "",
                              county: "",
                              city: "",
                              country: "",
                              pincode: "",
                              payment_type: "",
                              terms: false,
                              default_address: false,
                            },
                          });
                        }
                      }, [selectedOption]);
                      // ✅ Setup Google Autocomplete once when component mounts
                      useEffect(() => {
                        if (!googleMapsKey) return;

                        const loader = new Loader({
                          apiKey: googleMapsKey,
                          libraries: ["places"],
                        });

                        loader.load().then((google) => {
                          if (!addressRef.current) return;

                          const autocomplete =
                            new google.maps.places.Autocomplete(
                              addressRef.current,
                              {
                                types: ["geocode"],
                                componentRestrictions: { country: "us" },
                              }
                            );

                          autocomplete.addListener("place_changed", () => {
                            const place = autocomplete.getPlace();
                            if (!place.address_components) return;

                            const components: any = {};
                            place.address_components.forEach((c: any) => {
                              const type = c.types[0];
                              components[type] = c.long_name;
                            });

                            // 🏡 Autofill Address Details
                            setFieldValue(
                              "address",
                              place.formatted_address || ""
                            );
                            setFieldValue(
                              "city",
                              components.locality ||
                                components.post_town ||
                                components.sublocality ||
                                ""
                            );
                            setFieldValue(
                              "county",
                              components.administrative_area_level_2 ||
                                components.administrative_area_level_1 ||
                                ""
                            );
                            setFieldValue(
                              "pincode",
                              components.postal_code || ""
                            );
                            setFieldValue("country", components.country || "");
                          });
                        });
                      }, [setFieldValue]);

                      return (
                        <Form>
                          <div className="checkout-form mt-5">
                            <div className="address-check-container">
                              <h4 className="section-title">Address Options</h4>
                              <div className="address-options">
                                {/* Existing Address */}
                                <label className="address-card">
                                  <input
                                    type="radio"
                                    name="address_option"
                                    value="existing"
                                    checked={selectedOption === "existing"}
                                    onChange={(e) => {
                                      setSelectedOption(e.target.value);
                                    }}
                                  />
                                  <div className="address-content">
                                    <h5>Use Existing Address</h5>
                                    <p>
                                      Select this option to use the address
                                      already saved in your profile.
                                    </p>
                                  </div>
                                </label>

                                {/* New Address */}
                                <label className="address-card">
                                  <input
                                    type="radio"
                                    name="address_option"
                                    value="new"
                                    checked={selectedOption === "new"}
                                    onChange={(e) => {
                                      setSelectedOption(e.target.value);
                                    }}
                                  />
                                  <div className="address-content">
                                    <h5>Add New Address</h5>
                                    <p>
                                      Choose this if you want to provide a new
                                      shipping address for this order.
                                    </p>
                                  </div>
                                </label>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            {/* LEFT SIDE */}
                            <div className="col-lg-6 col-md-12 col-sm-12">
                              <div className="row">
                                <div className="col-lg-6 mb-4">
                                  <label className="mb-3">Name</label>
                                  <Field
                                    type="text"
                                    name="name"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>

                                <div className="col-lg-6 mb-4">
                                  <label className="mb-3">Email</label>
                                  <Field
                                    type="text"
                                    name="email"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>

                                <div className="col-lg-12 mb-4">
                                  <label className="mb-3">Phone Number</label>
                                  <Field
                                    type="text"
                                    name="phone_number"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name="phone_number"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>

                                <div className="col-lg-12 mb-4">
                                  <label className="mb-3">Address</label>
                                  <Field
                                    innerRef={addressRef} // ✅ attach autocomplete reference
                                    type="text"
                                    name="address"
                                    className="form-control"
                                    placeholder="Start typing your address..."
                                  />
                                  <ErrorMessage
                                    name="address"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>

                                <div className="col-lg-6 mb-4">
                                  <label className="mb-3">County</label>
                                  <Field
                                    type="text"
                                    name="county"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name="county"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>

                                <div className="col-lg-6 mb-4">
                                  <label className="mb-3">City</label>
                                  <Field
                                    type="text"
                                    name="city"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name="city"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>

                                <div className="col-lg-6 mb-4">
                                  <label className="mb-3">Country</label>
                                  <Field
                                    type="text"
                                    name="country"
                                    className="form-control"></Field>
                                  <ErrorMessage
                                    name="country"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>

                                <div className="col-lg-6 mb-4">
                                  <label className="mb-3">Postcode</label>
                                  <Field
                                    type="text"
                                    name="pincode"
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name="pincode"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* RIGHT SIDE */}
                            <div className="col-lg-6 col-md-12 col-sm-12">
                              <h3>Product Details</h3>
                              <table className="table table-bordered mr-5 checkout_table">
                                <thead>
                                  <tr>
                                    <th>Product Name</th>
                                    <th>Product Qty</th>
                                    <th>Price</th>
                                    <th>Total</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {products.map((p: any, index: number) => (
                                    <tr key={index}>
                                      <td>{p.name}</td>
                                      <td>{p.quantity}</td>
                                      <td>{p.price}</td>
                                      <td>{p.price * p.quantity}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>

                              {/* <div className="col-lg-12">
                                <label>Payment Methods</label>
                                <div className="paymentmethods mt-3">
                                  <label className="me-3">
                                    <Field
                                      type="radio"
                                      name="payment_type"
                                      value="Google Pay"
                                    />
                                    <Image
                                      width={50}
                                      height={50}
                                      src="/assets/images/google-pay-icon.png"
                                      alt="Google Pay"
                                    />
                                    Google Pay
                                  </label>

                                  <label className="me-3">
                                    <Field
                                      type="radio"
                                      name="payment_type"
                                      value="Phonepe"
                                    />
                                    <Image
                                      width={50}
                                      height={50}
                                      src="/assets/images/phonepe-logo-icon.png"
                                      alt="Phonepe"
                                    />
                                    Phonepe
                                  </label>

                                  <label>
                                    <Field
                                      type="radio"
                                      name="payment_type"
                                      value="Cards"
                                    />
                                    <Image
                                      width={50}
                                      height={50}
                                      src="/assets/images/credit-card.png"
                                      alt="Cards"
                                    />
                                    Cards
                                  </label>
                                </div>
                                <ErrorMessage
                                  name="payment_type"
                                  component="div"
                                  className="text-danger"
                                />
                              </div> */}

                              <div className="mt-4">
                                <label>
                                  <Field type="checkbox" name="terms" /> I have
                                  read and agree to the website terms and
                                  conditions*
                                </label>
                                <ErrorMessage
                                  name="terms"
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                              <div className="default-address-container mt-4 p-3 border rounded shadow-sm bg-light">
                                <div className="d-flex align-items-center">
                                  <label className="form-check-label fw-semibold">
                                    <Field
                                      type="checkbox"
                                      name="default_address"
                                      className="form-check-input me-2"
                                    />
                                    Make this my default address
                                  </label>
                                </div>
                                <p className="text-muted small mt-2 mb-0">
                                  Your future orders will automatically use this
                                  address unless you choose a different one.
                                </p>
                              </div>

                              <button
                                type="submit"
                                className="btn btn-primary mt-4 mb-4">
                                Purchase Now
                              </button>
                            </div>
                          </div>
                        </Form>
                      );
                    }}
                  </Formik>
                )}
              </div>
            </section>
          </div>
        </CommonLayout>
      )}
    </>
  );
}
