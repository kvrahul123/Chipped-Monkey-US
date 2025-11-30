"use client";
import CommonLayout from "../../layouts/CommonLayouts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import PaginationComponent from "@/app/common/PaginationComponent";
import Swal from "sweetalert2";
import axios from "axios";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
import { useParams } from "next/navigation";
import Modal from "react-bootstrap/Modal"; // Import Modal from react-bootstrap
import Form from "react-bootstrap/Form"; // Import Form components
import Button from "react-bootstrap/Button"; // Import Button component

// NOTE: You might need to install 'react-bootstrap' and 'bootstrap'
// If you haven't already:
// npm install react-bootstrap bootstrap

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

// Define a type for the user object to help with type safety (optional but recommended)
interface User {
  id: number;
  name: string;
  email: string;
  status: "active" | "in_active";
  // Add other user properties as they exist in your data
}

export default function UsersListsPage() {
  const params = useParams();
  const userType = params.type;
  const [usersList, setusersLists] = useState<User[]>([]); // Use the User type
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const token = getLocalStorageItem("token");

  // --- Modal State ---
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [paymentType, setPaymentType] = useState("Percentage");
  const [amountValue, setAmountValue] = useState("");
  // -------------------

  // Handlers for Modal
  const handleClose = () => {
    setShowModal(false);
    setSelectedUser(null);
    setPaymentType("Percentage"); // Reset form fields
    setAmountValue("");
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${appUrl}users/lists/${userType}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data && data.statusCode == 200) {
          setusersLists(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, [userType, token]);

  const toggleFeatured = async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "in_active" : "active";

    try {
      const response = await fetch(`${appUrl}users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      if (data && data.statusCode === 200) {
        toast.success(data.message);
        setusersLists((prevLists) =>
          prevLists.map((user) =>
            user.id === userId ? { ...user, status: newStatus } : user
          )
        );
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Failed to update user status", error);
      toast.error("Failed to update user status.");
    }
  };

  const deleteData = async (id: number) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (!result.isConfirmed) return;

      const response = await axios.delete(`${appUrl}users/delete/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.statusCode === 200) {
        setusersLists((prevusers) =>
          prevusers.filter((user) => user.id !== id)
        );
        Swal.fire("Deleted!", "The user has been deleted.", "success");
      } else {
        Swal.fire("Failed!", "Failed to delete the user.", "error");
      }
    } catch (error) {
      console.error("Error deleting data", error);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the user.",
        "error"
      );
    }
  };

  const handleSubmitAmount = async (e) => {
    e.preventDefault();

    // 1. Initial Client-Side Validation
    if (!selectedUser || !amountValue || parseFloat(amountValue) <= 0) {
      toast.error("Please ensure all fields are correctly filled.");
      return;
    }

    // Percentage specific validation
    if (paymentType === "Percentage" && parseFloat(amountValue) > 100) {
      toast.error("Percentage cannot exceed 100.");
      return;
    }

    const payload = {
      userId: selectedUser.id,
      paymentType: paymentType, // "Percentage" or "Amount"
      value: parseFloat(amountValue),
    };

    try {
      // 2. API Call
      const response = await axios.post(
        `${appUrl}microchip/create/implanter/amount`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Assumes token is defined in component scope
            "Content-Type": "application/json",
          },
        }
      );

      // 3. Success Handling (Checking API status code)
      if (response.data.statusCode === 200) {
        toast.success(
          `Successfully set ${payload.value}${
            paymentType === "Percentage" ? "%" : "£"
          } for ${selectedUser.name}.`
        );
        handleClose(); // ONLY close the modal on success
      } else {
        // Handle non-200 status codes returned by your backend
        toast.error(
          response.data.message || "Failed to process request (Non-200 Status)."
        );
      }
    } catch (error) {
      // 4. Error Handling (Network errors, timeouts, 4xx/5xx HTTP errors)
      console.error("API Submission Error:", error);

      // Determine the best error message
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(
          error.response.data.message ||
            `Server Error: ${error.response.status}`
        );
      } else if (error.request) {
        // The request was made but no response was received (e.g., network issue)
        toast.error("Network Error: No response received from server.");
      } else {
        // Something else happened in setting up the request that triggered an Error
        toast.error("An unknown error occurred during submission.");
      }
    }
    // handleClose() is removed from the end, ensuring it only runs on success inside the try block.
  };


  const handleShow = async (user: User) => {
  setSelectedUser(user);
  setShowModal(true);

  try {
    const response = await axios.get(
      `${appUrl}microchip/implanter/amount/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data.statusCode === 200 && response.data.data) {
      const data = response.data.data;

      // Auto-fill modal fields
      setPaymentType(data.type === "Percentage" ? "Percentage" : "Amount");
      setAmountValue(String(data.value));
    } else {
      // No record exists → reset fields
      setPaymentType("Percentage");
      setAmountValue("");
    }
  } catch (error) {
    // If no data or API error → reset modal fields
    setPaymentType("Percentage");
    setAmountValue("");
  }
};

  
  const filteredusers = usersList.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastusers = currentPage * itemsPerPage;
  const indexOfFirstusers = indexOfLastusers - itemsPerPage;
  const currentusers = filteredusers.slice(indexOfFirstusers, indexOfLastusers);

  return (
    <CommonLayout>
      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="row mb-3">
            <div className="col-md-12">
              <h1 className="fs-4">Users Lists</h1>
            </div>
          </div>
          <hr />
          <div className="row h-100">
            <div className="col-md-12">
              <div className="card mb-4 h-100">
                <div className="card-header border-bottom border-light p-3 bg-white">
                  <div className="d-flex flex-wrap justify-content-between gap-3">
                    <div>
                      <input
                        type="text"
                        className="form-control ps-4"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => {
                          setSearchTerm(e.target.value);
                          setCurrentPage(1);
                        }}
                      />
                    </div>
                    <div>
                      <Link href={`/admin/users/create?type=${userType}`}>
                        <button className="btn btn-primary">
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
                        <th scope="col">Name</th>
                        <th scope="col">Email</th>
                        <th scope="col">Status </th>
                        <th scope="col">Amount </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentusers.map((user, index) => (
                        <tr key={index}>
                          <td>{user.name}</td>
                          <td>{user.email}</td>

                          <td>
                            <div className="custom-toggle-switch toggle-lg ms-sm-2 ms-0">
                              <input
                                id={`toggle-${user.id}`}
                                name="toggleswitchsize"
                                type="checkbox"
                                onChange={() =>
                                  toggleFeatured(user.id, user.status)
                                }
                                checked={user.status === "active"}
                              />
                              <label
                                htmlFor={`toggle-${user.id}`}
                                className="label-success mb-2"></label>
                            </div>
                          </td>
                          <td>
                            {/* Update the button to show the modal */}
                            <button
                              onClick={() => handleShow(user)}
                              className="btn btn-icon btn-sm btn-info-transparent rounded-pill display-flex align-items-center align-items-center">
                              <i className="fa-regular fa-plus fs-6"></i>
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
                    totalItems={filteredusers.length}
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

      {/* --- Bootstrap Modal Component --- */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Set Amount/Percentage for: **{selectedUser?.name}**
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* 1. Add the ID to the Form */}
          <Form id="amountForm" onSubmit={handleSubmitAmount}>
            <Form.Group className="mb-3" controlId="paymentTypeDropdown">
              <Form.Label>Payment Type</Form.Label>
              <Form.Select
                value={paymentType}
                onChange={(e) => setPaymentType(e.target.value)}>
                <option value="Percentage">Percentage (%)</option>
                <option value="Amount">Amount (£)</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="amountValueField">
              <Form.Label>{paymentType} Value</Form.Label>
              <Form.Control
                type="number"
                placeholder={`Enter ${paymentType}...`}
                value={amountValue}
                onChange={(e) => setAmountValue(e.target.value)}
                required
              />
            </Form.Group>

            {/* 2. Add a hidden submit button inside the form */}
            <button
              type="submit"
              style={{ display: "none" }}
              aria-hidden="true"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {/* 3. Link the Footer button to the form using 'form' and 'type="submit"' */}
          <Button
            variant="primary"
            type="submit" // Must be type="submit"
            form="amountForm" // Links this button to the Form with id="amountForm"
            disabled={!amountValue || parseFloat(amountValue) <= 0}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* ------------------------------- */}
    </CommonLayout>
  );
}
