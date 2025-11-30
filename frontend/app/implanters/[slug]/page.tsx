import CommonLayout from "@/app/frontend/layouts/CommonLayouts";
import React from "react";
import ImplanterDetails from "./ImplanterDetails";
interface Props {
  params: { slug: string };
}

export default function ImplanterPage({ params }: Props) {
  return (
    <CommonLayout>
      <section className="wrapper">
        <div className="container pt-7 pt-md-7 pb-8">
          <ImplanterDetails slug={params.slug} />
        </div>
      </section>
    </CommonLayout>
  );
}
