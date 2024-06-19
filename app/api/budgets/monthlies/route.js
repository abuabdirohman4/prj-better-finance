import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const params = url.searchParams;
  console.log("params monthly", params);
  const clientId = params.get("clientId");
  const groupId = params.get("groupId");
  const year = params.get("year");
  const month = parseInt(params.get("month"));
  const where = { clientId };
  const include = {};

  if (!clientId) {
    return new Response(JSON.stringify({ error: "ClientId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (groupId) where.category.memberships.some.groupId = parseInt(groupId);
  if (year) where.year = year;
  if (month) where.month = month;

  const monthlyCategories = await prisma.monthlyCategory.findMany({
    where,
    include,
  });

  return NextResponse.json(monthlyCategories, { status: 200 });
}
