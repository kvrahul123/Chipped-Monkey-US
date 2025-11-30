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
import ModalComponent from "../../fileDirectory/FilesPop";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL

import EditorToolbar from "@/app/common/EditorToolbar";
import { useEditor, EditorContent } from "@tiptap/react";

import { getLocalStorageItem } from "@/app/common/LocalStorage";

export default function blogsCreatePage() {
  const router = useRouter();
  const token = getLocalStorageItem("token");
  const [showModal, setShowModal] = useState(false);
  const [currentType, setCurrentType] = useState<string | null>(null);
  const handleOpenModal = (type: string) => {
    setCurrentType(type);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentType(null);
  };
  type Values = {
    title: string;
    image: string;
    short_description: string;
    description: string;
    meta_title: string;
    meta_img: string;
    meta_description: string;
    meta_keywords: string;
  };

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    image: Yup.mixed().required("Image is required"),
    short_description: Yup.string().required("Short Description is required"),
    description: Yup.string().required("Description is required"),
    meta_title: Yup.string().required("Meta Title is required"),
    meta_img: Yup.mixed().required("Meta Image is required"),
    meta_description: Yup.string().required("Meta Description is required"),
    meta_keywords: Yup.string().required("Meta Keywords are required"),
  });

  // Formik setup
  const formik = useFormik<Values>({
    initialValues: {
      title: "",
      image: "", // use null for files
      short_description: "",
      description: "",
      meta_title: "",
      meta_img: "", // use null for files
      meta_description: "",
      meta_keywords: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        title: values.title,
        short_description: values.short_description,
        description: values.description,
        meta_title: values.meta_title,
        meta_description: values.meta_description,
        meta_keywords: values.meta_keywords,
        image: values.image,
        meta_img: values.meta_img,
        // image/meta_img: send as URL or number if backend expects IDs
      };

      try {
        const response = await axios.post(`${appUrl}blogs/create`, payload, {
          headers: {
            "Content-Type": "application/json", // <--- JSON, not multipart
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.statusCode === 201) {
          toast.success(response.data.message || "Blog created successfully");
          router.push("/admin/blogs/list");
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
    image: [],
    meta_img: [],
  });

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
  content: formik.values.description, // optional initial content
  editorProps: {
    attributes: {
      class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none",
    },
  },
  onUpdate: ({ editor }) => {
    formik.setFieldValue("description", editor.getHTML());
  },
  immediatelyRender: false, // ⚠ important for SSR in Next.js
});


  const handleEditorChange = (content) => {
    formik.setFieldValue("description", content); // Replace 'description' with your actual field name in Formik
    if (formik.touched.description) {
      formik.setFieldTouched("description", false); // Mark the field as untouched to clear the error
    }
  };
  useEffect(() => {
    if (descriptionEditor) {
      descriptionEditor.on("update", ({ editor }) => {
        const content = editor.getHTML();
        formik.setFieldValue("description", content);
      });
    }
  }, [descriptionEditor]);

  return (
    <CommonLayout>
      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="page-header-container mb-3 d-flex align-items-center justify-content-between">
            <div className="page-header-title">
              <h1 className="fs-4 mb-0">Create Blogs</h1>
            </div>
            <div className="page-header-button">
              <Link href="/admin/blogs/list">
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
                  {/* Title */}
                  <div className="col-12 mb-3">
                    <label htmlFor="title" className="form-label">
                      Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="title"
                      {...formik.getFieldProps("title")}
                    />
                    {formik.touched.title && formik.errors.title && (
                      <div className="text-danger">{formik.errors.title}</div>
                    )}
                  </div>

                  {/* Image */}
                  <div className="col-12 mb-3">
                    <label htmlFor="image" className="form-label">
                      Image <span className="text-danger">*</span>
                    </label>
                    <button
                      className="form-control"
                      id="image"
                      onClick={() => handleOpenModal("image")}
                      type="button">
                      Choose File
                    </button>
                    {formik.touched.image && formik.errors.image && (
                      <div className="text-danger">{formik.errors.image}</div>
                    )}
                  </div>

                  {/* Short Description */}
                  <div className="col-12 mb-3">
                    <label htmlFor="short_description" className="form-label">
                      Short Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="short_description"
                      {...formik.getFieldProps("short_description")}
                    />
                    {formik.touched.short_description &&
                      formik.errors.short_description && (
                        <div className="text-danger">
                          {formik.errors.short_description}
                        </div>
                      )}
                  </div>

                  {/* Description */}
                  <div className="col-12 mb-3">
                    <label htmlFor="description" className="form-label">
                      Description <span className="text-danger">*</span>
                    </label>
                    <div className="border rounded-md">
                      <div className="editor-top-tool">
                        <EditorToolbar editor={descriptionEditor} />
                        <div className="editor-content-tool">
                          <EditorContent
                            value={formik.values.description}
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
                    {formik.touched.description &&
                      formik.errors.description && (
                        <div className="text-danger">
                          {formik.errors.description}
                        </div>
                      )}
                  </div>

                  {/* Meta Title */}
                  <div className="col-12 mb-3">
                    <label htmlFor="meta_title" className="form-label">
                      Meta Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="meta_title"
                      {...formik.getFieldProps("meta_title")}
                    />
                    {formik.touched.meta_title && formik.errors.meta_title && (
                      <div className="text-danger">
                        {formik.errors.meta_title}
                      </div>
                    )}
                  </div>

                  {/* Meta Image */}
                  <div className="col-12 mb-3">
                    <label htmlFor="meta_img" className="form-label">
                      Meta Image <span className="text-danger">*</span>
                    </label>
                    <button
                      className="form-control"
                      id="meta_img"
                      onClick={() => handleOpenModal("meta_img")}
                      type="button">
                      Choose File
                    </button>
                    {formik.touched.meta_img && formik.errors.meta_img && (
                      <div className="text-danger">
                        {formik.errors.meta_img}
                      </div>
                    )}
                  </div>

                  {/* Meta Description */}
                  <div className="col-12 mb-3">
                    <label htmlFor="meta_description" className="form-label">
                      Meta Description <span className="text-danger">*</span>
                    </label>
                    <textarea
                      className="form-control"
                      id="meta_description"
                      {...formik.getFieldProps("meta_description")}
                    />
                    {formik.touched.meta_description &&
                      formik.errors.meta_description && (
                        <div className="text-danger">
                          {formik.errors.meta_description}
                        </div>
                      )}
                  </div>

                  {/* Meta Keywords */}
                  <div className="col-12 mb-3">
                    <label htmlFor="meta_keywords" className="form-label">
                      Meta Keywords <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="meta_keywords"
                      {...formik.getFieldProps("meta_keywords")}
                    />
                    {formik.touched.meta_keywords &&
                      formik.errors.meta_keywords && (
                        <div className="text-danger">
                          {formik.errors.meta_keywords}
                        </div>
                      )}
                  </div>

                  <div className="page-bottom-actions">
                    <button type="submit" className="btn btn-primary">
                      Save Blog
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
