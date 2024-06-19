import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const params = url.searchParams;
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

export async function POST(req) {
  try {
    const body = await req.json();
    const { categories } = body;

    const newCategory = await prisma.monthlyCategory.createMany({
      data: categories.map((category) => ({
        categoryId: category.categoryId,
        clientId: category.clientId,
        year: category.year,
        month: parseInt(category.month),
        amount: category.amount,
        type: category.type,
      })),
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error adding monthly category:", error);
    Response.json({ status: 500, message: "Error adding monthly category" });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { categories } = body;

    const updateCategory = categories.map((category) =>
      prisma.monthlyCategory.update({
        where: { id: category.id },
        data: {
          categoryId: category.categoryId,
          clientId: category.clientId,
          year: category.year,
          month: parseInt(category.month),
          amount: category.amount,
          type: category.type,
        },
      })
    );

    return NextResponse.json(updateCategory, { status: 200 });
  } catch (error) {
    console.error("Error update monthly category:", error);
    Response.json({ status: 500, message: "Error update monthly category" });
  }
}