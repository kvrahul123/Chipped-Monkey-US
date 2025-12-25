import CommonLayout from "@/app/frontend/layouts/CommonLayouts";
import Image from "next/image";
const appUrl = process.env.NEXT_PUBLIC_APP_URL; // Your API URL
import { generateCommonMetadata } from "@/app/utils/metadata";
import { Metadata } from "next";
import { LoginForm } from "./LoginForm";
import ForgotPassword from "./ForgotForm";





const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;

export async function generateMetadata(): Promise<Metadata> {
  const res = await fetch(`${appUrl}frontend/pages/list/?id=12`);
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
    `${frontendUrl}user-login/pet_owner`
  );
}



  const Login = () => {
 

  return (
    <CommonLayout>
      <div className="main-page-container">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 text-center mobile-none">
              <Image
                src="/assets/images/login.jpg"
                alt="Login Image"
                width={630}
                quality={100}
                height={537}
              />
            </div>

            <ForgotPassword/>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
  }

  export default Login;
