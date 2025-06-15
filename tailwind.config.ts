
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
        // Branding
        primary: { DEFAULT: '#0D47A1' }, // Royal Blue
        accent:  { DEFAULT: '#FF6D00' }, // Sunset Orange
        background: '#FFFFFF', // Pure White
        'bg-secondary': '#F5F5F5',
        'text-dark': '#1C1C1C',
        // Gray/Neutral for borders & subtle backgrounds
        muted:  '#ECECEC',
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
        md: "0 8px 24px 0 rgba(13,71,161,0.07)",   // Royal soft
        lg: "0 16px 40px 0 rgba(13,71,161,0.15)",  // deeper on hover
      },
      // Responsive font sizing
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
