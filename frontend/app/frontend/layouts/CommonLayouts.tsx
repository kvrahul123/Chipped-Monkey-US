"use client";

import { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Loader from "@/app/loader/page";
import { ToastContainer } from "react-toastify";

interface CommonLayoutProps {
  children: React.ReactNode;
}

export default function CommonLayout({ children }: CommonLayoutProps) {
  const [loading, setLoading] = useState(true); // 👈 track CSS load state

  useEffect(() => {
    let loadedCount = 0;
    const totalStyles = 3;

    const onStyleLoad = () => {
      loadedCount++;
      if (loadedCount === totalStyles) {
        // All CSS loaded
        setLoading(false);
      }
    };

    // Dynamically load styles
    const bootstrap = document.createElement("link");
    bootstrap.rel = "stylesheet";
    bootstrap.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
    bootstrap.id = "bootstrap-style";
    bootstrap.onload = onStyleLoad;

    const styleCss = document.createElement("link");
    styleCss.rel = "stylesheet";
    styleCss.href = "/assets/css/style.css";
    styleCss.id = "style-style";
    styleCss.onload = onStyleLoad;

    const responsiveCss = document.createElement("link");
    responsiveCss.rel = "stylesheet";
    responsiveCss.href = "/assets/css/responsive.css";
    responsiveCss.id = "responsive-style";
    responsiveCss.onload = onStyleLoad;

    document.head.append(bootstrap, styleCss, responsiveCss);

    // Remove admin styles if any leaked from previous route
    document.getElementById("admin-style")?.remove();
    document.getElementById("fa-style")?.remove();

    return () => {
      document.getElementById("bootstrap-style")?.remove();
      document.getElementById("style-style")?.remove();
      document.getElementById("responsive-style")?.remove();
    };
  }, []);

  if (loading) {
    // ⏳ Show loader until styles are loaded
    return <Loader />;
  }

  return (
    <div className="chippedMonkey_page">
      <Header />
      <div>{children}</div>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <Footer />
    </div>
  );
}
