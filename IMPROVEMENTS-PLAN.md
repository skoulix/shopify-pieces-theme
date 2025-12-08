# Pieces Theme Improvements Plan

Implementation plan for performance, accessibility, security, and code quality improvements.

## Completed Improvements

- [x] **Phase 1.1** - Replaced innerHTML with safe DOM methods (`replaceChildren`)
- [x] **Phase 1.2** - Replaced inline event handlers with `addEventListener`
- [x] **Phase 2.3** - Removed console statements from production code
- [x] **Phase 2.4** - Fixed localStorage error handling with `safeLocalStorage` utility
- [x] **Phase 3.1** - Added comprehensive ARIA labels to locales
- [x] **Phase 5.1** - Added FAQPage structured data (JSON-LD)
- [x] **Phase 5.3** - Enabled theme check validations

### New Files Created
- `frontend/js/utils/storage.js` - Safe localStorage wrapper
- `frontend/js/utils/dom.js` - DOM manipulation utilities with focus trap

---

## Remaining Tasks

### Phase 1.3: Extract Critical CSS (Priority: HIGH)
### Phase 2.1: Lazy-load Leaflet (Priority: MEDIUM)
### Phase 3.3: Add Image Lazy Loading (Priority: MEDIUM)

---

## Original Plan

## Phase 1: Critical Security & Performance (Priority: CRITICAL)

### 1.1 Replace innerHTML with Safe DOM Methods
**Files to modify:**
- [ ] `frontend/js/managers/FacetsManager.js` (lines 371, 446, 484, 494, 505, 508, 517)
- [ ] `frontend/js/managers/CartDrawerManager.js` (lines 306, 339, 343)
- [ ] `frontend/js/managers/CartPageManager.js` (line 255)

**Implementation:**
```javascript
// Before (security risk)
container.innerHTML = newContent.innerHTML;

// After (safe DOM manipulation)
// Option 1: For server-rendered trusted HTML
container.replaceChildren(...newContent.cloneNode(true).childNodes);

// Option 2: For text-only content
container.textContent = newContent.textContent;
```

**Estimated time:** 2-3 hours

---

### 1.2 Replace Inline Event Handlers with addEventListener
**Files to modify:**
- [ ] `sections/shoppable-videos.liquid` (line 642) - `prevBtn.onclick`, `nextBtn.onclick`
- [ ] `sections/pinned-image-reveal.liquid` - `img.onload = resolve`
- [ ] `sections/hero-orbit.liquid` - `img.onload = checkAllLoaded`

**Implementation:**
```javascript
// Before (memory leak risk with Swup)
img.onload = resolve;
prevBtn.onclick = function(e) { ... };

// After (proper event management)
img.addEventListener('load', resolve, { once: true });
prevBtn.addEventListener('click', function(e) { ... });
```

**Estimated time:** 1-2 hours

---

### 1.3 Critical CSS Extraction
**Files to modify:**
- [ ] `layout/theme.liquid` - Add inline critical CSS
- [ ] Create `snippets/critical-css.liquid` - Header, hero, above-fold styles

**Implementation:**
```liquid
{%- comment -%} In theme.liquid head {%- endcomment -%}
<style>
  {%- render 'critical-css' -%}
</style>

{%- comment -%} Defer non-critical CSS {%- endcomment -%}
<link rel="stylesheet" href="{{ 'pieces-app.css' | asset_url }}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="{{ 'pieces-app.css' | asset_url }}"></noscript>
```

**Critical CSS should include:**
- CSS reset/normalize
- Header styles
- Hero section base styles
- Typography base
- Layout utilities (page-container, page-full)
- CSS variables

**Estimated time:** 3-4 hours

---

## Phase 2: JavaScript Bundle Optimization (Priority: HIGH)

### 2.1 Lazy-Load Leaflet for Map Section
**Files to modify:**
- [ ] `frontend/js/app.js` - Remove Leaflet from main bundle
- [ ] `sections/map.liquid` - Dynamic import Leaflet
- [ ] `vite.config.js` - Configure code splitting

**Implementation:**
```javascript
// sections/map.liquid
async function initMap() {
  // Dynamic import only when map section exists
  const L = await import('leaflet');
  // ... rest of map initialization
}
```

**Estimated time:** 2-3 hours

---

### 2.2 Code Split Managers
**Files to modify:**
- [ ] `frontend/js/app.js` - Lazy load non-critical managers
- [ ] `vite.config.js` - Configure manual chunks

