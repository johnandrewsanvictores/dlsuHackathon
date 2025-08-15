// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          honey: {
            DEFAULT: "#FFC93C",
            50: "#FFF3C6",
            600: "#F5BE28",
          },
          bee: "#1C1C1C",
          soft: "#FDFDFD",
          amber: "#FFB100",
          gray: "#A9A9A9",
        },
      },
      fontSize: {
        h1: "3.815rem",
        h2: "3.052rem",
        h3: "2.441rem",
        h4: "1.953rem",
        h5: "1.563rem",
        h6: "1.25rem",
        p: "1rem",
        small: "0.8rem",
      },
      fontFamily: {
        poppins: ["Poppins", "ui-sans-serif", "system-ui", "sans-serif"],
        roboto: ["Roboto", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
};
