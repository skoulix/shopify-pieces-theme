import { Piece } from 'piecesjs';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollReveal Component
 * Generic component for scroll-triggered reveal animations
 */
class ScrollReveal extends Piece {
  constructor() {
    super('ScrollReveal', {
      stylesheets: [],
    });

    this.scrollTrigger = null;
  }

  mount() {
    // Get animation settings from data attributes
    this.animationType = this.dataset.animation || 'fade-up';
    this.duration = parseFloat(this.dataset.duration) || 0.8;
    this.delay = parseFloat(this.dataset.delay) || 0;
    this.start = this.dataset.start || 'top 85%';
    this.stagger = parseFloat(this.dataset.stagger) || 0;

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
    const states = {
      fade: { opacity: 0 },
      'fade-up': { opacity: 0, y: 50 },
      'fade-down': { opacity: 0, y: -50 },
      'fade-left': { opacity: 0, x: 50 },
      'fade-right': { opacity: 0, x: -50 },
      scale: { opacity: 0, scale: 0.9 },
      'scale-up': { opacity: 0, scale: 0.8, y: 30 },
      clip: { clipPath: 'inset(0 100% 0 0)' },
      'clip-up': { clipPath: 'inset(100% 0 0 0)' },
      'clip-down': { clipPath: 'inset(0 0 100% 0)' },
    };

    const state = states[this.animationType] || states.fade;

    // Check if we should animate children
    if (this.stagger > 0) {
      gsap.set(this.children, state);
    } else {
      gsap.set(this, state);
    }
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
    const targetState = {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      clipPath: 'inset(0 0% 0 0)',
      duration: this.duration,
      delay: this.delay,
      ease: 'power2.out',
    };

    if (this.stagger > 0) {
      gsap.to(this.children, {
        ...targetState,
        stagger: this.stagger,
      });
    } else {
      gsap.to(this, targetState);
    }
  }

  // Reset animation (useful for page transitions)
  reset() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }
    this.setInitialState();
    this.createScrollTrigger();
  }
}

customElements.define('c-scroll-reveal', ScrollReveal);
export default ScrollReveal;
