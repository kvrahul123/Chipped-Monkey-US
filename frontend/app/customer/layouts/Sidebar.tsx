"use client"; // This makes the component a Client Component
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type OpenSubMenus = {
  products: boolean;
  customers: boolean;
  settings: boolean;
  blogs: boolean;
};
import Link from "next/link";
import Image from "next/image";
import { removeLocalStorageItem } from "@/app/common/LocalStorage";
import { verifyToken } from "../common/api";

export default function Sidebar() {
  const router = useRouter();
  const [userType, setUserType] = useState<string | null>(null);
  const [accountType, setAcountType] = useState<string | null>(null);

  const [openSubMenus, setOpenSubMenus] = useState<OpenSubMenus>({
    products: false,
    customers: false,
    settings: false,
    blogs: false,
  });

  const toggleSubMenu = (menu: keyof OpenSubMenus) => {
    setOpenSubMenus((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  const logout = () => {
      localStorage.clear();
    router.push("/user-login/pet_owner");
  };

  useEffect(() => {
    const fetchUserType = async () => {
      const type = await verifyToken();
      if (type) {
        setUserType(type.user_type);
        setAcountType(type.account_type);
      }
    };

    fetchUserType();
  }, []);

  return (
    <aside className="app-aside">
      <div className="aside-container">
        <div className="aside-logo text-center">
          <Link href="/">
            <Image
              src="/assets/images/logo-inside.png"
              alt="ChippedMonkey Logo"
              width={135}
              height={63}
            />
          </Link>
        </div>
        <div className="aside-menu">
          <ul>
            <li className="slide">
              <Link href="/customer/dashboard" className="side-menu_item">
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
                <span className="side-menu__label">Dashboard</span>
              </Link>
            </li>

            {/* My Profile and Settings */}
            <li
              className={`slide has-sub ${
                openSubMenus.settings ? "open" : ""
              }`}>
              <Link
                href=""
                className="side-menu_item"
                onClick={(e) => {
                  e.preventDefault();
                  toggleSubMenu("settings");
                }}>
                <i
                  className={`fa-solid fa-angle-${
                    openSubMenus.settings ? "up" : "down"
                  } side-menu__angle`}></i>
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.591 1.01c1.52-.878 3.232.834 2.354 2.354a1.724 1.724 0 001.01 2.591c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.01 2.591c.878 1.52-.834 3.232-2.354 2.354a1.724 1.724 0 00-2.591 1.01c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.591-1.01c-1.52.878-3.232-.834-2.354-2.354a1.724 1.724 0 00-1.01-2.591c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.01-2.591c-.878-1.52.834-3.232 2.354-2.354.996.575 2.165.043 2.591-1.01z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

                <span className="side-menu__label">
                  My Profile and Settings
                </span>
              </Link>

              <ul
                className="slide-menu child1"
                style={{
                  display: openSubMenus.settings ? "block" : "none",
                }}>
                <li className="slide">
                  <Link className="side-menu_item" href="/customer/profile">
                    Edit My Profile
                  </Link>
                </li>
                <li className="slide">
                  <Link
                    className="side-menu_item"
                    href="/customer/profile/settings">
                    Account Settings
                  </Link>
                </li>
              </ul>
            </li>

            <li className="slide">
              <Link href="/customer/shop" className="side-menu_item">
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
                    d="M3 9.75V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9.75M3 9.75l2.25-4.5h13.5L21 9.75M3 9.75h18M9 22V12h6v10"
                  />
                </svg>

                <span className="side-menu__label">Shop </span>
              </Link>
            </li>

            <li className="slide">
              <Link
                href="/customer/microchip/payment"
                className="side-menu_item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 side-menu__icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor">
                  <rect x="3" y="4" width="18" height="14" rx="2" ry="2" />
                  <path d="M3 10h18" />
                  <rect x="7" y="13" width="4" height="3" rx="0.5" />
                  <path d="M14 13h4" />
                </svg>

                <span className="side-menu__label">Microchip Payments </span>
              </Link>
            </li>

            {(accountType == "1" || accountType == "3") && (
              <li className="slide">
                <Link
                  href="/customer/microchip/orders"
                  className="side-menu_item">
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

                  <span className="side-menu__label">Microchip Order </span>
                </Link>
              </li>
            )}

            <li className="slide">
              <Link href="/customer/microchip/list" className="side-menu_item">
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

                <span className="side-menu__label">Microchip</span>
              </Link>
            </li>

            <li className="slide">
              <Link href="/customer/products/orders" className="side-menu_item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 side-menu__icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H6.4M7 13L5.4 5M7 13l-2 9h14l-2-9M10 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
                </svg>

                <span className="side-menu__label">Product Orders</span>
              </Link>
            </li>

            <li className="slide">
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default link behavior
                  logout(); // Call logout function
                }}
                className="side-menu_item">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 side-menu__icon">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15M12 9l3 3m0 0-3 3m3-3H2.25"
                  />
                </svg>

                <span className="side-menu__label">Logout</span>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
