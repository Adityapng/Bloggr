import { violet, blackA, mauve, green, gray } from "@radix-ui/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.jsx"],
  theme: {
    extend: {
      colors: {
        ...mauve,
        ...violet,
        ...green,
        ...blackA,
        ...gray,
      },
      keyframes: {
        overlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        contentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
      },
      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [
    typography,
    // ✅ ADD THIS PLUGIN FUNCTION
    function ({ addVariant }) {
      addVariant("radix-state-active", '&[data-state="active"]');
      addVariant("radix-state-inactive", '&[data-state="inactive"]');
      addVariant("radix-state-open", '&[data-state="open"]');
      addVariant("radix-state-closed", '&[data-state="closed"]');
      // You can add more for other Radix states like 'checked', 'unchecked', 'on', 'off'
    },
  ],
};
