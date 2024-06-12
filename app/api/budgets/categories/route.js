import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import { validateField, validateFields } from "../../helper";

export async function GET(req) {
  const url = new URL(req.url);
  const clientId = url.searchParams.get("clientId");
  const groupId = url.searchParams.get("groupId");
  const groupName = url.searchParams.get("groupName");
  const type = url.searchParams.get("type");
  const year = url.searchParams.get("year");
  const month = parseInt(url.searchParams.get("month"));
  const reqFunc = url.searchParams.get("reqFunc");

  if (!clientId) {
    return new Response(JSON.stringify({ error: "ClientId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let categoryBudgets = null;
  if (reqFunc === "GetCategoryBudgetsAmount") {
    categoryBudgets = await GetCategoryBudgetsAmount(
      clientId,
      groupName,
      type,
      year,
      month
    );
  } else if (reqFunc === "GetMonthlyCategoryBudgets") {
    categoryBudgets = await GetMonthlyCategoryBudgets(
      clientId,
      groupId,
      month,
      year
    );
  } else if (reqFunc === "GetCategoryBudgets") {
    console.log("groupId", groupId);
    categoryBudgets = await GetCategoryBudgets(clientId, groupId, type);
  }
  return NextResponse.json(categoryBudgets, { status: 200 });
}

export async function GetCategoryBudgets(clientId, groupId, type) {
  let categoryBudgets = "";
  if (groupId) {
    categoryBudgets = await prisma.categoryBudget.findMany({
      where: {
        clientId: clientId,
        type: type,
        memberships: {
          some: {
            groupId: parseInt(groupId),
          },
        },
      },
      select: {
        name: true,
        type: true,
      },
    });
  } else {
    categoryBudgets = await prisma.categoryBudget.findMany({
      where: { clientId: clientId },
      select: {
        name: true,
        type: true,
      },
    });
  }

  return categoryBudgets;
}

export async function GetCategoryBudgetsAmount(
  clientId,
  groupName,
  type,
  year,
  month
) {
  const categoryBudgets = await prisma.categoryBudget.findMany({
    where: {
      clientId: clientId,
      type: type,
      memberships: {
        some: {
          group: {
            name: groupName,
          },
        },
      },
    },
    include: {
      monthlyCategoryBudgets: {
        where: {
          year: year,
          month: month,
        },
      },
    },
  });

  return categoryBudgets;
}

export async function GetTotalAmountCategoryBudgets(clientId, groupName, type) {
  const categoryBudgets = await prisma.categoryBudget.findMany({
    where: {
      clientId: clientId,
      type: type,
      memberships: {
        some: {
          group: {
            name: groupName,
          },
        },
      },
    },
    include: {
      monthlyCategoryBudgets: true,
    },
  });

  const totalAmountCaegoryBudget = categoryBudgets.map((category) => ({
    name: category.name,
    totalAmount: category.monthlyCategoryBudgets.reduce(
      (total, monthlyCategoryBudgets) => {
        return total + monthlyCategoryBudgets.amount;
      },
      0
    ),
  }));

  return totalAmountCaegoryBudget;
}

export async function GetMonthlyCategoryBudgets(
  clientId,
  groupId,
  month,
  year
) {
  const monthlyCategoryBudgets = await prisma.monthlyCategoryBudget.findMany({
    where: {
      clientId: clientId,
      categoryBudget: {
        memberships: {
          some: {
            groupId: parseInt(groupId),
          },
        },
      },
      year: year,
      month: parseInt(month),
    },
    include: {
      categoryBudget: true,
    },
  });

  return monthlyCategoryBudgets;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { reqFunc } = body;

    let newCategoryBudget = null;
    if (reqFunc === "PostCategoryBudgetWithGroup") {
      newCategoryBudget = await PostCategoryBudgetWithGroup(body);
    } else if (reqFunc === "PostCategoryBudgetBulk") {
      newCategoryBudget = await PostCategoryBudgetBulk(body);
    } else {
      newCategoryBudget = await PostCategoryBudgetWithGroup(body);
    }

    return NextResponse.json(newCategoryBudget, { status: 201 });
  } catch (error) {
    console.error("Error adding category budget:", error);
    Response.json({ status: 500, message: "Error adding category budget" });
  }
}

export async function PostCategoryBudgets(body) {
  const { clientId, name, type } = body;
  validateFields([clientId, name, type]);

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

  return await prisma.categoryBudget.create({
    data: {
      clientId,
      name,
      type,
    },
  });
}

export async function PostCategoryBudgetWithGroup(body) {
  const { clientId, groupId } = body;
  validateField(clientId);

  return await prisma.categoryBudget.create({
    data: {
      clientId: clientId,
      name: categoryName,
      type: categoryType,
      memberships: {
        create: {
          groupId: groupId,
        },
      },
    },
    include: {
      memberships: true,
    },
  });
}

export async function PostCategoryBudgetBulk(body) {
  const { categories } = body;
  const createdCategories = await prisma.monthlyCategoryBudget.createMany({
    data: categories.map((category) => ({
      categoryId: category.categoryId,
      clientId: category.clientId,
      year: category.year,
      month: parseInt(category.month),
      amount: category.amount,
      type: category.type,
    })),
  });
  return createdCategories;
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { reqFunc } = body;

    let updateCategoryBudget = null;
    if (reqFunc === "PutCategoryBudgetBulk") {
      updateCategoryBudget = await PutCategoryBudgetBulk(body);
    }

    return NextResponse.json(updateCategoryBudget, { status: 201 });
  } catch (error) {
    console.error("Error adding category budget:", error);
    Response.json({ status: 500, message: "Error adding category budget" });
  }
}

export async function PutCategoryBudgetBulk(body) {
  const { categories } = body;
  const updatePromises = categories.map((category) =>
    prisma.monthlyCategoryBudget.update({
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

  const updatedCategories = await Promise.all(updatePromises);
  return updatedCategories;
}
