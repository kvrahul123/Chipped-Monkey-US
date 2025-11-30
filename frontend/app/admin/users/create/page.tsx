// app/dashboard/page.tsx
"use client";

import CommonLayout from "../../layouts/CommonLayouts";
import Link from "next/link";
import { Suspense } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useSearchParams } from "next/navigation";
import { RegisterForm } from "./RegisterForm";
import Loader from "@/app/loader/page";

// ✅ Inner client component that uses useSearchParams
function UsersCreateInner() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  return (
    <div className="app-content">
      <div className="container-fluid h-100">
        <div className="page-header-container mb-3 d-flex align-items-center justify-content-between">
          <div className="page-header-title">
            <h1 className="fs-4 mb-0">Users Create</h1>
          </div>
          <div className="page-header-button">
            <Link href={`/admin/users/${type}`}>
              <button className="btn btn-primary">
                <i className="fa-solid fa-arrow-left"></i> Back
              </button>
            </Link>
          </div>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}

export default function UsersCreatePage() {
  return (
    <CommonLayout>
      {/* ✅ Wrap in Suspense so useSearchParams works */}
      <Suspense fallback={<div>
        <Loader/>
      </div>}>
        <UsersCreateInner />
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </CommonLayout>
  );
}
