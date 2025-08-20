import { Inter } from "next/font/google";
// import "./globals.css";
import BottomNav from "@/components/BottomNav/BottomNav";
import "react-toastify/dist/ReactToastify.css";
import "../styles/toastify.css";
import { Suspense } from "react";
import SkeletonList from "@/components/Skeleton/List";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Better Finance",
  description: "Aplikasi keuangan pribadi yang lebih baik",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        <div className="max-w-md mx-auto bg-white min-h-screen">
          {/* <Suspense fallback={<SkeletonList listNumber={15} />}> */}
          <div className="mb-10 bg-white">{children}</div>
          {/* </Suspense> */}
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
