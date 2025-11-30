import Link from "next/link";
import CommonLayout from "../frontend/layouts/CommonLayouts";
import { Metadata } from "next";
import { generateCommonMetadata } from "../utils/metadata";
import ContactForm from "./ContactForm";
import { ContactContent } from "./ContactContent";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;

const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${appUrl}frontend/pages/list/?id=11`);
  const result = await res.json();
  const seoData = result.data ? result.data[0] : null;

  const dynamicTitle = seoData
    ? seoData.meta_title
    : process.env.NEXT_META_TITLE;
  const dynamicDescription = seoData
    ? seoData.meta_description
    : process.env.NEXT_META_DESCRIPTION;
  const dynamicKeywords = seoData
    ? seoData.meta_keywords
    : process.env.NEXT_META_KEYWORDS;
  const dynamicImages =
    seoData.image_file_name != null && seoData.image_file_name != ""
      ? appUrl + "uploads/" + seoData.image_file_name
      : process.env.NEXT_META_OG_IMAGE;

  return generateCommonMetadata(
    dynamicTitle,
    dynamicDescription,
    dynamicKeywords,
    dynamicImages,
    `${frontendUrl}contact`
  );
}

export default function Contact() {
  return (
    <CommonLayout>
      <div className="main-page-container">
        <div className="contactus_main_container">
          <div className="contactus_container pt-3 pt-md-3 pb-8 ">
            <ContactContent/>

            <div className="contact_us_form_container">
              <div className="contact_us_left_container">
                <div className="contact_us_form_title">
                  <h3>Fill out the form below to get in touch with us.</h3>
                </div>
                <ContactForm />
              </div>
              <div className="contact_us_right_container">
                <div className="contact_us_right_container_title">
                  <h3>Chipped Monkey Address</h3>
                  <p>28 Fore Street, North Petherton, Bridgwater,</p>
                  <p>England, TA6 6PY</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}
