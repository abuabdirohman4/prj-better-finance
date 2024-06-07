import Card from "@/components/Card";
import { getData } from "@/utils/fetch";
import formatRupiah from "@/utils/formatRupiah";

async function fetchTransaction() {
  try {
    const sheetId = "1mVgdePlteuewjY6DvdUmNyHf0CPoAoHY3Sh3lDymV5A";
    const sheetName = encodeURIComponent("Jun");
    const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

    const res = await getData({
      url: sheetURL,
    });

    if (res.status === 200) {
      const data = parseCSV(res.data);
      console.log(data[1]);
      return data.sort().reverse();
    } else {
      throw new Error(`Failed to fetch data: ${res.status}`);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
}

function parseCSV(data) {
  // Mengganti newline yang tidak sesuai
  data = data.replace("Category\nor Account", "Category or Account");
  // Split data menjadi baris-baris
  const rows = data.split("\n").filter((row) => row.trim() !== "");
  // Ambil header dan bersihkan dari tanda kutip
  const headers = rows[0]
    .split(",")
    .map((header) => header.trim().replace(/"/g, ""));
  // Parse setiap baris data menjadi objek
  return rows.slice(1).map((row) => {
    const values = row
      .split(",")
      .map((value) => value.trim().replace(/"/g, ""));
    const rowData = {};
    headers.forEach((header, index) => {
      if (header) {
        // Pastikan header tidak kosong
        rowData[header] = values[index];
      }
    });
    return rowData;
  });
}

export default async function Transactions() {
  const transaction = await fetchTransaction();

  const getCashValue = (data) => {
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
      return data.Wallet;
    } else if (ATM.includes(data.Account)) {
      return data.ATM;
    } else if (Platform.includes(data.Account)) {
      return data.Platform;
    } else if (data.Account === "BNI") {
      return data.INVESTMENT;
    } else if (data.Account === "AR") {
      return data.AR;
    } else if (data.Account === "AP") {
      return data.AP;
    } else {
      return data.NET;
    }
  };

  const getTotalCash = (transactions, type) => {
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
            `Invalid cash value for transaction: ${JSON.stringify(data)}`
          );
        }
      }
    });

    return total;
  };

  const spending = getTotalCash(transaction, "Spending");
  const earning = getTotalCash(transaction, "Earning");
  return (
    <main className="">
      <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
        <h5>Spending : {formatRupiah(spending)}</h5>
        <h5>Earning : {formatRupiah(earning)}</h5>
        <div className="flex items-center justify-between mb-4">
          <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Latest Transaction
          </h5>
          <a
            href="#"
            className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
          >
            View all
          </a>
        </div>
        {transaction.map(
          (data, key) =>
            data.Note !== "Moving Period" && (
              <div key={key}>
                <Card
                  date={data.Date}
                  type={data.Transaction}
                  account={data.Account}
                  category={data["Category or Account"]}
                  note={data.Note}
                  cash={getCashValue(data)}
                />
              </div>
            )
        )}
      </div>
    </main>
  );
}
