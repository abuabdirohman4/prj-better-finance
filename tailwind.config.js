/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    safelist: [
        // Account logo colors
        "text-gray-600",
        "text-red-600",
        "text-blue-600",
        "text-yellow-600",
        "text-orange-600",
        "text-purple-600",
        "text-teal-600",
        "text-green-600",
        "text-indigo-600",
        "text-emerald-600",
        "text-rose-600",

        // Account background colors
        "bg-red-600",
        "bg-blue-600",
        "bg-yellow-600",
        "bg-orange-500",
        "bg-purple-600",
        "bg-teal-500",
        "bg-green-600",
        "bg-indigo-600",
        "bg-purple-500",
        "bg-emerald-600",
        "bg-rose-600",
        "bg-gray-500",

        // Account color schemes
        "bg-gray-50",
        "bg-gray-200",
        "text-gray-800",
        "bg-red-50",
        "bg-red-200",
        "text-red-800",
        "bg-blue-50",
        "bg-blue-200",
        "text-blue-800",
        "bg-yellow-50",
        "bg-yellow-200",
        "text-yellow-800",
        "bg-orange-50",
        "bg-orange-200",
        "text-orange-800",
        "bg-purple-50",
        "bg-purple-200",
        "text-purple-800",
        "bg-teal-50",
        "bg-teal-200",
        "text-teal-800",
        "bg-green-50",
        "bg-green-200",
        "text-green-800",
        "bg-indigo-50",
        "bg-indigo-200",
        "text-indigo-800",
        "bg-emerald-50",
        "bg-emerald-200",
        "text-emerald-800",
        "bg-rose-50",
        "bg-rose-200",
        "text-rose-800",

        // Pattern for any missing colors
        {
            pattern:
                /(text|bg)-(gray|red|blue|yellow|orange|purple|teal|green|indigo|emerald|rose)-(50|100|200|300|400|500|600|700|800|900)/,
            variants: ["hover", "focus"],
        },
    ],

    theme: {
        extend: {
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic":
                    "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                welcome: "url('/img/welcome.svg')",
            },
        },
    },
    plugins: [],
};
