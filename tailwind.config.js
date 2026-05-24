/** @type {import('tailwindcss').Config} */

// Helper: CSS variables hold space-separated RGB channels, so we wrap them
// with rgb(... / <alpha-value>) to enable opacity modifiers like bg-primary/10.
const withAlpha = (v) => `rgb(var(${v}) / <alpha-value>)`;

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    container: { center: true, padding: '1rem' },
    extend: {
      colors: {
        background: withAlpha('--background'),
        'background-alt': withAlpha('--background-alt'),
        foreground: withAlpha('--foreground'),
        primary: {
          DEFAULT: withAlpha('--primary'),
          dark: withAlpha('--primary-dark'),
          light: withAlpha('--primary-light'),
          foreground: withAlpha('--primary-foreground'),
        },
        secondary: {
          DEFAULT: withAlpha('--secondary'),
          foreground: withAlpha('--secondary-foreground'),
        },
        accent: {
          DEFAULT: withAlpha('--accent'),
          foreground: withAlpha('--accent-foreground'),
        },
        muted: {
          DEFAULT: withAlpha('--muted'),
          foreground: withAlpha('--muted-foreground'),
        },
        card: {
          DEFAULT: withAlpha('--card'),
          foreground: withAlpha('--card-foreground'),
        },
        border: withAlpha('--border'),
        input: withAlpha('--input'),
        ring: withAlpha('--ring'),
        critical: withAlpha('--critical'),
        low: withAlpha('--low'),
        available: withAlpha('--available'),
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 2px)',
        '2xl': 'calc(var(--radius) + 6px)',
        '3xl': 'calc(var(--radius) + 12px)',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)', 'sans-serif'],
        mono: ['var(--font-ibm-plex-mono)', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(15,16,28,0.06), 0 1px 2px -1px rgba(15,16,28,0.06)',
        'card-md': '0 4px 12px -2px rgba(15,16,28,0.08), 0 2px 6px -2px rgba(15,16,28,0.06)',
        'card-lg': '0 16px 40px -12px rgba(15,16,28,0.18), 0 4px 10px -4px rgba(15,16,28,0.08)',
        'red-glow': '0 8px 28px -6px rgba(192,57,43,0.45)',
        'accent-glow': '0 8px 28px -6px rgba(14,165,163,0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-gentle': 'bounce 2s infinite',
        float: 'float 6s ease-in-out infinite',
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(to right, rgba(120,120,140,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(120,120,140,0.06) 1px, transparent 1px)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
};
