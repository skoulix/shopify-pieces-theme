# Pieces Theme - Development Guidelines

## Tailwind CSS First

**ALWAYS use Tailwind CSS classes instead of custom CSS rules whenever possible.**

### When to use Tailwind classes:
- Layout (flex, grid, spacing, sizing)
- Typography (font-size, font-weight, line-height, letter-spacing)
- Colors using CSS variables: `text-[--color-text]`, `bg-[--color-background-secondary]`
- Borders and rounded corners: `rounded-[--card-radius]`, `border-[--color-border]`
- Responsive design: `md:`, `lg:`, `xl:` prefixes
- Line clamping: `line-clamp-3`, `line-clamp-6`
- Overflow, display, position, etc.

### When custom CSS is acceptable:
- `clamp()` values (Tailwind doesn't support clamp natively)
- Complex selectors like `:nth-child()`, `::before`, `::after`
- CSS properties without Tailwind equivalents (e.g., `clip-path`, `aspect-ratio: unset`)
- Liquid template values in CSS (e.g., `repeat({{ section.settings.columns }}, 1fr)`)
- Animation keyframes
- Pseudo-element content

### Examples

**DO:**
```liquid
<p class="text-sm leading-relaxed text-[--color-text-secondary] line-clamp-3">
```

**DON'T:**
```css
.blog-item-excerpt {
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
  -webkit-line-clamp: 3;
}
```

### CSS Variable Usage with Tailwind

Use arbitrary value syntax for theme CSS variables:

**Colors:**
- `text-[--color-text]`
- `text-[--color-text-secondary]`
- `bg-[--color-background]`
- `bg-[--color-background-secondary]`
- `border-[--color-border]`
- `text-[--color-primary]`

**Border Radius (from theme settings):**
- `rounded-[--card-radius]`
- `rounded-[--button-radius]`
- `rounded-[--input-radius]`

**Custom sizes:**
- `text-[0.65rem]` (for specific sizes)

### Layout Utility Classes

The theme provides utility classes that respect theme settings:

**Container classes (use these instead of hardcoded max-w/px values):**
```liquid
{%- liquid
  if section.settings.full_width
    assign container_class = 'page-full'
  else
    assign container_class = 'page-container'
  endif
-%}
```

- `.page-container` - Centered container with max-width from theme settings (`--page-max-width`) and page padding (`--page-padding`)
- `.page-full` - Full width with page padding only
- `py-[--page-vertical-padding]` - Vertical padding for templates/pages using theme settings

**DO:**
```liquid
<div class="page-container py-[--page-vertical-padding]">
```

**DON'T:**
```liquid
<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
```

### Input Styling with CSS Variables

For inputs, use Tailwind arbitrary values with inline style for border-width:
```html
<input
  class="w-full py-3 px-4 text-[--color-text] bg-[--color-background] border border-[--color-border] rounded-[--input-radius] focus:border-[--color-primary] focus:outline-none"
  style="border-width: var(--input-border-width);"
>
```

### Responsive Classes

Always use Tailwind responsive prefixes:
- `sm:` - 640px
- `md:` - 768px
- `lg:` - 1024px
- `xl:` - 1280px
- `2xl:` - 1536px

Example:
```liquid
<div class="p-6{% if is_featured %} lg:py-8 lg:pr-8 lg:pl-0 lg:flex lg:flex-col lg:justify-center{% endif %}">
```

## Reusable Patterns

### Text Hover Reveal
```liquid
<a class="text-hover-reveal">
  <span data-hover="Text">Text</span>
  <i class="ph ph-arrow-right"></i>
</a>
```

### Page Header Subtitle (with line draw animation)
```liquid
<p class="page-header-subtitle">
  <span class="page-header-subtitle-line" data-subtitle-line></span>
  <span class="overflow-hidden">
    <span class="inline-block" data-subtitle-text>Text here</span>
  </span>
</p>
```

## Animation Guidelines

### Animation Control System

The theme has a two-tier animation control system:

1. **Theme Setting**: `settings.enable_animations` (Layout > "Enable animations")
2. **User Preference**: `prefers-reduced-motion` media query

**Global helper function** (`window.shouldAnimate()`):
```javascript
// Returns true only if BOTH conditions are met:
// 1. Theme setting enables animations
// 2. User hasn't enabled reduced motion
window.shouldAnimate()
```

**When animations are disabled:**
- The `html` element gets the class `animations-disabled`
- Use this class for CSS overrides to show hidden elements immediately

### CSS Overrides for Disabled Animations

Elements with initial hidden states (clip-path, opacity, transform) need CSS overrides:

```css
/* Show elements immediately when animations disabled */
html.animations-disabled .my-element { clip-path: none; }
html.animations-disabled .my-hidden-element { opacity: 1; transform: none; }
```

Common elements needing overrides:
- Images with `clip-path: inset(0 100% 0 0)` initial state
- Title lines with `yPercent: 120` initial state
- Elements with `opacity: 0` or `transform` initial state

### JavaScript Animation Pattern

Always check `shouldAnimate()` before running GSAP animations:

```javascript
// At the start of animation init function
if (typeof window.shouldAnimate === 'function' && !window.shouldAnimate()) {
  // Skip animations, show content immediately
  wrapper.classList.remove('is-loading');
  wrapper.classList.add('is-ready');
  return;
}
```

### GSAP Animation Patterns

- Use GSAP for scroll-triggered and intro animations
- Set initial states with `gsap.set()` or `fromTo()`
- Common animation patterns:
  - `yPercent: 120` → `yPercent: 0` for title text reveals (SplitText)
  - `clip-path: inset(0 100% 0 0)` → `clip-path: inset(0 0% 0 0)` for image reveals
  - `opacity: 0, y: 30` → `opacity: 1, y: 0` for fade-up effects

### SplitText Title Animation

For section titles with line-by-line reveal:

```javascript
const split = new SplitText(title, { type: 'lines', linesClass: 'my-title-line' });

// Wrap each line for overflow hidden
split.lines.forEach(line => {
  const wrapper = document.createElement('div');
  wrapper.style.overflow = 'hidden';
  wrapper.style.display = 'block';
  line.parentNode.insertBefore(wrapper, line);
  wrapper.appendChild(line);
});

gsap.set(split.lines, { yPercent: 120 });

gsap.to(split.lines, {
  yPercent: 0,
  duration: 1.2,
  ease: 'power4.out',
  stagger: 0.1,
  scrollTrigger: {
    trigger: section,
    start: 'top 70%',
    once: true
  }
});
```

**CSS for second line offset:**
```css
.my-title-line:nth-child(2) { margin-left: clamp(0.5rem, 4vw, 2rem); }
```

### Global Intro Animation (`data-intro`)

Use `data-intro` attribute for scroll-triggered fade-up animations on any element. This is a global system that can be applied anywhere.

**Usage:**
```liquid
<div data-intro>Content fades up when scrolled into view</div>
```

**How it works:**
- Elements with `data-intro` start with `opacity: 0` and `transform: translateY(20px)`
- Elements animate sequentially as they scroll into view (staggered 80ms apart)
- Controlled by Intersection Observer in `AnimationManager.js`
- Automatically disabled when `shouldAnimate()` returns false
- Respects both theme setting and `prefers-reduced-motion`

**CSS (defined in frontend/css/app.css):**
```css
[data-intro] {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
[data-intro].intro-visible { opacity: 1; transform: translateY(0); }

/* When animations disabled, show immediately */
html.animations-disabled [data-intro] { opacity: 1; transform: none; }
```

**Important for block-based sections:**
- Place `data-intro` directly on each block wrapper
- The order elements appear in the DOM determines animation order
- The JavaScript automatically staggers elements as they become visible

### Section Animation Boilerplate

Standard pattern for section-specific animations:

```javascript
(function() {
  const section = document.querySelector('[data-my-section="{{ section.id }}"]');
  if (!section || section.dataset.myAnimInitialized) return;
  section.dataset.myAnimInitialized = 'true';

  // Skip if animations disabled
  if (typeof window.shouldAnimate === 'function' && !window.shouldAnimate()) return;

  function initAnimation() {
    let gsap = window.gsap;
    if (!gsap && window.pieces && window.pieces.gsap) {
      gsap = window.pieces.gsap;
    }

    let SplitText = window.SplitText;
    if (!SplitText && window.pieces && window.pieces.SplitText) {
      SplitText = window.pieces.SplitText;
    }

    const ScrollTrigger = window.ScrollTrigger || (window.pieces && window.pieces.ScrollTrigger);

    if (!gsap || !SplitText || !ScrollTrigger) {
      setTimeout(initAnimation, 50);
      return;
    }

    // Animation code here...
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnimation);
  } else {
    requestAnimationFrame(initAnimation);
  }

  // Reinitialize after Swup page transitions
  window.addEventListener('swup:contentReplaced', () => {
    requestAnimationFrame(initAnimation);
  });
})();
```

## Internationalization (i18n)

**NEVER use hardcoded text strings in sections.** All user-facing text must be translatable.

### Translation System

Shopify uses JSON locale files in `/locales/`. The primary file is `en.default.json`.

**Translation filter syntax:**
```liquid
{{ 'namespace.key' | t }}
```

**With interpolation:**
```liquid
{{ 'sections.shop_the_look.view_product' | t: index: forloop.index }}
```

**Pluralization:**
```json
{
  "items_in_look": {
    "one": "{{ count }} item in this look",
    "other": "{{ count }} items in this look"
  }
}
```
```liquid
{{ 'sections.shop_the_look.items_in_look' | t: count: product_count }}
```

### Where to Add Translation Keys

Organize translations by section in `en.default.json`:

```json
{
  "sections": {
    "shop_the_look": {
      "items_in_look": { "one": "...", "other": "..." },
      "total": "Total",
      "view_product": "View product {{ index }}",
      "add_all": "Add All"
    },
    "hotspots": {
      "view_details": "View details"
    }
  }
}
```

### Common Translation Namespaces

- `accessibility.*` - Screen reader text, aria-labels
- `general.*` - Common UI text (View All, Share, etc.)
- `products.product.*` - Product-related (Add to cart, Sold out)
- `cart.*` - Cart-related (Checkout, Adding..., Added!)
- `sections.<section_name>.*` - Section-specific text

### Handling Default Values with Translations

When a setting has a default but should fall back to a translation:

**DO:**
```liquid
{%- liquid
  if section.settings.button_text != blank
    assign button_text = section.settings.button_text
  else
    assign button_text = 'sections.shop_the_look.add_all' | t
  endif
-%}
<button>{{ button_text }}</button>
```

**DON'T:**
```liquid
{# This doesn't work - default is applied before translation #}
<button>{{ section.settings.button_text | default: 'sections.shop_the_look.add_all' | t }}</button>
```

### JavaScript Strings

For text rendered in JavaScript, use Liquid to inject translations:

```javascript
button.innerHTML = '<span>{{ 'cart.adding' | t }}</span>';
button.innerHTML = '<span>{{ 'cart.added' | t }}</span>';
```

## Accessibility (a11y)

**All interactive elements must be accessible.** Follow WCAG 2.1 AA guidelines.

### Aria Labels

Every interactive element without visible text needs an `aria-label`:

```liquid
<button aria-label="{{ 'accessibility.close' | t }}">
  <i class="ph ph-x"></i>
</button>

<button aria-label="{{ 'sections.shop_the_look.view_product' | t: index: forloop.index }}">
  <span>{{ forloop.index }}</span>
</button>
```

**Use translations for aria-labels** - never hardcode:

**DO:**
```liquid
aria-label="{{ 'accessibility.close' | t }}"
aria-label="{{ 'sections.hotspots.view_details' | t }}"
```

**DON'T:**
```liquid
aria-label="Close"
aria-label="View details"
```

### Dynamic Aria Labels

When aria-labels need dynamic content, use translation interpolation:

```liquid
aria-label="{{ 'accessibility.view_image' | t: index: forloop.index, total: images.size }}"
```

With translation key:
```json
"view_image": "View image {{ index }} of {{ total }}"
```

### Common Accessibility Patterns

**Close buttons:**
```liquid
<button aria-label="{{ 'accessibility.close' | t }}">
  <i class="ph ph-x"></i>
</button>
```

**Navigation arrows:**
```liquid
<button aria-label="{{ 'accessibility.previous_slide' | t }}">
  <i class="ph ph-arrow-left"></i>
</button>
<button aria-label="{{ 'accessibility.next_slide' | t }}">
  <i class="ph ph-arrow-right"></i>
</button>
```

**Image alt text:**
```liquid
{{ image | image_url: width: 800 | image_tag:
  alt: product.title,
  loading: 'lazy'
}}
```

**Form inputs:**
```liquid
<label for="email-{{ section.id }}">{{ 'customers.register.email' | t }}</label>
<input type="email" id="email-{{ section.id }}" name="email">
```

### Focus Management

- Ensure all interactive elements are keyboard accessible
- Use `tabindex="0"` sparingly - prefer native focusable elements
- Manage focus when opening/closing modals and drawers
- Provide visible focus indicators (don't remove outline without replacement)

### Reduced Motion

Always check for reduced motion preference:

```javascript
if (typeof window.shouldAnimate === 'function' && !window.shouldAnimate()) {
  // Skip animations
  return;
}
```

CSS fallback:
```css
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}

html.animations-disabled .element {
  opacity: 1;
  transform: none;
}
```

### Checklist for New Sections

When creating a new section, verify:

1. [ ] All buttons/links have `aria-label` if no visible text
2. [ ] All aria-labels use translation keys
3. [ ] Images have meaningful `alt` text
4. [ ] Form inputs have associated labels
5. [ ] No hardcoded user-facing strings
6. [ ] All text uses translation keys
7. [ ] Animations respect `shouldAnimate()` and have CSS fallbacks
8. [ ] Interactive elements are keyboard accessible
9. [ ] Color contrast meets WCAG AA (4.5:1 for text, 3:1 for large text)
10. [ ] Focus states are visible

## Section Schema Settings

**Use consistent setting patterns across all sections.** This ensures a cohesive merchant experience in the theme editor.

### Standard Section Header Settings

Most sections with a header should include these settings in this order:

```json
{
  "type": "header",
  "content": "Header"
},
{
  "type": "text",
  "id": "label",
  "label": "Label",
  "default": "Section Label"
},
{
  "type": "text",
  "id": "title",
  "label": "Title",
  "default": "Section Title"
},
{
  "type": "textarea",
  "id": "description",
  "label": "Description"
},
{
  "type": "select",
  "id": "header_alignment",
  "options": [
    { "value": "left", "label": "Left" },
    { "value": "center", "label": "Center" }
  ],
  "default": "left",
  "label": "Header alignment"
}
```

### Standard Layout Settings

```json
{
  "type": "header",
  "content": "Layout"
},
{
  "type": "checkbox",
  "id": "full_width",
  "label": "Full width",
  "default": false
}
```

For sections with image/content layout options:

```json
{
  "type": "select",
  "id": "layout",
  "label": "Layout",
  "options": [
    { "value": "image_left", "label": "Image left" },
    { "value": "image_right", "label": "Image right" }
  ],
  "default": "image_left"
}
```

### Standard Color Settings

Always include these color settings at the end of the section schema:

```json
{
  "type": "header",
  "content": "Colors"
},
{
  "type": "color",
  "id": "background_color",
  "label": "Background color",
  "default": "#ffffff"
},
{
  "type": "color",
  "id": "text_color",
  "label": "Text color",
  "default": "#000000"
}
```

For sections with separate heading colors:

```json
{
  "type": "color",
  "id": "heading_color",
  "label": "Heading color",
  "info": "Leave empty to use text color"
}
```

### Global Theme Settings to Respect

Always use global card settings instead of hardcoded values:

```liquid
{%- liquid
  assign card_radius = settings.card_radius | default: 8
  assign card_border_width = settings.card_border_width | default: 0
  assign card_shadow = settings.card_shadow | default: 'none'
-%}
```

Apply in CSS:

```css
.my-card {
  border-radius: {{ card_radius }}px;
  {% if card_border_width > 0 %}
  border: {{ card_border_width }}px solid var(--color-border);
  {% endif %}
  {% if card_shadow != 'none' %}
  box-shadow: {{ card_shadow }};
  {% endif %}
}
```

### Section Vertical Padding

Use CSS variable for consistent vertical spacing:

```css
.my-section {
  padding: var(--section-vertical-padding) 0;
}
```

### Image Settings Pattern

For sections with images:

```json
{
  "type": "header",
  "content": "Image"
},
{
  "type": "image_picker",
  "id": "image",
  "label": "Image"
},
{
  "type": "text",
  "id": "image_alt",
  "label": "Image alt text",
  "info": "Describe the image for accessibility"
}
```

For sections with separate desktop/mobile images:

```json
{
  "type": "image_picker",
  "id": "desktop_image",
  "label": "Desktop image"
},
{
  "type": "image_picker",
  "id": "mobile_image",
  "label": "Mobile image",
  "info": "Optional: Different image for mobile devices"
}
```

### Image Ratio Settings

```json
{
  "type": "select",
  "id": "image_ratio",
  "options": [
    { "value": "1/1", "label": "Square (1:1)" },
    { "value": "4/5", "label": "Portrait (4:5)" },
    { "value": "3/4", "label": "Portrait (3:4)" },
    { "value": "16/9", "label": "Landscape (16:9)" }
  ],
  "default": "4/5",
  "label": "Image ratio"
}
```

### Button Settings Pattern

```json
{
  "type": "text",
  "id": "button_text",
  "label": "Button text",
  "default": "Learn More"
},
{
  "type": "url",
  "id": "button_link",
  "label": "Button link"
},
{
  "type": "select",
  "id": "button_style",
  "label": "Button style",
  "options": [
    { "value": "primary", "label": "Primary" },
    { "value": "secondary", "label": "Secondary" }
  ],
  "default": "primary"
}
```

### Block Position Settings (for hotspots, etc.)

```json
{
  "type": "header",
  "content": "Position"
},
{
  "type": "range",
  "id": "position_x",
  "label": "Horizontal position (Desktop)",
  "default": 50,
  "min": 0,
  "max": 100,
  "step": 1,
  "unit": "%"
},
{
  "type": "range",
  "id": "position_y",
  "label": "Vertical position (Desktop)",
  "default": 50,
  "min": 0,
  "max": 100,
  "step": 1,
  "unit": "%"
},
{
  "type": "range",
  "id": "position_x_mobile",
  "label": "Horizontal position (Mobile)",
  "default": 50,
  "min": 0,
  "max": 100,
  "step": 1,
  "unit": "%"
},
{
  "type": "range",
  "id": "position_y_mobile",
  "label": "Vertical position (Mobile)",
  "default": 50,
  "min": 0,
  "max": 100,
  "step": 1,
  "unit": "%"
}
```

### Consistent Setting Order

Settings should appear in this order:
1. **Header** - Label, title, description, alignment
2. **Content** - Section-specific content settings
3. **Image** - Image picker, alt text, ratio
4. **Layout** - Full width, image position, columns
5. **Display options** - Show/hide toggles
6. **Colors** - Background, text, accent colors

### Presets

Every section should have at least one preset:

```json
"presets": [
  {
    "name": "Section Name",
    "category": "Category Name",
    "blocks": []
  }
]
```

Common categories:
- `Image & media`
- `Products`
- `Text`
- `Promotional`
- `Collection`

### Section Class Naming

Use consistent class naming with section ID for scoping:

```liquid
<section class="my-section-{{ section.id }}" data-my-section="{{ section.id }}">
```

```css
.my-section-{{ section.id }} { /* styles */ }
```

### CSS Variable Consistency

For section-specific colors, use the pattern:

```css
.my-section-{{ section.id }} {
  background-color: {{ section.settings.background_color }};
  color: {{ section.settings.text_color }};
}
```

For text with opacity variations:
```css
.my-element { color: {{ section.settings.text_color }}; opacity: 0.7; }
/* Or for borders/backgrounds with alpha: */
.my-border { border-color: {{ section.settings.text_color }}20; }
```
