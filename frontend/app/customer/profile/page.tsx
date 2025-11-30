// app/dashboard/page.tsx
"use client";
import CommonLayout from "../layouts/CommonLayouts"; // Import your common layout component
import Link from "next/link"; // Import Link for navigation
import { useState, useRef, useEffect } from "react"; // Import useState and useRef from React
import { useFormik } from "formik"; // Formik for form handling
import * as Yup from "yup"; // Yup for validation
import { Loader } from "@googlemaps/js-api-loader";
import { toast, ToastContainer } from "react-toastify";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Select from "react-select";
import Image from "next/image";
import ModalComponent from "../fileDirectory/FilesPop";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL
import { verifyToken } from "../common/api";
import EditorToolbar from "@/app/common/EditorToolbar";
import { useEditor, EditorContent } from "@tiptap/react";

import { getLocalStorageItem } from "@/app/common/LocalStorage";

export default function profileCreatePage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const countyRef = useRef<HTMLInputElement>(null);
  const postcodeRef = useRef<HTMLInputElement>(null);
  const latitudeRef = useRef<HTMLInputElement>(null);
  const longitudeRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);
  const [accountType, setAcountType] = useState<string | null>(null);
  const didFetch = useRef(false);
  const token = getLocalStorageItem("token");
  const [showModal, setShowModal] = useState(false);
  const [companyImages, setCompanyImages] = useState<string[]>([]);
  const [currentType, setCurrentType] = useState<string | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
      libraries: ["places"],
    });

    loader.load().then(() => {
      if (!inputRef.current) return;

      const autocomplete = new google.maps.places.Autocomplete(
        inputRef.current,
        {
          types: ["(regions)"],
          componentRestrictions: { country: "gb" },
        }
      );

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.geometry || !place.geometry.location) return;

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        if (latitudeRef.current) latitudeRef.current.value = lat.toString();
        if (longitudeRef.current) longitudeRef.current.value = lng.toString();

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results && results.length > 0) {
            let postcode = "";
            let county = "";

            // 🔍 Extract postcode + county
            for (const result of results) {
              for (const component of result.address_components) {
                if (component.types.includes("postal_code") && !postcode) {
                  postcode = component.long_name;
                }
                if (
                  component.types.includes("administrative_area_level_2") &&
                  !county
                ) {
                  county = component.long_name;
                }
              }
            }

            // 📝 Fallback for postcode
            if (!postcode) {
              for (const result of results) {
                const match = result.formatted_address.match(
                  /[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}/i
                );
                if (match) {
                  postcode = match[0];
                  break;
                }
              }
            }

            // ✅ Update **Formik values** directly
            formik.setFieldValue("county", county || "");
            formik.setFieldValue("postcode", postcode || "");
            formik.setFieldValue("address_1", place.formatted_address || "");

            console.log("Full address components:", results);
            console.log("Detected postcode:", postcode || "(not found)");
            console.log("Detected county:", county || "(not found)");
          } else {
            console.error("Geocoder failed:", status);
          }
        });
      });
    });
  }, []);

  const handleOpenModal = (type: string) => {
    setCurrentType(type);
    setShowModal(true);
  };
  useEffect(() => {
    const fetchUserType = async () => {
      const type = await verifyToken();
      if (type) {
        setAcountType(type.account_type);
      }
    };

    fetchUserType();
  }, []);
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentType(null);
  };
  type Values = {
    company_logo: string;
    name: string;
    company_name: string;
    email: string;
    phone: string;
    emergency_number: string;
    address_1: string;
    address_2: string;
    address_3: string;
    county: string;
    country: string;
    postcode: string;
    small_description: string;
  };

  const validationSchema = Yup.object().shape({
    company_logo: Yup.string().when([], {
      is: () => accountType !== "0",
      then: (schema) => schema.required("Company logo is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    name: Yup.string().required("Name is required"),
    company_name: Yup.string().when([], {
      is: () => accountType !== "0",
      then: (schema) => schema.required("Company name is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10,15}$/, "Phone must be 10–15 digits")
      .required("Phone is required"),
    emergency_number: Yup.string()
      .matches(/^[0-9]{10,15}$/, "Emergency number must be 10–15 digits")
      .required("Emergency number is required"),
    address_1: Yup.string().required("Address is required"),
    address_2: Yup.string().nullable(), // optional
    address_3: Yup.string().nullable(), // optional
    county: Yup.string().required("County is required"),
    country: Yup.string().required("Country is required"),
    postcode: Yup.string().required("Postcode is required"),
    small_description: Yup.string().when([], {
      is: () => accountType !== "0",
      then: (schema) =>
        schema
          .min(50, "Description must be minimum 50 characters")
          .required("Description is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
  // Formik setup
  const formik = useFormik<Values>({
    initialValues: {
      company_logo: "",
      name: "",
      company_name: "",
      email: "",
      phone: "",
      emergency_number: "",
      address_1: "",
      address_2: "",
      address_3: "",
      county: "",
      country: "",
      postcode: "",
      small_description: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        ...values, // send all values directly
        city: values.county,
        company_logo: accountType === "0" ? "" : values.company_logo || "",
      };

      try {
        const response = await axios.post(`${appUrl}profile/update`, payload, {
          headers: {
            "Content-Type": "application/json", // <--- JSON, not multipart
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.statusCode === 201) {
          toast.success(
            response.data.message || "Profile created successfully"
          );
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    },
  });

  const handleSelectImages = (images: number[]) => {
    if (currentType) {
      // Set images in selectedImages state
      setSelectedImages((prev) => ({
        ...prev,
        [currentType]: images, // Set images for the specific type
      }));

      // Convert array to comma-separated string and set it in formik
      formik.setFieldValue(currentType, images.join(","));
    }
    handleCloseModal();
  };

  const [selectedImages, setSelectedImages] = useState<{
    [key: string]: number[];
  }>({
    company_logo: [],
  });

  const handleEditorChange = (content) => {
    formik.setFieldValue("small_description", content); // Replace 'small_description' with your actual field name in Formik
    if (formik.touched.small_description) {
      formik.setFieldTouched("small_description", false); // Mark the field as untouched to clear the error
    }
  };

  /** Editor **/
  const descriptionEditor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start typing the description...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: formik.values.small_description, // optional initial content
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      formik.setFieldValue("small_description", editor.getHTML());
    },
    immediatelyRender: false, // ⚠ important for SSR in Next.js
  });
  useEffect(() => {
    if (descriptionEditor && formik.values.small_description) {
      descriptionEditor.commands.setContent(formik.values.small_description);
    }
  }, [formik.values.small_description, descriptionEditor]);

  const handleRemoveImage = (id, type) => {
    if (type == "company_logo") {
      const updatedImages = companyImages.filter((img) => img.id !== id);
      setCompanyImages(updatedImages);
      const updatedFileNames = updatedImages.map((img) => img.id).join(",");
      formik.setFieldValue("company_logo", updatedFileNames);
      setSelectedImages((prev) => ({
        ...prev,
        ["company_logo"]: updatedImages.map((img) => img.id).join(","),
      }));
    }
  };

  useEffect(() => {
    if (didFetch.current) return;

    didFetch.current = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(`${appUrl}profile/edit`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const res = response.data;

        formik.setValues({
          company_logo: res.data?.company_logo
            ? String(res.data.company_logo)
            : "",
          name: res.data?.name ?? "",
          company_name: res.data?.company_name ?? "",
          email: res.data?.email ?? "",
          phone: res.data?.phone ?? "",
          emergency_number: res.data?.emergency_number ?? "",
          address_1: res.data?.address_1 ?? "",
          address_2: res.data?.address_2 ?? "",
          address_3: res.data?.address_3 ?? "",
          county: res.data?.city ?? "",
          country: res.data?.country ?? "",
          postcode: res.data?.postcode ?? "",
          small_description: res.data?.small_description ?? "",
        });

        setSelectedImages((prev) => ({
          ...prev,
          ["company_logo"]: res.data.company_logo, // Set images for the specific type
        }));
        formik.setFieldValue("company_logo", res.data.company_logo);

        setCompanyImages(res.data.imageData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load microchip data");
      }
    };

    fetchData();
  }, [token]);

  const addressRef = useRef(null);

useEffect(() => {
  const loader = new Loader({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"]
  });


  loader.load().then(() => {
    if (!addressRef.current) return;
    console.log("Address Ref:", addressRef.current);

    const autocomplete = new google.maps.places.Autocomplete(
      addressRef.current,
      {
        fields: [
          "address_components",
          "formatted_address",
          "geometry"
        ],
        componentRestrictions: { country: "gb" },
        types: ["address"] 
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (!place.address_components) return;

      const comp = {};
      place.address_components.forEach((c) => {
        comp[c.types[0]] = c.long_name;
      });

      const postcode =
        comp.postal_code || "";
      const city =
        comp.post_town || comp.locality || "";
      const county =
        comp.administrative_area_level_2 ||
        comp.administrative_area_level_1 || "";
      const country = comp.country || "United Kingdom";

      formik.setFieldValue("address_1", place.formatted_address);
      formik.setFieldValue("county", county);
      formik.setFieldValue("postcode", postcode);
      formik.setFieldValue("country", country);
    });
  });
}, [addressRef]);


  return (
    <CommonLayout>
      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="page-header-container mb-3 d-flex align-items-center justify-content-between">
            <div className="page-header-title">
              <h1 className="fs-4 mb-0">Update Profile</h1>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit}>
            <input type="hidden" ref={countyRef} id="countyName" />
            <input type="hidden" ref={postcodeRef} id="postcodeField" />
            <input type="hidden" ref={latitudeRef} id="latitude" />
            <input type="hidden" ref={longitudeRef} id="longitude" />
            <div className="page-table-container w-100">
              <div className="card-body">
                <div className="row">
                  {accountType !== "0" && (
                    <div className="col-12 mb-3">
                      <label htmlFor="company_logo" className="form-label">
                        Company Logo <span className="text-danger">*</span>
                      </label>
                      <button
                        className="form-control"
                        id="company_logo"
                        onClick={() => handleOpenModal("company_logo")}
                        type="button">
                        Choose File
                      </button>
                      <div className="img-lists">
                        {companyImages.map((val, index) => (
                          <>
                            <div key={index} className="img-item">
                              <Image
                                src={`${appUrl}uploads/${val.file_name}`}
                                alt={`Image ${val.file_name}`}
                                width={100}
                                height={100}
                              />
                            </div>
                            <div
                              className="img-remove"
                              onClick={() =>
                                handleRemoveImage(val.id, "company_logo")
                              }>
                              <i className="fa-solid fa-x"></i>
                            </div>
                          </>
                        ))}
                      </div>
                      {formik.touched.company_logo &&
                        formik.errors.company_logo && (
                          <div className="text-danger">
                            {formik.errors.company_logo}
                          </div>
                        )}
                    </div>
                  )}

                  {/* Name */}
                  <div className="col-12 mb-3">
                    <label htmlFor="name" className="form-label">
                      Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      {...formik.getFieldProps("name")}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <div className="text-danger">{formik.errors.name}</div>
                    )}
                  </div>

                  {/* Company Name */}
                  {accountType !== "0" && (
                    <div className="col-12 mb-3">
                      <label htmlFor="company_name" className="form-label">
                        Company Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="company_name"
                        {...formik.getFieldProps("company_name")}
                      />
                      {formik.touched.company_name &&
                        formik.errors.company_name && (
                          <div className="text-danger">
                            {formik.errors.company_name}
                          </div>
                        )}
                    </div>
                  )}

                  {/* Email */}
                  <div className="col-12 mb-3">
                    <label htmlFor="email" className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      {...formik.getFieldProps("email")}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <div className="text-danger">{formik.errors.email}</div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="col-12 mb-3">
                    <label htmlFor="phone" className="form-label">
                      Phone <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      {...formik.getFieldProps("phone")}
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <div className="text-danger">{formik.errors.phone}</div>
                    )}
                  </div>

                  {/* Emergency Number */}
                  <div className="col-12 mb-3">
                    <label htmlFor="emergency_number" className="form-label">
                      Emergency Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="emergency_number"
                      {...formik.getFieldProps("emergency_number")}
                    />
                    {formik.touched.emergency_number &&
                      formik.errors.emergency_number && (
                        <div className="text-danger">
                          {formik.errors.emergency_number}
                        </div>
                      )}
                  </div>

                  {/* Address 1 */}
                  <div className="col-12 mb-3">
                    <label htmlFor="address_1" className="form-label">
                      Address 1 <span className="text-danger">*</span>
                    </label>

                    <textarea
                      id="address_1"
                      name="address_1"
                      className="form-control"
                      placeholder="Full address"
                      autoComplete="off"
                      ref={addressRef}
                      style={{ height: "100px" }}
                      value={formik.values.address_1}
                      onChange={(e) =>
                        formik.setFieldValue("address_1", e.target.value)
                      }
                    />

                    {formik.touched.address_1 && formik.errors.address_1 && (
                      <div className="text-danger">
                        {formik.errors.address_1}
                      </div>
                    )}
                  </div>

                  {/* Address 2 */}
                  <div className="col-12 mb-3">
                    <label htmlFor="address_2" className="form-label">
                      Address 2
                    </label>
                    <textarea
                      className="form-control"
                      id="address_2"
                      {...formik.getFieldProps("address_2")}
                    />
                    {formik.touched.address_2 && formik.errors.address_2 && (
                      <div className="text-danger">
                        {formik.errors.address_2}
                      </div>
                    )}
                  </div>

                  {/* Address 3 */}
                  <div className="col-12 mb-3">
                    <label htmlFor="address_3" className="form-label">
                      Address 3
                    </label>
                    <textarea
                      className="form-control"
                      id="address_3"
                      {...formik.getFieldProps("address_3")}
                    />
                    {formik.touched.address_3 && formik.errors.address_3 && (
                      <div className="text-danger">
                        {formik.errors.address_3}
                      </div>
                    )}
                  </div>
                  {/* County */}
                  <div className="col-12 mb-3">
                    <label htmlFor="county" className="form-label">
                      County
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="county"
                      {...formik.getFieldProps("county")}
                      onChange={(e) => {
                        formik.setFieldValue("county", e.target.value); // ensure Formik syncs
                      }}
                    />
                    {formik.touched.county && formik.errors.county && (
                      <div className="text-danger">{formik.errors.county}</div>
                    )}
                  </div>

                  {/* Country */}
                  <div className="col-12 mb-3">
                    <label htmlFor="country" className="form-label">
                      Country
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

                  {/* Postcode */}
                  <div className="col-12 mb-3">
                    <label htmlFor="postcode" className="form-label">
                      Postcode
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="postcode"
                      {...formik.getFieldProps("postcode")}
                    />
                    {formik.touched.postcode && formik.errors.postcode && (
                      <div className="text-danger">
                        {formik.errors.postcode}
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {accountType !== "0" && (
                    <div className="col-12 mb-3">
                      <label htmlFor="small_description" className="form-label">
                        Description <span className="text-danger">*</span>
                      </label>
                      <div className="border rounded-md">
                        <div className="editor-top-tool">
                          <EditorToolbar editor={descriptionEditor} />
                          <div className="editor-content-tool">
                            <EditorContent
                              value={formik.values.small_description}
                              onUpdate={({ editor }) => {
                                console.log(
                                  "Editor content updated:",
                                  editor.getHTML()
                                ); // Check if HTML is logged
                                handleEditorChange(editor.getHTML());
                              }}
                              editor={descriptionEditor}
                              className="bs-[200px] overflow-y-auto flex"
                            />
                          </div>
                        </div>
                      </div>
                      {formik.touched.small_description &&
                        formik.errors.small_description && (
                          <div className="text-danger">
                            {formik.errors.small_description}
                          </div>
                        )}
                    </div>
                  )}

                  <div className="page-bottom-actions">
                    <button type="submit" className="btn btn-primary">
                      Update Profile
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
        <ModalComponent
          showModal={showModal}
          handleClose={handleCloseModal}
          onSelectImages={handleSelectImages}
          type={currentType}
          preSelectedImages={selectedImages[currentType] || []}
        />
      </div>
    </CommonLayout>
  );
}
