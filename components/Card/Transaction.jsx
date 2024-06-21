"use client";
import { formatRupiah } from "@/utils/helper";
import Image from "next/image";

export default function CardTransaction({
  icons,
  account,
  category,
  note,
  cash,
}) {
  const icon = icons.find((icon) => icon == account.toLowerCase()) || "other";
  return (
    <div className="flex items-center py-2 sm:py-3">
      <div className="flex-shrink-0">
        <Image
          src={`/icons/${icon.toLowerCase()}.png`}
          width={30}
          height={30}
          alt={account}
          priority={true}
        />
      </div>
      <div className="flex-1 min-w-0 ms-4">
        <p className="text-base font-medium text-gray-900 truncate">{note}</p>
        <p className="text-sm text-gray-500 truncate">
          {!category ? account : `${account} (${category})`}
        </p>
      </div>
      <div
        className={`inline-flex items-center text-base font-semibold text-gray-900 ${
          cash > 0 && "text-green-600"
        }`}
      >
        {cash > 0 ? `+${formatRupiah(cash)}` : formatRupiah(cash)}
      </div>
    </div>
  );
}
