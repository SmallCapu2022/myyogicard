/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        camel: "#C6A27E",
        tealdeep: "#264653",
        sage: "#BFC7B0",
        terracotta: "#D9825B",
        beige: "#F8F5F2",
        cream: "#FAF8F5",
        brownsoft: "#6B5440",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        serif: ["Playfair Display", "serif"],
      },
    },
  },
  daisyui: {
    themes: [
      {
        myyogicard: {
          primary: "#264653",
          "primary-content": "#F8F5F2",
          secondary: "#C6A27E",
          "secondary-content": "#F8F5F2",
          accent: "#BFC7B0",
          neutral: "#6B5440",
          "base-100": "#F8F5F2",
          info: "#D9825B",
          success: "#BFC7B0",
          warning: "#E9A46F",
          error: "#D9825B",
        },
      },
    ],
    darkTheme: "myyogicard",
  },
  plugins: [require("daisyui")],
};
