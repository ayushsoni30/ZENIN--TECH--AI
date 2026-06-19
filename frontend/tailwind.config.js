/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        // Display font for headings and logo
        display: ["'Space Grotesk'", "sans-serif"],
        // Mono for code blocks
        mono: ["'JetBrains Mono'", "monospace"],
        // Body text
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        // Our brand green palette
        brand: {
          50:  "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        // Dark surface colors for the UI
        surface: {
          900: "#0a0a0f",
          800: "#111118",
          700: "#1a1a26",
          600: "#22223a",
          500: "#2d2d4a",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "typing": "typing 1.2s steps(3, end) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        typing: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      // Typography plugin customization
      typography: (theme) => ({
        // Green theme for prose (prose-green)
        green: {
          css: {
            "--tw-prose-body": theme("colors.slate[300]"),
            "--tw-prose-headings": theme("colors.green[400]"),
            "--tw-prose-lead": theme("colors.slate[300]"),
            "--tw-prose-links": theme("colors.green[400]"),
            "--tw-prose-bold": theme("colors.green[300]"),
            "--tw-prose-counters": theme("colors.green[500]"),
            "--tw-prose-bullets": theme("colors.green[500]"),
            "--tw-prose-hr": theme("colors.surface[500]"),
            "--tw-prose-quotes": theme("colors.slate[300]"),
            "--tw-prose-quote-borders": theme("colors.green[500]"),
            "--tw-prose-captions": theme("colors.slate[400]"),
            "--tw-prose-code": theme("colors.green[300]"),
            "--tw-prose-pre-code": theme("colors.slate[200]"),
            "--tw-prose-pre-bg": theme("colors.surface[700]"),
            "--tw-prose-th-borders": theme("colors.surface[500]"),
            "--tw-prose-td-borders": theme("colors.surface[600]"),
          },
        },
        // Invert theme (for dark backgrounds)
        invert: {
          css: {
            "--tw-prose-body": theme("colors.slate[300]"),
            "--tw-prose-headings": theme("colors.white"),
            "--tw-prose-links": theme("colors.green[400]"),
            "--tw-prose-bold": theme("colors.white"),
            "--tw-prose-code": theme("colors.green[300]"),
            "--tw-prose-pre-bg": "#1e1e2e",
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
