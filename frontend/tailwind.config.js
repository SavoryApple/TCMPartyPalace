/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vanilla: "#D7D9B1",
        carolina: "#84ACCE",
        violet: "#827191",
        claret: "#7D1D3F",
        seal: "#512500",
      },
    },
  },
  plugins: [],
}