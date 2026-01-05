"use client";

import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CommonLayout from "../../../frontend/layouts/CommonLayouts";
import { toast, ToastContainer } from "react-toastify";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
import axios from "axios";
const authorizeUrl = process.env.NEXT_PUBLIC_AUTHORIZE_URL || "";
const apiUrl = process.env.NEXT_PUBLIC_APP_URL;

const CheckoutSchema = Yup.object({
  selected_plan: Yup.string().required("Please select a plan"),
});

type TokenData = {
  microchip_number: string;
  contact_id: number;
  contact: Contact;
};

type Contact = {
  id: number;
  pet_name: string;
  pet_keeper: string;
  microchip_number: string;
  photo: string | null;
  breed: string;
  sex: string;
  color: string;
  dob: string;
};

export default function Checkout() {
  const { token } = useParams();
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [tokenError, setTokenError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [contact, setContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (!token) return;

    const decryptToken = async () => {
      try {
        const res = await fetch(`${apiUrl}frontend/payment/decrypt-token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok || !data.data) {
          setTokenError(data.message || "Invalid or expired token");
          return;
        }

        setTokenData(data.data);
        setContact(data.data.contact);
      } catch (err: any) {
        setTokenError(err.message || "Something went wrong");
      }
    };

    decryptToken();
  }, [token]);

  if (tokenError) {
    return (
      <CommonLayout>
        <div className="paymentNoty-wrapper">
          <div className="paymentNoty-card paymentNoty-errorCard">
            <h1 className="paymentNoty-title">⚠️ Payment Token Invalid</h1>
            <p className="paymentNoty-subtitle">
              {tokenError}. Please contact support or request a new payment
              link.
            </p>
          </div>
        </div>
      </CommonLayout>
    );
  }

  if (!tokenData || !contact) {
    return (
      <CommonLayout>
        <div className="paymentNoty-wrapper">
          <div className="paymentNoty-card">
            <h1 className="paymentNoty-title">Loading...</h1>
          </div>
        </div>
      </CommonLayout>
    );
  }
  const handleBuyNow = async (selectedPlan: string, microchip: string) => {
    try {
      setIsLoading(true);
      const token = getLocalStorageItem("token");

      const res = await axios.post(
        `${apiUrl}frontend/microchip/payment/confirm`,
        {
          microchip_id: microchip,
          selected_plan: selectedPlan,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.statusCode === 200) {
        let data = res.data;
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
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error("Payment initialization error", err);
      toast.error("Payment initialization failed");
    } finally {
      setIsLoading(false); // stop loading
    }
  };

  return (
    <CommonLayout>
      <div className="container">
        <div className="paymentNoty-wrapper">
          {/* Pet Details Card */}
          <div className="paymentNoty-card paymentNoty-petCard">
            {contact.photo && (
              <img
                src={`${apiUrl}uploads/${contact.photo}`}
                alt={contact.pet_name}
                className="paymentNoty-petPhoto"
              />
            )}
            <div className="paymentNoty-petDetails">
              <h2>{contact.pet_name} 🐾</h2>
              <p>
                <strong>Microchip:</strong> {contact.microchip_number}
              </p>
              <p>
                <strong>Owner:</strong> {contact.pet_keeper}
              </p>
              <p>
                <strong>Breed:</strong> {contact.breed}
              </p>
              <p>
                <strong>Sex:</strong> {contact.sex}
              </p>
              <p>
                <strong>Color:</strong> {contact.color}
              </p>
              <p>
                <strong>DOB:</strong> {contact.dob}
              </p>
            </div>
          </div>

          {/* Payment Section */}
          <div className="paymentNoty-card">
            <h1 className="paymentNoty-title">
              Activate Your Pet’s Microchip 🐾
            </h1>
            <p className="paymentNoty-subtitle">
              Choose a protection plan to keep your pet safe for life.
            </p>

            <Formik
              initialValues={{ selected_plan: "" }}
              validationSchema={CheckoutSchema}
              onSubmit={(values) => {
                if (!tokenData) return; // safety check
                handleBuyNow(values.selected_plan, tokenData.microchip_number);
              }}>
              {({ values, setFieldValue }) => (
                <Form>
                  <div className="paymentNoty-planGrid">
                    {/* Lifetime */}
                    <div
                      className={`paymentNoty-planBox ${
                        values.selected_plan === "lifetime"
                          ? "paymentNoty-active"
                          : ""
                      }`}
                      onClick={() =>
                        setFieldValue("selected_plan", "lifetime")
                      }>
                      <span className="paymentNoty-badge">MOST POPULAR</span>
                      <h3>Lifetime Registration</h3>
                      <p className="paymentNoty-price">$49</p>
                      <p className="paymentNoty-planNote">One-time payment</p>
                      <ul>
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

                    {/* Annual */}
                    <div
                      className={`paymentNoty-planBox ${
                        values.selected_plan === "annual"
                          ? "paymentNoty-active"
                          : ""
                      }`}
                      onClick={() => setFieldValue("selected_plan", "annual")}>
                      <h3>Annual Protection</h3>
                      <p className="paymentNoty-price">$19.99</p>
                      <p className="paymentNoty-planNote">Billed yearly</p>
                      <ul>
                        <li>
                          Includes Lifetime Registration: All the benefits of
                          our standard plan.
                        </li>
                        <li>
                          Instant Multi-Channel Alerts: Receive emergency
                          notifications via SMS and WhatsApp the second your pet
                          is found.
                        </li>
                        <li>
                          Geo-Shelter Radius: We notify shelters and vet clinics
                          in your specific geographic area if your pet is
                          reported lost.
                        </li>
                        <li>
                          Multi-Animal Dashboard: Manage all your pets' safety
                          profiles from one easy-to-use screen.
                        </li>
                        <li>Pet lost and found image match up tool</li>
                      </ul>
                    </div>
                  </div>

                  <ErrorMessage
                    name="selected_plan"
                    component="div"
                    className="paymentNoty-error"
                  />

                  <button
                    type="submit"
                    className="paymentNoty-payBtn"
                    disabled={!values.selected_plan}>
                    {isLoading
                      ? "Processing..."
                      : "Proceed to Secure Payment 🔒"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}
