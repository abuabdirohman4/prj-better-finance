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

export async function POST(req) {
  try {
    const body = await req.json();
    const { clientId, name, type } = body;
    validateFields([clientId, name, type]);

    // Periksa apakah nama kategori sudah ada
    const existingCategory = await prisma.category.findFirst({
      where: {
        clientId: clientId,
        name: name,
      },
    });
    if (existingCategory) {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 400 }
      );
    }

    const newCategory =  await prisma.category.create({
      data: {
        clientId,
        name,
        type,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error adding category:", error);
    Response.json({ status: 500, message: "Error adding category" });
  }
}
