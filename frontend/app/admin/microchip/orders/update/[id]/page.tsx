"use client";
import CommonLayout from "../../../../layouts/CommonLayouts";
import { useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function MicrochipOrdersPage() {
  const [formValues, setFormValues] = useState({
    microchip_count: "",
    prefix: "",
    assigned_to: "",
    ranges: [{ start: "", end: "" }],
    OP_id: "",
  });
  const formikRef = useRef(null);
  const router = useRouter();
  const token = getLocalStorageItem("token");
  const [showPage, setShowPage] = useState(false);
  const [selectedImplanter, setSelectedImplanter] = useState<any>(null);
  const [searchUserLists, setSearchUserLists] = useState("");
  const [usersLists, setUsersLists] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [numbers, setNumbers] = useState([]);
  const [orderId, setOrderId] = useState("");
  const [userId, setUserId] = useState("");
  const { id } = useParams();
  const [microchipData, setMicrochipData] = useState<any>(null);

  useEffect(() => {
    fetchMicrochipData(id);
  }, [id])
  const fetchMicrochipData = async (id: any) => {


    try {
      const response = await fetch(
        `${appUrl}microchip_orders/microchip/lists/${id}`,
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
        setMicrochipData(data.data);
        console.log("Microchip order data:", JSON.stringify(data.data));
        if (data.data.assigned_chips <= 0) {
          setShowPage(true);
        } else {
          router.push(`/admin/microchip/orders/view/${data.data.order_id}`);
        }
      } else {
        router.push("/admin/microchip/orders");
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };


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

  // ✅ Submit form
  const handleMicrochipSubmit = async (
    values: any,
    { setSubmitting, resetForm }: any
  ) => {
    try {
      // Merge multiple ranges into a single list
      let allNumbers: string[] = [];
      for (const range of values.ranges) {
        if (!range.start || !range.end) {
          toast.error("Start and End are required for all ranges!");
          setSubmitting(false);
          return;
        }

        const generated = generateNumbers(
          values.prefix,
          parseInt(range.start, 10),
          parseInt(range.end, 10)
        );
        if (!generated) {
          setSubmitting(false);
          return;
        }

        allNumbers = [...allNumbers, ...generated];
      }

      // if (allNumbers.length !== values.microchip_count) {
      //   toast.error(`You must assign exactly ${values.microchip_count} microchips. Currently generated: ${allNumbers.length}`);
      //   setSubmitting(false);
      //   return;
      // }

      const payload = {
        microchip_count: values.microchip_count,
        prefix: values.prefix,
        start: values.ranges[0].start,
        end: values.ranges[values.ranges.length - 1].end,
        assigned_numbers: allNumbers,
        microchipNumbers: allNumbers.join(","),
        order_id: orderId,
        assigned_to: String(userId),
        OP_id: values.OP_id,
      };

      console.log("Payload:", payload);

      const response = await axios.post(
        `${appUrl}microchip_orders/assigned_microchips/create`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.statusCode === 201) {
        toast.success("Assigned successfully!");
        router.push(`/admin/microchip/orders/view/${response.data.data.order_id}`);
        resetForm();
        setNumbers([]);
      } else {
        toast.error(response.data.message ?? "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to assign microchips");
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch users
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
        setFilteredUsers(data.data);
        console.log("User list data:", data.data);
      }
    } catch (error) {
      console.error("Failed to fetch user list data", error);
    }
  };

  useEffect(() => {
    usersListsApi();
  }, []);

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchUserLists(value);
    const filtered = usersLists.filter(
      (user) =>
        user.email.toLowerCase().includes(value) ||
        user.name?.toLowerCase().includes(value)
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    if (microchipData) {
      // Autofill the fetched values into your form
      setFormValues((prev) => ({
        ...prev,
        microchip_count: microchipData.microchip_count || "",
        assigned_to: String(microchipData.user_id || ""),
        OP_id: microchipData.id || "",
      }));

      // Also store separately for payload use
      setUserId(microchipData.user_id);
      setOrderId(microchipData.order_id);
      const filterUser = usersLists.find((user) => user.id == microchipData.user_id);
      setSelectedImplanter(filterUser);
    }
  }, [microchipData, usersLists]);

  return (
    <CommonLayout>
      {showPage && (
        <div className="app-content py-4">
          <div className="container-fluid h-100">
            <h1 className="fs-4 mb-4">
              Microchip Implanter Assignment Dashboard
            </h1>

            <div className="row h-100">
              {/* Left Panel */}
              {/* <div className="col-md-5">
              <div className="card shadow-sm border-0 mb-3 h-100">
                <div className="card-header bg-white border-0">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search Implanters by Email ID"
                    value={searchUserLists}
                    onChange={handleSearch}
                  />
                </div>
                <div
                  className="card-body"
                  style={{ maxHeight: "500px", overflowY: "auto" }}>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="d-flex align-items-center justify-content-between border rounded p-2 mb-2">
                        <div className="d-flex align-items-center">
                          <img
                            src={
                              user?.company_logo
                                ? appUrl + "uploads" + user?.company_logo
                                : "/assets/images/no-implanter.png"
                            }
                            alt={user.name}
                            className="rounded-circle me-3"
                            width="50"
                            height="50"
                          />
                          <div>
                            <div className="fw-semibold">
                              {user.name || "Unnamed User"}
                            </div>
                            <div className="text-muted small">{user.email}</div>
                            <div className="text-muted small">
                              {user.role || "User"}
                            </div>
                          </div>
                        </div>
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => {
                            setSelectedImplanter(user);
                            setUserId(user.id);
                            if (formikRef.current) {
                              formikRef.current.setFieldValue(
                                "assigned_to",
                                String(user.id)
                              );
                            } else {
                              console.warn("Formik reference not ready yet!");
                            }
                          }}>
                          Select
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted text-center">No users found.</p>
                  )}
                </div>
              </div>
            </div> */}

              {/* Right Panel */}
              <div className="col-md-12">
                <div className="card shadow-sm border-0 h-100">
                  <div className="card-body">
                    <h5 className="mb-3">Assignment Details</h5>

                    {selectedImplanter ? (
                      <div className="d-flex align-items-center mb-3">
                        <img
                          src={
                            selectedImplanter?.company_logo
                              ? appUrl +
                              "uploads" +
                              selectedImplanter?.company_logo
                              : "/assets/images/no-implanter.png"
                          }
                          alt={selectedImplanter.name}
                          className="rounded-circle me-3"
                          width="60"
                          height="60"
                        />
                        <div>
                          <div className="fw-semibold">
                            {selectedImplanter.name}
                          </div>
                          <div className="text-muted small">
                            {selectedImplanter.email}
                          </div>
                          <div className="text-muted small">
                            Address: {selectedImplanter.address || "N/A"}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-muted">No implanter selected.</p>
                    )}

                    <hr />

                    <Formik
                      enableReinitialize
                      innerRef={formikRef}
                      initialValues={formValues}
                      validationSchema={Yup.object({
                        assigned_to: Yup.string().required(
                          "Implanter is not assigned"
                        ),
                        microchip_count: Yup.number()
                          .required("Microchip count is required")
                          .typeError("Must be a number")
                          .min(1, "Microchip count must be greater than 0"),
                        prefix: Yup.string().nullable(),
                        ranges: Yup.array().of(
                          Yup.object({
                            start: Yup.number()
                              .required("Starting number is required")
                              .typeError("Must be a number"),
                            end: Yup.number()
                              .required("Ending number is required")
                              .typeError("Must be a number")
                              .min(Yup.ref("start"), "End must be >= start"),
                          })
                        ),
                      })}
                      onSubmit={handleMicrochipSubmit}>
                      {({ values, setFieldValue, isSubmitting, errors }) => (
                        <Form>
                          {!values.assigned_to && (
                            <div className="text-danger mb-2">
                              {errors.assigned_to}
                            </div>
                          )}
                          <h6 className="mb-3">Assign Microchips</h6>

                          {/* Microchip Count */}
                          <div className="mb-3">
                            <label className="form-label">Microchip Count</label>
                            <Field
                              type="number"
                              name="microchip_count"
                              className="form-control"
                              placeholder="Enter microchip count"
                            />
                            <ErrorMessage
                              name="microchip_count"
                              component="div"
                              className="text-danger"
                            />
                          </div>

                          {/* Prefix */}
                          {/* <div className="mb-3">
                          <label className="form-label">
                            Microchip Numbers (Prefix)
                          </label>
                          <Field
                            type="text"
                            name="prefix"
                            className="form-control"
                            placeholder="Enter prefix"
                          />
                          <ErrorMessage
                            name="prefix"
                            component="div"
                            className="text-danger"
                          />
                        </div> */}

                          {/* Start & End Ranges */}
                          <div className="mt-4 mb-4">
                            {values.ranges.map((range, index) => (
                              <div key={index} className="d-flex gap-2 mb-2">
                                <div style={{ width: "50%" }}>
                                  <label className="form-label">
                                    Starting Number
                                  </label>
                                  <Field
                                    type="number"
                                    className="form-control"
                                    name={`ranges[${index}].start`}
                                    placeholder="Starting Number"
                                  />
                                  <ErrorMessage
                                    name={`ranges[${index}].start`}
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>

                                <div style={{ width: "50%" }}>
                                  <label className="form-label">
                                    Ending Number
                                  </label>
                                  <Field
                                    type="number"
                                    className="form-control"
                                    name={`ranges[${index}].end`}
                                    placeholder="Ending Number"
                                  />
                                  <ErrorMessage
                                    name={`ranges[${index}].end`}
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>
                                {/* Delete Button (not for first range) */}
                                {index > 0 && (
                                  <div style={{ width: "10%" }}>
                                    <button
                                     style={{marginTop: "3.1em"}}
                                      type="button"
                                      className="delete-btn-icon"
                                      onClick={() => {
                                        const updatedRanges = [...values.ranges];
                                        updatedRanges.splice(index, 1); // remove the clicked range
                                        setFieldValue("ranges", updatedRanges);

                                        // Optional: Decrement microchip_count if needed
                                        setFieldValue(
                                          "microchip_count",
                                          Number(values.microchip_count) - 20
                                        );
                                      }}>
                                     <i class="fa-solid fa-trash"></i>
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* Add More button */}
                            <div
                              style={{ textAlign: "right", marginTop: "10px" }}>
                              <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => {
                                  setFieldValue("ranges", [
                                    ...values.ranges,
                                    { start: "", end: "" },
                                  ]);
                                  setFieldValue(
                                    "microchip_count",
                                    Number(values.microchip_count) + 20
                                  );

                                }}>
                                Add More
                              </button>
                            </div>
                          </div>

                          {/* Submit */}
                          <div className="modal-footer">
                            <button
                              type="submit"
                              className="btn btn-success"
                              disabled={isSubmitting}>
                              {isSubmitting ? "Saving..." : "Save Changes"}
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
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
      )}
    </CommonLayout>
  );
}
