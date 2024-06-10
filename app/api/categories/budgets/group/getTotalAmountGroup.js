import prisma from "@/utils/prisma";

export default async function getTotalAmountGroup(clientId) {
  try {
    // Dapatkan daftar grup kategori anggaran untuk pengguna tertentu
    const categoryBudgetGroups = await prisma.categoryBudgetGroup.findMany({
      where: { client: { clientId } },
      include: {
        memberships: {
          include: {
            categoryBudget: {
              include: {
                monthlyCategoryBudgets: true,
              },
            },
          },
        },
      },
    });

    // Hitung total jumlah amount untuk setiap grup
    const totalAmountByGroup = categoryBudgetGroups.map((group) => ({
      name: group.name,
      totalAmount: group.memberships.reduce((total, membership) => {
        // Jumlahkan jumlah amount dari semua kategori anggaran dalam grup
        return (
          total +
          membership.categoryBudget.monthlyCategoryBudgets.reduce(
            (subtotal, budget) => subtotal + budget.amount,
            0
          )
        );
      }, 0),
    }));

    return totalAmountByGroup;
  } catch (error) {
    console.error("Error calculating total amount:", error);
    throw error;
  }
}
