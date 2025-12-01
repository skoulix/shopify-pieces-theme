# Pieces Theme - Frontend Development Guide

A modern Shopify theme based on Dawn with SPA-like navigation and smooth animations.

## Tech Stack

- **[piecesjs](https://github.com/piecesjs/piecesjs)** - Lightweight web components framework
- **[Swup](https://swup.js.org/)** - Page transitions via AJAX
- **[Lenis](https://github.com/darkroomengineering/lenis)** - Smooth scrolling
- **[GSAP](https://gsap.com/)** - Professional animations
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Vite](https://vitejs.dev/)** - Fast build tool

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Development with hot reload
npm run dev

# Build for production
npm run build

# Watch mode (rebuild on changes)
npm run watch
```

### Output

The build outputs to the `assets/` folder:
- `pieces-app.js` - Main JavaScript bundle
- `pieces-app.css` - Compiled CSS with Tailwind

## Architecture

### Directory Structure

```
frontend/
├── css/
│   ├── base/
│   │   ├── reset.css       # Lenis CSS overrides
│   │   ├── transitions.css # Swup page transitions
│   │   └── animations.css  # GSAP animation states
│   └── app.css             # Main CSS entry
└── js/
    ├── components/         # piecesjs components
    │   ├── Header.js
    │   ├── Hero.js
    │   ├── ProductCard.js
    │   ├── ScrollReveal.js
    │   ├── ImageReveal.js
    │   └── Magnetic.js
    ├── managers/           # Core managers
    │   ├── LenisManager.js
    │   ├── SwupManager.js
    │   └── AnimationManager.js
    └── app.js              # Main entry point
```

## Creating Components

### Basic piecesjs Component

```javascript
import { Piece } from 'piecesjs';
import { gsap } from 'gsap';

class MyComponent extends Piece {
  constructor() {
    super('MyComponent', {
      stylesheets: [], // Optional: dynamic CSS imports
    });
  }

  mount() {
    // Called when component is added to DOM
    this.$button = this.$('button')[0];
    this.on('click', this.$button, this.handleClick);
  }

  unmount() {
    // Called when component is removed from DOM
    this.off('click', this.$button, this.handleClick);
  }

  handleClick() {
    console.log('Clicked!');
  }
}

customElements.define('c-my-component', MyComponent);
export default MyComponent;
```

### Register Component in app.js

```javascript
import { loadDynamically } from 'piecesjs';

loadDynamically('c-my-component', () => import('./components/MyComponent.js'));
```

### Use in Liquid

```liquid
<c-my-component>
  <button>Click me</button>
</c-my-component>
```

## Animation Utilities

### Scroll Reveal

Add `data-reveal` attribute for scroll-triggered animations:

```html
<div data-reveal="fade-up" data-reveal-delay="0.2">
  Content reveals on scroll
</div>
```

**Animation types:**
- `fade` - Fade in
- `fade-up` - Fade + slide up
- `fade-down` - Fade + slide down
- `fade-left` - Fade + slide from right
- `fade-right` - Fade + slide from left
- `scale` - Fade + scale up
- `clip` - Clip reveal horizontal
- `clip-up` - Clip reveal from bottom

### Stagger Animations

```html
<div data-stagger="0.1">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Parallax

```html
<div data-parallax="0.5">
  Parallax element (0.5 = 50% speed)
</div>
```

## Page Transitions

Swup automatically handles page transitions. Links are intercepted and pages load via AJAX.

### Exclude Links from Swup

```html
<a href="/checkout" data-no-swup>Checkout</a>
```

### Transition Container

The `#swup-container` in theme.liquid wraps content that gets swapped:

```liquid
<div id="swup-container" class="transition-fade">
  {{ content_for_layout }}
</div>
```

### Custom Transition Hooks

```javascript
// Listen for page transitions
window.addEventListener('swup:contentReplaced', () => {
  // Re-initialize your custom code
});
```

## Smooth Scrolling

Lenis handles smooth scrolling. Access via global:

```javascript
// Scroll to element
window.pieces.lenis.scrollTo('#section');

// Scroll to position
window.pieces.lenis.scrollTo(500);

// Stop/start scrolling
window.pieces.lenis.stop();
window.pieces.lenis.start();
```

### Disable for Specific Elements

```html
<div data-lenis-prevent>
  No smooth scroll inside here
</div>
```

## Liquid Snippets

### Hero Section

```liquid
{% render 'pieces-hero',
  title: 'Welcome',
  subtitle: 'Discover our collection',
  cta_text: 'Shop Now',
  cta_link: '/collections/all',
  image: section.settings.image,
  height: 'full',
  parallax: true
%}
```

### Product Card

```liquid
{% render 'pieces-product-card',
  product: product,
  show_secondary_image: true,
  show_quick_add: true,
  reveal_animation: 'fade-up',
  reveal_delay: 0.1
%}
```

### Scroll Reveal Wrapper

```liquid
<c-scroll-reveal data-animation="fade-up" data-stagger="0.1">
  <div>Staggered item 1</div>
  <div>Staggered item 2</div>
  <div>Staggered item 3</div>
</c-scroll-reveal>
```

### Image Reveal

```liquid
{% render 'pieces-image-reveal',
  image: section.settings.image,
  direction: 'up',
  duration: 1.2,
  aspect_ratio: '16/9'
%}
```

## Accessibility

- Respects `prefers-reduced-motion` - animations disabled when set
- All interactive elements are keyboard accessible
- Swup maintains focus management during transitions
- Screen reader announcements for page transitions

## Theme Editor Compatibility

The theme works with Shopify's theme editor:
- Components reinitialize on section add/remove/reorder
- Animations refresh on section changes
- No need to reload the page in the editor

## Debugging

Access managers via console:

```javascript
window.pieces.lenis    // Lenis instance
window.pieces.swup     // Swup instance
window.pieces.animation // AnimationManager
window.pieces.gsap     // GSAP
window.pieces.ScrollTrigger
```

## Performance Tips

1. Use `loading="lazy"` on images below the fold
2. Components are code-split - only loaded when used
3. Animations use GPU-accelerated properties (transform, opacity)
4. Swup preloads visible links automatically

## Resources

- [piecesjs Documentation](https://piecesjs.github.io/piecesjs/)
- [Swup Documentation](https://swup.js.org/)
- [GSAP Documentation](https://gsap.com/docs/)
- [Lenis Documentation](https://github.com/darkroomengineering/lenis)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Codrops Case Study](https://tympanus.net/codrops/2025/11/28/the-geometry-of-movement-a-shopify-powered-digital-tribute-to-raymond-templiers-modernist-vision/)
