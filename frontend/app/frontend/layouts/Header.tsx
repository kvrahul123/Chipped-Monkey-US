"use client";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { verifyToken } from "@/app/customer/common/api";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;
import { useEffect, useState } from "react";

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  let userToken = getLocalStorageItem("token");
  const [accountType, setAcountType] = useState<string | null>(null);

  const [userDetails, setuserDetails] = useState([]);
  const fetchUserType = async () => {
    const type = await verifyToken();
    if (type) {
      setAcountType(type.account_type);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);

    const headerMenu = document.querySelector(".header-menus");
    const menuIcon = document.querySelector(".menu-icon");
    headerMenu?.classList.toggle("active");
    menuIcon?.classList.toggle("active");
  };
  const fetchData = async () => {
    try {
      const response = await fetch(`${appUrl}auth/validate-token`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });
      const data = await response.json();

      if (data && data.statusCode === 200) {
        setisLoggedIn(true);

        setuserDetails((prevDetails) => ({
          ...prevDetails,
          user_name: data.data.user_name,
          user_type: data.data.user_type,
        }));
      } else {
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
        }
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
    }
  };

  useEffect(() => {
    if (userToken) {
      fetchData();
    }
    fetchUserType();
  }, []);
  return (
    <header className={`header`}>
      <div className="header-container">
        <div className="header-container-logo">
          <Link href="/">
            <Image
              src="/assets/images/logo-inside.png"
              alt="Chipped Monkey Logo"
              width={275}
              height={129}
              quality={100}
            />
          </Link>
        </div>
        <div className="header-menus">
          <ul className="header-menu-ul">
            <li>
              <div className="header-menu-li">
                <Link href="/pet-owners/update-pet-microchip">
                  <span className="header-menu-li-title">
                    Update/Register Microchip
                  </span>
                </Link>
              </div>
            </li>
            <li>
              <div className="header-menu-li">
                <Link href="/shop">
                  <span className="header-menu-li-title">Shop</span>
                </Link>
              </div>
            </li>
            <li>
              <div className="header-menu-li">
                <Link href="/implanters">
                  <span className="header-menu-li-title">Implanters</span>
                </Link>
              </div>
            </li>
            <li>
              <div className="header-menu-li">
                <Link href="/contact">
                  <span className="header-menu-li-title">Contact Us</span>
                </Link>
              </div>
            </li>
            {(accountType == "1" || accountType == "3") && (
              <li>
                <div className="header-menu-li">
                  <Link href="/wallet">
                    <span className="header-menu-li-title">Wallet</span>
                  </Link>
                </div>
              </li>
            )}

            {/* <li>
              <div className="header-menu-li-contact">
                <div className="emergency_helpline">
                  24/7 emergency Helpline
                </div>
                <div className="header-phone">07734616466</div>
              </div>
            </li> */}
          </ul>
        </div>

        <div className={`header_user_menu`}>
          <ul className="d-flex justify-content-between align-items-center ">
            {userDetails?.user_type && (
              <li>
                <div className="header-menu-li">
                  <Link href="/checkout">
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round">
                      <circle cx="9" cy="20" r="2" />
                      <circle cx="17" cy="20" r="2" />
                      <path d="M3 4h2l2.5 10.5a2 2 0 0 0 2 1.5h8a2 2 0 0 0 1.9-1.4l2-6H6" />
                    </svg>
                    <span className="header-menu-li-title">Cart</span>
                  </Link>
                </div>
              </li>
            )}
            <li>
              <div className="header-menu-li">
                {!isLoggedIn ? (
                  <>
                    <Link href="/user-login/pet_owner">
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.5">
                        <circle cx="12" cy="7" r="4" />
                        <path d="M3 21c1.5-4 6-6 9-6s7.5 2 9 6" />
                      </svg>
                      <span className="header-menu-li-title">Login</span>
                    </Link>
                  </>
                ) : (
                  <Link
                    href={
                      userDetails?.user_type === "pet_owner"
                        ? "/customer/dashboard"
                        : "/admin/dashboard"
                    }>
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.5">
                      <circle cx="12" cy="7" r="4" />
                      <path d="M3 21c1.5-4 6-6 9-6s7.5 2 9 6" />
                    </svg>
                    <span className="header-menu-li-title">
                      {userDetails?.user_name}
                    </span>
                  </Link>
                )}
              </div>
            </li>
          </ul>
        </div>

        <div className="header_mobile_icon">
          <i
            className={`fa-solid ${isMenuOpen ? "fa-x" : "fa-bars"}`}
            onClick={toggleMenu}></i>
        </div>
      </div>

      <div className="header_contact_info">
        <div className="emergency_helpline">
          24/7 emergency Helpline - (888) TRACK-17
        </div>
      </div>
    </header>
  );
}
