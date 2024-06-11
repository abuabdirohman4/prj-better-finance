"use client";
import { getData } from "@/utils/fetch";
import { useEffect } from "react";

export default function Home() {
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
        return data.sort().reverse();
      } else {
        throw new Error(`Failed to fetch data: ${res.status}`);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  useEffect(() => {
    fetchTransaction();
  }, []);

  return <main className=""></main>;
}
