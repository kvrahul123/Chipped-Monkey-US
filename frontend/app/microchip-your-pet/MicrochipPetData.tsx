"use client";

import { useEffect, useState } from "react";
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL

export default function MicrochipPetData() {
  const [pageData, setData] = useState<any>(null); // start with null instead of []

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${appUrl}frontend/pages/list/?id=16`);
        const result = await res.json();
        setData(result.data[0]);
      } catch (error) {
        console.error("Error fetching page data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {pageData?.content && (
        <div
          className="faq-intro"
          dangerouslySetInnerHTML={{ __html: pageData.content }}
        />
      )}
    </>
  );
}
