import CommonLayout from "../frontend/layouts/CommonLayouts";
import { Metadata } from "next";
import { generateCommonMetadata } from "../utils/metadata";
import { FaqContent } from "./FaqContent";


const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${appUrl}frontend/pages/list/?id=17`);
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
    `${frontendUrl}frequently-asked-questions`
  );
}

type FAQ = { question: string; answer: string };

export default function Faq() {
  
  return (
    <CommonLayout>
      <div className="main-page-container">
        <div className="container">
          <FaqContent/>
        </div>
      </div>


    </CommonLayout>
  );
}
