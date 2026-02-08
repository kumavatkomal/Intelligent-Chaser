/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["Inter", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"]
      },
      colors: {
        ink: "#0f172a",
        mist: "#f8fafc",
        tide: "#4f46e5",
        glow: "#4f46e5",
        alert: "#ef4444"
      },
      boxShadow: {
        lift: "0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.06)"
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease-out both"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};
