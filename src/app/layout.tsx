import type { Metadata } from "next";
import "./globals.css";
import IntroSplash from "@/components/IntroSplash";
import SiteContentProvider from "@/components/SiteContentProvider";

export const metadata: Metadata = {
  title: "PLANE ARCHITECT | Dhaka, Bangladesh",
  description:
    "Plane Architect is an architecture, urbanism, and landscape practice based in Dhaka, Bangladesh, exploring contextual, sustainable, and progressive architectural design.",
  keywords: [
    "Plane Architect",
    "Architecture Dhaka",
    "Bangladesh Architecture",
    "Urban Design",
    "Sustainable Architecture",
    "Landscape Architecture",
  ],
  authors: [{ name: "Plane Architect" }],
  openGraph: {
    title: "PLANE ARCHITECT | Dhaka, Bangladesh",
    description: "An architectural laboratory exploring how spatial geometry shapes human life and ecological futures.",
    url: "https://planearchitect.com",
    siteName: "PLANE ARCHITECT",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PLANE ARCHITECT | Dhaka, Bangladesh",
    description: "Architecture, Urbanism, Landscape, Research.",
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
        <SiteContentProvider>{children}</SiteContentProvider>
      </body>
    </html>
  );
}
