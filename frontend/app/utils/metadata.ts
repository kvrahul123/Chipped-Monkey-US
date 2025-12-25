import { Metadata } from "next";

export function generateCommonMetadata(
  title?: string,
  description?: string,
  keywords?: any,
  metaImages?: string,
  canonicalUrl?: string
): Metadata {
  // Function to strip HTML tags from the description
  const stripHtmlTags = (input: string | undefined): string =>
    input ? input.replace(/<\/?[^>]+(>|$)/g, "") : "";

  const fullTitle = title ? `${title}` : "Chipped Monkey";
  const fullDescription = description
    ? stripHtmlTags(description)
    : "Register your pet's microchip with Chipped Monkey, a proud AAHA Universal Lookup participant. Secure, lifetime national recovery database for all chip brands.";

  return {
    title: {
      default: fullTitle,
      template: "%s | My App",
    },
    description: fullDescription,
    keywords: [keywords],
    authors: [{ name: "Chipped Monkey" }],
    creator: "Chipped Monkey",
    publisher: "Chipped Monkey",
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Chipped Monkey",
      title: fullTitle,
      description: fullDescription,
      images: [
        {
          url: metaImages || "/assets/images/logo-inside.png",
          width: 1200,
          height: 630,
          alt: title || "Chipped Monkey Logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: fullDescription,
      creator: "@yourhandle",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: "your-google-verification-code",
      yandex: "your-yandex-verification-code",
    },
    alternates: {
      canonical: canonicalUrl || "https://chippedmonkey.com/", // Add canonical URL here
    },
  };
}
