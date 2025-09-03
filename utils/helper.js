import { categories } from "./constants";

export function formatRupiah(amount) {
  if (amount || amount == 0) {
    // Parse first if amount is still in string format
    const parsedAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;

    // Format to Rupiah currency format
    const formattedAmount = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0, // Maximum 0 decimal places
    }).format(parsedAmount);

    return formattedAmount;
  }
}

export function formatCurrency(amount, format = 'rupiah', className = '') {
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
    case 'superscript':
      // Return JSX for superscript format
      if (amount || amount == 0) {
        const parsedAmount = typeof amount === "string" ? parseFloat(amount) : amount;
        
        // Split into integer and decimal parts
        const integerPart = Math.floor(Math.abs(parsedAmount));
        const decimalPart = Math.round((Math.abs(parsedAmount) - integerPart) * 100);
        
        // Format integer part with thousand separators
        const formattedInteger = integerPart.toLocaleString('id-ID');
        
        // Add sign if negative
        const sign = parsedAmount < 0 ? '-' : '';
        const decimalStr = decimalPart.toString().padStart(2, '0');
        
        return (
          <span className={className}>
            {sign}Rp {formattedInteger}
            <sup className="text-[0.7em] leading-none">
              {decimalStr}
            </sup>
          </span>
        );
      }
      return <span className={className}>Rp 0</span>;
    default:
      return formatRupiah(amount);
  }
}

export function formatCurrencyShort(amount) {
  if (amount === 0) return 'Rp0';
  
  const absAmount = Math.abs(amount);
  
  if (absAmount >= 1000000000) {
    const value = (absAmount / 1000000000).toFixed(1);
    return `Rp${parseFloat(value)}M`;
  } else if (absAmount >= 1000000) {
    const value = (absAmount / 1000000).toFixed(1);
    return `Rp${parseFloat(value)}jt`;
  } else if (absAmount >= 1000) {
    return `Rp${(absAmount / 1000).toFixed(0)}rb`;
  } else {
    return `Rp${absAmount.toFixed(0)}`;
  }
}

export function formatDate(dateString) {
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const date = new Date(dateString.split("/").reverse().join("-"));

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  // Check if date is today
  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  // Check if date is yesterday
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
  // Initialize total cash
  let total = 0;

  transactions.forEach((data) => {
    if (data.Transaction === type) {
      // Check if cash value can be converted to number
      const cashValue = parseFloat(getCashValue(data));
      if (!isNaN(cashValue)) {
        // If valid, add to total
        total += cashValue;
      } else {
        // If not valid, log error message
        console.error(
          `Invalid cash value for transaction: ${JSON.stringify(data.Note)}`
        );
      }
    }
  });

  return total;
}

export function getTotalCashGroupedByDate(groupedTransactions, type) {
  // Initialize total cash
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
            // Check if cash value can be converted to number
            const cashValue = parseFloat(getCashValue(data));
            if (!isNaN(cashValue)) {
              // If valid, add to total
              total += cashValue;
            } else {
              // If not valid, log error message
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

export function getTotalExpensesWithTransfers(groupedTransactions) {
  // Initialize total expenses
  let total = 0;

  // Check if groupedTransactions is an array (ungrouped) or object (grouped)
  if (Array.isArray(groupedTransactions)) {
    // If it's an array, process directly
    groupedTransactions.forEach((data) => {
      // Include regular spending transactions
      if (data.Transaction === "Spending") {
        const cashValue = parseFloat(getCashValue(data));
        if (!isNaN(cashValue)) {
          total += cashValue;
        }
      }
      // Include transfers to Investment or Saving as expenses
      else if (data.Transaction === "Transfer" && data.Note !== "Tabungan") {
        const category = data["Category or Account"];
        const allTransferCategories = [
          ...(categories.investing || []),
          ...(categories.saving || [])
        ].map(cat => cat.toLowerCase());
        if (allTransferCategories.includes((category || '').toLowerCase())) {
          const cashValue = parseFloat(getCashValue(data));
          if (!isNaN(cashValue)) {
            total += cashValue;
          }
        }
      }
    });
  } else if (typeof groupedTransactions === 'object' && groupedTransactions !== null) {
    // If it's an object with grouped data
    Object.keys(groupedTransactions).forEach((date) => {
      // Check if the date key has an array value
      if (Array.isArray(groupedTransactions[date])) {
        groupedTransactions[date].forEach((data) => {
          // Include regular spending transactions
          if (data.Transaction === "Spending") {
            const cashValue = parseFloat(getCashValue(data));
            if (!isNaN(cashValue)) {
              total += cashValue;
            }
          }
          // Include transfers to Investment or Saving as expenses
          else if (data.Transaction === "Transfer") {
            const category = data["Category or Account"];
            if (category === "Investment" || category === "Saving") {
              const cashValue = parseFloat(getCashValue(data));
              if (!isNaN(cashValue)) {
                total += cashValue;
              }
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

export function getTotalBalance(accounts) {
  if (!Array.isArray(accounts)) return 0;
  return accounts.reduce((total, account) => total + (account.balance || account.value || 0), 0);
}

export function categorizeAccounts(accounts) {
  if (!Array.isArray(accounts)) return { wallet: [], atm: [], platform: [], other: [] };
  
  const categories = {
    wallet: [],
    atm: [],
    platform: [],
    other: []
  };

  // Import accountCategories from constants
  const { accountCategories } = require('./constants');

  accounts.forEach(account => {
    if (accountCategories.wallet.includes(account.name)) {
      categories.wallet.push(account);
    } else if (accountCategories.atm.includes(account.name)) {
      categories.atm.push(account);
    } else if (accountCategories.platform.includes(account.name)) {
      categories.platform.push(account);
    } else {
      categories.other.push(account);
    }
  });

  return categories;
}

export function getBudgetColors(percent) {
  if (percent <= 100 && percent < 80) {
    return {
      text: 'text-green-600 font-semibold',
      progress: 'bg-green-500',
      status: 'On Track',
      statusBg: 'bg-green-100 text-green-700'
    };
  } else if (percent > 100) {
    return {
      text: 'text-red-600 font-semibold',
      progress: 'bg-red-500',
      status: 'Over Budget',
      statusBg: 'bg-red-100 text-red-700'
    };
  } else if (percent >= 80 && percent < 100) {
    return {
      text: 'text-yellow-500 font-semibold',
      progress: 'bg-yellow-300',
      status: 'Warning',
      statusBg: 'bg-yellow-100 text-yellow-700'
    };
  } else if (percent === 100) {
    return {
      text: 'text-green-600 font-semibold',
      progress: 'bg-green-500',
      status: 'On Track',
      statusBg: 'bg-green-100 text-green-700'
    };
  }
  
  // Default fallback for values that don't meet the above conditions
  return {
    text: 'text-gray-600 font-semibold',
    progress: 'bg-gray-500',
    status: 'Unknown',
    statusBg: 'bg-gray-100 text-gray-700'
  };
};

export function getGoalColors(progress) {
  if (progress < 50) {
    return {
      progress: 'bg-red-500',
      text: 'text-red-600',
      status: 'Behind',
      statusBg: 'bg-red-100 text-red-600'
    };
  } else if (progress < 80) {
    return {
      progress: 'bg-yellow-500',
      text: 'text-yellow-600',
      status: 'On Track',
      statusBg: 'bg-yellow-100 text-yellow-600'
    };
  } else {
    return {
      progress: 'bg-green-500',
      text: 'text-green-600',
      status: 'Ahead',
      statusBg: 'bg-green-100 text-green-600'
    };
  }
};