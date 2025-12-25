import type { Metadata } from "next";
import Script from "next/script";


export const metadata: Metadata = {
  title: "Chipped Monkey | Official AAHA Pet Microchip Registry & Recovery",
  description: "Register your pet's microchip with Chipped Monkey, a proud AAHA Universal Lookup participant. Secure, lifetime national recovery database for all chip brands.",
  keywords: "Register your pet's microchip with Chipped Monkey, a proud AAHA Universal Lookup participant. Secure, lifetime national recovery database for all chip brands.",
    robots: {
    index: true,
    follow: true,
    nocache: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en">
      <head>
      <link rel="icon" href="../pet_favicon.jpeg"></link>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet"></link>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
            <Script
          src="https://secure.helcim.app/helcim-pay/services/start.js"
          strategy="afterInteractive"
          
        />
        </head>
      <body>
        {children}
      </body>
    </html>
  );
}
