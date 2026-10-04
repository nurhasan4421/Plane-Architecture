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

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (window.location.pathname.startsWith('/admin')) return;
                  var t = localStorage.getItem('plane_theme');
                  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-[#0e0e0e] text-black dark:text-[#f5f5f5] min-h-screen selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
        <ThemeProvider>
          <IntroSplash />
          <SiteContentProvider>{children}</SiteContentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
