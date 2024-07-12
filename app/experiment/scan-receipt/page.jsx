"use client";
import { postData } from "@/utils/fetch";
import { useState } from "react";
import Tesseract from "tesseract.js";

export default function ScanReceipt() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    // const reader = new FileReader();
    // reader.onload = async () => {
    //   const base64Image = reader.result.split(",")[1]; // Hanya mengambil data base64
    //   const payload = { image: base64Image };
    //   //   const payload = { image: reader.result };
    //   const response = await postData({
    //     url: "/api/scan-receipt",
    //     payload,
    //     token: "", // Jika tidak memerlukan token, biarkan kosong atau hapus bagian ini
    //     formData: false,
    //   });

    //   if (response.data) {
    //     setResult(response.data.text);
    //   } else {
    //     setResult("Error: " + response.message);
    //   }
    // };

    const reader = new FileReader();
    reader.onload = async () => {
      setLoading(true);
      const base64Image = reader.result.split(",")[1]; // Hanya mengambil data base64

      try {
        const {
          data: { text },
        } = await Tesseract.recognize(
          `data:image/png;base64,${base64Image}`,
          "eng",
          {
            logger: (m) => console.log(m),
          }
        );
        setResult(text);
        const parsedItems = parseReceipt(text);
        setItems(parsedItems);
      } catch (error) {
        console.error("Error performing OCR:", error);
        setResult("Error performing OCR");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(selectedFile);
  };

  return (
    <div>
      <h1>Receipt Scanner</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit">Scan</button>
      </form>
      {loading && <p>Processing...</p>}
      {/* {result && (
        <div>
          <h2>OCR Result:</h2>
          <pre>{result}</pre>
        </div>
      )} */}
      {items.length > 0 && (
        <div>
          <h2>Items:</h2>
          <ul>
            {items.map((item, index) => (
              <li key={index}>
                {item.name} - Quantity: {item.quantity}, Price: {item.price},
                Total: {item.total}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// utils/parser.js
export function parseReceipt(text) {
  //   const lines = text.split('\n');
  //   const items = [];
  //   const itemPattern = /^[A-Z0-9\s]+ \d+(\.\d+)? [\d,.]+ [\d,.]+$/;

  //   lines.forEach(line => {
  //     if (itemPattern.test(line)) {
  //       const parts = line.split(' ');
  //       const quantity = parseFloat(parts[parts.length - 3]);
  //       const price = parseFloat(parts[parts.length - 2].replace(/,/g, ''));
  //       const total = parseFloat(parts[parts.length - 1].replace(/,/g, ''));
  //       const name = parts.slice(0, parts.length - 3).join(' ');
  //       items.push({ name, quantity, price, total });
  //     }
  //   });

  //   return items;
  const lines = text.split("\n");
  console.log("lines", lines);
  const items = [];
  const itemPattern = /^([A-Z0-9\s]+) (\d+(\.\d+)?) ([\d,.]+) ([\d,.]+)$/;
  const discountPattern = /^Disc. ([\d,-]+)$/;

  lines.forEach((line) => {
    const itemMatch = line.match(itemPattern);
    const discountMatch = line.match(discountPattern);

    if (itemMatch) {
      const name = itemMatch[1].trim();
      const quantity = parseFloat(itemMatch[2]);
      const price = parseFloat(itemMatch[4].replace(/,/g, ""));
      const total = parseFloat(itemMatch[5].replace(/,/g, ""));
      items.push({ name, quantity, price, total, discount: 0 });
    } else if (discountMatch && items.length > 0) {
      const discount = parseFloat(discountMatch[1].replace(/,/g, ""));
      items[items.length - 1].discount = discount;
    }
  });

  return items;
}
