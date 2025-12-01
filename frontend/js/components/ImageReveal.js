import { Piece } from 'piecesjs';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ImageReveal Component
 * Creates elegant image reveal animations on scroll
 */
class ImageReveal extends Piece {
  constructor() {
    super('ImageReveal', {
      stylesheets: [],
    });

    this.scrollTrigger = null;
  }

  mount() {
    // Get elements
    this.$image = this.$('img')[0] || this.$('video')[0];
    this.$overlay = this.$('[data-overlay]')[0];

    if (!this.$image) return;

    // Get settings
    this.direction = this.dataset.direction || 'up'; // up, down, left, right
    this.duration = parseFloat(this.dataset.duration) || 1.2;
    this.start = this.dataset.start || 'top 85%';

    // Set initial state
    this.setInitialState();

    // Create scroll trigger
    this.createScrollTrigger();
  }

  unmount() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
      this.scrollTrigger = null;
    }
  }

  setInitialState() {
    // Container overflow hidden for reveal effect
    gsap.set(this, { overflow: 'hidden' });

    // Image starts scaled and hidden
    gsap.set(this.$image, {
      scale: 1.3,
      opacity: 0,
    });

    // Create or set overlay for wipe effect
    if (!this.$overlay) {
      this.$overlay = document.createElement('div');
      this.$overlay.classList.add('image-reveal-overlay');
      this.$overlay.style.cssText = `
        position: absolute;
        inset: 0;
        background: rgb(var(--color-background));
        z-index: 1;
      `;
      this.appendChild(this.$overlay);
    }

    // Set overlay initial state based on direction
    const overlayStates = {
      up: { scaleY: 1, transformOrigin: 'bottom' },
      down: { scaleY: 1, transformOrigin: 'top' },
      left: { scaleX: 1, transformOrigin: 'right' },
      right: { scaleX: 1, transformOrigin: 'left' },
    };

    gsap.set(this.$overlay, overlayStates[this.direction] || overlayStates.up);
  }

  createScrollTrigger() {
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this,
      start: this.start,
      once: true,
      onEnter: () => this.animate(),
    });
  }

  animate() {
    const tl = gsap.timeline();

    // Reveal overlay animation based on direction
    const overlayAnimations = {
      up: { scaleY: 0 },
      down: { scaleY: 0 },
      left: { scaleX: 0 },
      right: { scaleX: 0 },
    };

    // Animate overlay out
    tl.to(this.$overlay, {
      ...overlayAnimations[this.direction],
      duration: this.duration * 0.7,
      ease: 'power2.inOut',
    });

    // Animate image in
    tl.to(
      this.$image,
      {
        scale: 1,
        opacity: 1,
        duration: this.duration,
        ease: 'power2.out',
      },
      0 // Start at the same time as overlay
    );

    return tl;
  }

  // Reset for page transitions
  reset() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }
    this.setInitialState();
    this.createScrollTrigger();
  }
}

customElements.define('c-image-reveal', ImageReveal);
export default ImageReveal;
