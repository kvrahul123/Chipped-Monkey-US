import MicrochipForm from "@/app/common/MicrochipForm";
import CommonLayout from "@/app/frontend/layouts/CommonLayouts";
import { generateCommonMetadata } from "@/app/utils/metadata";
import { Metadata } from "next";
import { LostContent } from "./PageContent";
import MicrochipFormShow from "../pet-microchip-registration/MicrochipFormShow";
import Certificate from "@/app/common/certificate";

const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${appUrl}frontend/pages/list/?id=6`);
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
    `${frontendUrl}pet-owners/lost-found-pets`
  );
}

export default function UpdatePetMicrochip() {
  return (
    <CommonLayout>
      <div className="main-page-container">
        <div className="container">
          <LostContent />
          {/* <MicrochipForm/> */}

          {/* ADD THE CERTIFICATE AND DOWNLOAD BUTTON HERE */}
          {/* <div className="mt-5">
             <Certificate />
          </div> */}
              <div
                className="registe-monkey-new text-center mb-3"
                style={{
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}>
                <div className="row">
                  <div className="col-lg-12 col-md-12 mb-lg-0 register-left-dv">
                    <h2 className="mb-0 page-title-h2 text-white mb-2">
                      Your Pet's Lifeline: Register their microchip and secure
                      their journey home.
                    </h2>
                  </div>
                  <div className="col-lg-12 col-md-12 mb-0 register-right-dv">
                    <MicrochipFormShow />
                  </div>
                </div>
              </div>
        </div>
      </div>
    </CommonLayout>
  );
}
