import prisma from "@/utils/prisma";
import { validateFields } from "../../helper";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const url = new URL(req.url);
  const reqFunc = url.searchParams.get("reqFunc");
  const id = params.id;
  validateFields([id, reqFunc]);

  let pockets = null;
  if (reqFunc === "GetPocket") {
    pockets = await GetPocket(id);
  }
  return NextResponse.json(pockets, { status: 200 });
}

async function GetPocket(id) {
  return await prisma.pocket.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      actual: true,
    },
  });
}

export async function PUT(req, { params }) {

}