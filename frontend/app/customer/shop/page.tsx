// app/dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import CommonLayout from "../layouts/CommonLayouts"; // Import your common layout component
import Link from "next/link";
import Image from "next/image";
import parse from "html-react-parser";

const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL

export default function profileCreatePage() {
  const [products, setProducts] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${appUrl}frontend/products/list`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data || []); // adjust key depending on your API response
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  return (
    <CommonLayout>
      <div className="app-content">
        <div className="container-fluid h-100">
          <div className="page-header-container mb-3 d-flex align-items-center justify-content-between">
            <div className="page-header-title">
              <h1 className="fs-4 mb-0">Shop</h1>
            </div>
          </div>
          <div className="row blog-section mb-10">
            {products.map((product, index) => (
              <div className="col-12 col-md-12 col-lg-4 mb-4" key={index}>
                <div className="card mb-4 blog-card">
                  <Link href={`/customer/shop/${product.slug}`}>
                    <Image
                      className="card-img img-blog"
                      src={
                        product.image_file_name
                          ? `${appUrl}uploads/${product.image_file_name}`
                          : `${appUrl}/assets/images/default.jpg`
                      }
                      alt={product.title}
                      width={410}
                      height={250}
                      style={{ objectFit: "cover" }}
                    />

                    <div className="card-body p-4">
                      <div className="views mb-2">{product.date}</div>
                      <h4 className="card-title" style={{ fontSize: "18px" }}>
                        {product.title}
                      </h4>
                      <small className="text-muted cat">
                        {product.category || ""}
                      </small>
                      <p className="card-text">
                        {product.description
                          ? parse(
                              product.description
                                .split(" ")
                                .slice(0, 50) // ✅ take only first 100 words
                                .join(" ") +
                                (product.description.split(" ").length > 50
                                  ? " ..."
                                  : "")
                            )
                          : "N/A"}
                      </p>
                      <div className="text-center w-100">
                        <Link href={`/customer/shop/${product.slug}`}>
                          <button className="btn btn-primary shopViewMore">
                            View More
                          </button>
                        </Link>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}
