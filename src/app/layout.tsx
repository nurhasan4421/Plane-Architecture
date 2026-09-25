import type { Metadata } from "next";
import "./globals.css";
import IntroSplash from "@/components/IntroSplash";

export const metadata: Metadata = {
  title: "BIG | Bjarke Ingels Group",
  description:
    "BIG is a Copenhagen, New York, London, Barcelona and Shenzhen based group of architects, designers, urbanists, landscape professionals, interior and product designers, researchers and inventors.",
  keywords: [
    "Architecture",
    "Bjarke Ingels",
    "BIG",
    "Urbanism",
    "Landscape",
    "Hedonistic Sustainability",
    "Danish Design",
  ],
  authors: [{ name: "Bjarke Ingels Group" }],
  openGraph: {
    title: "BIG | Bjarke Ingels Group",
    description: "An architectural laboratory exploring how buildings shape human life and planetary ecology.",
    url: "https://big.dk",
    siteName: "BIG | Bjarke Ingels Group",
    images: [
      {
        url: "https://media.big.dk/share.jpg",
        width: 1200,
        height: 630,
        alt: "BIG | Bjarke Ingels Group",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BIG | Bjarke Ingels Group",
    description: "Architecture, Urbanism, Landscape, Research.",
    images: ["https://media.big.dk/share.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-black min-h-screen selection:bg-black selection:text-white">
        <IntroSplash />
        {children}
      </body>
    </html>
  );
}
