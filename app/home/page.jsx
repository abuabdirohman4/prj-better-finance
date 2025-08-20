import {
  ArrowUpIcon,
  ArrowDownIcon,
  WalletIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const quickActions = [
    { name: "Transfer", icon: ArrowUpIcon, color: "bg-blue-100 text-blue-600" },
    {
      name: "Terima",
      icon: ArrowDownIcon,
      color: "bg-green-100 text-green-600",
    },
    {
      name: "Pembayaran",
      icon: WalletIcon,
      color: "bg-purple-100 text-purple-600",
    },
    {
      name: "Investasi",
      icon: ChartBarIcon,
      color: "bg-yellow-100 text-yellow-600",
    },
  ];

  return (
    <div className="p-4">
      {/* Balance Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white mb-6">
        <h2 className="text-sm opacity-80">Total Saldo</h2>
        <p className="text-3xl font-bold mt-2">Rp 5.000.000</p>
        <div className="flex justify-between mt-4 text-sm">
          <div>
            <p className="opacity-80">Pemasukan</p>
            <p className="font-semibold">Rp 2.500.000</p>
          </div>
          <div>
            <p className="opacity-80">Pengeluaran</p>
            <p className="font-semibold">Rp 1.500.000</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {quickActions.map((action) => (
          <button
            key={action.name}
            className={`flex flex-col items-center justify-center p-3 rounded-xl ${action.color}`}
          >
            <action.icon className="w-6 h-6" />
            <span className="text-xs mt-2">{action.name}</span>
          </button>
        ))}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-semibold mb-4">Transaksi Terakhir</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <WalletIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="font-medium">Belanja Bulanan</p>
                  <p className="text-sm text-gray-500">12 Mar 2024</p>
                </div>
              </div>
              <p className="text-red-600 font-medium">-Rp 500.000</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
