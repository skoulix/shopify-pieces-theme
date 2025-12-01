/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './layout/**/*.liquid',
    './templates/**/*.liquid',
    './sections/**/*.liquid',
    './snippets/**/*.liquid',
    './frontend/**/*.{js,css}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-body-family)', 'sans-serif'],
        heading: ['var(--font-heading-family)', 'sans-serif'],
      },
      colors: {
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        button: 'rgb(var(--color-button) / <alpha-value>)',
        'button-text': 'rgb(var(--color-button-text) / <alpha-value>)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      transitionDuration: {
        600: '600ms',
        800: '800ms',
        1000: '1000ms',
        1200: '1200ms',
      },
    },
  },
  plugins: [],
  // Preserve Dawn's existing classes
  corePlugins: {
    preflight: false,
  },
};
