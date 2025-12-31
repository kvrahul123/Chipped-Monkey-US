"use client";
import { getLocalStorageItem } from "@/app/common/LocalStorage";
import Image from "next/image";
import Link from "next/link";
import { verifyToken } from "@/app/customer/common/api";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

import { useEffect, useState } from "react";

export default function Footer() {
  let userToken = getLocalStorageItem("token");
  const [accountType, setAcountType] = useState<string | null>(null);

  const [userDetails, setuserDetails] = useState([]);
  const [isLoggedIn, setisLoggedIn] = useState(false);
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
  const fetchUserType = async () => {
    const type = await verifyToken();
    if (type) {
      setAcountType(type.account_type);
    }
  };
  useEffect(() => {
    if (userToken) {
      fetchData();
    }
    fetchUserType();
  }, []);
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-lg-6 mb-4 mb-lg-0 mt-4 mt-lg-0">
            <Image
              width={200}
              height={94}
              alt="Chipped Monkey Logo"
              src="/assets/images/footer-logo.png"
            />

            <div className="footer-mail-input-container">
              <input
                className="form-control footer-mail-input"
                placeholder="Enter Your Mail Here"
              />
              <button className="btn btn-primary footer-mail-btn">
                Subscribe
              </button>
            </div>
            {/* <Image
              width={170}
              height={170}
              alt="Chipped Monkey Logo"
              src="/assets/images/ICO_logo.png"
            /> */}
            <div className="mt-4 d-flex flex-row ">
              <Image
                src="/assets/images/google-play.svg"
                alt="Play Store /logo"
                width={200}
                height={63}
                className="mb-3 mx-3 footer-app-store"
              />
              <Image
                src="/assets/images/app-store.svg"
                width={200}
                height={63}
                alt="App Store Logo"
                className="footer-app-store"
              />
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
            <div className="footer-menu-lists">
              <h4 className="footer-menu-title text-white mb-3">Menu</h4>
              <ul className="footer-menu-lists-ul text-reset mb-0">
                <li>
                  <Link href="/pet-owners/pet-microchip-registration">
                    Update/Register MicroChip
                  </Link>
                </li>
                <li>
                  <Link href="/about_us">About Us</Link>
                </li>
                <li>
                  <Link href="/pet-owners/pet-microchip-registration">
                    Pet Keepers
                  </Link>
                </li>
                <li>
                  <Link href="/shop">Shop</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/privacypolicy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/termsconditions">Terms &amp; Conditions</Link>
                </li>
                <li>
                  <Link href="/refundpolicy">Refund and Return Policy</Link>
                </li>
                <li>
                  <Link href="/frequently-asked-questions">Faq</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
            <h4 className="footer-menu-title text-white mb-3">Contact US</h4>
            <p className="footer-p-element">
              Call Us : <Link href="tel:+18888722517">+1 888-872-2517</Link>
            </p>
            <p className="footer-p-element">
              We are open Monday to Friday business hours 9:00 am to 17:00 pm
            </p>
          </div>
        </div>
        <hr className="mt-7 mt-md-7 mb-2 text-white" />
        <div className="d-md-flex align-items-center justify-content-between footer-address">
          <small className="mb-2 mb-lg-0">
            <p className="p-0 m-0">
              © Copyright © Hummr media corporation. All rights reserved
            </p>
          </small>
        </div>
      </div>
      <div className="footer-mobile">
        <div className="container-fluid">
          <div className="row info-row">
            <div className="col-2">
              <Link href="/shop" className="">
                <Image
                  src="/assets/images/list-icon.png"
                  alt="home"
                  width={30}
                  height={30}
                  quality={100}
                />
                <span className="footer_menu_title">Shop</span>
              </Link>
            </div>

            <div className="col-2">
              <Link href="/pet-owners/lost-found-pets" className="">
                <Image
                  src="/assets/images/lost-found.png"
                  alt="home"
                  width={30}
                  height={30}
                  quality={100}
                />
                <span className="footer_menu_title">Lost/Found</span>
              </Link>
            </div>
            <div className="col-4">
              <Link href="/pet-owners/pet-microchip-registration" className="">
                <Image
                  src="/assets/images/add-user.png"
                  alt="home"
                  width={30}
                  height={30}
                  quality={100}
                />
                <span className="footer_menu_title" style={{color:"rgb(247, 161, 46)"}}>Register Microchip</span>
              </Link>
            </div>
            <div className="col-2">
              <Link href="/contact" className="">
                <Image
                  src="/assets/images/contact-icon.png"
                  alt="home"
                  width={30}
                  height={30}
                  quality={100}
                />
                <span className="footer_menu_title">Contact</span>
              </Link>
            </div>

            <div className="col-2">
              {!isLoggedIn ? (
                <Link href="/user-login/pet_owner">
                  <Image
                    src="/assets/images/user-icon.png"
                    alt="home"
                    width={30}
                    height={30}
                    quality={100}
                  />
                  <span className="footer_menu_title">Login</span>
                </Link>
              ) : (
                <Link
                  href={
                    userDetails?.user_type === "pet_owner"
                      ? "/customer/dashboard"
                      : "/admin/dashboard"
                  }>
                  <Image
                    src="/assets/images/user-icon.png"
                    alt="home"
                    width={30}
                    height={30}
                    quality={100}
                  />
                   <span className="footer_menu_title truncate_text">
                    {userDetails?.user_name}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
