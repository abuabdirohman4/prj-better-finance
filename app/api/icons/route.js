import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  const iconsDir = path.join(process.cwd(), "public", "icons");

  try {
    const files = await fs.readdir(iconsDir);
    const fileNames = files.map((file) => path.parse(file).name); // Mengambil nama file tanpa ekstensi
    return new Response(JSON.stringify(fileNames), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to read directory" }), {
      status: 500,
    });
  }
}