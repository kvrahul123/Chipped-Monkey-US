import { Metadata } from "next";
import CommonLayout from "../frontend/layouts/CommonLayouts";
import { generateCommonMetadata } from "../utils/metadata";
import { AggrementContent } from "./AggrementContent";


const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${appUrl}frontend/pages/list/?id=21`);
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
    `${frontendUrl}user-agreement`
  );
}

export default function TermsCondition() {
  return (
    <CommonLayout>
      <div className="main-page-container">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="chippedMonkey-page-content">
                 <h1 className="index_hightlight banner-heading-title pageHeadingTitle"><h4> ChippedMonkey.com  <b> User Agreement</b></h4></h1>

                <AggrementContent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}
