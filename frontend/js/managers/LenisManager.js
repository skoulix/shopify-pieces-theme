import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * LenisManager - Smooth scroll management
 * Handles smooth scrolling with Lenis and GSAP ScrollTrigger integration
 */
class LenisManager {
  constructor() {
    this.lenis = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return this.lenis;

    // Create Lenis instance
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // Integrate with GSAP ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis to GSAP ticker
    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });

    // Disable GSAP lag smoothing for better scroll performance
    gsap.ticker.lagSmoothing(0);

    // Add lenis class to html element
    document.documentElement.classList.add('lenis');

    this.isInitialized = true;

    return this.lenis;
  }

  /**
   * Scroll to a target element or position
   * @param {string|number|HTMLElement} target - Target to scroll to
   * @param {Object} options - Scroll options
   */
  scrollTo(target, options = {}) {
    if (!this.lenis) return;

    const defaultOptions = {
      offset: 0,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      immediate: false,
      lock: false,
      onComplete: null,
    };

    this.lenis.scrollTo(target, { ...defaultOptions, ...options });
  }

  /**
   * Stop smooth scrolling
   */
  stop() {
    if (this.lenis) {
      this.lenis.stop();
    }
  }

  /**
   * Start smooth scrolling
   */
  start() {
    if (this.lenis) {
      this.lenis.start();
    }
  }

  /**
   * Resize/recalculate scroll bounds
   * Call this after content changes that affect page height
   */
  resize() {
    if (this.lenis) {
      this.lenis.resize();
    }
  }

  /**
   * Destroy the Lenis instance
   */
  destroy() {
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
      this.isInitialized = false;
      document.documentElement.classList.remove('lenis');
    }
  }

  /**
   * Get current scroll position
   * @returns {number}
   */
  get scroll() {
    return this.lenis?.scroll || 0;
  }

  /**
   * Get scroll progress (0-1)
   * @returns {number}
   */
  get progress() {
    return this.lenis?.progress || 0;
  }

  /**
   * Check if scrolling is active
   * @returns {boolean}
   */
  get isScrolling() {
    return this.lenis?.isScrolling || false;
  }
}

// Singleton export
export const lenisManager = new LenisManager();
export default lenisManager;
