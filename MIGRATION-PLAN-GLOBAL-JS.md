# Migration Plan: global.js → Pieces Framework

This document outlines the strategy to eliminate `global.js` by migrating its functionality to the Pieces framework or modern alternatives.

## Current State

`global.js` is a 1,333-line file containing:
- Utility functions
- Shopify namespace functions
- 15 custom element classes
- Performance utilities

## Migration Categories

### ✅ Phase 1: Already Migrated (Complete)

| Component | Lines | Pieces Equivalent | Status |
|-----------|-------|-------------------|--------|
| `QuantityInput` | 217-280 | `c-quantity-input` | ✅ Done |
| `ModalDialog` | 602-645 | `c-modal` | ✅ Done |
| `SliderComponent` | 728-827 | `c-slider` | ✅ Done |

---

### 🔄 Phase 2: Menu & Navigation (Estimated: 2-3 hours)

These components can be consolidated into the existing `c-header` Pieces component.

| Component | Lines | Action |
|-----------|-------|--------|
| `MenuDrawer` | 422-556 | Merge into `c-header` |
| `HeaderDrawer` | 558-600 | Merge into `c-header` |

**Implementation:**
1. Extend `c-header` to handle:
   - Mobile menu drawer with GSAP animations
   - Submenu open/close
   - Escape key handling
   - Focus trapping
2. Update `sections/header.liquid` to use enhanced `c-header`
3. Remove `menu-drawer` and `header-drawer` custom elements

---

### 🔄 Phase 3: Utility Functions (Estimated: 1-2 hours)

Move to a Pieces utilities module.

| Function | Lines | Action |
|----------|-------|--------|
| `getFocusableElements()` | 1-7 | → `frontend/js/utils/focus.js` |
| `trapFocus()` | 89-133 | → `frontend/js/utils/focus.js` |
| `removeTrapFocus()` | 197-203 | → `frontend/js/utils/focus.js` |
| `onKeyUpEscape()` | 205-215 | → `frontend/js/utils/keyboard.js` |
| `pauseAllMedia()` | 184-195 | → `frontend/js/utils/media.js` |
| `debounce()` | 282-288 | → `frontend/js/utils/timing.js` |
| `throttle()` | 291-301 | → `frontend/js/utils/timing.js` |
| `fetchConfig()` | 303-308 | → `frontend/js/utils/fetch.js` |
| `focusVisiblePolyfill()` | 142-182 | Delete (native support) |

**Implementation:**
```js
// frontend/js/utils/index.js
export * from './focus.js';
export * from './keyboard.js';
export * from './media.js';
export * from './timing.js';
export * from './fetch.js';
```

---

### 🔄 Phase 4: HTML Utilities & Classes (Estimated: 1 hour)

| Class/Function | Lines | Action |
|----------------|-------|--------|
| `SectionId` | 9-26 | → `frontend/js/utils/shopify.js` |
| `HTMLUpdateUtility` | 28-69 | → `frontend/js/utils/dom.js` |
| Details summary setup | 71-85 | Inline in theme.liquid or Pieces init |

---

### 🔄 Phase 5: Shopify Namespace (Estimated: 30 min)

**Keep as minimal standalone file** - These are Shopify-specific legacy functions used by checkout and other Shopify code.

| Function | Lines | Action |
|----------|-------|--------|
| `Shopify.bind()` | 318-322 | Keep (legacy compat) |
| `Shopify.setSelectorByValue()` | 324-332 | Keep |
| `Shopify.addListener()` | 334-338 | Keep |
| `Shopify.postLink()` | 340-359 | Keep |
| `Shopify.CountryProvinceSelector` | 361-420 | Keep |

**Action:** Extract to `assets/shopify-compat.js` (~100 lines)

---

### 🔄 Phase 6: Slideshow Component (Estimated: 2 hours)

| Component | Lines | Action |
|-----------|-------|--------|
| `SlideshowComponent` | 829-1061 | Create `c-slideshow` extending `c-slider` |

**Features to migrate:**
- Autoplay with pause on hover/focus
- Dot navigation
- Announcement bar animations
- Looping support

---

### ⏸️ Phase 7: Keep in Separate Files (Shopify-specific)

These components are tightly coupled to Shopify's cart/product systems and should remain as standalone JS files (loaded only when needed):

| Component | Lines | Action |
|-----------|-------|--------|
| `VariantSelects` | 1063-1126 | → `assets/variant-selects.js` |
| `ProductRecommendations` | 1128-1178 | → `assets/product-recommendations.js` |
| `BulkAdd` | 1200-1282 | → `assets/bulk-add.js` |
| `BulkModal` | 647-677 | → `assets/bulk-modal.js` |
| `DeferredMedia` | 694-726 | → `assets/deferred-media.js` |
| `ModalOpener` | 679-692 | → `assets/modal-opener.js` |
| `AccountIcon` | 1180-1198 | → `assets/account-icon.js` |
| `CartPerformance` | 1284-1332 | → `assets/cart-performance.js` |

---

## Final File Structure

```
frontend/js/
├── app.js                    # Main entry
├── components/
│   ├── Header.js            # Enhanced (includes menu drawer)
│   ├── Modal.js             # ✅ Done
│   ├── QuantityInput.js     # ✅ Done
│   ├── Slider.js            # ✅ Done
│   └── Slideshow.js         # New
├── utils/
│   ├── index.js             # Export all utils
│   ├── focus.js             # trapFocus, removeTrapFocus, getFocusableElements
│   ├── keyboard.js          # onKeyUpEscape
│   ├── media.js             # pauseAllMedia
│   ├── timing.js            # debounce, throttle
│   ├── fetch.js             # fetchConfig
│   ├── dom.js               # HTMLUpdateUtility
│   └── shopify.js           # SectionId
└── managers/
    └── ...existing...

assets/
├── shopify-compat.js        # Shopify namespace (legacy)
├── variant-selects.js       # Product variants
├── product-recommendations.js
├── bulk-add.js
├── bulk-modal.js
├── deferred-media.js
├── modal-opener.js
├── account-icon.js
└── cart-performance.js
```

---

## Implementation Order

1. **Phase 3** - Utility functions (foundation for other phases)
2. **Phase 4** - HTML utilities
3. **Phase 2** - Menu/Navigation (high impact)
4. **Phase 6** - Slideshow
5. **Phase 5** - Shopify namespace (extract)
6. **Phase 7** - Split remaining components

---

## Estimated Total Time

| Phase | Time |
|-------|------|
| Phase 2: Menu/Navigation | 2-3 hours |
| Phase 3: Utilities | 1-2 hours |
| Phase 4: HTML Utilities | 1 hour |
| Phase 5: Shopify Namespace | 30 min |
| Phase 6: Slideshow | 2 hours |
| Phase 7: Split components | 2 hours |
| **Total** | **8-10 hours** |

---

## Benefits After Migration

1. **Code splitting** - Components loaded only when needed
2. **Tree shaking** - Unused code eliminated in build
3. **Modern ES modules** - Better browser caching
4. **GSAP animations** - Consistent, performant animations
5. **Pieces lifecycle** - Proper mount/unmount for SPA navigation
6. **Smaller initial bundle** - global.js (44KB) split into on-demand chunks
7. **Type safety** - Can add TypeScript later
8. **Testing** - Modular code easier to test

---

## Risk Mitigation

- Keep `global.js` as fallback during migration
- Test each component thoroughly before removing from global.js
- Use feature flags if needed
- Maintain backwards compatibility for `quantity-input`, `modal-dialog`, `slider-component` tag names
