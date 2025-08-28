import { formatCurrency, getBudgetColors, toProperCase } from "@/utils/helper";

export default function Budget({ category, budget, spending }) {
  const percentage = (parseFloat(spending) / -parseFloat(budget)) * 100;
  const stringPercent = percentage.toFixed(0);
  const balance = parseFloat(spending) + parseFloat(budget);
  const colors = getBudgetColors(percentage);
  
  return (
    <li className="py-2">
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        {/* Header with Category Name and Percentage */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium text-gray-900">
            {toProperCase(category)}
          </h3>
          <span className={`text-sm font-medium ${colors.text}`}>
            {stringPercent === "NaN" ? "0" : stringPercent}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${colors.progress}`}
            style={{ 
              width: `${percentage > 100 ? "100" : Math.max(0, stringPercent)}%` 
            }}
          ></div>
        </div>
        
        {/* Budget Information - 3 rows */}
        <div className="space-y-2">
          {/* Budget Total */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Budget:</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(budget, "brackets")}
            </span>
          </div>
          
          {/* Terpakai (Used) */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Terpakai:</span>
            <span className={`font-medium ${spending < 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {formatCurrency(spending, "brackets")}
            </span>
          </div>
          
          {/* Sisa (Remaining) */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Sisa:</span>
            <span className={`font-medium ${balance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {formatCurrency(balance, "brackets")}
            </span>
          </div>
        </div>
      </div>
    </li>
  );
}