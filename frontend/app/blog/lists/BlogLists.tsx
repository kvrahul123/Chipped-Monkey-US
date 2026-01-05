"use client";
import parse from "html-react-parser";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function BlogSection() {
  const [blogs, setBlogs] = useState<any[]>([]);
  useEffect(() => {
    fetch(`${appUrl}frontend/blogs/list`)
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.data || []); // adjust key depending on your API response
      })
      .catch((err) => console.error("Error fetching blogs:", err));
  }, []);
  return (
    <div className="row blog-section mb-10">
      {blogs.map((blog, index) => (
        <div className="col-12 col-md-12 col-lg-4 mb-4" key={index}>
          <div className="card mb-4 blog-card">
            <Link href={`/blog/details/${blog.slug}`}>
              <Image
                className="card-img img-blog"
                src={
                  blog.image_file_name
                    ? `${appUrl}uploads/${blog.image_file_name}`
                    : `${appUrl}/assets/images/default.jpg`
                }
                alt={blog.title}
                width={410}
                height={250}
                style={{ objectFit: "cover" }}
              />

              <div className="card-body p-4">
                <div className="views mb-2">{blog.date}</div>
                <h4 className="card-title" style={{ fontSize: "18px" }}>
                  {blog.title}
                </h4>
                <small className="text-muted cat">{blog.category || ""}</small>
                <p className="card-text">
                  {blog.short_description
                    ? parse(blog.short_description)
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
