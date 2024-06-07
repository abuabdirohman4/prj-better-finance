export function formatRupiah(amount) {
  if (amount || amount == 0) {
    // Lakukan parsing terlebih dahulu jika amount masih dalam format string
    const parsedAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;

    // Lakukan formatting ke dalam format Rupiah
    const formattedAmount = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0, // Maksimum 0 digit di belakang koma
    }).format(parsedAmount);

    return formattedAmount;
  }
}

export function getDefaultSheetName(months) {
  const currentMonth = new Date().getMonth();
  return months[currentMonth];
}

export function toCapitalCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
