/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          primary: "var(--color-primary)",
          "primary-hover": "var(--color-primary-hover)",
          bg: "var(--color-bg)",
          card: "var(--color-card)",
          text: "var(--color-text)",
          muted: "var(--color-muted)",
          border: "var(--color-border)",
          accent: "var(--color-accent)",
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
