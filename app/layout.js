import { Inter } from "next/font/google";
import "../styles/globals.css";
import BottomNav from "@/components/BottomNav/page";
import PWAComponents from "@/components/PWA";
import SplashScreen from "@/components/SplashScreen";
import { SWRConfig } from 'swr';
import { swrConfig } from '@/configs';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Better Finance",
  description: "A smart financial app to help you manage your money better",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Better Finance"
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: [
      { url: "/img/logo.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/img/logo.svg", sizes: "512x512", type: "image/svg+xml" }
    ],
    apple: [
      { url: "/img/logo.svg", sizes: "192x192", type: "image/svg+xml" }
    ]
  },
  openGraph: {
    type: "website",
    title: "Better Finance",
    description: "A smart financial app to help you manage your money better",
    siteName: "Better Finance",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    images: [
      {
        url: "/img/logo.svg",
        width: 512,
        height: 512,
        alt: "Better Finance App"
      }
    ]
  },
  twitter: {
    card: "summary",
    title: "Better Finance",
    description: "A smart financial app to help you manage your money better",
    images: ["/img/logo.svg"]
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#2563eb"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="mx-auto max-w-md">
      <body className={`${inter.className} bg-gray-50`}>
        <SWRConfig value={swrConfig}>
          <PWAComponents />
          <SplashScreen />
          {children}
          <BottomNav />
        </SWRConfig>
      </body>
    </html>
  );
}
