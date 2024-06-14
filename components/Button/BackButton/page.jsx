import Link from "next/link";

export default function ButtonBack({ href }) {
  console.log("href", href);
  return (
    <div className="mb-4">
      <Link href={href} className="text-black underline">
        Back
      </Link>
    </div>
  );
}
