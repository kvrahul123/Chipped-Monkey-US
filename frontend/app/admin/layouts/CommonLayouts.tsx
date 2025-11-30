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
  const [loading, setLoading] = useState(true); // 👈 Track CSS load status

  useEffect(() => {
    let loadedCount = 0;
    const totalFiles = 3; // bootstrap + admin.css + font-awesome.css

    const onFileLoad = () => {
      loadedCount++;
      if (loadedCount === totalFiles) {
        setLoading(false); // ✅ all CSS loaded
      }
    };

    // ✅ Dynamically add required CSS files
    const bootstrap = document.createElement("link");
    bootstrap.rel = "stylesheet";
    bootstrap.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
    bootstrap.id = "bootstrap-style";
    bootstrap.onload = onFileLoad;

    const adminCss = document.createElement("link");
    adminCss.rel = "stylesheet";
    adminCss.href = "/assets/css/admin.css";
    adminCss.id = "admin-style";
    adminCss.onload = onFileLoad;

    const fontAwesome = document.createElement("link");
    fontAwesome.rel = "stylesheet";
    fontAwesome.href = "/assets/fontAwesome/Font-Awesome-6.4/font-awesome.css";
    fontAwesome.id = "fa-style";
    fontAwesome.onload = onFileLoad;

    document.head.append(bootstrap, adminCss, fontAwesome);

    // ✅ Remove frontend styles (if user just switched from /)
    document.getElementById("style-style")?.remove();
    document.getElementById("responsive-style")?.remove();

    // ✅ Cleanup when leaving admin routes
    return () => {
      document.getElementById("bootstrap-style")?.remove();
      document.getElementById("admin-style")?.remove();
      document.getElementById("fa-style")?.remove();
    };
  }, [pathname]);

  // ⏳ Show loader until all admin CSS files are loaded
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
