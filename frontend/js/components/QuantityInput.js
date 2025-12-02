import { Piece } from 'piecesjs';

/**
 * QuantityInput Component
 * Handles quantity +/- buttons for cart and product forms
 */
class QuantityInput extends Piece {
  constructor() {
    super('QuantityInput', {
      stylesheets: [],
    });
  }

  mount() {
    this.$input = this.$('input')[0];
    this.$buttons = this.$$('button');

    if (!this.$input) return;

    // Create change event
    this.changeEvent = new Event('change', { bubbles: true });

    // Bind events
    this.on('change', this.$input, this.onInputChange);
    this.$buttons.forEach((button) => {
      this.on('click', button, this.onButtonClick);
    });

    // Initial validation
    this.validateQtyRules();

    // Subscribe to quantity updates if pubsub exists
    if (typeof subscribe !== 'undefined' && typeof PUB_SUB_EVENTS !== 'undefined') {
      this.quantityUpdateUnsubscriber = subscribe(
        PUB_SUB_EVENTS.quantityUpdate,
        this.validateQtyRules.bind(this)
      );
    }
  }

  unmount() {
    if (this.quantityUpdateUnsubscriber) {
      this.quantityUpdateUnsubscriber();
    }
  }

  onInputChange() {
    this.validateQtyRules();
  }

  onButtonClick(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const previousValue = this.$input.value;

    if (button.name === 'plus') {
      const min = parseInt(this.$input.dataset.min);
      const step = parseInt(this.$input.step);

      if (min > step && this.$input.value == 0) {
        this.$input.value = min;
      } else {
        this.$input.stepUp();
      }
    } else {
      this.$input.stepDown();
    }

    if (previousValue !== this.$input.value) {
      this.$input.dispatchEvent(this.changeEvent);
    }

    // Handle minimum boundary
    if (this.$input.dataset.min === previousValue && button.name === 'minus') {
      this.$input.value = parseInt(this.$input.min);
    }
  }

  validateQtyRules() {
    const value = parseInt(this.$input.value);

    // Disable minus button at min
    if (this.$input.min) {
      const buttonMinus = this.$("[name='minus']")[0];
      if (buttonMinus) {
        buttonMinus.classList.toggle('disabled', value <= parseInt(this.$input.min));
        buttonMinus.disabled = value <= parseInt(this.$input.min);
      }
    }

    // Disable plus button at max
    if (this.$input.max) {
      const max = parseInt(this.$input.max);
      const buttonPlus = this.$("[name='plus']")[0];
      if (buttonPlus) {
        buttonPlus.classList.toggle('disabled', value >= max);
        buttonPlus.disabled = value >= max;
      }
    }
  }
}

customElements.define('c-quantity-input', QuantityInput);
export default QuantityInput;
