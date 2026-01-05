
import CommonLayout from "@/app/frontend/layouts/CommonLayouts";
import Link from "next/link";
import Image from "next/image";
import BlogDetails from "./BlogsDetails";
import { useParams, useSearchParams } from "next/navigation";


interface PageProps {
  params: {
    slug?: string;
  };
}

export default function BlogDetailsPage({ params }: PageProps) {
  return (
    <CommonLayout>
      <div className="main-page-container">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <BlogDetails slug={params.slug} />
            </div>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}
