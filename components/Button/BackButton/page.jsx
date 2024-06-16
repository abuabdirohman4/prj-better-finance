import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ButtonBack() {
  const router = useRouter();

  return (
    <div className="mb-4">
      <Link
        href=""
        onClick={() => router.back()}
        className="text-black underline"
      >
        Back
      </Link>
    </div>
  );
}
