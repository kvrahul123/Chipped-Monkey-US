import { Metadata } from "next";
import CommonLayout from "../frontend/layouts/CommonLayouts";
import { generateCommonMetadata } from "../utils/metadata";
import RefundContent from "./RefundContent";
import Script from "next/script";


const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${appUrl}frontend/pages/list/?id=10`);
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
  const dynamicImages = (seoData.image_file_name!=null && seoData.image_file_name!="")?(appUrl+"uploads/" + seoData.image_file_name) : process.env.NEXT_META_OG_IMAGE;

  return generateCommonMetadata(
    dynamicTitle,
    dynamicDescription,
    dynamicKeywords,
    dynamicImages,
    `${frontendUrl}refundpolicy`
  );
}

export default function RefundPolicy() {
    const faqSchema = {
  "@context": " https://schema.org",
  "@type": "Organization",
  "name": "ChippedMonkey",
  "url": " https://chippedmonkey.com",
  "hasMerchantReturnPolicy": {
    "@type": "MerchantReturnPolicy",
    "applicableCountry": "US",
    "returnPolicyCategory": " https://schema.org/MerchantReturnFiniteReturnWindow",
    "merchantReturnDays": 30,
    "returnMethod": " https://schema.org/ReturnByMail",
    "refundType": " https://schema.org/FullRefund",
    "returnFees": " https://schema.org/ReturnFeesCustomerResponsibility",
    "itemCondition": " https://schema.org/NewCondition",
    "merchantReturnLink": " https://chippedmonkey.com/refundpolicy"
  }
}
;
  return (
    <CommonLayout>
                    <Script
    id="faq-schema"
    type="application/ld+json"
    strategy="afterInteractive"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(faqSchema),
    }}
  />
      <div className="main-page-container">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="chippedMonkey-page-content">
                <h1>Refund and Cancellation Policy </h1>
                <RefundContent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}
