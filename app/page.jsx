import Link from "next/link";

export default function Root() {
  return (
    <div className="flex h-screen flex-col justify-evenly bg-cover bg-top bg-no-repeat px-9 md:bg-welcome-md md:bg-cover">
      <Link href="/home">Home</Link>
      Financial App
    </div>
  );
}
