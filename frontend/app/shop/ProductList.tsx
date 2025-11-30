"use client";
import parse from "html-react-parser";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function ProductList() {
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
    <div className="row blog-section mb-10">
      {products.map((product, index) => (
        <div className="col-12 col-md-12 col-lg-4 mb-4" key={index}>
          <div className="card mb-4 blog-card">
            <Link href={`/shop/${product.slug}`}>
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
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
