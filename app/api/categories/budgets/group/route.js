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

  // const categoryBudgetGroups = await prisma.categoryBudgetGroup.findMany({
  //   where: { clientId: parseInt(clientId) },
  //   select: {
  //     name: true,
  //   },
  // });
  const categoryBudgetGroups = await getTotalAmountGroup(clientId);

  return Response.json({ data: categoryBudgetGroups });
}
