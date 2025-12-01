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
        'background-contrast': 'rgb(var(--color-background-contrast) / <alpha-value>)',
        button: 'rgb(var(--color-button) / <alpha-value>)',
        'button-text': 'rgb(var(--color-button-text) / <alpha-value>)',
        'secondary-button': 'rgb(var(--color-secondary-button) / <alpha-value>)',
        'secondary-button-text': 'rgb(var(--color-secondary-button-text) / <alpha-value>)',
        link: 'rgb(var(--color-link) / <alpha-value>)',
        badge: {
          foreground: 'rgb(var(--color-badge-foreground) / <alpha-value>)',
          background: 'rgb(var(--color-badge-background) / <alpha-value>)',
          border: 'rgb(var(--color-badge-border) / <alpha-value>)',
        },
        shadow: 'rgb(var(--color-shadow) / <alpha-value>)',
      },
      spacing: {
        'page': 'var(--page-width)',
        'section-mobile': 'var(--spacing-sections-mobile)',
        'section-desktop': 'var(--spacing-sections-desktop)',
        'grid-mobile': 'var(--grid-mobile-horizontal-spacing)',
        'grid-desktop': 'var(--grid-desktop-horizontal-spacing)',
        'media-padding': 'var(--media-padding)',
        'image-padding': 'var(--image-padding)',
      },
      maxWidth: {
        'page': 'var(--page-width)',
      },
      borderRadius: {
        'card': 'var(--border-radius)',
        'product-card': 'var(--product-card-corner-radius)',
        'collection-card': 'var(--collection-card-corner-radius)',
        'blog-card': 'var(--blog-card-corner-radius)',
        'button': 'var(--buttons-radius)',
        'input': 'var(--inputs-radius)',
        'badge': 'var(--badge-corner-radius)',
        'popup': 'var(--popup-corner-radius)',
        'media': 'var(--media-radius)',
        'text-box': 'var(--text-boxes-radius)',
        'variant-pill': 'var(--variant-pills-radius)',
      },
      borderWidth: {
        'card': 'var(--border-width)',
        'button': 'var(--buttons-border-width)',
        'input': 'var(--inputs-border-width)',
        'media': 'var(--media-border-width)',
        'popup': 'var(--popup-border-width)',
        'drawer': 'var(--drawer-border-width)',
        'variant-pill': 'var(--variant-pills-border-width)',
      },
      boxShadow: {
        'card': 'var(--shadow-horizontal-offset) var(--shadow-vertical-offset) var(--shadow-blur-radius) rgba(var(--color-shadow), var(--shadow-opacity))',
        'button': 'var(--buttons-shadow-horizontal-offset) var(--buttons-shadow-vertical-offset) var(--buttons-shadow-blur-radius) rgba(var(--color-shadow), var(--buttons-shadow-opacity))',
        'input': 'var(--inputs-shadow-horizontal-offset) var(--inputs-shadow-vertical-offset) var(--inputs-shadow-blur-radius) rgba(var(--color-shadow), var(--inputs-shadow-opacity))',
        'popup': 'var(--popup-shadow-horizontal-offset) var(--popup-shadow-vertical-offset) var(--popup-shadow-blur-radius) rgba(var(--color-shadow), var(--popup-shadow-opacity))',
        'drawer': 'var(--drawer-shadow-horizontal-offset) var(--drawer-shadow-vertical-offset) var(--drawer-shadow-blur-radius) rgba(var(--color-shadow), var(--drawer-shadow-opacity))',
        'media': 'var(--media-shadow-horizontal-offset) var(--media-shadow-vertical-offset) var(--media-shadow-blur-radius) rgba(var(--color-shadow), var(--media-shadow-opacity))',
      },
      fontSize: {
        'body': ['calc(var(--font-body-scale) * 1rem)', { lineHeight: 'calc(1 + 0.8 / var(--font-body-scale))' }],
        'heading': ['calc(var(--font-heading-scale) * 1rem)', { lineHeight: '1.2' }],
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-expo': 'cubic-bezier(0.87, 0, 0.13, 1)',
      },
      transitionDuration: {
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
        '1200': '1200ms',
      },
      aspectRatio: {
        'card': 'var(--ratio-percent)',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
