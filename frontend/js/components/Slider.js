import { Piece } from 'piecesjs';

/**
 * Slider Component
 * Native scroll-based slider with optional navigation
 */
class Slider extends Piece {
  constructor() {
    super('Slider', {
      stylesheets: [],
    });

    this.currentPage = 1;
    this.totalPages = 1;
    this.sliderItemOffset = 0;
    this.slidesPerPage = 1;
  }

  mount() {
    this.$slider = this.$('[data-slider-track]')[0] || this.$('[id^="Slider-"]')[0];
    this.$items = this.$$('[data-slider-item]').length
      ? this.$$('[data-slider-item]')
      : this.$$('[id^="Slide-"]');
    this.$prevButton = this.$('[data-slider-prev]')[0] || this.$('button[name="previous"]')[0];
    this.$nextButton = this.$('[data-slider-next]')[0] || this.$('button[name="next"]')[0];
    this.$currentPage = this.$('[data-slider-current]')[0] || this.$('.slider-counter--current')[0];
    this.$totalPages = this.$('[data-slider-total]')[0] || this.$('.slider-counter--total')[0];

    if (!this.$slider || !this.$items.length) return;

    // Enable looping if set
    this.enableLooping = this.hasAttribute('data-loop');

    // Initialize
    this.initPages();

    // Observe resize
    this.resizeObserver = new ResizeObserver(() => this.initPages());
    this.resizeObserver.observe(this.$slider);

    // Bind events
    this.on('scroll', this.$slider, this.update);

    if (this.$prevButton) {
      this.on('click', this.$prevButton, this.onPrevClick);
    }
    if (this.$nextButton) {
      this.on('click', this.$nextButton, this.onNextClick);
    }
  }

  unmount() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    this.off('scroll', this.$slider, this.update);
    if (this.$prevButton) {
      this.off('click', this.$prevButton, this.onPrevClick);
    }
    if (this.$nextButton) {
      this.off('click', this.$nextButton, this.onNextClick);
    }
  }

  initPages() {
    this.visibleItems = Array.from(this.$items).filter((el) => el.clientWidth > 0);

    if (this.visibleItems.length < 2) return;

    this.sliderItemOffset = this.visibleItems[1].offsetLeft - this.visibleItems[0].offsetLeft;
    this.slidesPerPage = Math.floor(
      (this.$slider.clientWidth - this.visibleItems[0].offsetLeft) / this.sliderItemOffset
    );
    this.totalPages = this.visibleItems.length - this.slidesPerPage + 1;

    this.update();
  }

  update() {
    if (!this.$slider) return;

    const previousPage = this.currentPage;
    this.currentPage = Math.round(this.$slider.scrollLeft / this.sliderItemOffset) + 1;

    // Update counter
    if (this.$currentPage) {
      this.$currentPage.textContent = this.currentPage;
    }
    if (this.$totalPages) {
      this.$totalPages.textContent = this.totalPages;
    }

    // Dispatch event on page change
    if (this.currentPage !== previousPage) {
      this.emit('slideChanged', this, {
        detail: {
          currentPage: this.currentPage,
          currentElement: this.visibleItems[this.currentPage - 1],
        },
      });
    }

    // Update button states (unless looping)
    if (!this.enableLooping) {
      this.updateButtonStates();
    }
  }

  updateButtonStates() {
    const isAtStart = this.isSlideVisible(this.visibleItems[0]) && this.$slider.scrollLeft === 0;
    const isAtEnd = this.isSlideVisible(this.visibleItems[this.visibleItems.length - 1]);

    if (this.$prevButton) {
      this.$prevButton.disabled = isAtStart;
      this.$prevButton.classList.toggle('opacity-50', isAtStart);
    }
    if (this.$nextButton) {
      this.$nextButton.disabled = isAtEnd;
      this.$nextButton.classList.toggle('opacity-50', isAtEnd);
    }
  }

  isSlideVisible(element, offset = 0) {
    const lastVisibleSlide = this.$slider.clientWidth + this.$slider.scrollLeft - offset;
    return (
      element.offsetLeft + element.clientWidth <= lastVisibleSlide &&
      element.offsetLeft >= this.$slider.scrollLeft
    );
  }

  onPrevClick(event) {
    event.preventDefault();
    const step = parseInt(event.currentTarget.dataset.step) || 1;
    this.scrollTo(this.$slider.scrollLeft - step * this.sliderItemOffset);
  }

  onNextClick(event) {
    event.preventDefault();
    const step = parseInt(event.currentTarget.dataset.step) || 1;
    this.scrollTo(this.$slider.scrollLeft + step * this.sliderItemOffset);
  }

  scrollTo(position) {
    this.$slider.scrollTo({
      left: position,
      behavior: 'smooth',
    });
  }

  // Go to specific slide (1-indexed)
  goToSlide(index) {
    const position = (index - 1) * this.sliderItemOffset;
    this.scrollTo(position);
  }
}

customElements.define('c-slider', Slider);
export default Slider;
