
import CommonLayout from "../../frontend/layouts/CommonLayouts";

import { generateCommonMetadata } from "../../utils/metadata";
import { Metadata } from "next";
import { ProductPage } from "./ProductPage";



const appUrl = process.env.NEXT_PUBLIC_APP_URL;
const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
interface PageProps {
  params: {
    slug?: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const res = await fetch(`${appUrl}frontend/products/list/${params.slug}`);
  const result = await res.json();
  const seoData = result.data ? result.data : null;
  const dynamicTitle = seoData
    ? seoData.meta_title
    : process.env.NEXT_META_TITLE;
  const dynamicDescription = seoData
    ? seoData.meta_description
    : process.env.NEXT_META_DESCRIPTION;
  const dynamicKeywords = seoData
    ? seoData.meta_keywords
    : process.env.NEXT_META_KEYWORDS;
  const dynamicImages = (seoData && seoData.image_file_name!=null && seoData.image_file_name!="")?(appUrl+"uploads/" + seoData.image_file_name) : process.env.NEXT_META_OG_IMAGE;

  return generateCommonMetadata(
    dynamicTitle,
    dynamicDescription,
    dynamicKeywords,
    dynamicImages,
    `${frontendUrl}shop/${params.slug}`
  );
}


export default function Shop({ params }: PageProps) {



  return (
    <CommonLayout>
      <div className="main-page-container">
        <div className="container">
          <ProductPage slug={params.slug} />
        </div>
      </div>
    </CommonLayout>
  );
}
