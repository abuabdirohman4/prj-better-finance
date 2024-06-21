import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";
import { validateField, validateFields } from "../helper";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const clientId = searchParams.get("clientId");
  validateFields([clientId]);

  const pockets = await prisma.pocket.findMany({
    where: { clientId },
    select: {
      id: true,
      name: true,
      actual: true,
    },
  });
  return NextResponse.json(pockets, { status: 200 });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { reqFunc } = body;
    validateField(reqFunc);

    let newCategory = null;
    if (reqFunc === "PostPocket") {
      newCategory = await PostPocket(body);
    }

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error adding category budget:", error);
    Response.json({ status: 500, message: "Error adding category budget" });
  }
}

async function PostPocket(body) {
  const { clientId, name, actual } = body;
  validateFields([clientId, name, actual]);

  // Periksa apakah nama pocket sudah ada
  const existingPocket = await prisma.pocket.findFirst({
    where: {
      clientId: clientId,
      name: name,
    },
  });
  if (existingPocket) {
    return NextResponse.json(
      { error: "Pocket name already exists" },
      { status: 400 }
    );
  }

  return await prisma.pocket.create({
    data: {
      clientId,
      name,
      actual: parseFloat(actual),
    },
  });
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { reqFunc } = body;

    let updatePocket = null;
    if (reqFunc === "PutPocket") {
      updatePocket = await PutPocket(body);
    }

    return NextResponse.json(updatePocket, { status: 201 });
  } catch (error) {
    console.error("Error update pocket:", error);
  }
}

async function PutPocket(body) {
  const { id, actual } = body;
  return prisma.pocket.update({
    where: { id: Number(id) },
    data: { actual: parseFloat(actual) },
  });
}
