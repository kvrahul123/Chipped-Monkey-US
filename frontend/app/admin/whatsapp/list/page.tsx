"use client";
import CommonLayout from "../../layouts/CommonLayouts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaginationComponent from "@/app/common/PaginationComponent";
import Swal from "sweetalert2";
import axios from "axios";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
import Image from "next/image";
import { Table, Button, Modal, Form } from "react-bootstrap";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

import "bootstrap/dist/css/bootstrap.min.css";

import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema
const WhatsappSchema = Yup.object().shape({
  label: Yup.string().required("Message Type is required"),
  message: Yup.string().required("Message is required"),
});

declare global {
  interface Window {
    bootstrap: any;
  }
}

export default function whatsappOrdersPage() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bs) => {
      (window as any).bootstrap = bs; // ✅ assign bootstrap globally
    });
  }, []);
  const [showModal, setShowModal] = useState(false);

  const [pagesList, setpagesLists] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const token = getLocalStorageItem("token");
  const handleEdit = (page: any) => {
    setSelectedPage(page);
    setShowModal(true);
  };
  const handleSave = async () => {
    if (!selectedPage.label || !selectedPage.message) {
      toast.error("Both fields are required");
      return;
    }

    try {
      await axios.put(
        `${appUrl}whatsapp/${selectedPage.id}`,
        {
          label: selectedPage.label,
          message: selectedPage.message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Template updated successfully!");
      const modal = (window as any).bootstrap.Modal.getInstance(
        document.getElementById("editModal")
      );
      modal.hide();
    } catch (err) {
      toast.error("❌ Failed to update template");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${appUrl}whatsapp/lists`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data && data.statusCode == 200) {
          setpagesLists(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const filteredpages = pagesList.filter((pages) =>
    pages.label?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastpages = currentPage * itemsPerPage;
  const indexOfFirstpages = indexOfLastpages - itemsPerPage;
  const currentpages = filteredpages.slice(indexOfFirstpages, indexOfLastpages);

  return (
    <CommonLayout>
      {/* Bootstrap Modal for Editing */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Whatsapp Template</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPage && (
            <Formik
              initialValues={{
                label: selectedPage.label || "",
                message: selectedPage.message || "",
              }}
              validationSchema={WhatsappSchema}
              onSubmit={async (values, { setSubmitting }) => {
                try {
                  await axios.put(
                    `${appUrl}whatsapp/update/${selectedPage.id}`,
                    {
                      label: values.label,
                      message: values.message,
                    },
                    {
                      headers: { Authorization: `Bearer ${token}` },
                    }
                  );

                  toast.success("Template updated successfully!");
                  setShowModal(false);

                  // update table instantly
                  setpagesLists((prev) =>
                    prev.map((item) =>
                      item.id === selectedPage.id
                        ? {
                            ...item,
                            label: values.label,
                            message: values.message,
                          }
                        : item
                    )
                  );
                } catch (err: any) {
                  toast.error(
                    err.response?.data?.message ||
                      "❌ Failed to update template"
                  );
                } finally {
                  setSubmitting(false);
                }
              }}>
              {({ isSubmitting }) => (
                <FormikForm>
                  <div className="mb-3">
                    <label className="form-label">Message Type</label>
                    <Field name="label" className="form-control" />
                    <ErrorMessage
                      name="label"
                      component="div"
                      className="text-danger mt-1"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <Field
                      as="textarea"
                      name="message"
                      rows={4}
                      className="form-control"
                    />
                    <ErrorMessage
                      name="message"
                      component="div"
                      className="text-danger mt-1"
                    />
                  </div>

                  <Modal.Footer>
                    <Button
                      variant="secondary"
                      onClick={() => setShowModal(false)}>
                      Close
                    </Button>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </Modal.Footer>
                </FormikForm>
              )}
            </Formik>
          )}
        </Modal.Body>
      </Modal>

      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="row mb-3">
            <div className="col-md-12">
              <h1 className="fs-4">Whatsapp Lists</h1>
            </div>
          </div>

          <div className="row h-100">
            <div className="col-md-12">
              <div className="card mb-4 h-100">
                <div className="card-header border-bottom border-light p-3 bg-white">
                  <div className="d-flex flex-wrap justify-content-between gap-3">
                    <div>
                      <input
                        type="text"
                        className="form-control ps-4"
                        placeholder="Search whatsapp..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="page-table-container w-100 ">
                  <table className="table text-nowrap">
                    <thead className="table-primary">
                      <tr>
                        <th scope="col">Msg Type</th>
                        <th scope="col">Message</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentpages.map((pages, index) => (
                        <tr key={index}>
                          <td>{pages.label}</td>
                          <td>{pages.message}</td>

                          <td>
                            <button
                              type="button"
                              onClick={() => handleEdit(pages)}
                              className="btn btn-icon btn-sm btn-info-transparent rounded-pill">
                              <i className="fa-regular fa-pen-to-square"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Component */}
                <div className="mb-3 footer-paginator">
                  <PaginationComponent
                    currentPage={currentPage}
                    totalItems={filteredpages.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            </div>
          </div>

          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover
            draggable
          />
        </div>
      </div>
    </CommonLayout>
  );
}
