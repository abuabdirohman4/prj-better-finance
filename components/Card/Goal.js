import { formatCurrency, formatCurrencyShort, getBudgetColors } from "@/utils/helper";

export default function Goal({
  goal,
  isHidden = false,
  onToggleVisibility = null,
}) {
  // Handle column names with spaces
  const name = goal['Saving'] || goal[' Saving '] || goal['Saving '] || goal[' Saving'];
  const account = goal['Account'] || goal[' Account '] || goal['Account '] || goal[' Account'];
  const time = goal['Time'] || goal[' Time '] || goal['Time '] || goal[' Time'];
  
  // Get the actual type (Sinking, Wishlist, Business, Emergency, Investment)
  const type = goal['Type'] || goal[' Type '] || goal['Type '] || goal[' Type'];
  const target = goal['Target'] || goal[' Target '] || goal['Target '] || goal[' Target'];
  const monthly = goal['Monthly'] || goal[' Monthly '] || goal['Monthly '] || goal[' Monthly'];
  const deadline = goal['Deadline'] || goal[' Deadline '] || goal['Deadline '] || goal[' Deadline'];
  const progress = goal['Progress'] || goal[' Progress '] || goal['Progress '] || goal[' Progress'];
  const percentage = goal['%'] || goal[' % '] || goal['% '] || goal[' %'];
  const retained = goal['Retained'] || goal[' Retained '] || goal['Retained '] || goal[' Retained'];
  const collected = goal['Collected'] || goal[' Collected '] || goal['Collected '] || goal[' Collected'];
  
  // Calculate progress percentage from collected and target values
  // Data from Google Sheets is already in number format
  const collectedValue = parseFloat(collected) || 0;
  const targetValue = parseFloat(target) || 0;
  const calculatedProgress = targetValue > 0 ? (collectedValue / targetValue) * 100 : 0;
  
  
  // Use calculated progress if percentage column is not available or is 0
  const progressPercent = Math.min(calculatedProgress || parseFloat(percentage) || 0, 100);
  const isCompleted = progressPercent >= 100;
  const isOverTarget = progressPercent > 100;
  
  // Custom colors for goals progress
  const getGoalColors = (progress) => {
    if (progress < 50) {
      return {
        progress: 'bg-red-500',
        text: 'text-red-600',
        status: 'Behind',
        statusBg: 'bg-red-100 text-red-600'
      };
    } else if (progress < 80) {
      return {
        progress: 'bg-yellow-500',
        text: 'text-yellow-600',
        status: 'On Track',
        statusBg: 'bg-yellow-100 text-yellow-600'
      };
    } else {
      return {
        progress: 'bg-green-500',
        text: 'text-green-600',
        status: 'Ahead',
        statusBg: 'bg-green-100 text-green-600'
      };
    }
  };
  
  const colors = getGoalColors(progressPercent);

  // Get type icon - using emoji style like Budgets page
  const getTypeIcon = () => {
    // Handle column names with spaces and trim
    const cleanType = type ? type.trim() : '';
    const goalName = name ? name.toLowerCase() : '';
    
    // For Sinking funds, determine icon based on goal name
    if (cleanType === 'Sinking') {
      if (goalName.includes('kontrakan') || goalName.includes('rent') || goalName.includes('rumah')) {
        return '🏠';
      } else if (goalName.includes('qurban') || goalName.includes('kurban')) {
        return '🐑';
      } else if (goalName.includes('gd') || goalName.includes('google drive')) {
        return '☁️';
      } else if (goalName.includes('motor') || goalName.includes('mobil') || goalName.includes('kendaraan')) {
        return '🚗';
      } else if (goalName.includes('liburan') || goalName.includes('travel') || goalName.includes('vacation')) {
        return '✈️';
      } else if (goalName.includes('pernikahan') || goalName.includes('wedding') || goalName.includes('nikah')) {
        return '💒';
      } else if (goalName.includes('hp') || goalName.includes('phone') || goalName.includes('smartphone')) {
        return '📱';
      } else if (goalName.includes('laptop') || goalName.includes('komputer') || goalName.includes('pc')) {
        return '💻';
      } else if (goalName.includes('elektronik') || goalName.includes('electronic') || goalName.includes('gadget')) {
        return '🔧';
      } else if (goalName.includes('furniture') || goalName.includes('mebel') || goalName.includes('kursi') || goalName.includes('meja')) {
        return '🪑';
      } else if (goalName.includes('kesehatan') || goalName.includes('health') || goalName.includes('medical') || goalName.includes('dokter')) {
        return '🏥';
      } else if (goalName.includes('pendidikan') || goalName.includes('education') || goalName.includes('sekolah') || goalName.includes('kuliah')) {
        return '🎓';
      } else if (goalName.includes('hobi') || goalName.includes('hobby') || goalName.includes('mainan') || goalName.includes('toy')) {
        return '🎮';
      } else if (goalName.includes('olahraga') || goalName.includes('sport') || goalName.includes('gym') || goalName.includes('fitness')) {
        return '⚽';
      } else if (goalName.includes('makanan') || goalName.includes('food') || goalName.includes('restoran') || goalName.includes('restaurant')) {
        return '🍽️';
      } else if (goalName.includes('pakaian') || goalName.includes('clothes') || goalName.includes('fashion') || goalName.includes('baju')) {
        return '👕';
      } else if (goalName.includes('maintenance') || goalName.includes('perbaikan') || goalName.includes('service') || goalName.includes('servis')) {
        return '🔧';
      } else {
        // Default sinking fund icon
        return '💰';
      }
    }
    
    switch (cleanType) {
      case 'Wishlist':
        return '🎁';
      case 'Business':
        return '💼';
      case 'Dana Darurat':
        return '🚨';
      case 'Emergency':
        return '🚨';
      case 'Pendidikan SD':
        return '🎓';
      case 'Investment':
        return '📈';
      default:
        return '📋';
    }
  };

  return (
    <div 
      className={`bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-200 ${
        onToggleVisibility ? 'cursor-pointer hover:bg-gray-50' : ''
      }`}
      onClick={onToggleVisibility || undefined}
      title={onToggleVisibility ? (isHidden ? "Click to show goal" : "Click to hide goal") : undefined}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* Goal Type Icon */}
          <div className="w-8 h-8 flex items-center justify-center">
            <span className="text-2xl">
              {getTypeIcon()}
            </span>
          </div>
          
          {/* Goal Details */}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 truncate mb-1">
              {name}
            </h4>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span className="flex items-center">
                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {account}
              </span>
            </div>
          </div>
        </div>

        {/* Collected/Target Amount and Visibility Indicator */}
        <div className="text-right flex items-center space-x-2">
          <div className="text-xs font-medium text-gray-900">
            {formatCurrencyShort(parseFloat(collected) || 0)} / {formatCurrencyShort(parseFloat(target) || 0)}
          </div>
          {onToggleVisibility && (
            <div className="flex items-center">
              {isHidden ? (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${colors.progress}`}
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium text-gray-900">{progressPercent.toFixed(0)}%</span>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>Monthly: {formatCurrencyShort(parseFloat(monthly) || 0)}</span>
            {time && time !== '-' && (
              <span>Time: {time}</span>
            )}
          </div>
          {deadline && deadline !== '-' && (
            <span>Due: {deadline}</span>
          )}
        </div>
      </div>
    </div>
  );
}
