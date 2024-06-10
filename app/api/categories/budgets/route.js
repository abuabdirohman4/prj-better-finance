import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const clientId = url.searchParams.get("clientId");

  if (!clientId) {
    return new Response(JSON.stringify({ error: "ClientId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const categoryBudgets = await prisma.categoryBudget.findMany({
    where: { clientId: clientId },
    select: {
      name: true,
      type: true,
    },
  });

  // return Response.json({ data: categoryBudgets });
  return NextResponse.json(categoryBudgets, { status: 200 });
}

export async function POST(req, res) {
  try {
    const body = await req.json();
    const { clientId, name, type } = body;

    if (!clientId || !name || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Periksa apakah nama kategori sudah ada
    const existingCategory = await prisma.categoryBudget.findFirst({
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

    const newCategoryBudget = await prisma.categoryBudget.create({
      data: {
        clientId,
        name,
        type,
      },
    });

    return NextResponse.json(newCategoryBudget, { status: 201 });
    // return Response.json({ data: newCategoryBudget });
  } catch (error) {
    console.error("Error adding category budget:", error);
    Response.json({ status: 500, message: "Error adding category budget" });
  }
}
