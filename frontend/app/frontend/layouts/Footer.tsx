import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-lg-6 mb-4 mb-lg-0">
            <Image
              width={200}
              height={94}
              alt="Chipped Monkey Logo"
              src="/assets/images/footer-logo.png"
            />

            <div className="footer-mail-input-container">
              <input className="form-control footer-mail-input" placeholder="Enter Your Mail Here" />
              <button className="btn btn-primary footer-mail-btn">Subscribe</button>
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
                className="mb-3 mx-3"
              />
              <Image
                src="/assets/images/app-store.svg"
                width={200}
                height={63}
                alt="App Store Logo"
              />
            </div>
          </div>
          <div className="col-md-6 col-lg-3 mb-4 mb-lg-0">
            <div className="footer-menu-lists">
              <h4 className="footer-menu-title text-white mb-3">Menu</h4>
              <ul className="footer-menu-lists-ul text-reset mb-0">
                <li>
                  <Link href="/pet-owners/update-pet-microchip">
                    Update/Register MicroChip
                  </Link>
                </li>
                <li>
                  <Link href="/about_us">About Us</Link>
                </li>
                <li>
                  <Link href="/pet-owners/update-pet-microchip">Pet Keepers</Link>
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
            <p className="p-0 m-0" style={{ marginBottom: "10px" }}>
              © Copyright © CHIPPEDMONKEY LTD All rights reserved
            </p>
            <p style={{ marginTop: "10px" }}>
              28 Fore Street, North Petherton, Bridgwater,
              <br /> England, TA6 6PY
            </p>
          </small>
        </div>
      </div>
    </footer>
  );
}
