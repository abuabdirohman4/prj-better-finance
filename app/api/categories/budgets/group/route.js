import { NextResponse } from "next/server";
import getTotalAmountGroup from "./getTotalAmountGroup";

export async function GET(req) {
  const url = new URL(req.url);
  const clientId = url.searchParams.get("clientId");

  if (!clientId) {
    return new Response(JSON.stringify({ error: "ClientId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const categoryBudgetGroups = await getTotalAmountGroup(clientId);

  return NextResponse.json(categoryBudgetGroups, { status: 200 });
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
    console.log("newCategoryBudgetGroup", newCategoryBudgetGroup);

    return NextResponse.json(newCategoryBudgetGroup, { status: 201 });
  } catch (error) {
    console.error("Error adding category budget group:", error);
    return NextResponse.json(
      { error: "Error adding category budget group" },
      { status: 500 }
    );
  }
}
