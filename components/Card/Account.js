import { formatCurrency } from "@/utils/helper";
import { accountLogos, accountColorSchemes } from "@/utils/constants";
import Link from "next/link";

const getAccountLogo = (accountName) => {
  const logoConfig = accountLogos[accountName];
  
  if (!logoConfig) {
    return {
      icon: (
        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-sm">{accountName.charAt(0)}</span>
        </div>
      ),
      color: "text-gray-600"
    };
  }

  if (logoConfig.icon === "wallet") {
    return {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      color: logoConfig.color
    };
  }

  return {
    icon: (
      <div className={`w-8 h-8 ${logoConfig.bgColor} rounded-full flex items-center justify-center`}>
        <span className="text-white font-bold text-sm">{logoConfig.icon}</span>
      </div>
    ),
    color: logoConfig.color
  };
};

const getAccountColorScheme = (accountName) => {
  return accountColorSchemes[accountName] || {
    bg: "bg-gray-50",
    accent: "bg-gray-200",
    text: "text-gray-800"
  };
};

export default function AccountCard({ account }) {
  const logo = getAccountLogo(account.name);
  const colorScheme = getAccountColorScheme(account.name);
  const isLowBalance = account.balance <= 0;
  const isBankAccount = account.name === 'Mandiri' || account.name === 'BCA';

  // Determine the correct link based on account type
  const getAccountLink = () => {
    if (account.name === 'Wallet') {
      return '/accounts/wallet-fractions';
    }
    return `/accounts/balancing?account=${encodeURIComponent(account.name)}`;
  };

  return (
    <Link
      href={getAccountLink()}
      className={`block relative bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer ${isLowBalance ? 'opacity-75' : ''}`}
    >
      {/* Card Content */}
      <div className="p-3">
        {/* Logo and Name */}
        <div className="flex flex-col items-center">
          <div className={`${logo.color} mt-2 mb-1`}>
            {logo.icon}
          </div>
          <h3 className="font-bold text-gray-900 text-sm text-center">{account.name}</h3>
        </div>
      </div>

      {/* Balance Bar */}
      <div className={`${colorScheme.accent} px-3 py-1.5 rounded-b-2xl`}>
        <div className="text-center">
          {isBankAccount ? (
            formatCurrency(account.balance, 'superscript', `font-bold text-xs ${isLowBalance ? 'text-red-600' : colorScheme.text}`)
          ) : (
            <span className={`font-bold text-xs ${isLowBalance ? 'text-red-600' : colorScheme.text}`}>
              {formatCurrency(account.balance)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
