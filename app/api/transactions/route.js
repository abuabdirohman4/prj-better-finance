import prisma from "@/utils/prisma";
import { SESSIONKEY } from "@/utils/constants";
import { getLocal } from "@/utils/session";
import { NextResponse } from "next/server";
import { excludeData } from "@/utils/helper";

const clientId = getLocal(SESSIONKEY.clientId);

export async function GET(req) {
  const url = new URL(req.url);
  const params = url.searchParams;
  const day = params.get("date[day]");
  const month = params.get("date[month]");
  const year = params.get("date[year]");
  const type = params.get("type");
  const pocket1 = params.get("pocket1");
  const pocket2 = params.get("pocket2");
  const category = params.get("category");
  const desc = params.get("desc");
  const amount = params.get("amount");
  const where = { clientId };

  if (year) {
    const startYear = `${year}-01-01T00:00:00.000Z`;
    const endYear = `${year}-12-31T23:59:59.999Z`;

    where.date = {
      ...where.date,
      gte: new Date(startYear),
      lte: new Date(endYear),
    };
  }

  if (month && year) {
    const startMonth = `${year}-${month.padStart(2, "0")}-01T00:00:00.000Z`;
    const endMonth = new Date(startMonth);
    endMonth.setMonth(endMonth.getMonth() + 1); // Bulan berikutnya
    endMonth.setDate(0); // Hari terakhir bulan ini

    where.date = {
      ...where.date,
      gte: new Date(startMonth),
      lte: endMonth,
    };
  } else if (month && !year) {
    const currentYear = new Date().getFullYear(); // Jika tahun tidak diberikan, gunakan tahun ini
    const startMonth = `${currentYear}-${month.padStart(
      2,
      "0"
    )}-01T00:00:00.000Z`;
    const endMonth = new Date(startMonth);
    endMonth.setMonth(endMonth.getMonth() + 1); // Bulan berikutnya
    endMonth.setDate(0); // Hari terakhir bulan ini

    where.date = {
      ...where.date,
      gte: new Date(startMonth),
      lte: endMonth,
    };
  }

  if (day && month && year) {
    const startDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}T00:00:00.000Z`;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    where.date = {
      ...where.date,
      gte: new Date(startDate),
      lte: endDate,
    };
  } else if (day && !month && year) {
    // Jika hanya hari dan tahun yang diberikan
    const startDate = `${year}-01-${day.padStart(2, "0")}T00:00:00.000Z`;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    where.date = {
      ...where.date,
      gte: new Date(startDate),
      lte: endDate,
    };
  } else if (day && month && !year) {
    // Jika hanya hari dan bulan yang diberikan
    const currentYear = new Date().getFullYear(); // Gunakan tahun ini jika tahun tidak diberikan
    const startDate = `${currentYear}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}T00:00:00.000Z`;
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    where.date = {
      ...where.date,
      gte: new Date(startDate),
      lte: endDate,
    };
  }

  if (type) where.type = type;
  if (pocket1) where.pocket1 = parseInt(pocket1);
  if (pocket2) where.pocket2 = parseInt(pocket2);
  if (category) where.categoryId = parseInt(category);
  if (desc) where.desc = { contains: desc };
  if (amount) where.amount = parseFloat(amount);

  let transactions = await prisma.transaction.findMany({
    where,
    include: {
      pockets: {
        select: {
          name: true,
        },
      },
      pockets2: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  transactions = excludeData(transactions, ["id", "clientId"]);
  return NextResponse.json(transactions, { status: 200 });
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { transactions, clientId } = body;

    let amount = parseFloat(transactions.amount);
    if (transactions.type === "spending" && amount > 0) {
      amount = -amount;
    }

    const now = new Date();
    let dateWithTime = new Date(transactions.date);
    dateWithTime.setHours(now.getHours() + 7);
    dateWithTime.setMinutes(now.getMinutes());
    dateWithTime.setSeconds(now.getSeconds());
    dateWithTime.setMilliseconds(now.getMilliseconds());

    const newCategory = await prisma.transaction.create({
      data: {
        clientId: clientId,
        date: dateWithTime,
        type: transactions.type,
        pocket1: transactions.pocket1,
        pocket2: transactions.pocket2,
        categoryId: transactions.category,
        desc: transactions.desc,
        amount: amount,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error adding category budget:", error);
    Response.json({ status: 500, message: "Error adding category budget" });
  }
}
