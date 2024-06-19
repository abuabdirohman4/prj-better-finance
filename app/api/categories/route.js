import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const params = url.searchParams;
  const clientId = params.get("clientId");
  const groupId = params.get("groupId");
  const groupName = params.get("groupName");
  const type = params.get("type");
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

  if (type) where.type = type;
  if (groupId || groupName) {
    where.memberships = {
      some: {},
    };
    if (groupId) where.memberships.some.groupId = parseInt(groupId);
    if (groupName) where.memberships.some.group = { name: groupName };
  }

  if (year || month) {
    include.monthlyCategories = {
      where: {},
    };
    if (year) include.monthlyCategories.where.year = year;
    if (month) include.monthlyCategories.where.month = month;
  }

  const categories = await prisma.category.findMany({
    where,
    include,
  });

  return NextResponse.json(categories, { status: 200 });
}
