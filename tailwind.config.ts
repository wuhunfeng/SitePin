import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "zoom-in": {
          from: { transform: "scale(0.95)" },
          to: { transform: "scale(1)" },
        },
        "slide-in": {
          from: { transform: "translateY(10px)" },
          to: { transform: "translateY(0)" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "zoom-out": {
          from: { transform: "scale(1)" },
          to: { transform: "scale(0.95)" },
        },
        "slide-out": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(10px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "zoom-in": "zoom-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out",
        "zoom-out": "zoom-out 0.3s ease-out",
        "slide-out": "slide-out 0.3s ease-out",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
