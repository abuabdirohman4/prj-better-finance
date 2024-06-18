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

export function formatDateWithTodayYesterdayCheck(dateString) {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const date = new Date(dateString.split("/").reverse().join("-"));

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Periksa apakah tanggal adalah hari ini
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  // Periksa apakah tanggal adalah kemarin
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-GB", options).replace(/ /g, " ");
}

export function formatDateToDDMMYYYY(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

export function getDefaultSheetName(months) {
  const currentMonth = new Date().getMonth();
  return months[currentMonth];
}

export function getMonthInNumber(monthString) {
  const year = new Date().getFullYear();
  return new Date(Date.parse(monthString + " 1, " + year)).getMonth() + 1;
}

export function getCashValue(data) {
  let amount = "";
  const ATM = ["Mandiri", "BCA"];
  const Platform = [
    "Ponch",
    "Dana",
    "Flip",
    "GoPay",
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

  if (!amount) {
    amount = "0";
  }

  return parseInt(amount);
}

export function getCashValuePocket(data, pocket) {
  let amount = "";
  const ATM = ["Mandiri", "BCA"];
  const Platform = [
    "Ponch",
    "Dana",
    "Flip",
    "GoPay",
    "Grab",
    "Jenius",
    "MyTelkomsel",
    "E-Toll",
    "Ovo",
  ];

  if (pocket === "Wallet") {
    amount = data.Wallet;
  } else if (ATM.includes(pocket)) {
    amount = data.ATM;
  } else if (Platform.includes(pocket)) {
    amount = data.Platform;
  } else if (pocket === "BNI") {
    amount = data.INVESTMENT;
  } else if (pocket === "AR") {
    amount = data.AR;
  } else if (pocket === "AP") {
    amount = data.AP;
  } else {
    amount = data.NET;
  }

  if (!amount) {
    amount = "0";
  }

  // console.log(data.Date, data.Note, parseInt(amount));
  return parseInt(amount);
}

export function getTotalCashTransactions(transactions, type) {
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

export function getTotalCashGroupedByDate(groupedTransactions, type) {
  // Inisialisasi total cash
  let total = 0;

  Object.keys(groupedTransactions).forEach((date) => {
    groupedTransactions[date].forEach((data) => {
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
  });

  return total;
}

export function getTotalObjectValue(data) {
  return Object.values(data).reduce((total, value) => total + value, 0);
}

export function toCapitalCase(string) {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } else {
    console.log(string, "string toCapitalCase");
  }
}
