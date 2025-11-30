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
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";



interface MicrochipOrder {
  id: number;
  order_id: string;
  user_id: number | null;
  microchip_count: number;
  date: string;
  status: "pending" | "cancelled" | "completed";
  created_at: string;
  updated_at: string;
}

export default function MicrochipOrdersPage() {

  useEffect(() => {
  import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bs) => {
    (window as any).bootstrap = bs; // ✅ assign bootstrap globally
  });
  }, []);
  let modalInstance: any = null;

  const [microchipsList, setmicrochipLists] = useState<MicrochipOrder[]>([]);
  const [modalType, setModalType] = useState("");
  const [editID, seteditID] = useState(0);
  const [editValue, setEditValue] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [orderData, setOrderData] = useState<MicrochipOrder[]>([]);
  const [itemsPerPage] = useState(10);
  const token = getLocalStorageItem("token");
  const fetchData = async () => {
    try {
      const response = await fetch(`${appUrl}microchip_orders/lists`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data && data.statusCode == 200) {
        setmicrochipLists(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };



  useEffect(() => {
    fetchData();
      if (typeof window !== "undefined") {
    const modalEl = document.getElementById("addOrderModal");
    if (modalEl && window.bootstrap) {
      modalInstance = window.bootstrap.Modal.getOrCreateInstance(modalEl);
    }
  }
  }, []);

  const deleteData = async (id: number) => {
    try {
      // Show confirmation modal
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (!result.isConfirmed) return; // Exit if user cancels

      // Proceed with deletion
      const response = await axios.delete(
        `${appUrl}microchip_orders/delete/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.statusCode === 200) {
        // Remove the deleted order from state
        setmicrochipLists((prevmicrochips) =>
          prevmicrochips.filter((microchips) => microchips.id !== id)
        );
        Swal.fire("Deleted!", "The order has been deleted.", "success");
      } else {
        Swal.fire("Failed!", "Failed to delete the order.", "error");
      }
    } catch (error) {
      console.error("Error deleting data", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the order.",
        "error"
      );
    }
  };

  const filteredmicrochips = microchipsList.filter((microchip) =>
    microchip.order_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastmicrochips = currentPage * itemsPerPage;
  const indexOfFirstmicrochips = indexOfLastmicrochips - itemsPerPage;
  const currentmicrochips = filteredmicrochips.slice(
    indexOfFirstmicrochips,
    indexOfLastmicrochips
  );


  const validationSchema = Yup.object({
    microchipCount: Yup.number()
      .typeError("Microchip count must be a number")
      .positive("Must be greater than 0")
      .required("Microchip count is required"),
    status: Yup.string().required("Status is required"),
  });

  // Handle submit
const handleSubmit = async (values: any, { resetForm }: any) => {
  try {
    const res = await axios.post(
      `${appUrl}microchip_orders/create`,
      {
        microchip_count: values.microchipCount,
        status: values.status,
        id: editID,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = res.data; // <-- backend response

    if (data.statusCode === 200) {
      toast.success("Order added successfully!");
    } else {
      toast.error(data.message || "Something went wrong");
    }

    fetchData();
    resetForm();
    closeModal("addOrderModal");
  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Request failed");
  }
};


  const getEditData = (value: any, id: any) => {
    setModalType("Edit");
    setEditValue(Number(value));
    seteditID(id);
  if (typeof window !== "undefined") {
  modalInstance.show();
  }
  };

  const getAddData = () => {
    setModalType("Add");
    setEditValue("");
    seteditID(0);
    if (typeof window !== "undefined") {

      const modalEl = document.getElementById("addOrderModal");
      if (modalEl) new Modal(modalEl).show();
    }
  };

const closeModal = (id: string) => {
  const modalEl = document.getElementById(id);

  if (!modalEl || !window.bootstrap) return;

  let modalInstance = window.bootstrap.Modal.getInstance(modalEl);

  if (!modalInstance) {
    modalInstance = new window.bootstrap.Modal(modalEl, { backdrop: true });
  }

  // Listen for the modal to fully close
  modalEl.addEventListener(
    "hidden.bs.modal",
    function handleHidden() {
      // Remove leftover backdrop
      document.querySelectorAll(".modal-backdrop").forEach((el) => el.remove());

      // Remove Bootstrap body classes
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow");
      document.body.style.removeProperty("padding-right");

      modalEl.removeEventListener("hidden.bs.modal", handleHidden);
    },
    { once: true }
  );

  modalInstance.hide();
};


  

  return (
    <CommonLayout>
      {/* Assign Microchip */}
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                View Assigned Microchip
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ></button>
            </div>
            <div className="modal-body">
              {orderData.length > 0 ? (
                <ul className="assigned-numbers-list">
                  {orderData.map((order) => (
                    <li key={order.id}>{order.microchip_number}</li>
                  ))}
                </ul>
              ) : (
                <p>Not Assigned any microchip</p>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Add Microchip Orders */}
      <div
        className="modal fade"
        id="addOrderModal"
        tabIndex={-1}
        aria-labelledby="addOrderModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addOrderModalLabel">
                {modalType} Orders
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close" ></button>
            </div>
            <Formik
              enableReinitialize
              initialValues={{
                microchipCount: editValue || "",
                status: "pending",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    {/* Microchip Count */}
                    <div className="mb-3">
                      <label htmlFor="microchipCount" className="form-label">
                        Microchip Count
                      </label>
                      <Field
                        type="number"
                        className="form-control"
                        id="microchipCount"
                        name="microchipCount"
                        placeholder="Enter microchip count"
                      />
                      <ErrorMessage
                        name="microchipCount"
                        component="div"
                        className="text-danger small"
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                      >
                      Close
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save changes
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="row mb-3">
            <div className="col-md-12">
              <h1 className="fs-4">Microchips Order Lists</h1>
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
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                    <div>
                      <button
                        className="btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#addOrderModal"
                        onClick={getAddData}>
                        <i className="fa-regular fa-plus"></i> Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="page-table-container w-100 ">
                  <table className="table text-nowrap">
                    <thead className="table-primary">
                      <tr>
                        <th scope="col">Order ID</th>
                        <th scope="col">Customer Name</th>
                        <th scope="col">Microchip Count</th>
                        <th scope="col">Date</th>
                        {/* <th scope="col">Status</th> */}
                        <th scope="col">Assign Microchip</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentmicrochips.map((microchips, index) => (
                        <tr key={index}>
                          <td>{microchips.order_id}</td>
                          <td><Link href={`/customer/microchip/orders/view/${microchips.order_id}`}>{microchips.userName}</Link></td>
                          <td>{microchips.microchip_count}</td>
                          <td>{microchips.date}</td>
                          {/* <td className="table_badge">
                            {microchips.status === "pending" && (
                              <span className="badge bg-warning text-dark fs-16">
                                Pending
                              </span>
                            )}
                            {microchips.status === "cancelled" && (
                              <span className="badge bg-danger">Cancelled</span>
                            )}
                            {microchips.status === "completed" && (
                              <span className="badge bg-success">
                                Completed
                              </span>
                            )}
                          </td> */}

                          <td>
                            <Link href={`/customer/microchip/orders/view/${microchips.order_id}`}>
                            <span
                              className="btn btn-soft-view btn-icon btn-sm rounded-circle display-flex align-items-center align-items-center"
                              >
                              <i className="fa-regular fa-eye fs-6"></i>
                            </span>
                            </Link>
                          </td>

                          <td>
                            {!microchips.is_assigned && (
                              <>
                              <div
                                data-bs-toggle="modal"
                                data-bs-target="#addOrderModal"
                                onClick={() =>
                                  getEditData(
                                    microchips.microchip_count,
                                    microchips.id
                                  )
                                }
                                className="btn btn-icon btn-sm btn-info-transparent rounded-pill">
                                <i className="fa-regular fa-pen-to-square"></i>
                              </div>
                            <Link
                              href="#"
                              onClick={() => deleteData(microchips.id)}
                              className="btn btn-soft-danger btn-icon btn-sm rounded-circle ms-2">
                              <i className="fa-solid fa-trash"></i>
                                </Link>
                                </>
                            )}
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
                    totalItems={filteredmicrochips.length}
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
