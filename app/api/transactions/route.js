import prisma from "@/utils/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { transactions, clientId } = body;

    const newCategory = await prisma.transaction.create({
      data: {
        clientId: clientId,
        date: new Date(transactions.date),
        type: transactions.type,
        pocket1: transactions.pocket1,
        pocket2: transactions.pocket2,
        categoryId: transactions.category,
        desc: transactions.desc,
        amount: parseFloat(transactions.amount),
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error adding category budget:", error);
    Response.json({ status: 500, message: "Error adding category budget" });
  }
}
