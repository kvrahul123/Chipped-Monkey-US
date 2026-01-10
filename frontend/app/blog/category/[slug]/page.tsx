
import CommonLayout from "@/app/frontend/layouts/CommonLayouts";
import Link from "next/link";
import Image from "next/image";
import BlogDetails from "./BlogsCategoryLists";
import { useParams, useSearchParams } from "next/navigation";
import { Metadata } from "next";
import { generateCommonMetadata } from "@/app/utils/metadata";
import BlogCategoryList from "./BlogsCategoryLists";
const appUrl = process.env.NEXT_PUBLIC_APP_URL;


interface PageProps {
  params: {
    slug?: string;
  };
}
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  console.log("slugss"+params.slug)
  const res = await fetch(`${appUrl}frontend/blogs/category/details?slug=${params.slug}`);
  const result = await res.json();
  const seoData = result.data;
  const dynamicTitle = seoData ? seoData.meta_title : process.env.NEXT_META_TITLE; // You can choose what to do if the id is not found
    
  const dynamicDescription = seoData ? seoData.meta_description : process.env.NEXT_META_DESCRIPTION;

  const dynamicKeywords = seoData ? seoData.meta_keywords : process.env.NEXT_META_KEYWORDS;

    const dynamicMetaImg = seoData?.meta_image_file_name ? `${appUrl}uploads${seoData.meta_image_file_name}` : process.env.NEXT_META_OG_IMAGE!;
  return generateCommonMetadata(
    dynamicTitle,
    dynamicDescription,
    dynamicKeywords,
    dynamicMetaImg,
     `${appUrl}blog/category/${params.slug}`
  )
}

export default function BlogDetailsPage({ params }: PageProps) {
  return (
    <CommonLayout>
      <div className="main-page-container">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <BlogCategoryList slug={params.slug} />
            </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}
