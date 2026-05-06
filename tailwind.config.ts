import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Mint/teal — primary, copied from getrevalue.com palette
        mint: {
          50: "#E6FBF5",
          100: "#CFF7EA",
          200: "#9FEFD5",
          300: "#5DDBB7",
          400: "#2BD2A4",
          500: "#11CB9D",
          600: "#0FA085",
          700: "#0C8270",
          800: "#0A6457",
          900: "#06443B",
        },
        // Slate matches Tailwind's defaults; aliasing only what the design uses.
        ink: "#1A202C",
        body: "#2D3748",
        muted: "#4A5568",
        soft: "#718096",
        line: "#E2E8F0",
        cream: "#F7FAFC",
        sand: "#EDF2F7",
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "12px",
        "2xl": "20px",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        scrollIn: "scrollIn 0.6s ease forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        scrollIn: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      boxShadow: {
        soft: "0 4px 15px rgba(17, 203, 157, 0.3)",
        softHover: "0 8px 25px rgba(17, 203, 157, 0.4)",
        cardHover: "0 20px 40px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
