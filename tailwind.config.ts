
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
        // 1. Brand Colors (Name the essentials)
        primary: {
          DEFAULT: "hsl(var(--color-primary))", // Royal Blue
          foreground: "hsl(var(--color-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--color-secondary))", // Sunset Orange
          foreground: "hsl(var(--color-secondary-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--color-success))",
          foreground: "hsl(var(--color-success-foreground))"
        },
        warning: {
          DEFAULT: "hsl(var(--color-warning))",
          foreground: "hsl(var(--color-warning-foreground))"
        },
        error: {
          DEFAULT: "hsl(var(--color-error))",
          foreground: "hsl(var(--color-error-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--color-muted))",
          foreground: "hsl(var(--color-muted-foreground))"
        },
        background: "hsl(var(--color-background))",
        foreground: "hsl(var(--color-foreground))",
        card: "hsl(var(--color-card))",
        border: "hsl(var(--color-border))",
        input: "hsl(var(--color-input))",
        // Old fallback (remove discrete uses)
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
        md: "0 8px 24px 0 rgba(13,71,161,0.07)", // Slight blue shadow
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
  ],
} satisfies Config;
