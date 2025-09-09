import Link from "next/link";
import { formatCurrency } from "@/utils/helper";

const getAssetIcon = (category) => {
    switch (category?.toLowerCase()) {
        case "liquid":
            return (
                <div className="w-8 h-8 bg-red-300 rounded-full flex items-center justify-center mb-1">
                    <svg
                        className="w-7 h-7 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                        />
                    </svg>
                </div>
            );
        case "non-liquid":
            return (
                <div className="w-8 h-8 bg-green-300 rounded-full flex items-center justify-center mb-1">
                    <svg
                        className="w-5 h-5 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                    </svg>
                </div>
            );
        default:
            return (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                    <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                    </svg>
                </div>
            );
    }
};

const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
        case "liquid":
            return "bg-red-200 text-red-800";
        case "non-liquid":
            return "bg-green-200 text-green-800";
        default:
            return "bg-gray-200 text-gray-800";
    }
};

export default function AssetCard({ asset }) {
    return (
        <Link href={`/assets/${encodeURIComponent(asset.name)}`}>
            <div className="block relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ">
                <div className="p-3 py-4">
                    <div className="flex flex-col items-center">
                        {getAssetIcon(asset.category)}
                        <h3 className="font-bold text-gray-900 text-sm text-center">
                            {asset.name}
                        </h3>
                    </div>
                </div>
                <div
                    className={`px-3 py-2 rounded-b-2xl ${getCategoryColor(asset.category)}`}
                >
                    <div className="text-xs font-bold text-center">
                        {formatCurrency(asset.balance)}
                    </div>
                </div>
            </div>
        </Link>
    );
}
