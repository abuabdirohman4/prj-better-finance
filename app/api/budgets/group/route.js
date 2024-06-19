import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const params = url.searchParams;
  const clientId = params.get("clientId");

  if (!clientId) {
    return new Response(JSON.stringify({ error: "ClientId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Query untuk mengambil semua kategori yang tidak memiliki grup
  const categoriesWithoutGroup = await prisma.category.findMany({
    where: {
      client: { clientId },
      memberships: { none: {} }, // Menunjukkan kategori yang tidak memiliki grup
    },
    include: {
      monthlyCategories: true,
    },
  });

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

  // Ambil semua transaksi yang berkaitan dengan clientId
  // const transactions = await prisma.transaction.findMany({
  //   where: { clientId },
  // });

  // Hitung total jumlah amount untuk setiap grup
  const categoryGroupWithBudget = categoryGroups.map((group) => ({
    groupId: group.id,
    name: group.name,
    budget: group.memberships.reduce((total, membership) => {
      // Jumlahkan jumlah amount dari semua kategori anggaran dalam grup
      return (
        total +
        membership.category.monthlyCategories.reduce(
          (subtotal, budget) => subtotal + budget.amount,
          0
        )
      );
    }, 0),
    // categories: group.memberships.map((membership) => ({
    //   name: membership.category.name,
    //   budget: membership.category.monthlyCategories.reduce(
    //     (subtotal, budget) => subtotal + budget.amount,
    //     0
    //   ),
    // })),
    categories: group.memberships.map((membership) => {
      // const categoryTransactions = transactions.filter(
      //   (transaction) => transaction.categoryId === membership.categoryId
      // );

      return {
        id: membership.category.id,
        name: membership.category.name,
        budget: membership.category.monthlyCategories.reduce(
          (subtotal, budget) => subtotal + budget.amount,
          0
        ),
        // spending: categoryTransactions
        //   .filter((transaction) => transaction.type === "spending")
        //   .reduce((total, transaction) => total + transaction.amount, 0),
        // earning: categoryTransactions
        //   .filter((transaction) => transaction.type === "earning")
        //   .reduce((total, transaction) => total + transaction.amount, 0),
      };
    }),
  }));

  // Gabungkan kategori yang tidak memiliki grup dengan hasil kategori grup
  const allCategories = [
    ...categoryGroupWithBudget,
    ...categoriesWithoutGroup.map((category) => ({
      groupId: null,
      categoryId: category.id,
      name: category.name,
      budget: category.monthlyCategories.reduce(
        (subtotal, budget) => subtotal + budget.amount,
        0
      ),
      categories: [], // Tidak ada subkategori
    })),
  ];

  return NextResponse.json(allCategories, { status: 200 });
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
    const existingCategoryGroup = await prisma.categoryGroup.findFirst({
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
