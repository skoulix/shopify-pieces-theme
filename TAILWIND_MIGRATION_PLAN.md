# Tailwind CSS Migration Plan for Pieces Theme

## Overview

The Pieces theme currently loads **66 CSS files** (~383KB total) inherited from Dawn. This plan outlines how to systematically replace these with Tailwind utility classes, reducing complexity and file size.

---

## Phase 1: CSS Audit Results

### Files Always Loaded (Critical Path)
These are loaded on every page via `theme.liquid`:

| File | Size | Priority | Notes |
|------|------|----------|-------|
| `base.css` | 80.4 KB | HIGH | Core styles, typography, utilities - **migrate first** |
| `pieces-app.css` | 10.8 KB | KEEP | Your Tailwind output - this stays |
| `component-cart-items.css` | 6.1 KB | MEDIUM | Lazy-loaded, cart functionality |
| `component-cart-drawer.css` | 7.6 KB | MEDIUM | Conditional (drawer cart only) |
| `component-cart.css` | 3.3 KB | MEDIUM | Conditional |
| `component-totals.css` | 2.1 KB | LOW | Small, cart-specific |
| `component-price.css` | 3.8 KB | HIGH | Used everywhere |
| `component-discounts.css` | 1.2 KB | LOW | Small |

### High-Impact Component Files
These are loaded frequently across multiple sections:

| File | Size | Used By | Priority |
|------|------|---------|----------|
| `component-card.css` | 14.1 KB | Product cards, collections, search | **HIGH** |
| `component-slider.css` | 9.4 KB | Featured collection, slideshow, multicolumn | MEDIUM |
| `component-facets.css` | 25.7 KB | Collection, search filtering | MEDIUM |
| `section-image-banner.css` | 10.2 KB | Homepage banners, slideshow | MEDIUM |

### Section-Specific Files (Lower Priority)
These are only loaded on specific pages:

| File | Size | Page |
|------|------|------|
| `section-main-product.css` | 32.3 KB | Product pages |
| `customer.css` | 13.2 KB | Account pages |
| `template-collection.css` | 4.8 KB | Collection pages |
| `section-footer.css` | 9.5 KB | All pages (but isolated) |

### Potentially Removable Files
These may not be used or can be easily replaced:

| File | Size | Reason |
|------|------|--------|
| `mask-blobs.css` | 12.1 KB | Decorative only, optional feature |
| `quick-order-list.css` | 12.1 KB | B2B feature, may not be used |
| `quantity-popover.css` | 3.4 KB | Niche feature |
| `collapsible-content.css` | 2.8 KB | Single section |

---

## Phase 2: Migration Strategy

### Step 1: Extend Tailwind Config
Add Dawn's CSS variables to Tailwind so they're available as utilities:

```js
// tailwind.config.js additions
theme: {
  extend: {
    spacing: {
      'section-mobile': 'var(--spacing-sections-mobile)',
      'section-desktop': 'var(--spacing-sections-desktop)',
      'page-width': 'var(--page-width)',
    },
    borderRadius: {
      'card': 'var(--border-radius)',
      'button': 'var(--buttons-radius)',
      'input': 'var(--inputs-radius)',
    },
    boxShadow: {
      'card': 'var(--shadow-horizontal-offset) var(--shadow-vertical-offset) var(--shadow-blur-radius) rgba(var(--color-shadow), var(--shadow-opacity))',
    },
  },
}
```

### Step 2: Create Base Layer Styles
Replace `base.css` critical styles in `frontend/css/app.css`:

```css
@layer base {
  /* Typography */
  h1, h2, h3, h4, h5, h6 { @apply font-heading; }

  /* Links */
  a { @apply text-foreground/85 transition-colors; }

  /* Focus states */
  :focus-visible {
    @apply outline-2 outline-foreground/50 outline-offset-1;
  }
}
```

### Step 3: Create Component Classes
For reusable patterns, use `@apply` in component layer:

```css
@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-6 py-3
           rounded-[var(--buttons-radius)] font-medium
           transition-all duration-200;
  }

  .btn-primary {
    @apply btn bg-button text-button-text;
  }

  .card {
    @apply relative rounded-card border border-foreground/10
           overflow-hidden;
  }
}
```

### Step 4: Migrate Templates Incrementally
For each Liquid file, replace Dawn classes with Tailwind:

**Before (Dawn):**
```liquid
<div class="card-wrapper product-card-wrapper underline-links-hover">
  <div class="card card--standard card--media">
    <div class="card__inner ratio">
```

**After (Tailwind):**
```liquid
<div class="group relative h-full">
  <div class="relative overflow-hidden rounded-card border border-foreground/10">
    <div class="aspect-[var(--ratio-percent)]">
```

---

## Phase 3: Implementation Order

### Week 1: Foundation
1. [ ] Extend `tailwind.config.js` with Dawn variables
2. [ ] Add base layer styles to `app.css`
3. [ ] Create component classes for buttons, badges, forms
4. [ ] Remove `base.css` dependency from `theme.liquid`

### Week 2: High-Impact Components
1. [ ] Migrate `card-product.liquid` snippet
2. [ ] Migrate `price.liquid` snippet
3. [ ] Remove `component-card.css` and `component-price.css`
4. [ ] Test on collection and product pages

### Week 3: Sections
1. [ ] Migrate `header.liquid` section
2. [ ] Migrate `footer.liquid` section
3. [ ] Migrate `image-banner.liquid` section
4. [ ] Remove corresponding section CSS files

### Week 4: Remaining Components
1. [ ] Cart components (drawer, items, totals)
2. [ ] Search and facets
3. [ ] Product page components
4. [ ] Customer account pages

---

## Phase 4: File Removal Checklist

After migrating each component, remove its CSS file from:
1. The `assets/` folder
2. Any `{{ 'file.css' | asset_url | stylesheet_tag }}` references in Liquid

### Files to Remove (in order):

**Round 1 - After base migration:**
- [ ] `base.css` (80.4 KB) - Replace with Tailwind base

**Round 2 - After card migration:**
- [ ] `component-card.css` (14.1 KB)
- [ ] `component-price.css` (3.8 KB)
- [ ] `component-rating.css`
- [ ] `component-volume-pricing.css`

**Round 3 - After section migration:**
- [ ] `section-image-banner.css` (10.2 KB)
- [ ] `section-footer.css` (9.5 KB)
- [ ] `component-slider.css` (9.4 KB)

**Round 4 - Final cleanup:**
- [ ] All remaining `component-*.css` files
- [ ] All remaining `section-*.css` files
- [ ] Template-specific CSS files

---

## Expected Results

| Metric | Before | After |
|--------|--------|-------|
| CSS Files | 66 | ~5-10 |
| Total CSS Size | ~383 KB | ~50-80 KB |
| HTTP Requests | Many conditional | 1-2 main bundles |
| Maintainability | Low (scattered) | High (centralized) |

---

## Notes

- Keep `pieces-app.css` as the main output bundle
- Preserve CSS custom properties from `theme.liquid` (they power theme customization)
- Test thoroughly after each phase - use Shopify's theme preview
- Consider using Tailwind's `@apply` sparingly for complex, repeated patterns