**Implementation:**
```javascript
// app.js - Lazy load after initial paint
requestIdleCallback(async () => {
  if (document.querySelector('[data-cart-drawer]')) {
    const { CartDrawerManager } = await import('./managers/CartDrawerManager.js');
    new CartDrawerManager();
  }
});

// vite.config.js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'leaflet': ['leaflet'],
        'gsap': ['gsap'],
        'cart': ['./frontend/js/managers/CartDrawerManager.js', './frontend/js/managers/CartState.js'],
        'facets': ['./frontend/js/managers/FacetsManager.js'],
      }
    }
  }
}
```

**Estimated time:** 3-4 hours

---

### 2.3 Remove Console Statements
**Files to modify:**
- [ ] `frontend/js/app.js` (line 358)
- [ ] `frontend/js/managers/SwupManager.js` (line 31)
- [ ] `frontend/js/managers/CartState.js` (multiple)
- [ ] `frontend/js/managers/FacetsManager.js` (line 353)

**Implementation:**
```javascript
// Option 1: Remove entirely
// Option 2: Conditional logging (development only)
const isDev = import.meta.env.DEV;
if (isDev) console.log('Debug message');
```

**Estimated time:** 30 minutes

---

### 2.4 Fix localStorage Error Handling
**Files to modify:**
- [ ] `frontend/js/managers/FacetsManager.js` (line 111)
- [ ] Create `frontend/js/utils/storage.js` - Safe storage wrapper

**Implementation:**
```javascript
// utils/storage.js
export function safeLocalStorage(key, value) {
  try {
    if (value !== undefined) {
      localStorage.setItem(key, value);
      return true;
    }
    return localStorage.getItem(key);
  } catch (e) {
    // Private browsing or quota exceeded
    return value !== undefined ? false : null;
  }
}

// FacetsManager.js
import { safeLocalStorage } from '../utils/storage.js';
const savedView = safeLocalStorage('collection-view') || 'grid';
```

**Estimated time:** 1 hour

---

## Phase 3: Accessibility Improvements (Priority: HIGH)

### 3.1 Add Missing ARIA Labels
**Files to modify:**
- [ ] `sections/header.liquid` - Mobile menu button, nav items
- [ ] `sections/collection.liquid` - Pagination, sort controls
- [ ] `snippets/product-card.liquid` - Quick add buttons
- [ ] `snippets/cart-drawer.liquid` - Close button, quantity controls
- [ ] All carousel sections - Prev/next buttons

**Implementation:**
```liquid
{%- comment -%} Add to snippets/icon-button.liquid {%- endcomment -%}
<button
  type="button"
  aria-label="{{ aria_label | default: 'accessibility.button' | t }}"
  {% if aria_expanded != blank %}aria-expanded="{{ aria_expanded }}"{% endif %}
  {% if aria_controls != blank %}aria-controls="{{ aria_controls }}"{% endif %}
>
  {{ content }}
</button>
```

**Add translations to `locales/en.default.json`:**
```json
{
  "accessibility": {
    "close": "Close",
    "previous": "Previous",
    "next": "Next",
    "open_menu": "Open menu",
    "close_menu": "Close menu",
    "increase_quantity": "Increase quantity",
    "decrease_quantity": "Decrease quantity",
    "remove_item": "Remove item",
    "go_to_page": "Go to page {{ page }}",
    "current_page": "Page {{ page }}, current page"
  }
}
```

**Estimated time:** 3-4 hours

---

### 3.2 Implement Focus Trap for Modals
**Files to modify:**
- [ ] Create `frontend/js/utils/focus-trap.js`
- [ ] `frontend/js/managers/CartDrawerManager.js` - Add focus trap
- [ ] `sections/header.liquid` - Mobile nav focus trap
- [ ] `frontend/js/managers/FacetsManager.js` - Mobile filters focus trap

**Implementation:**
```javascript
// utils/focus-trap.js
export function createFocusTrap(element) {
  const focusableSelectors = [
    'button:not([disabled])',
    '[href]',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  const focusableElements = element.querySelectorAll(focusableSelectors);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  function handleKeydown(e) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  element.addEventListener('keydown', handleKeydown);
  firstElement?.focus();

  return {
    destroy() {
      element.removeEventListener('keydown', handleKeydown);
    }
  };
}
```

**Estimated time:** 2-3 hours

---

