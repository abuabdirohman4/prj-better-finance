'use client'
import { clearLocal } from "@/utils/session";

export default function Root() {
  clearLocal()
  return (
    <div className="flex h-screen flex-col justify-evenly bg-cover bg-top bg-no-repeat px-9"></div>
  );
}
