// app/dashboard/page.tsx
"use client";

import CommonLayout from "../../../layouts/CommonLayouts"; // Import your common layout component
import Link from "next/link"; // Import Link for navigation
import { useState, useRef, useEffect } from "react"; // Import useState and useRef from React
import { useFormik } from "formik"; // Formik for form handling
import * as Yup from "yup"; // Yup for validation
import { toast, ToastContainer } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import Select from "react-select";
import Image from "next/image";
import ModalComponent from "../../../fileDirectory/FilesPop";
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL
import { useEditor, EditorContent } from "@tiptap/react";
import EditorToolbar from "@/app/common/EditorToolbar";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";

import { getLocalStorageItem } from "@/app/common/LocalStorage";

export default function productsEditPage() {
  const router = useRouter();
  const didFetch = useRef(false);
  const { id } = useParams();
  const token = getLocalStorageItem("token");
  const [showModal, setShowModal] = useState(false);
  const [currentType, setCurrentType] = useState<string | null>(null);
  const [image, setImages] = useState<string[]>([]);
  const [metaImages, setMetaImages] = useState<string[]>([]);
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
    specifications: string;
    price:string,
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
    specifications: Yup.string().required("Specifications is required"),
    price: Yup.number()
      .typeError("Price must be a number") // handles non-numeric input
      .required("Price is required")
      .positive("Price must be greater than zero"), // optional: positive only
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
      specifications: "",
      price:"",
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
        specifications: values.specifications,
        price:values.price,
        description: values.description,
        meta_title: values.meta_title,
        meta_description: values.meta_description,
        meta_keywords: values.meta_keywords,
        image: values.image,
        meta_img: values.meta_img,
        // image/meta_img: send as URL or number if backend expects IDs
      };

      try {
        const response = await axios.put(`${appUrl}products/update/${id}`, payload, {
          headers: {
            "Content-Type": "application/json", // <--- JSON, not multipart
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.statusCode == 200) {
          toast.success(response.data.message || "Blog updated successfully");
          router.push("/admin/products/list");
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    },
  });

  const handleRemoveImage = (id, type) => {
    if (type == "image") {
      const updatedImages = image.filter((img) => img.id !== id);
      setImages(updatedImages);
      const updatedFileNames = updatedImages.map((img) => img.id).join(",");
      formik.setFieldValue("image", updatedFileNames);
      setSelectedImages((prev) => ({
        ...prev,
        ["image"]: updatedImages.map((img) => img.id).join(","),
      }));
    } else {
      const updatedImages = metaImages.filter((img) => img.id !== id);
      setMetaImages(updatedImages);
      const updatedFileNames = updatedImages.map((img) => img.id).join(",");
      formik.setFieldValue("meta_img", updatedFileNames);
      setSelectedImages((prev) => ({
        ...prev,
        ["meta_img"]: updatedImages.map((img) => img.id).join(","),
      }));
    }
  };

  useEffect(() => {
    if (!id || didFetch.current) return;

    didFetch.current = true;

    const fetchData = async () => {
      try {
        const response = await axios.get(`${appUrl}products/edit/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const res = response.data;

        formik.setValues({
          title: res.data.title,
          image: res.data.image?.toString() || "",
          specifications: res.data.specifications,
          price: res.data.price?.toString() || "",
          description: res.data.description,
          meta_title: res.data.meta_title,
          meta_img: res.data.meta_img?.toString() || "",
          meta_description: res.data.meta_description,
          meta_keywords: res.data.meta_keywords,
        });

        setSelectedImages((prev) => ({
          ...prev,
          ["image"]: res.data.image, // Set images for the specific type
        }));
        formik.setFieldValue("image", res.data.image);
        setSelectedImages((prev) => ({
          ...prev,
          ["meta_img"]: res.data.meta_img, // Set images for the specific type
        }));
        setImages(res.data.imageData);
        formik.setFieldValue("meta_img", res.data.meta_img);
        setMetaImages(res.data.metaImageData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load microchip data");
      }
    };

    fetchData();
  }, [id]);

  const handleSelectImages = (images: number[]) => {
    if (currentType) {
      // Set images in selectedImages state
      setSelectedImages((prev) => ({
        ...prev,
        [currentType]: images, // Set images for the specific type
      }));

      if (Array.isArray(images)) {
        formik.setFieldValue(currentType, images.join(","));
      } else {
        formik.setFieldValue(currentType, images);
      }
    }
    handleCloseModal();
  };

  const [selectedImages, setSelectedImages] = useState<{
    [key: string]: number[];
  }>({
    image: [],
    meta_img: [],
  });


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
  useEffect(() => {
    if (descriptionEditor && formik.values.description) {
      descriptionEditor.commands.setContent(formik.values.description);
    }
  }, [formik.values.description, descriptionEditor]);





      /** Editor **/
const specificationsEditor = useEditor({
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: "Start typing the specifications...",
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
  ],
  content: formik.values.specifications, // optional initial content
  editorProps: {
    attributes: {
      class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none",
    },
  },
  onUpdate: ({ editor }) => {
    formik.setFieldValue("specifications", editor.getHTML());
  },
  immediatelyRender: false, // ⚠ important for SSR in Next.js
});
  useEffect(() => {
    if (specificationsEditor && formik.values.specifications) {
      specificationsEditor.commands.setContent(formik.values.specifications);
    }
  }, [formik.values.specifications, specificationsEditor]);



   /** Editor **/
const meta_description_Editor = useEditor({
  extensions: [
    StarterKit,
    Placeholder.configure({
      placeholder: "Start typing the meta description...",
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
  ],
  content: formik.values.meta_description, // optional initial content
  editorProps: {
    attributes: {
      class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none",
    },
  },
  onUpdate: ({ editor }) => {
    formik.setFieldValue("meta_description", editor.getHTML());
  },
  immediatelyRender: false, // ⚠ important for SSR in Next.js
});
  useEffect(() => {
    if (meta_description_Editor && formik.values.meta_description) {
      meta_description_Editor.commands.setContent(formik.values.meta_description);
    }
  }, [formik.values.meta_description, meta_description_Editor]);

    const handleEditorChange = (content) => {
    formik.setFieldValue("description", content); // Replace 'description' with your actual field name in Formik
    if (formik.touched.description) {
      formik.setFieldTouched("description", false); // Mark the field as untouched to clear the error
    }
    };
  
    const handleSpecificationChange = (content) => {
    formik.setFieldValue("specifications", content); // Replace 'description' with your actual field name in Formik
    if (formik.touched.specifications) {
      formik.setFieldTouched("specifications", false); // Mark the field as untouched to clear the error
    }
    };
  
    const handleMetaDescriptionChange = (content) => {
    formik.setFieldValue("meta_description", content); // Replace 'description' with your actual field name in Formik
    if (formik.touched.meta_description) {
      formik.setFieldTouched("meta_description", false); // Mark the field as untouched to clear the error
    }
  };
  return (
    <CommonLayout>
      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="page-header-container mb-3 d-flex align-items-center justify-content-between">
            <div className="page-header-title">
              <h1 className="fs-4 mb-0">Edit Products</h1>
            </div>
            <div className="page-header-button">
              <Link href="/admin/products/list">
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
                    <div className="img-lists">
                      {image.map((val, index) => (
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
                            onClick={() => handleRemoveImage(val.id, "image")}>
                            <i className="fa-solid fa-x"></i>
                          </div>
                        </>
                      ))}
                    </div>
                    {formik.touched.image && formik.errors.image && (
                      <div className="text-danger">{formik.errors.image}</div>
                    )}
                  </div>

                  {/* Short Description */}
                  <div className="col-12 mb-3">
                    <label htmlFor="specifications" className="form-label">
                      Specifications <span className="text-danger">*</span>
                    </label>
                    <div className="border rounded-md">
                    <div className="editor-top-tool">
                        <EditorToolbar editor={specificationsEditor} />
                        <div className="editor-content-tool">
                        <EditorContent
                          value={formik.values.specifications}
                          onUpdate={({ editor }) => {
                            console.log(
                              "Editor content updated:",
                              editor.getHTML()
                            ); // Check if HTML is logged
                            handleSpecificationChange(editor.getHTML());
                          }}
                          editor={specificationsEditor}
                          className="bs-[200px] overflow-y-auto flex"
                          />
                          </div>
                        </div>
                    </div>
                    {formik.touched.specifications &&
                      formik.errors.specifications && (
                        <div className="text-danger">
                          {formik.errors.specifications}
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

                                    <div className="col-12 mb-3">
                    <label htmlFor="price" className="form-label">
                      Price <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="price"
                      {...formik.getFieldProps("price")}
                    />
                    {formik.touched.price && formik.errors.price && (
                      <div className="text-danger">
                        {formik.errors.price}
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
                    <div className="img-lists">
                      {metaImages.map((val, index) => (
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
                              handleRemoveImage(val.id, "meta_img")
                            }>
                            <i className="fa-solid fa-x"></i>
                          </div>
                        </>
                      ))}
                    </div>
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
                    <div className="border rounded-md">
                    <div className="editor-top-tool">
                        <EditorToolbar editor={meta_description_Editor} />
                        <div className="editor-content-tool">
                        <EditorContent
                          value={formik.values.meta_description}
                          onUpdate={({ editor }) => {
                            console.log(
                              "Editor content updated:",
                              editor.getHTML()
                            ); // Check if HTML is logged
                            handleMetaDescriptionChange(editor.getHTML());
                          }}
                          editor={meta_description_Editor}
                          className="bs-[200px] overflow-y-auto flex"
                          />
                          </div>
                        </div>
                    </div>
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
                      Update Blog
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
