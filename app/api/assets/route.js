import { NextResponse } from "next/server";
import { fetchAssetData } from "@/app/assets/utils";

// Ensure this route is always dynamic and not statically optimized
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        const assets = await fetchAssetData();
        return NextResponse.json({ success: true, data: assets });
    } catch (error) {
        console.error("Error fetching assets:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch assets data" },
            { status: 500 }
        );
    }
}
