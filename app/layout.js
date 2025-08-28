import { Inter } from "next/font/google";
import "../styles/globals.css";
import BottomNav from "@/components/BottomNav/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "My Financial",
  description: "A simple financial app to help you manage your money",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="mx-auto max-w-md dark:bg-white">
      <body className={`${inter.className} shadow-2xl`}>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
