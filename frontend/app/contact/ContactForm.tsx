"use client";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {toast,ToastContainer} from "react-toastify";
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // e.g. http://localhost:4000/

// ✅ Yup validation schema
const ContactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone_number: Yup.string()
    .matches(/^[0-9]+$/, "Must be a valid number")
    .required("Phone number is required"),
  message: Yup.string().required("Message is required"),
});

export default function ContactForm() {
  return (
    <Formik
      initialValues={{ name: "", email: "", phone_number: "", message: "" }}
      validationSchema={ContactSchema}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        try {
          const res = await fetch(`${appUrl}frontend/contact/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });

          const data = await res.json();

          if (data.statusCode === 200) {
           toast.success("Enquiry submitted successfully");
            resetForm();
          } else {
            toast.error("Enquiry submission failed");
          }
        } catch (err) {
          console.error("Error submitting contact form:", err);
          toast.error("Enquiry submission failed");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className="fom-lost">
          {/* Name */}
          <div className="form-floating mb-3">
            <Field
              type="text"
              id="name"
              name="name"
              className="form-control"
              placeholder="Your name"
            />
            <label htmlFor="name">Your Name</label>
            <ErrorMessage
              name="name"
              component="span"
              className="text-danger"
            />
          </div>

          {/* Email */}
          <div className="form-floating mb-3">
            <Field
              type="email"
              id="email"
              name="email"
              className="form-control"
              placeholder="Your email"
            />
            <label htmlFor="email">Email Address</label>
            <ErrorMessage
              name="email"
              component="span"
              className="text-danger"
            />
          </div>

          {/* Phone */}
          <div className="form-floating mb-3">
            <Field
              type="tel"
              id="phone_number"
              name="phone_number"
              className="form-control"
              placeholder="Your phone number"
            />
            <label htmlFor="phone_number">Phone Number</label>
            <ErrorMessage
              name="phone_number"
              component="span"
              className="text-danger"
            />
          </div>

          {/* Message */}
          <div className="form-floating mb-3">
            <Field
              as="textarea"
              id="message"
              name="message"
              className="form-control"
              placeholder="Your message"
              style={{ height: "150px" }}
            />
            <label htmlFor="message">Message</label>
            <ErrorMessage
              name="message"
              component="span"
              className="text-danger"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary csave_btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </Form>
      )}
    </Formik>
  );
}
