"use client";
import { useEffect, useState } from "react";
import Loader from "../loader/page"; // make sure this path is correct
import parse from "html-react-parser";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export default function PrivacyPolicyContent() {
  const [seoData, setSeoData] = useState(null); // start as null
  const [loading, setLoading] = useState(true);

  const fetchSeoData = async () => {
    try {
      const res = await fetch(`${appUrl}frontend/pages/list/?id=1`);
      const result = await res.json();
      const data = result.data ? result.data[0] : null;
      setSeoData(data);
    } catch (err) {
      console.error("Error fetching SEO data:", err);
      setSeoData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeoData();
  }, []);

  if (loading) {
    return <Loader />; // show loader while fetching
  }

  return <>{seoData?.content ? parse(seoData.content) : "No content available"}</>;
}
