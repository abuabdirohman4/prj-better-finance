export function formatCurrency(amount, format = 'rupiah') {
  const absAmount = Math.abs(amount);
  
  switch (format) {
    case 'rupiah':
      return formatRupiah(amount);
    case 'brackets':
      if (amount < 0) {
        return `(${formatRupiah(absAmount)})`;
      }
      return formatRupiah(absAmount);
    case 'signs':
      if (amount < 0) {
        return `- ${formatRupiah(absAmount)}`;
      }
      return `+ ${formatRupiah(absAmount)}`;
    default:
      return formatRupiah(amount);
  }
}

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

export function formatDate(dateString) {
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
};

export function toProperCase(string) {
  if (!string) return '';
  return string.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
}

export function getCashValue(data) {
  let amount = "";
  const ATM = ["Mandiri", "BCA"];
  const Platform = [
    "E-Toll",
    "Flip",
    "GoPay",
    "Grab",
    "Jenius",
    "Ovo",
  ];

  if (data.Account === "Wallet") {
    amount = data.Wallet;
  } else if (ATM.includes(data.Account)) {
    amount = data.ATM;
  } else if (Platform.includes(data.Account)) {
    amount = data.Platform;
  } else if (data.Account === "BNI") {
    amount = data.Saving;
  } else if (data.Account === "AR") {
    amount = data.AR;
  } else if (data.Account === "AP") {
    amount = data.AP;
  } else {
    amount = data.NET;
  }

  if (!amount) {
    amount = '0'
  }

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

  // Check if groupedTransactions is an array (ungrouped) or object (grouped)
  if (Array.isArray(groupedTransactions)) {
    // If it's an array, use the simple function
    return getTotalCashTransactions(groupedTransactions, type);
  }

  // If it's an object with grouped data
  if (typeof groupedTransactions === 'object' && groupedTransactions !== null) {
    Object.keys(groupedTransactions).forEach((date) => {
      // Check if the date key has an array value
      if (Array.isArray(groupedTransactions[date])) {
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
      } else {
        console.warn(`Date ${date} does not contain an array of transactions`);
      }
    });
  }

  return total;
}

export function getTotalObjectValue(data) {
  return Object.values(data).reduce((total, value) => total + value, 0);
}

export function getBudgetColors(percent) {
  if (percent == 100 || percent < 80) {
    return {
      text: 'text-green-600 font-semibold',
      progress: 'bg-green-500'
    };
  } else if (percent > 100) {
    return {
      text: 'text-red-600 font-semibold',
      progress: 'bg-red-500'
    };
  } else if (percent >= 80) {
    return {
      text: 'text-yellow-500 font-semibold',
      progress: 'bg-yellow-300'
    };
  }
};