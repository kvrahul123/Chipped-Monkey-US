"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { removeLocalStorageItem } from "@/app/common/LocalStorage";
import { verifyToken } from "../common/api";
import { rolePermissions } from "../common/rolePermissions";

/* -------------------------
   menuItems (unchanged)
   ------------------------- */
export const menuItems = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 side-menu__icon"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"></path>
      </svg>
    ),
  },
  {
    key: "microchip/orders",
    label: "Microchip Order",
    href: "/admin/microchip/orders",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 side-menu__icon"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 7V6a6 6 0 1 1 12 0v1"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 7h14l-1.5 12.5a2 2 0 0 1-2 1.5H8.5a2 2 0 0 1-2-1.5L5 7z"
        />
      </svg>
    ),
  },
    {
    key: "microchip/payment",
    label: "Microchip Payments",
    href: "/admin/microchip/payment",
    icon: (
<svg
  xmlns="http://www.w3.org/2000/svg"
  className="w-6 h-6 side-menu__icon"
  fill="none"
  viewBox="0 0 24 24"
  strokeWidth="1.5"
  stroke="currentColor"
>
  <rect x="3" y="4" width="18" height="14" rx="2" ry="2" />
  <path d="M3 10h18" />
  <rect x="7" y="13" width="4" height="3" rx="0.5" />
  <path d="M14 13h4" />
</svg>

    ),
  },
  {
    key: "transaction/request",
    label: "Transfer Request",
    href: "/admin/transaction/request",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 side-menu__icon"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 7h16M4 7l3-3m-3 3l3 3M20 17H4m16 0l-3-3m3 3l-3 3"
        />
      </svg>
    ),
  },
  {
    key: "microchip/list",
    label: "Microchip",
    href: "/admin/microchip/list",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 side-menu__icon"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor">
        <rect
          x="7"
          y="7"
          width="10"
          height="10"
          rx="2"
          ry="2"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    key: "blogs",
    label: "Blogs",
    href: "/admin/blogs/list",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 side-menu__icon"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20h9" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
        />
      </svg>
    ),
  },
  {
    key: "products",
    label: "Products",
    href: "/admin/products/list",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 side-menu__icon"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5v-9z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 12l9-4.5M12 12v9M12 12L3 7.5"
        />
      </svg>
    ),
  },
  {
    key: "products/orders",
    label: "Product Orders",
    href: "/admin/products/orders",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 side-menu__icon"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H6.4M7 13L5.4 5M7 13l-2 9h14l-2-9M10 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"
        />
      </svg>
    ),
  },
  // {
  //   key: "package/orders",
  //   label: "Subscription",
  //   href: "/admin/package/orders",
  //   icon: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       className="w-6 h-6 side-menu__icon"
  //       fill="none"
  //       viewBox="0 0 24 24"
  //       strokeWidth="1.5"
  //       stroke="currentColor">
  //       <path
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //         d="M3 7.5L12 3l9 4.5v9L12 21l-9-4.5v-9z"
  //       />
  //       <path
  //         strokeLinecap="round"
  //         strokeLinejoin="round"
  //         d="M12 12l9-4.5M12 12v9M12 12L3 7.5"
  //       />
  //     </svg>
  //   ),
  // },
  {
    key: "users",
    label: "Registered Users",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 side-menu__icon"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 20.25a8.25 8.25 0 0 1 15 0"
        />
      </svg>
    ),
    children: [
      {
        key: "users/pet_owner",
        label: "Pet Owner",
        href: "/admin/users/pet_owner",
      },
      {
        key: "users/microchip_implanters",
        label: "Microchip Implanter",
        href: "/admin/users/microchip_implanters",
      },
      {
        key: "users/breeders",
        label: "Breeder",
        href: "/admin/users/breeders",
      },
      {
        key: "users/other_users",
        label: "Other Users",
        href: "/admin/users/other_users",
      },
    ],
  },
  {
    key: "pages",
    label: "Pages",
    href: "/admin/pages/list",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 side-menu__icon"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 7h6M9 12h6M9 17h6M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
        />
      </svg>
    ),
  },
  {
    key: "whatsapp",
    label: "Whatsapp Template",
    href: "/admin/whatsapp/list",
    icon: (
      // Outline (stroke) WhatsApp icon 
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 side-menu__icon"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.5"
        stroke="currentColor"
        aria-hidden="true">
        <title>WhatsApp</title>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12.2c0 4.6-3.7 8.3-8.3 8.3a8.2 8.2 0 0 1-4.5-1.3L3 21l1.1-4.2A8.3 8.3 0 0 1 3.7 12.2C3.7 7.6 7.4 3.9 12 3.9s8.3 3.7 8.3 8.3z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15.2 14.3c-.2-.1-1.1-.6-1.3-.7-.2-.1-.4-.1-.5.1-.1.2-.5.7-.6.8-.1.1-.3.1-.5 0-.7-.4-1.3-1.1-1.8-1.8-.1-.1 0-.3.1-.4.1-.1.3-.3.4-.5.1-.2 0-.4-.1-.6-.1-.2-.9-2-.9-2.6 0-.6.4-1 1-1 .2 0 .4 0 .6.1.2.1.5.1.7.1.2 0 .4-.1.6-.1.5 0 1 .3 1.3.8.4.6.5 1.2.6 1.5.1.3 0 .6-.1.7-.1.2-.5.7-.6.8z"
        />
      </svg>
    ),
  },
];

