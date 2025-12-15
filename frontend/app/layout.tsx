import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Chipped Monkey |US Pet Microchip Database",
  description: "Register and manage your pet’s microchip with Chipped Monkey, the US’s trusted US-compliant database. 24/7 reunification support US",
  keywords: "Pet microchip database, US pet microchip registration, 24/7 pet reunification support,  Register pet microchip online,  Update pet microchip details,  Change of keeper verification,  Pet microchip legal requirement US,  Secure pet microchip database,  Lost pet recovery US",
    robots: {
    index: false,
    follow: false,
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
      <link rel="icon" href="../pet_favicon.jpeg"></link>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet"></link>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      <body>
        {children}
      </body>
    </html>
  );
}
