"use client";
import parse from "html-react-parser";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { generateCommonMetadata } from "@/app/utils/metadata";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

interface BlogDetailsProps {
  slug: string | null;
}

export default function BlogCategoryList({ slug }: BlogDetailsProps) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categoriesList, setblogsLists] = useState([]);

  useEffect(() => {
    fetch(`${appUrl}frontend/blogs/category/list?slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setBlogs(data.data || []); // adjust key depending on your API response
      })
      .catch((err) => console.error("Error fetching blogs:", err));

    const fetchData = async () => {
      try {
        const response = await fetch(`${appUrl}blogs/category/lists`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();
        if (data && data.statusCode == 200) {
          setblogsLists(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="row blog-section mb-10">
      <div className="col-12 col-md-3">
        <div className="blogsCategoryLS-sidebar">
          <div className="sidebar-header-glass">
            <h5>Explore Topics</h5>
            <div className="header-line"></div>
          </div>
          <ul className="blogsCategoryLS-list list-unstyled">
            {categoriesList.map((cat, index) => (
              <li key={index} className="blogsCategoryLS-item">
                <Link
                  href={`/blog/category/${cat.slug}`}
                  className="blogsCategoryLS-link">
                  <span className="blogsCategoryLS-name">{cat.name}</span>
                  <span className="blogsCategoryLS-count">
                    {cat.blogsCount || 0}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="col-12 col-md-9">
        <div className="row">
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
                    <small className="text-muted cat">
                      {blog.category || ""}
                    </small>
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
      </div>

      {/* Categories sidebar */}
    </div>
  );
}
