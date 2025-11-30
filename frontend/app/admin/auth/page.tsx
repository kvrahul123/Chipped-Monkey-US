"use client";
import { Formik, Field, Form, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../public/assets/css/admin.css';
import axios from "axios";
import Image from "next/image";
import { getLocalStorageItem, setLocalStorageItem } from "@/app/common/LocalStorage";
import { useEffect } from "react";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;


const SignInPage = () => {
  const router = useRouter();
  let token = getLocalStorageItem("token");
  useEffect(() => {
    if (token) {
      router.push("/admin/dashboard");
    }
  }, [token]);

  // Yup validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Handle form submission
  const handleSubmit = async (
    values: { email: string; password: string; user_type: string }, // Make sure to define user_type in values
    { setSubmitting, setFieldError }: FormikHelpers<{ email: string; password: string; user_type: string }> // Use FormikHelpers type
  ) => {
    try {
      // Ensure user_type is included in the values object
      const response = await axios.post(`${appUrl}auth/login`, {
        ...values, // Spread the form values (which includes user_type)
        user_type: "admin" // Set user_type to "admin"
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = response.data;
  
      if (response.status === 200 && data.token) {
        setLocalStorageItem("token", data.token);
        router.push("/admin/dashboard"); // Redirect on successful login
      } else if (data.message === "Invalid Email") {
        setFieldError("email", data.message); // Set error for email
      } else if (data.message === "Invalid Password") {
        setFieldError("password", data.message); // Set error for password
      }else if (data.message === "Invalid user type") {
        setFieldError("password", data.message); // Set error for password
      }
    } catch (error) {
      // Optionally, handle global errors here if needed
    } finally {
      setSubmitting(false); // Ensure the form resets the submission state
    }
  };
  



  return (
    <>

      <div className="section w-100 bg-dark login-background-container" >
        <div className="container">
          <div className="row vh-100 d-flex justify-content-center">
            <div className="col-12 align-self-center">
              <div className="card-body border-0">
                <div className="row">
                  <div className="col-lg-4 mx-auto">
                    <div className="card border-0">
                      <div className="card-body  p-0">
                        <div className="bg-blue  text-center p-3 mb-0">
                          <Image
                            src="/assets/images/logo-inside.png"
                            alt="ChippedMonkey Logo"
                            width={200}
                            height={93}
                          />

          <h5>Let&apos;s Get Started ChippedMonkey</h5>
                        </div>
                          <div className="form-box p-4">
                          <Formik
                            initialValues={{ email: "", password: "" }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                          >
                            {({ isSubmitting }) => (
                              <Form>
                                <label htmlFor="email" className="mb-2">
                                  Email *
                                </label>
                                <Field
                                  type="email"
                                  name="email"
                                  id="email"
                                  placeholder="Enter email address"
                                  className="form-control"
                                />
                                <ErrorMessage
                                  name="email"
                                  component="div"
                                  className="error-message text-danger mt-2"
                                />

                                <label htmlFor="password" className="mt-3 mb-2">
                                  Password *
                                </label>
                                <Field
                                  type="password"
                                  name="password"
                                  id="password"
                                  placeholder="Enter password"
                                  className="form-control"
                                />
                                <ErrorMessage
                                  name="password"
                                  component="div"
                                  className="error-message text-danger mt-2"
                                />

                                <button
                                  type="submit"
                                  className="signup-btn mt-4"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? "Log In..." : "Log In"}
                                </button>
                              </Form>
                            )}
                          </Formik>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
  </>

  );
};

export default SignInPage;
