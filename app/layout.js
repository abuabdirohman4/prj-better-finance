import { Inter } from "next/font/google";
import "../styles/globals.css";
import BottomNav from "@/components/BottomNav/page";
import PWAComponents from "@/components/PWA";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Better Finance",
  description: "A simple financial app to help you manage your money",
  manifest: "/manifest.json",
  themeColor: "#000000",
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
      { url: "/img/money-bag.png", sizes: "192x192", type: "image/png" },
      { url: "/img/money-bag.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/img/money-bag.png", sizes: "192x192", type: "image/png" }
    ]
  },
  openGraph: {
    type: "website",
    title: "Better Finance",
    description: "A simple financial app to help you manage your money",
    siteName: "Better Finance",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    images: [
      {
        url: "/img/money-bag.png",
        width: 512,
        height: 512,
        alt: "Better Finance App"
      }
    ]
  },
  twitter: {
    card: "summary",
    title: "Better Finance",
    description: "A simple financial app to help you manage your money",
    images: ["/img/money-bag.png"]
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#000000"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="mx-auto max-w-md dark:bg-white">
      <body className={`${inter.className} shadow-2xl`}>
        <PWAComponents />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
