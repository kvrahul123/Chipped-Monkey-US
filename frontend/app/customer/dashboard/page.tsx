// app/dashboard/page.tsx
"use client";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
import CommonLayout from "../layouts/CommonLayouts";
import { useEffect, useState } from "react";
import Link from "next/link";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function DashboardPage() {
  const token = getLocalStorageItem("token");

  const [counts, setCounts] = useState({
    userCount: 0,
    orderCount: 0,
    productsCount: 0,
    productPaymentsCount: 0,
    blogsCount: 0,
    microchipCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${appUrl}dashboard/counts`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data && data.statusCode === 200) {
          setCounts(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <CommonLayout>
      <div className="app-content">
        <div className="container-fluid">
          <div className="page-header-container">
            <div className="page-header-title">
              <h1>Dashboard</h1>
            </div>
          </div>

          <div className="dashboard-wrapper">
            {/* Microchips */}
            <div className="dashboard-card microchip">
              <div className="card-left">
                <span>Total Microchips</span>
                <h2>{counts.microchipCount}</h2>
              </div>
              <div className="card-icon microchip">
                <i className="fa-solid fa-microchip"></i>
              </div>
            </div>

            {/* Orders */}
            <div className="dashboard-card orders">
              <div className="card-left">
                <span>Total Product Orders</span>
                <h2>{counts.orderCount}</h2>
              </div>
              <div className="card-icon orders">
                <i className="fa-solid fa-cart-shopping"></i>
              </div>
            </div>

            {/* Payments */}
            <div className="dashboard-card payments">
              <div className="card-left">
                <span>Total Product Payments</span>
                <h2>₹ {counts.productPaymentsCount ?? 0}</h2>
              </div>
              <div className="card-icon payments">
                <i className="fa-solid fa-credit-card"></i>
              </div>
            </div>
          </div>

          <div className="row vw-100 mt-4">
            {/* Create Microchip */}
            <div className="col-md-6 col-sm-6 col-lg-3 mt-3">
              <Link href="/customer/microchip/list">
                <div className="page-dashboard-action-cards bg-softPurple">
                  <div
                    className="page-dashboard-cards-icons "
                    style={{ color: "#e7845b" }}>
                    <i className="fa-solid fa-microchip"></i>
                  </div>
                  <h5 style={{ color: "#000" }}>Add Microchip</h5>
                </div>
              </Link>
                      </div>
                      
            {/* Assign Microchip */}
            <div className="col-md-6 col-sm-6 col-lg-3 mt-3">
              <Link href="/customer/shop">
                <div className="page-dashboard-action-cards bg-lightBlue">
                  <div className="page-dashboard-cards-icons">
                    <i className="fa-solid fa-microchip"></i>
                  </div>
                  <h5>Shop Now</h5>
                </div>
              </Link>
            </div>

            {/* Free Registration */}
            <div className="col-md-6 col-sm-6 col-lg-3 mt-3">
              <Link href="/customer/products/orders">
                <div className="page-dashboard-action-cards bg-darkBlue">
                  <div
                    className="page-dashboard-cards-icons "
                    style={{ color: "#e7845b" }}>
                    <i className="fa-solid fa-tag"></i>
                  </div>
                  <h5>View Orders</h5>
                </div>
              </Link>
            </div>


          </div>
        </div>
      </div>
    </CommonLayout>
  );
}
