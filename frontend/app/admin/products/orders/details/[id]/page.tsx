"use client";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
import CommonLayout from "../../../../layouts/CommonLayouts";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams } from "next/navigation";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

interface Product {
  id: number;
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: number;
  bill_from: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  payment_type: string;
  payment_status: "paid" | "unpaid";
  products: Product[];
}

export default function OrderDetailsPage() {
  const {id}=useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const token = getLocalStorageItem("token");
  useEffect(() => {
    // Fetch order details from API
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${appUrl}products/orders/details/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }); // Replace with dynamic id if needed
        const data = await res.json();
        setOrder(data.data);
      } catch (error) {
        toast.error("Failed to fetch order details");
      }
    };
    fetchOrder();
  }, []);

  return (
    <CommonLayout>
<div className="app-content py-4">
  <div className="container-fluid">
    <h2 className="mb-4">Order Details</h2>

    <div className="row mb-4">
      {/* Bill From */}
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-header">
            <h5 className="mb-0">Bill From</h5>
          </div>
          <div className="card-body">
            <p><strong>Name:</strong> {order?.name}</p>
            <p><strong>Email:</strong> {order?.email}</p>
            <p><strong>Phone:</strong> {order?.phone_number}</p>
            <p><strong>Address:</strong> {order?.address}</p>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div className="col-md-6">
        <div className="card shadow-sm">
          <div className="card-header">
            <h5 className="mb-0">Payment Info</h5>
          </div>
          <div className="card-body">
            <p><strong>Payment Type:</strong> {order?.payment_type}</p>
            <p>
              <strong>Payment Status:</strong>{" "}
              {order?.payment_status === "paid" ? (
                <span className="badge bg-success">Paid</span>
              ) : (
                <span className="badge bg-warning text-dark">Unpaid</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Product Details */}
    <div className="card shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">Product Details</h5>
      </div>
      <div className="card-body p-0">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>S.No</th>
              <th>Product Name</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {order?.products?.length > 0 ? (
              order.products.map((p, index) => (
                <tr key={p.id}>
                  <td>{index + 1}</td>
                  <td>{p.product_name}</td>
                  <td>{p.product_qty}</td>
                  <td>{parseFloat(p.product_price).toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td>1</td>
                <td>Order {order?.order_id}</td>
                <td>1</td>
                <td>{parseFloat(order?.total_amount || 0).toFixed(2)}</td>
              </tr>
            )}
            <tr>
              <td colSpan={3} className="text-end fw-bold">
                Total Amount
              </td>
              <td className="fw-bold">{parseFloat(order?.total_amount).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
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