/* -------------------------
   Sidebar component
   ------------------------- */
export default function Sidebar() {
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);

  // make openSubMenus dynamic (no need to add keys manually)
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>(
    () =>
      menuItems.reduce((acc: Record<string, boolean>, item) => {
        if (item.children) acc[item.key] = false;
        return acc;
      }, {})
  );

  const toggleSubMenu = (menu: string) => {
    setOpenSubMenus((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  const logout = () => {
    localStorage.clear();
    router.push("/admin/auth");
  };

  useEffect(() => {
    const fetchUserType = async () => {
      const type = await verifyToken();
      if (type) {
        setUserType(type);
      }
    };
    fetchUserType();
  }, []);

  function hasPermission(
    role: keyof typeof rolePermissions,
    key: string,
    children?: { key: string }[]
  ) {
    const permissions = rolePermissions[role];
    if (!permissions) return false;
    if (permissions.includes("*")) return true;

    // direct match for the key
    const direct = permissions.some((perm) =>
      perm.endsWith("/*")
        ? key.startsWith(perm.replace("/*", ""))
        : perm === key
    );
    if (direct) return true;

    // if children exist, check if any child is allowed
    if (children) {
      return children.some((child) =>
        permissions.some((perm) =>
          perm.endsWith("/*")
            ? child.key.startsWith(perm.replace("/*", ""))
            : perm === child.key
        )
      );
    }

    return false;
  }

  return (
    <aside className="app-aside">
      <div className="aside-container">
        <div className="aside-logo text-center">
          <Image
            src="/assets/images/logo-inside.png"
            alt="ChippedMonkey Logo"
            width={135}
            height={63}
          />
        </div>

        <div className="aside-menu">
          <ul>
            {menuItems.map((item) => {
              if (!userType) return null;
              const role = userType as keyof typeof rolePermissions;

              // if item has children -> filter visible children by permission
              if (item.children) {
                const visibleChildren = item.children.filter((child) =>
                  hasPermission(role, child.key)
                );
                if (visibleChildren.length === 0) return null; // nothing visible, hide parent

                const isOpen = !!openSubMenus[item.key];

                return (
                  <li
                    key={item.key}
                    className={`slide has-sub ${isOpen ? "open" : ""}`}>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSubMenu(item.key);
                      }}
                      className="side-menu_item">
                      <i
                        className={`fa-solid ${
                          isOpen ? "fa-angle-up" : "fa-angle-down"
                        } side-menu__angle`}></i>
                      {item.icon}
                      <span className="side-menu__label">{item.label}</span>
                    </a>

                    {isOpen && (
                      <ul className="slide-menu child1">
                        {visibleChildren.map((child) => (
                          <li key={child.key} className="slide">
                            <Link href={child.href} className="side-menu_item">
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              // single item
              if (!hasPermission(role, item.key)) return null;

              return (
                <li key={item.key} className="slide">
                  <Link href={item.href ?? "#"} className="side-menu_item">
                    {item.icon}
                    <span className="side-menu__label">{item.label}</span>
                  </Link>
                </li>
              );
            })}
            <li className="slide">
              <a
                onClick={logout}
                className="side-menu_item flex items-center gap-2 text-red-600 hover:text-red-800 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 side-menu__icon">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                  />
                </svg>
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
