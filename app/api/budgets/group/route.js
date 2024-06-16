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

  const categoryGroups = await prisma.categoryGroup.findMany({
    where: { client: { clientId } },
    include: {
      memberships: {
        include: {
          category: {
            include: {
              monthlyCategories: true,
            },
          },
        },
      },
    },
  });

  // Hitung total jumlah amount untuk setiap grup
  const totalAmountByGroup = categoryGroups.map((group) => ({
    groupId: group.id,
    name: group.name,
    totalAmount: group.memberships.reduce((total, membership) => {
      // Jumlahkan jumlah amount dari semua kategori anggaran dalam grup
      return (
        total +
        membership.category.monthlyCategories.reduce(
          (subtotal, budget) => subtotal + budget.amount,
          0
        )
      );
    }, 0),
    categories: group.memberships.map((membership) => ({
      name: membership.category.name,
      totalAmount: membership.category.monthlyCategories.reduce(
        (subtotal, budget) => subtotal + budget.amount,
        0
      ),
    })),
  }));

  return NextResponse.json(totalAmountByGroup, { status: 200 });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { clientId, name } = body;

    if (!clientId || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Periksa apakah nama kategori sudah ada
    const existingCategoryGroup =
      await prisma.categoryGroup.findFirst({
        where: {
          clientId: clientId,
          name: name,
        },
      });

    if (existingCategoryGroup) {
      return NextResponse.json(
        { error: "Category group name already exists" },
        { status: 400 }
      );
    }

    const newCategoryGroup = await prisma.categoryGroup.create({
      data: {
        clientId,
        name,
      },
    });

    return NextResponse.json(newCategoryGroup, { status: 201 });
  } catch (error) {
    console.error("Error adding category budget group:", error);
    return NextResponse.json(
      { error: "Error adding category budget group" },
      { status: 500 }
    );
  }
}