### 3.3 Add Image Lazy Loading & decoding="async"
**Files to modify:**
- [ ] `snippets/product-card.liquid`
- [ ] `snippets/collection-card.liquid`
- [ ] All section images below the fold

**Implementation:**
```liquid
{%- comment -%} For below-fold images {%- endcomment -%}
{{ image | image_url: width: 800 | image_tag:
  loading: 'lazy',
  decoding: 'async',
  alt: image.alt | escape,
  sizes: sizes,
  widths: '300, 450, 600, 800'
}}

{%- comment -%} For above-fold hero images {%- endcomment -%}
{{ image | image_url: width: 1600 | image_tag:
  loading: 'eager',
  decoding: 'sync',
  fetchpriority: 'high',
  alt: image.alt | escape,
  sizes: '100vw',
  widths: '600, 900, 1200, 1600, 2000'
}}
```

**Estimated time:** 2-3 hours

---

## Phase 4: Performance Optimizations (Priority: MEDIUM)

### 4.1 Add WebP Format Support
**Files to modify:**
- [ ] `snippets/responsive-image.liquid` - Create new snippet
- [ ] Update all image renders to use the snippet

**Implementation:**
```liquid
{%- comment -%} snippets/responsive-image.liquid {%- endcomment -%}
{%- liquid
  assign loading = loading | default: 'lazy'
  assign decoding = decoding | default: 'async'
  assign fetchpriority = fetchpriority | default: 'auto'
-%}

<picture>
  <source
    srcset="{{ image | image_url: width: width, format: 'webp' }}"
    type="image/webp"
  >
  {{ image | image_url: width: width | image_tag:
    loading: loading,
    decoding: decoding,
    fetchpriority: fetchpriority,
    alt: alt | default: image.alt | escape,
    sizes: sizes,
    widths: widths
  }}
</picture>
```

**Estimated time:** 2 hours

---

### 4.2 Font Loading Optimization
**Files to modify:**
- [ ] `layout/theme.liquid` - Add font preload
- [ ] `snippets/css-variables.liquid` - Add font-display: swap

**Implementation:**
```liquid
{%- comment -%} Preload critical fonts in theme.liquid {%- endcomment -%}
{%- if settings.type_heading_font.system? == false -%}
  <link rel="preload" as="font" href="{{ settings.type_heading_font | font_url }}" type="font/woff2" crossorigin>
{%- endif -%}
{%- if settings.type_body_font.system? == false -%}
  <link rel="preload" as="font" href="{{ settings.type_body_font | font_url }}" type="font/woff2" crossorigin>
{%- endif -%}

{%- comment -%} Ensure font-display: swap in CSS {%- endcomment -%}
{{ settings.type_heading_font | font_face: font_display: 'swap' }}
{{ settings.type_body_font | font_face: font_display: 'swap' }}
```

**Estimated time:** 1 hour

---

### 4.3 Consolidate Animation Boilerplate
**Files to modify:**
- [ ] Create `frontend/js/utils/section-animation.js`
- [ ] Refactor all sections using the pattern (20+ sections)

**Implementation:**
```javascript
// utils/section-animation.js
export function initSectionAnimation(sectionSelector, animationKey, callback) {
  const section = document.querySelector(sectionSelector);
  if (!section || section.dataset.animInitialized) return;
  section.dataset.animInitialized = 'true';

  if (typeof window.shouldAnimate === 'function' && !window.shouldAnimate()) return;

  function init() {
    const gsap = window.gsap || window.pieces?.gsap;
    const SplitText = window.SplitText || window.pieces?.SplitText;
    const ScrollTrigger = window.ScrollTrigger || window.pieces?.ScrollTrigger;

    if (!gsap) {
      setTimeout(init, 50);
      return;
    }

    callback({ gsap, SplitText, ScrollTrigger, section });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    requestAnimationFrame(init);
  }

  if (window.onSwupContentReplaced) {
    window.onSwupContentReplaced(animationKey, () => {
      section.dataset.animInitialized = '';
      requestAnimationFrame(init);
    });
  }
}

// Usage in sections (much cleaner)
// <script type="module">
// import { initSectionAnimation } from '{{ "section-animation.js" | asset_url }}';
// initSectionAnimation('[data-faq-section="{{ section.id }}"]', 'faq_animation', ({ gsap, SplitText, section }) => {
//   // Animation code only
// });
// </script>
```

**Note:** This is a larger refactor - may want to do incrementally.

**Estimated time:** 4-6 hours (full refactor) or 1 hour (create utility only)

---

