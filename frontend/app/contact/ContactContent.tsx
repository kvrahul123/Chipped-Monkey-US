"use client";

import { useEffect, useState } from "react";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

export const ContactContent = () => {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const res = await fetch(`${appUrl}frontend/pages/list/?id=11`);
        const json = await res.json();

        if (json?.statusCode === 200 && json.data.length > 0) {
          const page = json.data[0];
          setPageData(page);
        }
      } catch (error) {
        console.error("Error fetching FAQ page:", error);
      }
    };

    fetchPageData();
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
};
