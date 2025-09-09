import { formatCurrency } from "@/utils/helper";

export default function Transaction({
    date,
    type,
    account,
    category,
    note,
    cash,
}) {
    const isEarning = type.includes("Earning");
    const isSpending = type.includes("Spending");
    const isTransfer = type.includes("Transfer");

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-3">
                {/* Transaction Type Icon */}
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isEarning
                            ? "bg-green-100 text-green-600"
                            : isSpending
                              ? "bg-red-100 text-red-600"
                              : "bg-blue-100 text-blue-600"
                    }`}
                >
                    {isEarning ? (
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 11l5-5m0 0l5 5m-5-5v12"
                            />
                        </svg>
                    ) : isSpending ? (
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 13l-5 5m0 0l-5-5m5 5V6"
                            />
                        </svg>
                    ) : (
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                        </svg>
                    )}
                </div>

                {/* Transaction Details */}
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">
                        {note || category}
                    </h4>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                        {isTransfer && (
                            <span className="flex items-center">
                                {account}
                                <svg
                                    className="w-3 h-3 ml-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                                    />
                                </svg>
                            </span>
                        )}
                        <span className="flex items-center">
                            {!isTransfer && (
                                <svg
                                    className="w-3 h-3 mr-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            )}
                            {category === "-" ? account : category}
                        </span>
                    </div>
                </div>

                {/* Amount */}
                <div className="text-right">
                    <div
                        className={`text-md font-bold ${
                            isEarning
                                ? "text-green-600"
                                : isSpending
                                  ? "text-red-600"
                                  : "text-blue-600"
                        }`}
                    >
                        {/* {isEarning ? '+' : isSpending ? '-' : ''} */}
                        {/* {formatCurrency(Math.abs(cash), "brackets")} */}
                        {cash > 0
                            ? `${formatCurrency(cash, "signs")}`
                            : formatCurrency(cash, "signs")}
                    </div>
                </div>
            </div>
        </div>
    );
}
