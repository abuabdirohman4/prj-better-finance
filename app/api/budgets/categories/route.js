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

  let categories = null;
  if (reqFunc === "GetCategoryAmount") {
    categories = await GetCategoryAmount(
      clientId,
      groupName,
      type,
      year,
      month
    );
  } else if (reqFunc === "GetMonthlyCategories") {
    categories = await GetMonthlyCategories(clientId, groupId, month, year);
  } else if (reqFunc === "GetCategories") {
    categories = await GetCategories(clientId, groupId, type);
  }
  return NextResponse.json(categories, { status: 200 });
}

export async function GetCategories(clientId, groupId, type) {
  let categories = "";
  if (groupId) {
    categories = await prisma.category.findMany({
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
    categories = await prisma.category.findMany({
      where: { clientId: clientId },
      select: {
        id: true,
        name: true,
        type: true,
      },
    });
  }

  return categories;
}

export async function GetCategoryAmount(
  clientId,
  groupName,
  type,
  year,
  month
) {
  const categories = await prisma.category.findMany({
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
      monthlyCategories: {
        where: {
          year: year,
          month: month,
        },
      },
    },
  });

  return categories;
}

export async function GetTotalAmountCategory(clientId, groupName, type) {
  const categories = await prisma.category.findMany({
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
      monthlyCategories: true,
    },
  });

  const totalAmountCaegoryBudget = categories.map((category) => ({
    name: category.name,
    totalAmount: category.monthlyCategories.reduce(
      (total, monthlyCategories) => {
        return total + monthlyCategories.amount;
      },
      0
    ),
  }));

  return totalAmountCaegoryBudget;
}

export async function GetMonthlyCategories(clientId, groupId, month, year) {
  const monthlyCategories = await prisma.monthlyCategory.findMany({
    where: {
      clientId: clientId,
      category: {
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
      category: true,
    },
  });

  return monthlyCategories;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { reqFunc } = body;

    let newCategory = null;
    if (reqFunc === "PostCategory") {
      newCategory = await PostCategory(body);
    } else if (reqFunc === "PostCategoryWithGroup") {
      newCategory = await PostCategoryWithGroup(body);
    } else if (reqFunc === "PostCategoryLinkGroup") {
      newCategory = await PostCategoryLinkGroup(body);
    }

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error adding category budget:", error);
    Response.json({ status: 500, message: "Error adding category budget" });
  }
}

export async function PostCategory(body) {
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

  return await prisma.category.create({
    data: {
      clientId,
      name,
      type,
    },
  });
}

export async function PostCategoryWithGroup(body) {
  const { clientId, name, type, groupId } = body;
  validateField(clientId);

  return await prisma.category.create({
    data: {
      clientId: clientId,
      name: name,
      type: type,
      memberships: {
        create: {
          groupId: parseInt(groupId),
        },
      },
    },
    include: {
      memberships: true,
    },
  });
}

export async function PostCategoryLinkGroup(body) {
  const {  categoryId, groupId } = body;
  validateFields([categoryId, groupId]);

  return await prisma.categoryGroupMembership.create({
    data: {
      categoryId,
      groupId,
    },
  });
}