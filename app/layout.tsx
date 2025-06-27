import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import AdSense from "./_components/Ads/AdSense";
import { OnboardingProvider } from "./_components/Onboarding/OnboardingProvider";
import SessionProvider from "./_components/Providers/SessionProvider";
import Footer from "./_components/UI/Footer/Footer";
import Navigation from "./_components/UI/Navigation/Navigation";
import "./globals.scss";

const poppins = Poppins({
   subsets: ["latin"],
   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
   metadataBase: new URL(process.env.SITE_URL || "https://pimpim.ng"),
   title: {
      default: "PimPim - Entertainment & Media Platform",
      template: "%s | PimPim",
   },
   description:
      "PimPim is your go-to platform for the latest movies, TV shows, events, and entertainment news. Discover trending content and stay updated with the entertainment world.",
   keywords: [
      "entertainment",
      "movies",
      "TV shows",
      "events",
      "media",
      "trending",
      "news",
   ],
   authors: [{ name: "PimPim Team" }],
   creator: "PimPim",
   publisher: "PimPim",
   formatDetection: {
      email: false,
      telephone: false,
      address: false,
   },
   openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: "PimPim",
      title: "PimPim - Entertainment & Media Platform",
      description:
         "PimPim is your go-to platform for the latest movies, TV shows, events, and entertainment news.",
      images: [
         {
            url: "/images/og-image.jpg",
            width: 1200,
            height: 630,
            alt: "PimPim - Entertainment & Media Platform",
         },
      ],
   },
   twitter: {
      card: "summary_large_image",
      title: "PimPim - Entertainment & Media Platform",
      description:
         "PimPim is your go-to platform for the latest movies, TV shows, events, and entertainment news.",
      images: ["/images/twitter-image.jpg"],
      creator: "@pimpim",
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
      google: process.env.GOOGLE_VERIFICATION,
   },
   alternates: {
      canonical: "https://pimpim.ng",
      languages: {
         "en-US": "/en-US",
      },
   },
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" className={poppins.className}>
         <head>
            <AdSense pId={"7227150050392511"} />
         </head>
         <body>
            <SessionProvider>
               <OnboardingProvider>
                  <Navigation />
                  {children}
                  <Footer />
                  <Toaster position="top-right" richColors closeButton />
               </OnboardingProvider>
            </SessionProvider>
         </body>
         <GoogleAnalytics gaId="G-JDWSRKLZZQ" />
      </html>
   );
}
