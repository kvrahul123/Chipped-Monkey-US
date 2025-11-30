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
const iframeUrl = process.env.NEXT_PUBLIC_IFRAME_URL;
import { useEditor, EditorContent } from "@tiptap/react";
import EditorToolbar from "@/app/common/EditorToolbar";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import DraftEditor from "@/app/admin/common/DraftEditor";
import { getLocalStorageItem } from "@/app/common/LocalStorage";

import CommonEditor from "@/app/admin/common/CommonEditor";
export default function pagesEditPage() {
    const iframeRef = useRef<HTMLIFrameElement>(null);
  const [pageContent, setPageContent] = useState("");
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

  type FAQ = {
    question: string;
    answer: string;
  };

  type Values = {
    title: string;
    content: string;
    meta_title: string;
    meta_image: string;
    meta_description: string;
    keywords: string;
    faqs: FAQ[];
  };

  // Yup validation schema
  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    content: Yup.string().required("Page Description is required"),
    meta_title: Yup.string().required("Meta Title is required"),
    meta_image: Yup.mixed().required("Meta Image is required"),
    meta_description: Yup.string().required("Meta Description is required"),
    keywords: Yup.string().required("Meta Keywords are required"),
    faqs: Yup.array().of(
      Yup.object().shape({
        question: Yup.string().required("Question is required"),
        answer: Yup.string().required("Answer is required"),
      })
    ),
  });

  // Formik setup
  const formik = useFormik<Values>({
    initialValues: {
      title: "",
      content: "",
      meta_title: "",
      meta_image: "", // use null for files
      meta_description: "",
      keywords: "",
      faqs: [
        // 👈 must exist!
        {
          question: "",
          answer: "",
        },
      ],
    },
    validationSchema,
    onSubmit: async (values) => {
      const payload = {
        title: values.title,
        content: pageContent,
        meta_title: values.meta_title,
        meta_description: values.meta_description,
        keywords: values.keywords,
        meta_image: values.meta_image,
        faqs: values.faqs,
        // image/meta_img: send as URL or number if backend expects IDs
      };

      try {
        const response = await axios.put(
          `${appUrl}pages/update/${id}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json", // <--- JSON, not multipart
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.statusCode == 200) {
          toast.success(response.data.message || "Pages updated successfully");
          router.push("/admin/pages/list");
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
    if (type == "meta_image") {
      const updatedImages = metaImages.filter((img) => img.id !== id);
      setMetaImages(updatedImages);
      const updatedFileNames = updatedImages.map((img) => img.id).join(",");
      formik.setFieldValue("meta_image", updatedFileNames);
      setSelectedImages((prev) => ({
        ...prev,
        ["meta_image"]: updatedImages.map((img) => img.id).join(","),
      }));
    }
  };

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    const plainText = state.getCurrentContent().getPlainText();
    formik.setFieldValue("content", plainText);
  };

useEffect(() => {
  if (!id || didFetch.current) return;

  didFetch.current = true;

  const fetchData = async () => {
    try {
      const response = await axios.get(`${appUrl}pages/edit/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = response.data;

      // Wait until iframe is loaded


      // Set formik values
      formik.setValues({
        title: res.data.title,
        content: res.data.content,
        meta_title: res.data.meta_title,
        meta_image: res.data.meta_image?.toString() || "",
        meta_description: res.data.meta_description,
        keywords: res.data.keywords,
        faqs: Array.isArray(res.data.faq_content)
          ? res.data.faq_content
          : res.data.faq_content
          ? JSON.parse(res.data.faq_content)
          : [],
      });

      setPageContent(res.data.content);
      setSelectedImages((prev) => ({
        ...prev,
        meta_image: res.data.meta_image,
      }));
      formik.setFieldValue("meta_image", res.data.meta_image);
      setMetaImages(res.data.metaImageData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load microchip data");
    }
  };

  fetchData();
}, [id]);


useEffect(() => {
  if (iframeRef.current && pageContent !== "") {
    const iframe = iframeRef.current;

    const sendMessage = () => {
      iframe.contentWindow?.postMessage(
        { type: "SET_CONTENT", content: pageContent },
        "*"
      );
    };

    if (iframe.contentWindow) {
      sendMessage();
    }

    iframe.onload = () => {
      sendMessage(); 
    };
  }
}, [pageContent]);

useEffect(() => {
  function handleMessage(event: MessageEvent) {
    if (event.data?.type === "CONTENT") {
      // Update only if content really changed
      if (formik.values.content !== event.data.content) {
        formik.setFieldValue("content", event.data.content, false); // false = don't validate on every keystroke
        setPageContent(event.data.content);
      }
    }
  }

  window.addEventListener("message", handleMessage);
  return () => window.removeEventListener("message", handleMessage);
}, [formik.values.content]);



  const handleSelectImages = (images: number[]) => {
    if (currentType) {
      setSelectedImages((prev) => ({
        ...prev,
        [currentType]: images,
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
    meta_image: [],
  });

  /** Editor **/
  const descriptionEditor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start typing the content...",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: formik.values.content, // optional initial content
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      formik.setFieldValue("content", editor.getHTML());
    },
    immediatelyRender: false, // ⚠ important for SSR in Next.js
  });
  useEffect(() => {
    if (descriptionEditor && formik.values.content) {
      descriptionEditor.commands.setContent(formik.values.content);
    }
  }, [formik.values.content, descriptionEditor]);


  
  //   useEffect(() => {
  //   const listener = (event: MessageEvent) => {
  //     if (event.data?.type === 'CONTENT') {
  //       formik.setFieldValue('content', event.data.content);
  //     }
  //   };
  //   window.addEventListener('message', listener);
  //   return () => window.removeEventListener('message', listener);
  // }, [formik]);

  return (
    <CommonLayout>
      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="page-header-container mb-3 d-flex align-items-center justify-content-between">
            <div className="page-header-title">
              <h1 className="fs-4 mb-0">Edit Pages</h1>
            </div>
            <div className="page-header-button">
              <Link href="/admin/pages/list">
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

                  {/* Description */}
                  <div className="col-12 mb-3">
                    <label htmlFor="content" className="form-label">
                      Page Description <span className="text-danger">*</span>
                    </label>
                    <div
                      className="border rounded-md"
                      style={{ minHeight: "400px" }}>
          <iframe
            ref={iframeRef}
            src={iframeUrl}
            style={{ width: '100%', height: '400px', border: 'none' }}
          />
                    </div>
                    {formik.touched.content && formik.errors.content && (
                      <div className="text-danger">{formik.errors.content}</div>
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
                    <label htmlFor="meta_image" className="form-label">
                      Meta Image <span className="text-danger">*</span>
                    </label>
                    <button
                      className="form-control"
                      id="meta_image"
                      onClick={() => handleOpenModal("meta_image")}
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
                              handleRemoveImage(val.id, "meta_image")
                            }>
                            <i className="fa-solid fa-x"></i>
                          </div>
                        </>
                      ))}
                    </div>
                    {formik.touched.meta_image && formik.errors.meta_image && (
                      <div className="text-danger">
                        {formik.errors.meta_image}
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
                    <label htmlFor="keywords" className="form-label">
                      Meta Keywords <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="keywords"
                      {...formik.getFieldProps("keywords")}
                    />
                    {formik.touched.keywords && formik.errors.keywords && (
                      <div className="text-danger">
                        {formik.errors.keywords}
                      </div>
                    )}
                  </div>
                  {Number(id) === 17 && (
                    <div className="col-12 mb-3">
                      <label className="form-label">FAQs</label>

                      {formik.values.faqs && formik.values.faqs.length > 0 ? (
                        formik.values.faqs.map((faq, index) => (
                          <div
                            key={index}
                            className="border rounded p-3 mb-3 bg-light position-relative">
                            {/* Question */}
                            <div className="mb-2">
                              <label className="form-label">Question</label>
                              <input
                                type="text"
                                className="form-control"
                                {...formik.getFieldProps(
                                  `faqs[${index}].question`
                                )}
                              />
                            </div>

                            {/* Answer */}
                            <div className="mb-2">
                              <label className="form-label">Answer</label>
                              <textarea
                                rows={2}
                                className="form-control"
                                {...formik.getFieldProps(
                                  `faqs[${index}].answer`
                                )}
                              />
                            </div>

                            {/* Remove button */}
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => {
                                const updatedFaqs = [...formik.values.faqs];
                                updatedFaqs.splice(index, 1);
                                formik.setFieldValue("faqs", updatedFaqs);
                              }}>
                              Remove
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted">No FAQs added yet.</p>
                      )}

                      {/* Add New Question */}
                      <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={() =>
                          formik.setFieldValue("faqs", [
                            ...formik.values.faqs,
                            { question: "", answer: "" },
                          ])
                        }>
                        + Add Question
                      </button>
                    </div>
                  )}

                  <div className="page-bottom-actions">
                    <button type="submit" className="btn btn-primary">
                      Update Page
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
