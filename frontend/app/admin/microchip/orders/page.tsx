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
import { Modal } from "react-bootstrap";
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

declare global {
  interface Window {
    bootstrap: any;
  }
}
export default function MicrochipOrdersPage() {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js").then((bs) => {
      (window as any).bootstrap = bs; // ✅ assign bootstrap globally
    });
  }, []);

  const [microchipsList, setmicrochipLists] = useState<MicrochipOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orderId, setOrderId] = useState("");
  const [modalType, setModalType] = useState("");
  const [editID, seteditID] = useState(0);
  const [editValue, setEditValue] = useState<any>(null);
  const [editStatus, setEditStatus] = useState("");
  const [orderData, setOrderData] = useState<MicrochipOrder[]>([]);
  const [usersLists, setUsersLists] = useState([]);
  const [microchipData, setMicrochipData] = useState<MicrochipOrder | null>(
    null
  );
  const [searchUserLists, setSearchUserLists] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const token = getLocalStorageItem("token");
  const [userId, setUserId] = useState("");

  const [prefix, setPrefix] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [numbers, setNumbers] = useState([]);


  
  const getAddData = () => {
    setModalType("Add");
    setEditValue("");
    seteditID(0);
    if (typeof window !== "undefined") {
      const modalEl = document.getElementById("addOrderModal");
      if (modalEl) new Modal(modalEl).show();
    }
  };

  const fetchOrderData = async (id: any) => {
    setOrderData([]);
    try {
      const response = await fetch(
        `${appUrl}microchip_orders/assigned/lists/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data && data.statusCode == 200) {
        setOrderData(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };
  const handleSearch = (e, setFieldValue) => {
    const value = e.target.value;
    setSearchUserLists(value);
    setFieldValue("email", value); // ✅ works now

    if (value.trim().length > 0) {
      const filtered = usersLists.filter((user) =>
        user.email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
      setShowDropdown(true);
    } else {
      setFilteredUsers([]);
      setShowDropdown(false);
    }
  };


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
    usersListsApi();
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
  const generateNumbers = (prefix: string, start: number, end: number) => {
    const result: string[] = [];

    for (let i = start; i <= end; i++) {
      const num = `${prefix}${i}`;
      if (num.length !== 15) {
        toast.error(`Must have exactly 15 digits.`);
        return false;
      }
      result.push(num);
    }

    return result;
  };

  const usersListsApi = async () => {
    try {
      const response = await fetch(`${appUrl}users/listsdata`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data && data.statusCode === 200) {
        setUsersLists(data.data);
        console.log("User list data:", data.data); // Log the fetched user data
      }
    } catch (error) {
      console.error("Failed to fetch user list data", error);
    }
  };

  // Handle submit
  const handleSubmit = async (values: any, { resetForm }: any) => {
    const response = await axios.post(
      `${appUrl}microchip_orders/create`, // ✅ backend URL
      {
        microchip_count: values.microchipCount, // match backend naming
        status: values.status,
        id: editID,
        email: values.email,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // if auth needed
          "Content-Type": "application/json",
        },
      }
    );

    toast.success("Order added successfully!");
    fetchData();

    resetForm();
    closeModal("addOrderModal");
  };

  const validationMicrochipSchema = Yup.object({
    prefix: Yup.string().required("Prefix is required"),
    start: Yup.number()
      .required("Starting number is required")
      .typeError("Must be a number"),
    end: Yup.number()
      .required("Ending number is required")
      .typeError("Must be a number")
      .min(Yup.ref("start"), "End number must be greater than start"),
  });

  // ✅ Submit form
  const handleMicrochipSubmit = async (
    values: {
      microchip_count: number;
      prefix: string;
      start: string;
      end: string;
    },
    { setSubmitting, resetForm }: any
  ) => {
    try {
      const generatedNumbers = generateNumbers(
        values.prefix,
        parseInt(values.start, 10),
        parseInt(values.end, 10)
      );

      if (!generatedNumbers) {
        setSubmitting(false);
        return;
      }

      if (generatedNumbers.length != values.microchip_count) {
        toast.error(
          `You must assign exactly ${values.microchip_count} microchips. Currently generated: ${generatedNumbers.length}`
        );
        setSubmitting(false);
        return;
      }

      const payload = {
        microchip_count: values.microchip_count,
        prefix: values.prefix,
        start: values.start,
        end: values.end,
        assigned_numbers: generatedNumbers, // array
        microchipNumbers: generatedNumbers.join(","),
        order_id: orderId,
        assigned_to: String(userId),
      };

      const response = await axios.post(
        `${appUrl}microchip_orders/assigned_microchips/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // if auth needed
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.statusCode == 201) {
        // ✅ Close modal
        if (typeof window !== "undefined") {
          closeModal("assignMicrochipModal");
        }
        toast.success("Assigned successfully!"); // ✅ success toast
        resetForm();
        setNumbers([]);
        fetchData();
        setOrderId("");
        setUserId("");
      } else {
        toast.error(response.data.message ?? "Something went wrong");
      }
    } catch (error) {
      console.error(JSON.stringify(error));
      toast.error("Failed to assign microchips");
    } finally {
      setSubmitting(false);
    }
  };

  const getEditData = (value: any, id: any, status: string) => {
    setModalType("Edit");
    setEditValue(Number(value));
    setEditStatus(status);
    seteditID(id);
    if (typeof window !== "undefined") {
      const modalEl = document.getElementById("addOrderModal");
      if (modalEl) new Modal(modalEl).show();
    }
  };
  const closeModal = (id: string) => {
    const modalEl = document.getElementById(id);

    if (modalEl && window.bootstrap) {
      const modalInstance =
        window.bootstrap.Modal.getInstance(modalEl) ||
        new window.bootstrap.Modal(modalEl);
      modalInstance.hide();
    }
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
                aria-label="Close"></button>
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

      {/* Add Assign Microchip */}
      <div
        className="modal fade"
        id="assignMicrochipModal"
        tabIndex={-1}
        aria-labelledby="assignMicrochipLabel"
        aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="assignMicrochipLabel">
                Assign Microchip
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>

            <Formik
              enableReinitialize
              initialValues={{
                microchip_count: microchipData?.microchip_count ?? "",
                prefix: "",
                start: "",
                end: "",
              }}
              validationSchema={validationMicrochipSchema}
              onSubmit={handleMicrochipSubmit}>
              {({ values, setFieldValue, isSubmitting }) => (
                <Form>
                  <div className="modal-body">
                    {/* Microchip Count */}
                    <div className="mb-3">
                      <label htmlFor="microchipCount" className="form-label">
                        Microchip Count
                      </label>
                      <Field
                        type="text"
                        className="form-control"
                        id="microchipCount"
                        name="microchip_count"
                        placeholder="Enter microchip count"
                      />
                    </div>

                    {/* Prefix */}
                    <div className="mb-3">
                      <label htmlFor="microchipNumber" className="form-label">
                        Microchip Numbers (Prefix)
                      </label>
                      <Field
                        type="text"
                        className="form-control"
                        id="microchipNumber"
                        name="prefix"
                        placeholder="Enter microchip number"
                      />
                      <ErrorMessage
                        name="prefix"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    {/* Start & End */}
                    <div className="d-flex justify-content-between align-items-center mt-4 mb-4">
                      <div style={{ width: "35%" }}>
                        <label className="form-label">Starting Number</label>
                        <Field
                          type="number"
                          className="form-control"
                          id="starting_number"
                          name="start"
                        />
                        <ErrorMessage
                          name="start"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      <div style={{ width: "35%" }}>
                        <label className="form-label">Last Number</label>
                        <Field
                          type="number"
                          className="form-control"
                          id="ending_number"
                          name="end"
                        />
                        <ErrorMessage
                          name="end"
                          component="div"
                          className="text-danger"
                        />
                      </div>

                      {/* Check button */}
                      <div style={{ width: "20%", marginTop: "30px" }}>
                        <button
                          type="button"
                          className="btn btn-secondary check_microchip"
                          onClick={() => {
                            if (values.prefix && values.start && values.end) {
                              setNumbers(
                                generateNumbers(
                                  values.prefix,
                                  parseInt(values.start, 10),
                                  parseInt(values.end, 10)
                                )
                              );
                            } else {
                              alert("Enter prefix, start and end first!");
                            }
                          }}>
                          Check
                        </button>
                      </div>
                    </div>

                    {/* Assigned numbers list */}
                    <div className="mb-3">
                      <label htmlFor="assignedNumbers" className="form-label">
                        Assigned Numbers
                      </label>
                      {numbers.length === 0 ? (
                        <p>Not Assigned</p>
                      ) : (
                        <ul className="assigned-numbers-list">
                          {numbers.map((num, index) => (
                            <li key={index}>{num}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="modal-footer">
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={isSubmitting}>
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal">
                      Close
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {/* Modal */}
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
                aria-label="Close"></button>
            </div>
            <Formik
              enableReinitialize
              initialValues={{
                microchipCount: editValue || "",
                status: editStatus || "",
                email: "",
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              {({ handleSubmit, setFieldValue }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3 position-relative">
                      <label htmlFor="assignedTo" className="form-label">
                        Assigned to
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="assignedTo"
                        name="email"
                        placeholder="Search using email..."
                        value={searchUserLists}
                        onChange={(e) => handleSearch(e, setFieldValue)} // ✅ pass it here
                        onBlur={() =>
                          setTimeout(() => setShowDropdown(false), 200)
                        }
                        onFocus={() =>
                          filteredUsers.length && setShowDropdown(true)
                        }
                      />

                      {showDropdown && filteredUsers.length > 0 && (
                        <ul
                          className="list-group position-absolute w-100 shadow-sm mt-1"
                          style={{
                            zIndex: 10,
                            maxHeight: "200px",
                            overflowY: "auto",
                            cursor: "pointer",
                          }}>
                          {filteredUsers.map((user) => (
                            <li
                              key={user.id}
                              className="list-group-item list-group-item-action"
                              onClick={() => {
                                setSearchUserLists(user.email);
                                setShowDropdown(false);
                                setFieldValue("email", user.email);
                              }}>
                              <div>
                                <strong>{user.name}</strong> <br />
                                <small>{user.email}</small>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

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

                    {/* Status */}
                    <div className="mb-3">
                      <label htmlFor="status" className="form-label">
                        Status
                      </label>
                      <Field
                        as="select"
                        className="form-select"
                        id="status"
                        name="status">
                        <option value="">Select Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </Field>
                      <ErrorMessage
                        name="status"
                        component="div"
                        className="text-danger small"
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal">
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
                      <Link href="/admin/microchip/orders/create">
                      <button
                        className="btn btn-primary"
                       
                       >
                        <i className="fa-regular fa-plus"></i> Add
                        </button>
                        </Link>
                    </div>
                  </div>
                </div>

                <div className="page-table-container w-100 ">
                  <table className="table text-nowrap">
                    <thead className="table-primary">
                      <tr>
                        <th scope="col">Order ID</th>
                        <th scope="col">Customer Name</th>
                        <th scope="col">Address</th>
                        <th scope="col">Microchip Count</th>
                        <th scope="col">Date</th>
                        {/* <th scope="col">Status</th> */}
                        <th scope="col">Assign Microchip</th>
                        {/* <th scope="col">Actions</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {currentmicrochips.map((microchips, index) => (
                        <tr key={index}>
                          <td>{microchips.order_id}</td>
                          <td><Link href={`/admin/microchip/orders/view/${microchips.order_id}`}>{microchips.userName}</Link></td>
                          <td>{microchips.address}</td>
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
                            {microchips.is_assigned ? (
                              <Link href={`/admin/microchip/orders/view/${microchips.order_id}`}>
                              <span
                                className="btn btn-soft-view btn-icon btn-sm rounded-circle display-flex align-items-center align-items-center"
                              
                               >
                                <i className="fa-regular fa-eye fs-6"></i>
                                </span>
                                </Link>
                            ) : (
                                <Link href={`/admin/microchip/orders/update/${microchips.order_id}`}>
                              <span
                                className="btn btn-icon btn-sm btn-info-transparent rounded-pill display-flex align-items-center align-items-center"
                    
                               >
                                <i className="fa-regular fa-plus fs-6"></i>
                              </span>
                                  </Link>
                            )}
                          </td>
{/* 
                          <td>
                            <div
                              data-bs-toggle="modal"
                              data-bs-target="#addOrderModal"
                              onClick={() =>
                                getEditData(
                                  microchips.microchip_count,
                                  microchips.id,
                                  microchips.status
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
                          </td> */}
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
