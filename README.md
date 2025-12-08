# Pieces - Modern Shopify Theme

A high-performance Shopify theme with SPA-like page transitions, smooth scrolling, and advanced animations. Built for brands that demand exceptional user experiences.

## Core Technologies

| Library | Version | Purpose |
|---------|---------|---------|
| [Swup](https://swup.js.org/) | 4.6.1 | SPA page transitions |
| [GSAP](https://gsap.com/) | 3.12.4 | Professional animations |
| [Lenis](https://lenis.darkroom.engineering/) | 1.1.1 | Smooth scrolling |
| [PhotoSwipe](https://photoswipe.com/) | 5.4.4 | Lightbox gallery |
| [Phosphor Icons](https://phosphoricons.com/) | 2.1.2 | Icon system |
| [Tailwind CSS](https://tailwindcss.com/) | 3.4.0 | Utility-first styling |
| [Vite](https://vitejs.dev/) | 5.0.10 | Build tooling |

---

## Page Transitions (Swup)

Seamless page navigation without full page reloads. Three transition styles available:

- **Fade** - Simple crossfade between pages
- **Slide** - Horizontal slide animation
- **Curtain** - Overlay curtain effect

### Swup Plugins Used

| Plugin | Purpose |
|--------|---------|
| [@swup/js-plugin](https://swup.js.org/plugins/js-plugin/) | Custom JavaScript animations |
| [@swup/head-plugin](https://swup.js.org/plugins/head-plugin/) | Meta tag and asset management |
| [@swup/preload-plugin](https://swup.js.org/plugins/preload-plugin/) | Link preloading on hover |
| [@swup/body-class-plugin](https://swup.js.org/plugins/body-class-plugin/) | Dynamic body class updates |
| [@swup/scripts-plugin](https://swup.js.org/plugins/scripts-plugin/) | Script re-execution |

### Content Replaced Handler

Use the global helper to register listeners that won't duplicate on navigation:

```javascript
if (window.onSwupContentReplaced) {
  window.onSwupContentReplaced('unique-key', () => {
    // Re-initialize your component
  });
}
```

---

## Animations (GSAP)

Professional-grade animations powered by GSAP with ScrollTrigger.

### GSAP Plugins

| Plugin | Purpose |
|--------|---------|
| [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) | Scroll-based animations |
| [SplitText](https://gsap.com/docs/v3/Plugins/SplitText/) | Text line/word/character splitting |
| [Flip](https://gsap.com/docs/v3/Plugins/Flip/) | Layout animations |

### Data Attribute Animation System

Add animations declaratively via HTML attributes:

```html
<!-- Fade up on scroll -->
<div data-intro>Content reveals when scrolled into view</div>

<!-- Custom reveal animation -->
<div data-reveal="fade-up" data-reveal-delay="0.2" data-reveal-duration="0.8">

<!-- Staggered children -->
<div data-stagger="0.1">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

<!-- Parallax effect -->
<img data-parallax="0.5" src="...">

<!-- Split text reveal -->
<h2 data-split-text data-split-stagger="0.1">Animated Heading</h2>
```

### Available Reveal Types

- `fade`, `fade-up`, `fade-down`, `fade-left`, `fade-right`
- `scale`, `scale-up`, `scale-down`
- `clip-up`, `clip-down`, `clip-left`, `clip-right`

---

## Smooth Scrolling (Lenis)

Buttery smooth scrolling with GSAP ScrollTrigger integration.

### Features

- 1.2s duration with exponential easing
- Automatic GSAP ticker synchronization
- Respects `prefers-reduced-motion`
- Anchor link smooth scrolling
- Pause during modal/drawer interactions

### Prevent Scroll

Add to any element to prevent smooth scroll behavior:

```html
<div data-lenis-prevent>
  <!-- Content with native scrolling -->
</div>
```

---

## Cart System

Three cart types available via theme settings:

| Type | Behavior |
|------|----------|
| **Drawer** | Slide-out cart drawer (default) |
| **Page** | Redirect to /cart page |
| **Notification** | Toast notification on add |

### Cart State API

```javascript
// Get cart state singleton
const cart = window.pieces.cartState;

// Add item
await cart.addItem(variantId, quantity);

// Update quantity
await cart.updateLine(lineIndex, quantity);

// Subscribe to changes
cart.subscribe((cartData) => {
  console.log('Cart updated:', cartData);
});
```

### Cart Events

```javascript
document.addEventListener('cart:refresh', () => {});
document.addEventListener('cart:open', () => {});
document.addEventListener('cart:notification', (e) => {
  console.log(e.detail.product, e.detail.cart);
});
```

---

## Sections (44 Total)

### Hero & Landing
- `hero` - Full-viewport hero with image/video
- `hero-orbit` - Animated orbiting elements
- `banner` - Smaller promotional banner

### Products & Collections
- `product` - Product page with variants, gallery
- `collection` - Collection with filtering
- `collections` - Collection list/grid
- `featured-collection` - Featured product grid
- `related-products` - Related products carousel

### Interactive
- `hotspots` - Clickable image hotspots
- `shop-the-look` - Shoppable image overlays
- `before-after` - Image comparison slider
- `shoppable-videos` - Video with product tags
- `pinned-image-reveal` - Scrollytelling layout

### Content
- `image-with-text` - Split image + text
- `text-reveal` - Animated text on scroll
- `video` - Video player section
- `testimonials` - Customer testimonials
- `faq` - Accordion FAQ
- `team` - Team member grid

### Animation Showcase
- `stacking-cards` - Scroll-stacking cards
- `rolling-numbers` - Animated counters
- `horizontal-scroll` - Horizontal gallery
- `marquee` - Scrolling text ticker
- `logo-marquee` - Infinite logo carousel

### Conversion
- `newsletter` - Email signup forms
- `contact-form` - Contact form
- `countdown` - Launch countdown

### Structure
- `header` - Navigation header
- `footer` - Site footer
- `page` - Generic page template
- `404` - Not found page

---

## Styling

### Tailwind CSS First

Use Tailwind utilities with CSS variables:

```html
<div class="bg-[--color-background] text-[--color-text] rounded-[--card-radius]">
```

### CSS Variables

Generated from theme settings:

```css
/* Colors */
--color-background
--color-background-secondary
--color-text
--color-text-secondary
--color-primary
--color-primary-contrast
--color-border
--color-sale

/* Typography */
--font-body
--font-heading
--body-font-scale
--heading-font-scale

/* Layout */
--page-max-width
--page-padding
--section-vertical-padding

/* Components */
--button-radius
--card-radius
--input-radius
```

### Container Classes

```html
<div class="page-container">Centered with max-width</div>
<div class="page-full">Full width with padding</div>
```

---

## Global API

### Window Objects

```javascript
// Theme settings
window.themeSettings = {
  enableSmoothScroll: boolean,
  enableAnimations: boolean,
  enablePageTransitions: boolean,
  pageTransitionStyle: 'slide' | 'fade' | 'curtain',
  cartType: 'drawer' | 'page' | 'notification',
  moneyFormat: string
};

// Animation check
window.shouldAnimate(); // Returns boolean

// Manager access
window.pieces = {
  lenis,
  swup,
  animation,
  cartState,
  gsap,
  ScrollTrigger,
  SplitText
};

// Cart drawer controls
window.openCartDrawer();
window.closeCartDrawer();
window.refreshCartDrawer();
```

---

## Development

### Prerequisites

- Node.js 18+
- Shopify CLI
- Theme access credentials

### Scripts

```bash
# Install dependencies
npm install

# Development (Vite + Shopify theme dev)
npm run develop

# Build for production
npm run build

# Watch mode
npm run watch

# Theme commands
npm run theme:dev      # Preview theme
npm run theme:push     # Push to Shopify
npm run theme:pull     # Pull from Shopify
npm run theme:check    # Lint theme
```

### File Structure

```
pieces/
├── assets/              # Compiled JS/CSS, fonts, images
├── config/              # Theme settings schema
├── frontend/
│   ├── css/            # Source CSS (Tailwind)
│   └── js/
│       ├── app.js      # Entry point
│       └── managers/   # Feature modules
├── layout/             # Theme layouts
├── locales/            # Translation files
├── sections/           # Liquid sections
├── snippets/           # Reusable partials
├── templates/          # Page templates
└── package.json
```

---

## Performance

### Optimizations

- **Lazy Loading** - Native `loading="lazy"` on images
- **Responsive Images** - Srcset with multiple sizes
- **Deferred Scripts** - Non-blocking script loading
- **Font Preloading** - Critical fonts preloaded
- **ScrollTrigger Cleanup** - Proper cleanup between pages
- **Swup Cache** - Intelligent page caching

### Animation Performance

- Hardware-accelerated transforms
- Will-change hints where appropriate
- Respects `prefers-reduced-motion`
- Font loading synchronization

---

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Skip-to-content link
- Focus management in modals
- Keyboard navigation support
- Color contrast compliance
- Screen reader optimizations

---

## Internationalization

All user-facing text uses Shopify's translation system:

```liquid
{{ 'products.product.add_to_cart' | t }}
```

Translation files located in `/locales/`.

---

## Theme Settings

Configurable via Shopify theme customizer:

| Section | Options |
|---------|---------|
| **Logo** | Image, sizing, favicon |
| **Colors** | Background, text, primary, borders |
| **Typography** | Font families, size scaling |
| **Layout** | Page width, padding, smooth scroll |
| **Buttons** | Radius, border, shadow |
| **Cards** | Radius, border, shadow |
| **Inputs** | Radius, border width |
| **Cart** | Drawer, page, or notification |
| **Social** | Social media links |

---

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

---

## License

**Proprietary License**

Copyright (c) 2024 [SEAPIXEL](https://seapixel.com). All rights reserved.

This software and associated documentation files (the "Software") are the exclusive property of SEAPIXEL. The Software is protected by copyright laws and international treaty provisions.

**You may NOT:**
- Copy, modify, or distribute the Software
- Reverse engineer, decompile, or disassemble the Software
- Sublicense, sell, resell, or transfer the Software
- Use the Software to create derivative works
- Remove or alter any proprietary notices

**Usage:** This Software may only be used with a valid license purchased from SEAPIXEL. Unauthorized reproduction, distribution, or use of this Software is strictly prohibited and may result in severe civil and criminal penalties.

For licensing inquiries, visit [seapixel.com](https://seapixel.com) or contact the owner directly.
