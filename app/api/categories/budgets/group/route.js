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

  const categoryBudgetGroups = await prisma.categoryBudgetGroup.findMany({
    where: { client: { clientId } },
    include: {
      memberships: {
        include: {
          categoryBudget: {
            include: {
              monthlyCategoryBudgets: true,
            },
          },
        },
      },
    },
  });

  // Hitung total jumlah amount untuk setiap grup
  const totalAmountByGroup = categoryBudgetGroups.map((group) => ({
    name: group.name,
    totalAmount: group.memberships.reduce((total, membership) => {
      // Jumlahkan jumlah amount dari semua kategori anggaran dalam grup
      return (
        total +
        membership.categoryBudget.monthlyCategoryBudgets.reduce(
          (subtotal, budget) => subtotal + budget.amount,
          0
        )
      );
    }, 0),
    categories: group.memberships.map((membership) => ({
      name: membership.categoryBudget.name,
      totalAmount: membership.categoryBudget.monthlyCategoryBudgets.reduce(
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
    const existingCategoryBudgetGroup =
      await prisma.categoryBudgetGroup.findFirst({
        where: {
          clientId: clientId,
          name: name,
        },
      });

    if (existingCategoryBudgetGroup) {
      return NextResponse.json(
        { error: "Category group name already exists" },
        { status: 400 }
      );
    }

    const newCategoryBudgetGroup = await prisma.categoryBudgetGroup.create({
      data: {
        clientId,
        name,
      },
    });

    return NextResponse.json(newCategoryBudgetGroup, { status: 201 });
  } catch (error) {
    console.error("Error adding category budget group:", error);
    return NextResponse.json(
      { error: "Error adding category budget group" },
      { status: 500 }
    );
  }
}
