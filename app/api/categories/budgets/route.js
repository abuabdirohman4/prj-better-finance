import prisma from "@/utils/prisma";

export async function GET(req) {
  const url = new URL(req.url);
  const clientId = url.searchParams.get("clientId");

  if (!clientId) {
    return new Response(JSON.stringify({ error: "ClientId is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const categoryBudgets = await prisma.categoryBudget.findMany({
    where: { clientId: parseInt(clientId) },
    select: {
      name: true,
      type: true,
    },
  });

  return Response.json({ data: categoryBudgets });
}