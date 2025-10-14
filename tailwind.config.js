/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
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
          primary: "#244D5D",            // Bleu canard
          "primary-content": "#F8F5F2",
          secondary: "#C6A27E",          // Camel
          "secondary-content": "#F8F5F2",
          accent: "#BFC7B0",             // Vert sauge
          neutral: "#6B5440",            // Brun doux
          "base-100": "#F8F5F2",         // Fond beige
          info: "#D9825B",               // Terracotta
          success: "#BFC7B0",
          warning: "#E9A46F",
          error: "#D9825B",
        },
      },
    ],
    base: false,           // 🔸 Empêche DaisyUI d’ajouter son thème par défaut (le violet)
    styled: true,          // Active le style DaisyUI
    darkTheme: "myyogicard", // 🔸 Force ton thème clair/sombre
    logs: false,           // (Optionnel) supprime les logs DaisyUI en console
  },

  plugins: [require("daisyui")],
};
