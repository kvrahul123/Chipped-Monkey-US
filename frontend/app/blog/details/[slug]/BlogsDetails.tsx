"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import parse from "html-react-parser";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

interface BlogDetailsProps {
  slug: string | null;
}

export default function BlogDetails({ slug }: BlogDetailsProps) {
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        const res = await fetch(
          `${appUrl}frontend/blogs/details?slug=${slug}`,
          {
            cache: "no-store",
          }
        );
        const data = await res.json();
        if (data.statusCode === 200) {
          setBlog(data.data);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) return <p>Loading blog...</p>;
  if (!blog) return <p>No blog found.</p>;

  return (
    <div className="blog-container">
      <h1 className="page-title-h1">{blog.title}</h1>
      <Image
        className="card-img img-blog"
        src={
          blog.image_file_name
            ? `${appUrl}uploads/${blog.image_file_name}`
            : `${appUrl}/assets/images/default.jpg`
        }
        alt={blog.title}
        width={960}
        height={540}
        quality={100}
        style={{ objectFit: "cover" }}
      />
      <div className="blog-content">{parse(blog.description)}</div>
    </div>
  );
}
