import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const clientId = url.searchParams.get("clientId");
  const groupId = url.searchParams.get("groupId");
  const groupName = url.searchParams.get("groupName");
  const type = url.searchParams.get("type");
  const year = url.searchParams.get("year");
  const month = parseInt(url.searchParams.get("month"));
  const reqFunc = url.searchParams.get("function");

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
  } else {
    categoryBudgets = await GetCategoryBudgets(clientId, groupName, type);
  }
  return NextResponse.json(categoryBudgets, { status: 200 });
}

export async function GetCategoryBudgets(clientId, groupName, type) {
  let categoryBudgets = "";
  if (groupName) {
    categoryBudgets = await prisma.categoryBudget.findMany({
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

export async function GetMonthlyCategoryBudgets(clientId, groupId, month, year) {
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
    console.log("POST");
    const body = await req.json();
    // const { reqFunc } = body;
    console.log("body", body);
    const { clientId, name, type, groupId, reqFunc } = body;

    // if (!clientId || !name || !type) {
    //   return NextResponse.json(
    //     { error: "Missing required fields" },
    //     { status: 400 }
    //   );
    // }

    // // Periksa apakah nama kategori sudah ada
    // const existingCategory = await prisma.categoryBudget.findFirst({
    //   where: {
    //     clientId: clientId,
    //     name: name,
    //   },
    // });

    // if (existingCategory) {
    //   return NextResponse.json(
    //     { error: "Category name already exists" },
    //     { status: 400 }
    //   );
    // }

    let newCategoryBudget = null;
    if (reqFunc === "PostCategoryBudgetWithGroup") {
      newCategoryBudget = await PostCategoryBudgetWithGroup(
        clientId,
        name,
        type,
        parseInt(groupId)
      );
    } else if (reqFunc === "PostCategoryBudgetBulk") {
      newCategoryBudget = await PostCategoryBudgetBulk(body);
    } else {
      newCategoryBudget = await prisma.categoryBudget.create({
        data: {
          clientId,
          name,
          type,
        },
      });
    }

    return NextResponse.json(newCategoryBudget, { status: 201 });
  } catch (error) {
    console.error("Error adding category budget:", error);
    Response.json({ status: 500, message: "Error adding category budget" });
  }
}

export async function PostCategoryBudgetWithGroup(
  clientId,
  categoryName,
  categoryType,
  groupId
) {
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
  console.log("masuk PostCategoryBudgetBulk");
  const { categories } = body;
  console.log("categories", categories);
  const createdCategories = await prisma.monthlyCategoryBudget.createMany({
    data: categories.map((category) => ({
      categoryId: category.categoryId,
      clientId: category.clientId,
      year: category.year,
      month: category.month,
      amount: category.amount,
      type: category.type,
    })),
  });
  console.log("createdCategories", createdCategories);
  return createdCategories;
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { reqFunc } = body;
    console.log("body", body);
    console.log("reqFunc", reqFunc);

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
  // const updatedCategories = await Promise.all(
  //   categories.map((category) =>
  //     prisma.monthlyCategoryBudget.update({
  //       where: { id: category.id },
  //       data: {
  //         clientId: category.clientId,
  //         categoryId: category.categoryId,
  //         year: category.year,
  //         month: category.month,
  //         amount: category.budget,
  //         type: category.type,
  //       },
  //     })
  //   )
  // );

  const updatePromises = categories.map((category) =>
    prisma.monthlyCategoryBudget.update({
      where: { id: category.id },
      data: {
        categoryId: category.categoryId,
        clientId: category.clientId,
        year: category.year,
        month: category.month,
        amount: category.amount,
        type: category.type,
      },
    })
  );

  const updatedCategories = await Promise.all(updatePromises);
  console.log("hasil updatedCategories", updatedCategories);
  return updatedCategories;
}