## Phase 5: SEO & Best Practices (Priority: MEDIUM)

### 5.1 Add FAQPage Structured Data
**Files to modify:**
- [ ] `sections/faq.liquid` - Add JSON-LD schema

**Implementation:**
```liquid
{%- if section.blocks.size > 0 -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {%- for block in section.blocks -%}
      {%- if block.type == 'faq_item' -%}
      {
        "@type": "Question",
        "name": {{ block.settings.question | json }},
        "acceptedAnswer": {
          "@type": "Answer",
          "text": {{ block.settings.answer | strip_html | json }}
        }
      }{% unless forloop.last %},{% endunless %}
      {%- endif -%}
    {%- endfor -%}
  ]
}
</script>
{%- endif -%}
```

**Estimated time:** 30 minutes

---

### 5.2 Add VideoObject Structured Data
**Files to modify:**
- [ ] `sections/video.liquid` - Add JSON-LD for hosted videos
- [ ] `sections/shoppable-videos.liquid` - Add JSON-LD

**Implementation:**
```liquid
{%- if section.settings.video != blank -%}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "VideoObject",
  "name": {{ section.settings.title | default: page_title | json }},
  "description": {{ section.settings.description | default: page_description | json }},
  "thumbnailUrl": "{{ section.settings.video.preview_image | image_url: width: 1280 }}",
  "uploadDate": "{{ section.settings.video.created_at | date: '%Y-%m-%d' }}",
  "contentUrl": "{{ section.settings.video.sources[0].url }}"
}
</script>
{%- endif -%}
```

**Estimated time:** 1 hour

---

### 5.3 Enable Theme Check Validations
**Files to modify:**
- [ ] `.theme-check.yml` - Enable recommended checks

**Implementation:**
```yaml
# .theme-check.yml
extends: :theme-check

# Enable all recommended checks
MatchingTranslations:
  enabled: true
TemplateLength:
  enabled: true
  max_length: 600
MissingTemplate:
  enabled: true
UnusedAssign:
  enabled: true
AssetSizeCss:
  enabled: true
  threshold_in_bytes: 100000
AssetSizeJavaScript:
  enabled: true
  threshold_in_bytes: 200000

# Keep disabled for specific reasons
RemoteAsset:
  enabled: false  # We use external CDNs intentionally
```

**Estimated time:** 30 minutes

---

## Implementation Schedule

### Week 1: Critical (6-8 hours)
- [ ] 1.1 Replace innerHTML (2-3h)
- [ ] 1.2 Replace inline event handlers (1-2h)
- [ ] 1.3 Critical CSS extraction (3-4h)

### Week 2: High Impact (8-10 hours)
- [ ] 2.1 Lazy-load Leaflet (2-3h)
- [ ] 2.2 Code split managers (3-4h)
- [ ] 2.3 Remove console statements (30m)
- [ ] 2.4 Fix localStorage handling (1h)
- [ ] 3.1 Add ARIA labels (3-4h)

### Week 3: Accessibility & Performance (8-10 hours)
- [ ] 3.2 Implement focus traps (2-3h)
- [ ] 3.3 Add image lazy loading (2-3h)
- [ ] 4.1 WebP format support (2h)
- [ ] 4.2 Font loading optimization (1h)

### Week 4: Polish & SEO (4-6 hours)
- [ ] 4.3 Consolidate animation boilerplate (4-6h or 1h for utility only)
- [ ] 5.1 FAQPage structured data (30m)
- [ ] 5.2 VideoObject structured data (1h)
- [ ] 5.3 Enable theme checks (30m)

---

## Expected Results

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| JS Bundle Size | 244KB | ~160KB | -34% |
| First Contentful Paint | ~2.5s | ~1.5s | -40% |
| Time to Interactive | ~4s | ~2.5s | -38% |
| Lighthouse Performance | ~75 | ~92+ | +17 points |
| Lighthouse Accessibility | ~85 | ~95+ | +10 points |
| Core Web Vitals | Needs Improvement | Pass | All green |

---

## Testing Checklist

After each phase, verify:
- [ ] No JavaScript console errors
- [ ] All Swup page transitions work
- [ ] Cart functionality works (add, remove, update)
- [ ] Facets/filtering works
- [ ] Animations play correctly
- [ ] Mobile menu opens/closes
- [ ] Focus management works with keyboard
- [ ] Screen reader announces elements correctly
- [ ] Images lazy load on scroll
- [ ] No layout shift (CLS < 0.1)
