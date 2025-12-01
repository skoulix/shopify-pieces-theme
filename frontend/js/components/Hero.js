import { Piece } from 'piecesjs';
import { gsap } from 'gsap';
import { animationManager } from '../managers/AnimationManager.js';

/**
 * Hero Component
 * Handles hero section entrance animations and interactions
 */
class Hero extends Piece {
  constructor() {
    super('Hero', {
      stylesheets: [],
    });
  }

  mount(firstHit) {
    // Get elements
    this.$title = this.$('[data-hero-title]')[0];
    this.$subtitle = this.$('[data-hero-subtitle]')[0];
    this.$cta = this.$('[data-hero-cta]')[0];
    this.$image = this.$('[data-hero-image]')[0];
    this.$video = this.$('[data-hero-video]')[0];

    // Animate on first mount
    if (firstHit) {
      this.animateIn();
    }

    // Set up parallax on scroll
    this.initParallax();

    // Handle video autoplay
    if (this.$video) {
      this.initVideo();
    }
  }

  unmount() {
    // Kill any running animations
    if (this.timeline) {
      this.timeline.kill();
    }
  }

  animateIn() {
    this.timeline = gsap.timeline({
      defaults: { ease: 'power2.out' },
    });

    // Image/background reveal
    if (this.$image) {
      this.timeline.from(this.$image, {
        scale: 1.15,
        opacity: 0,
        duration: 1.4,
      });
    }

    // Title animation
    if (this.$title) {
      // Split text animation if data attribute present
      if (this.$title.hasAttribute('data-split-text')) {
        this.animateSplitText(this.$title);
      } else {
        this.timeline.from(
          this.$title,
          {
            y: 80,
            opacity: 0,
            duration: 1,
          },
          '-=0.9'
        );
      }
    }

    // Subtitle animation
    if (this.$subtitle) {
      this.timeline.from(
        this.$subtitle,
        {
          y: 40,
          opacity: 0,
          duration: 0.8,
        },
        '-=0.6'
      );
    }

    // CTA button animation
    if (this.$cta) {
      this.timeline.from(
        this.$cta,
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
        },
        '-=0.4'
      );
    }
  }

  animateSplitText(element) {
    const text = element.textContent;
    const chars = text.split('');

    // Wrap each character in a span
    element.innerHTML = chars
      .map((char) => {
        if (char === ' ') {
          return '<span class="char">&nbsp;</span>';
        }
        return `<span class="char">${char}</span>`;
      })
      .join('');

    const charElements = element.querySelectorAll('.char');

    this.timeline.from(
      charElements,
      {
        y: '100%',
        opacity: 0,
        duration: 0.6,
        stagger: 0.02,
        ease: 'power2.out',
      },
      '-=0.8'
    );
  }

  initParallax() {
    if (this.$image && this.hasAttribute('data-parallax')) {
      const speed = parseFloat(this.dataset.parallax) || 0.3;

      gsap.to(this.$image, {
        y: () => window.innerHeight * speed,
        ease: 'none',
        scrollTrigger: {
          trigger: this,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  }

  initVideo() {
    // Play video when visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.$video.play();
          } else {
            this.$video.pause();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(this);
  }
}

customElements.define('c-hero', Hero);
export default Hero;
