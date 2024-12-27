import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";

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
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            p: {
              marginTop: '0.5em',
              marginBottom: '0.5em',
            },
            a: {
              color: 'var(--foreground)',
              textDecoration: 'underline',
              '&:hover': {
                opacity: 0.8,
              },
            },
            'ul,ol': {
              paddingLeft: '1.25em',
            },
          },
        },
      },
    },
  },
  plugins: [
    typography,
    animate
  ],
} satisfies Config;
