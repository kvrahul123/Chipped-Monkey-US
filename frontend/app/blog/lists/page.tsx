import CommonLayout from "@/app/frontend/layouts/CommonLayouts";
import BlogSection from "./BlogLists";
import { Metadata } from "next";
import { generateCommonMetadata } from "../../utils/metadata";

const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${appUrl}frontend/pages/list/?id=18`);
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
    `${frontendUrl}blog/lists`
  );
}

export default function BlogLists() {
  return (
    <CommonLayout>
      <div className="main-page-container">
        <div className="container">
          <div className="blog-container">
            <BlogSection/>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}
