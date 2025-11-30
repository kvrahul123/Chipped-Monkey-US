"use client";

import Header from "./Header";
import Sidebar from "./Sidebar";
import Loader from "@/app/loader/page";
import withAuth from "../auth/withAuth";
import "react-toastify/dist/ReactToastify.css";
import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface CommonLayoutProps {
  children: ReactNode;
}

function CommonLayout({ children }: CommonLayoutProps) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(true); // 👈 loader state

  useEffect(() => {
    let loadedCount = 0;
    const totalFiles = 3; // number of styles to load

    const onStyleLoad = () => {
      loadedCount++;
      if (loadedCount === totalFiles) {
        setLoading(false); // ✅ All CSS loaded
      }
    };

    // ✅ Load admin styles dynamically
    const bootstrap = document.createElement("link");
    bootstrap.rel = "stylesheet";
    bootstrap.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
    bootstrap.id = "bootstrap-style";
    bootstrap.onload = onStyleLoad;

    const adminCss = document.createElement("link");
    adminCss.rel = "stylesheet";
    adminCss.href = "/assets/css/admin.css";
    adminCss.id = "admin-style";
    adminCss.onload = onStyleLoad;

    const faCss = document.createElement("link");
    faCss.rel = "stylesheet";
    faCss.href = "/assets/fontAwesome/Font-Awesome-6.4/font-awesome.css";
    faCss.id = "fa-style";
    faCss.onload = onStyleLoad;

    document.head.append(bootstrap, adminCss, faCss);

    // ✅ Cleanup when leaving the page
    return () => {
      document.getElementById("bootstrap-style")?.remove();
      document.getElementById("admin-style")?.remove();
      document.getElementById("fa-style")?.remove();
    };
  }, [pathname]);

  // 🌀 Show loader until all styles are loaded
  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Header />
      <div className="page">{children}</div>
      <Sidebar />
    </>
  );
}

export default withAuth(CommonLayout);
