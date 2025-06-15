
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        // shadcn/ui system tokens
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        // Custom branding
        "bg-secondary": "#F5F5F5",
        "text-dark": "#1C1C1C",
      },
      fontFamily: {
        heading: ["Montserrat", "Arial", "sans-serif"],
        body: ["Inter", "Poppins", "Arial", "sans-serif"],
      },
      borderRadius: {
        xl: "1.5rem",
        '2xl': "2rem",
      },
      boxShadow: {
        md: "0 8px 24px 0 rgba(13,71,161,0.07)",
        lg: "0 16px 40px 0 rgba(13,71,161,0.15)",
      },
      fontSize: {
        'display': ['clamp(2.2rem, 6vw, 3.8rem)', { lineHeight: '1.1', fontWeight: '700', letterSpacing: '-.03em' }],
      },
      animation: {
        'fade-in': "fade-in .4s cubic-bezier(.4,0,.6,1) both",
      },
      keyframes: {
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } }
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Optionally add line-clamp/typography plugins
  ],
} satisfies Config;
