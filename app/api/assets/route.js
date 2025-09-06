import { NextResponse } from 'next/server';
import { fetchAssetData } from '@/app/assets/data';

export async function GET() {
  try {
    const assets = await fetchAssetData();
    return NextResponse.json({ success: true, data: assets });
  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assets data' },
      { status: 500 }
    );
  }
}
