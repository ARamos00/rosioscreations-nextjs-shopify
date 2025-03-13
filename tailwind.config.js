const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
      },
      colors: {
        // Primary: Darker color used for text and primary elements
        primary: "#3B3834", // hsl(34, 6%, 21%) | rgb(59, 56, 52)
        // Secondary: Lighter color used for backgrounds and secondary elements
        secondary: "#F8E1D9", // hsl(15, 68%, 91%) | rgb(248, 225, 217)
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      blink: {
        "0%": { opacity: 0.2 },
        "20%": { opacity: 1 },
        "100%": { opacity: 0.2 },
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-in-out",
        blink: "blink 1.4s both infinite",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
          {
            "animation-delay": (value) => ({
              "animation-delay": value,
            }),
          },
          { values: theme("transitionDelay") }
      );
    }),
  ],
};
