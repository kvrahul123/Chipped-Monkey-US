"use client";
import React, { useEffect, useState } from "react";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
import parse from "html-react-parser";

interface ImplanterDetailsProps {
  slug: string;
}

interface ImplanterData {
  company_name: string;
  description?: string;
  phone?: string;
  address?: string;
  image_file_name?: string | null;
}

export default function ImplanterDetails({ slug }: ImplanterDetailsProps) {
  const [data, setData] = useState<ImplanterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImplanter = async () => {
      try {
        const res = await fetch(
          `${appUrl}frontend/implanter/details?slug=${slug}`
        );
        const result = await res.json();

        if (result.statusCode === 200) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching implanter details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImplanter();
  }, [slug]);

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  if (!data) {
    return <p className="text-center text-danger">Implanter not found</p>;
  }

  const logoUrl = data.image_file_name
    ? `${appUrl}uploads/${data.image_file_name}` // adjust if your uploads folder path differs
    : "/assets/images/no-image.png";

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8 text-center">
        {/* Company Logo */}
        <div className="mb-4">
          <img
            src={logoUrl}
            alt={`${data.company_name || "Company"} Logo`}
            className="mx-auto d-block"
            style={{ maxHeight: "100px" }}
          />
        </div>

        {/* Company Name */}
        <h1 className="display-5 fw-bold text-primary mb-3">
          {data.company_name || "Unknown Company"}
        </h1>

        {/* Company Description */}
        {data.small_description && (
          <p className="lead text-muted">{parse(data.small_description)}</p>
        )}

        {/* Phone */}
        {data.phone && <p className="lead text-muted">{data.phone}</p>}

        {/* Address */}
        {(data.address_1 || data.address_2 || data.address_3) && (
          <p className="lead text-muted">
            {data.address_1 || data.address_2 || data.address_3}
          </p>
        )}
      </div>
    </div>
  );
}
