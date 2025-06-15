
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
        border:     'hsl(var(--border))',
        background: 'hsl(var(--background))',
        card:       'hsl(var(--card))',
        foreground: 'hsl(var(--foreground))',
        muted:      'hsl(var(--muted))',
        accent:     'hsl(var(--accent))',
        input:      'hsl(var(--input))',  // <--- ADDED FOR INPUTS
        // Status
        success:  { DEFAULT: "hsl(var(--color-success))" },
        warning:  { DEFAULT: "hsl(var(--color-warning))" },
        error:    { DEFAULT: "hsl(var(--color-error))" },
        primary: {
          DEFAULT: "hsl(var(--color-primary))", // Royal Blue
          foreground: "hsl(var(--color-primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--color-secondary))", // Sunset Orange
          foreground: "hsl(var(--color-secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--color-muted))",
          foreground: "hsl(var(--color-muted-foreground))"
        },
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

