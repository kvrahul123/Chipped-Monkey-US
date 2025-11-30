// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import CommonLayout from "../../layouts/CommonLayouts"; // Import your common layout component
import { ProductPage } from "./ProductPage";
import { useParams } from "next/navigation";

const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL

export default function profileCreatePage() {
  const slug = useParams();
  return (
    <CommonLayout>
      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="page-header-container mb-3 d-flex align-items-center justify-content-between">
            <div className="page-header-title"></div>
          </div>
          <ProductPage slug={slug.slug} />
        </div>
      </div>
    </CommonLayout>
  );
}
