import { getData } from "@/utils/fetch";

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

export async function fetchTransaction(sheetName) {
  const sheetId = "1mVgdePlteuewjY6DvdUmNyHf0CPoAoHY3Sh3lDymV5A";
  const encodedSheetName = encodeURIComponent(sheetName);
  const sheetURL = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${encodedSheetName}`;

  const res = await getData({
    url: sheetURL,
  });
  if (res.status == 200) {
    return parseCSV(res.data).sort().reverse();
  }
}

export function getCashValue(data) {
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
    return parseInt(data.Wallet);
  } else if (ATM.includes(data.Account)) {
    return parseInt(data.ATM);
  } else if (Platform.includes(data.Account)) {
    return parseInt(data.Platform);
  } else if (data.Account === "BNI") {
    return parseInt(data.INVESTMENT);
  } else if (data.Account === "AR") {
    return parseInt(data.AR);
  } else if (data.Account === "AP") {
    return parseInt(data.AP);
  } else {
    return parseInt(data.NET);
  }
}
