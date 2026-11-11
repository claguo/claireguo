/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Kosugi Maru"],
        sans: ["Inter"],
        kosugi: ["Kosugi Maru"],
      },
      colors: {
        "bg-white": "#FFFFFF",
        "bg-gray": "#ffffff",

        "text-default": "#000000",
        "text-subtle": "#666666",

        blue: "#248EFF",
        pink: "#FF6BE1",
        "pink-light": "#FF79E4",
        green: "#00CE7F",

        "border-default": "#D0D0E2",

        "text-mochi": "#5447FF",
        "border-mochi": "#6B60FF",
        "bg-mochi": "#6B60FF26",

        "text-a11y": "#BD5500",
        "border-a11y": "#FF9E34",
        "bg-a11y": "#FF9E3426",

        "text-eto": "#0C56DC",
        "border-eto": "#0C56DC",
        "bg-eto": "#0C56DC26",

        "text-blooms": "#DA1699",
        "border-blooms": "#FF3EBF",
        "bg-blooms": "#FF3EBF26",

        "text-stardrift": "#BD2717",
        "border-stardrift": "#E12D19",
        "bg-stardrift": "#E12D1926",
      },
      fontSize: {
        xs: "0.75rem",
        sm: "1rem",
        md: "1.5rem",
        lg: "2.5rem",
        xl: "4rem",
      },
      borderRadius: {
        md: "0.5rem",
      },
      spacing: {
        "5xs": "2px",
        "4xs": "4px",
        "3xs": "8px",
        "2xs": "12px",
        xs: "16px",
        sm: "24px",
        md: "32px",
        lg: "40px",
        xl: "48px",
        "2xl": "64px",
        "3xl": "72px",
        "4xl": "96px",
      },
    },
  },
  plugins: [],
};

// old green: #00D287
