// pages/api/scan-receipt.js
import Tesseract from "tesseract.js";

export async function POST(req) {
  try {
    // const { image } = req.body;
    const { image } = await req.json();
    // console.log("req.json()", req.json());
    // console.log("image", image);
    const {
      data: { text },
    } = await Tesseract.recognize(image, "eng", {
      logger: (m) => console.log(m),
    });

    return NextResponse.json(text, { status: 201 });
  } catch (error) {
    console.error("Error scan receipt:", error);
    Response.json({ status: 500, message: "Error scan receipt" });
  }
}

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       const { image } = req.body;
//       const {
//         data: { text },
//       } = await Tesseract.recognize(image, "eng", {
//         logger: (m) => console.log(m),
//       });
//       res.status(200).json({ text });
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   } else {
//     res.status(405).json({ message: "Method Not Allowed" });
//   }
// }
