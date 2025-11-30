"use client";
import { useEffect, useState } from "react";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
import parse from "html-react-parser";
export default function TermsConditionsContent() {
  const fetchSeoData = async () => {
    try {
      const res = await fetch(`${appUrl}frontend/pages/list/?id=1`);
      const result = await res.json();
      const seoData = result.data ? result.data[0] : null;
      setSeoData(seoData);
    } catch (err) {
      console.error("Error fetching SEO data:", err);
    }
  };
  const [seoData, setSeoData] = useState([]);
  useEffect(() => {
    fetchSeoData();
  }, []);
  return <>{parse(String(seoData.content)) || ""}</>;
}
