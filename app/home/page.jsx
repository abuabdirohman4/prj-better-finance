import Link from "next/link";

const menus = [
  { name: "Transactions", href: "/transactions" },
  { name: "Budgets", href: "/budgets" },
  { name: "Goals", href: "" },
  { name: "Pockets", href: "/pockets" },
  { name: "Inventory", href: "" },
  { name: "AR/AP", href: "" },
];

export default function Home() {
  return (
    <div className="w-full p-8 min-h-[94vh] bg-white border border-gray-200 rounded-lg shadow">
      <div className="flex items-center justify-between mb-8">
        <h5 className="text-xl font-bold leading-none text-gray-900">Home</h5>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-1 text-center">
        {menus.map((menu, index) => (
          <Link
            key={index}
            href={menu.href}
            className="block max-w-sm bg-white border border-gray-200 rounded-sm shadow cursor-pointer hover:bg-gray-100"
          >
            <h5 className="my-8 font-bold tracking-tight text-gray-900">
              {menu.name}
            </h5>
          </Link>
        ))}
      </div>
    </div>
  );
}
