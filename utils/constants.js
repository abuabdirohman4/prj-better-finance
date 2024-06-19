export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const categories = {
  Living: [
    "Charge",
    "Children",
    "Credit",
    "Food",
    "Groceries",
    "Grab Credit",
    "Health",
    "Transport",
    "Other Spend",
  ],
  Saving: ["AP", "AR", "Emergency", "Investment", "Retained", "Wishlist"],
  Investing: ["Business", "Knowledge", "Tools", "Subscribe"],
  Giving: [
    "Infaq Rezeki",
    "Tax Salary",
    "Shodaqoh",
    // "Orang Tua",
    // "Saudara",
    // "Lain-lain",
  ],
};

const Earning = [
  "Salary",
  "Business",
  "Investment",
  "Other Earn",
  "Emergency",
  "Saving",
  "Retained",
  "Interest",
  "AP",
  "AR",
];

export const SESSIONKEY = {
  clientId: "clientId",
  categories: "categories",
  categoryGroup: "category_group",
  currentMonthBudgetPage: "current_mont_budget_page",
  pockets: "pockets",
  summary: "summary",
  transactionsInYear: "transactions_in_year",
  transactions: "transactions",
};


export const styleSelect = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#f9fafb", // bg-gray-50
    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db", // focus:border-blue-500 or border-gray-300
    color: state.isFocused ? "#ffffff" : "#111827", // text-white or text-gray-900
    fontSize: "14px", // text-sm
    borderRadius: "0.5rem", // rounded-lg
    boxShadow: state.isFocused ? "0 0 0 1px #3b82f6" : null, // focus:ring-blue-500
    width: "100%", // w-full
    padding: "0.125rem 0", // py-5 px-0
  }),
  option: (base, state) => ({
    ...base,
    fontSize: "14px", // text-sm
    backgroundColor: state.isFocused && "#1d4ed8", // bg-blue-799
    color: state.isFocused ? "#ffffff" : "#111827", // text-white or text-gray-900
  }),
};