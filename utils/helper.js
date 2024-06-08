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

export function getCashValue(data) {
  let amount = "";
  const ATM = ["Mandiri", "BCA"];
  const Platform = [
    "Ponch",
    "Dana",
    "Flip",
    "Gopay",
    "Grab",
    "Jenius",
    "MyTelkomsel",
    "Ovo",
  ];

  if (data.Account === "Wallet") {
    amount = data.Wallet;
  } else if (ATM.includes(data.Account)) {
    amount = data.ATM;
  } else if (Platform.includes(data.Account)) {
    amount = data.Platform;
  } else if (data.Account === "BNI") {
    amount = data.INVESTMENT;
  } else if (data.Account === "AR") {
    amount = data.AR;
  } else if (data.Account === "AP") {
    amount = data.AP;
  } else {
    amount = data.NET;
  }

  return parseInt(amount);
}

export function getTotalCash(transactions, type) {
  // Inisialisasi total cash
  let total = 0;

  transactions.forEach((data) => {
    if (data.Transaction === type) {
      // Periksa apakah nilai cash dapat diubah menjadi angka
      const cashValue = parseFloat(getCashValue(data));
      if (!isNaN(cashValue)) {
        // Jika valid, tambahkan ke total
        total += cashValue;
      } else {
        // Jika tidak valid, log pesan kesalahan
        console.error(
          `Invalid cash value for transaction: ${JSON.stringify(data.Note)}`
        );
      }
    }
  });

  return total;
}
