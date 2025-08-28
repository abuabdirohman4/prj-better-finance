/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Safelist all colors that can be used dynamically
    'text-red-600',
    'text-yellow-500', 
    'text-green-600',
    'bg-red-500',
    'bg-yellow-300',
    'bg-green-500',
    {
      pattern: /(text|bg)-(red|yellow|green)-(300|400|500|600)/,
      variants: ['hover', 'focus']
    }
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
