import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Chipped Monkey |UK Pet Microchip Database",
  description: "Register and manage your pet’s microchip with Chipped Monkey, the UK’s trusted uk-compliant database. 24/7 reunification support UK",
  keywords:"Pet microchip database, UK pet microchip registration, 24/7 pet reunification support,  Register pet microchip online,  Update pet microchip details,  Change of keeper verification,  Pet microchip legal requirement UK,  Secure pet microchip database,  Lost pet recovery UK"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <link rel="icon" href="../pet_favicon.jpeg"></link>
<link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet"/>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" integrity="sha512-Evv84Mr4kqVGRNSgIGL/F/aIDqQb7xQ2vcrdIwxfjThSH8CSR7PBEakCr51Ck+w+/U6swU2Im1vVX0SVk9ABhg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
      <body>
        {children}
      </body>
    </html>
  );
}
