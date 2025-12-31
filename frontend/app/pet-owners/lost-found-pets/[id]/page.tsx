import MicrochipForm from "@/app/common/MicrochipForm";
import CommonLayout from "@/app/frontend/layouts/CommonLayouts";
import { generateCommonMetadata } from "@/app/utils/metadata";
import { Metadata } from "next";
import { useParams } from "next/navigation";
import LostPetDetails from "@/app/common/LostPetDetails";

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

export default function PetsDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <CommonLayout>
      <div className="main-page-container">
        <div className="container">
          <LostPetDetails petId={params.id} />
        </div>
      </div>
    </CommonLayout>
  );
}
