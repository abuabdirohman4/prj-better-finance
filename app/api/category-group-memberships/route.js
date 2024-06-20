import prisma from "@/utils/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { categoryId, groupId } = body;
    validateFields([categoryId, groupId]);

    const newCategoryGroupMembership =
      await prisma.categoryGroupMembership.create({
        data: {
          categoryId,
          groupId,
        },
      });

    return NextResponse.json(newCategoryGroupMembership, { status: 201 });
  } catch (error) {
    console.error("Error adding category group membership:", error);
    Response.json({ status: 500, message: "Error adding category group membership" });
  }
}
