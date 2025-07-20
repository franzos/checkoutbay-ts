/**
 * Full-screen Checkout Overlay
 * Handles address collection and payment initiation
 */

import Decimal from 'decimal.js';
import type { Cart } from '../core/cart.js';
import { Storage } from '../core/storage.js';
import { getAvailableCountriesForShipping, getCountrySubdivisions } from '../utils/countries.js';
import { createElement, escapeHtml } from '../utils/dom.js';

interface CountryInfo {
  name: string;
  alpha2: string;
}

interface CountrySubdivision {
  name: string;
  alpha2: string;
  country: string;
}

interface CheckoutAddress {
  recipient_name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  phone?: string;
}

interface CheckoutData {
  email: string;
  shippingAddress: CheckoutAddress;
  billingAddress?: CheckoutAddress;
}

interface CheckoutOverlayCallbacks {
  onSuccess?: (checkoutData: CheckoutData) => void;
  onCancel?: () => void;
  onError?: (error: Error) => void;
}

export class CheckoutOverlay {
  private cart: Cart;
  private callbacks: CheckoutOverlayCallbacks;
  private overlay: HTMLElement | null;
  private availableCountries: CountryInfo[];
  private availableSubdivisions: CountrySubdivision[];
  private formData: CheckoutData;
  private isProcessing: boolean;

  constructor(cart: Cart, callbacks: CheckoutOverlayCallbacks = {}) {
    this.cart = cart;
    this.callbacks = {
      onSuccess: callbacks.onSuccess || (() => {}),
      onCancel: callbacks.onCancel || (() => {}),
      onError: callbacks.onError || (() => {})
    };
    
    this.overlay = null;
    this.availableCountries = [];
    this.availableSubdivisions = [];
    this.formData = {
      email: '',
      shippingAddress: {
        recipient_name: '',
        street: '',
        city: '',
        state: '',
        country: Storage.getSelectedCountry() || '',
        zip: '',
        phone: ''
      },
      billingAddress: undefined // Will use shipping address if not provided
    };
    this.isProcessing = false;
  }

  async show(): Promise<void> {
    this.createOverlay();
    
    // Fetch available countries before rendering form
    await this.loadAvailableCountries();
    
    // Load subdivisions for the initially selected country
    if (this.formData.shippingAddress.country) {
      await this.loadSubdivisions(this.formData.shippingAddress.country);
    }
    
    this.renderForm();
    
    // Show overlay
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      if (this.overlay) {
        this.overlay.classList.add('cb-checkout-show');
      }
    });
  }

  private async loadAvailableCountries(): Promise<void> {
    try {
      // Fetch shipping rates to get available countries
      const shippingRates = await this.cart.api.getPublicShippingRates(this.cart.shopId);
      
      // Get available countries for shipping
      this.availableCountries = getAvailableCountriesForShipping(shippingRates);
    } catch (error) {
      console.error('[CheckoutBay] Failed to load available countries:', error);
      // Fallback to empty array, form will show error
      this.availableCountries = [];
    }
  }

  private createOverlay(): void {
    // Create full-screen overlay
    this.overlay = createElement('div', 'cb-checkout-overlay');
    
    // Create checkout container
    const container = createElement('div', 'cb-checkout-container');
    
    // Header
    const header = createElement('div', 'cb-checkout-header');
    const title = createElement('h1', 'cb-checkout-title', {
      innerHTML: 'Complete Your Order'
    });
    const closeButton = createElement('button', 'cb-checkout-close', {
      innerHTML: '×',
      'aria-label': 'Close checkout'
    });
    closeButton.addEventListener('click', () => this.handleCancel());
    
    header.appendChild(title);
    header.appendChild(closeButton);
    
    // Content area
    const content = createElement('div', 'cb-checkout-content');
    
    // Left side - form
    const formSection = createElement('div', 'cb-checkout-form');
    
    // Right side - order summary
    const summarySection = createElement('div', 'cb-checkout-summary');
    
    content.appendChild(formSection);
    content.appendChild(summarySection);
    
    container.appendChild(header);
    container.appendChild(content);
    
    this.overlay.appendChild(container);
    document.body.appendChild(this.overlay);
  }

  private renderForm(): void {
    if (!this.overlay) return;
    
    const formSection = this.overlay.querySelector('.cb-checkout-form') as HTMLElement;
    
    // Email section
    const emailSection = this.createFormSection('Email Address', [
      {
        type: 'email',
        name: 'email',
        placeholder: 'your@email.com',
        required: true,
        value: this.formData.email
      }
    ]);
    
    // Shipping address section
    const shippingSection = this.createShippingAddressSection();
    
    // Submit button
    const submitButton = createElement('button', 'cb-button cb-button-primary cb-button-large cb-checkout-submit', {
      innerHTML: 'Complete Order'
    });
    submitButton.addEventListener('click', () => this.handleSubmit());
    
    formSection.appendChild(emailSection);
    formSection.appendChild(shippingSection);
    formSection.appendChild(submitButton);
    
    // Render order summary
    this.renderOrderSummary();
  }

  private createShippingAddressSection(): HTMLElement {
    const section = createElement('div', 'cb-form-section');
    
    const titleElement = createElement('h3', 'cb-form-section-title', {
      innerHTML: 'Shipping Address'
    });
    section.appendChild(titleElement);
    
    // Regular text inputs
    const textFields = [
      {
        type: 'text',
        name: 'recipient_name',
        placeholder: 'Full Name',
        required: true,
        value: this.formData.shippingAddress.recipient_name
      },
      {
        type: 'text',
        name: 'street',
        placeholder: 'Street Address',
        required: true,
        value: this.formData.shippingAddress.street
      },
      {
        type: 'text',
        name: 'city',
        placeholder: 'City',
        required: true,
        value: this.formData.shippingAddress.city
      },
      {
        type: 'text',
        name: 'zip',
        placeholder: 'Postal Code',
        required: true,
        value: this.formData.shippingAddress.zip
      }
    ];
    
    // Add text fields
    textFields.forEach(field => {
      const input = createElement('input', 'cb-form-input', {
        type: field.type,
        name: field.name,
        placeholder: field.placeholder,
        required: field.required,
        value: field.value
      }) as HTMLInputElement;
      
      input.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        (this.formData.shippingAddress as any)[field.name] = target.value;
      });
      
      section.appendChild(input);
    });
    
    // Add country select dropdown
    const countrySelect = this.createCountrySelect();
    section.appendChild(countrySelect);
    
    // Add state/subdivision select dropdown
    const stateSelect = this.createStateSelect();
    section.appendChild(stateSelect);
    
    // Add phone field
    const phoneInput = createElement('input', 'cb-form-input', {
      type: 'tel',
      name: 'phone',
      placeholder: 'Phone Number (Optional)',
      required: false,
      value: this.formData.shippingAddress.phone || ''
    }) as HTMLInputElement;
    
    phoneInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.formData.shippingAddress.phone = target.value;
    });
    
    section.appendChild(phoneInput);
    
    return section;
  }

  private createCountrySelect(): HTMLSelectElement {
    const select = createElement('select', 'cb-form-input cb-country-select', {
      name: 'country',
      required: true
    }) as HTMLSelectElement;
    
    // Add default option
    const defaultOption = createElement('option', '', {
      value: '',
      innerHTML: 'Select Country...'
    }) as HTMLOptionElement;
    select.appendChild(defaultOption);
    
    // Add available countries
    this.availableCountries.forEach(country => {
      const option = createElement('option', '', {
        value: country.alpha2,
        innerHTML: escapeHtml(country.name)
      }) as HTMLOptionElement;
      
      // Set selected if this matches current country
      if (country.alpha2 === this.formData.shippingAddress.country) {
        option.selected = true;
      }
      
      select.appendChild(option);
    });
    
    // Handle country changes
    select.addEventListener('change', async (e) => {
      const target = e.target as HTMLSelectElement;
      this.formData.shippingAddress.country = target.value;
      
      // Clear state when country changes
      this.formData.shippingAddress.state = '';
      
      // Update storage
      Storage.setSelectedCountry(target.value);
      
      // Load subdivisions for new country
      await this.loadSubdivisions(target.value);
      
      // Update the state dropdown
      this.updateStateSelect();
      
      // Recalculate order if needed
      if (this.cart && !this.cart.isEmpty()) {
        this.cart.calculateOrder().then(() => {
          // Re-render order summary with updated totals
          this.renderOrderSummary();
        }).catch(error => {
          console.error('[CheckoutBay] Failed to recalculate order:', error);
        });
      }
    });
    
    return select;
  }

  private async loadSubdivisions(countryCode: string): Promise<void> {
    if (!countryCode) {
      this.availableSubdivisions = [];
      return;
    }
    
    try {
      this.availableSubdivisions = getCountrySubdivisions(countryCode);
    } catch (error) {
      console.error('[CheckoutBay] Failed to load subdivisions:', error);
      this.availableSubdivisions = [];
    }
  }

  private createStateSelect(): HTMLSelectElement {
    const select = createElement('select', 'cb-form-input cb-state-select', {
      name: 'state',
      required: true
    }) as HTMLSelectElement;
    
    this.populateStateSelect(select);
    
    // Handle state changes
    select.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.formData.shippingAddress.state = target.value;
    });
    
    return select;
  }

  private populateStateSelect(select: HTMLSelectElement): void {
    // Clear existing options
    select.innerHTML = '';
    
    // Add default option
    const defaultOption = createElement('option', '', {
      value: '',
      innerHTML: 'Select State/Province...'
    }) as HTMLOptionElement;
    select.appendChild(defaultOption);
    
    // Add subdivision options
    this.availableSubdivisions.forEach(subdivision => {
      const option = createElement('option', '', {
        value: subdivision.alpha2,
        innerHTML: escapeHtml(subdivision.name)
      }) as HTMLOptionElement;
      
      // Set selected if this matches current state
      if (subdivision.alpha2 === this.formData.shippingAddress.state) {
        option.selected = true;
      }
      
      select.appendChild(option);
    });
    
    // If no subdivisions available, show text input style message
    if (this.availableSubdivisions.length === 0) {
      const noSubdivisionsOption = createElement('option', '', {
        value: '',
        innerHTML: 'Enter manually in postal code field',
        disabled: true
      }) as HTMLOptionElement;
      select.appendChild(noSubdivisionsOption);
      select.disabled = true;
    } else {
      select.disabled = false;
    }
  }

  private updateStateSelect(): void {
    if (!this.overlay) return;
    
    const stateSelect = this.overlay.querySelector('.cb-state-select') as HTMLSelectElement;
    if (stateSelect) {
      this.populateStateSelect(stateSelect);
    }
  }

  private createFormSection(title: string, fields: Array<{
    type: string;
    name: string;
    placeholder: string;
    required: boolean;
    value: string;
  }>): HTMLElement {
    const section = createElement('div', 'cb-form-section');
    
    const titleElement = createElement('h3', 'cb-form-section-title', {
      innerHTML: title
    });
    section.appendChild(titleElement);
    
    fields.forEach(field => {
      const input = createElement('input', 'cb-form-input', {
        type: field.type,
        name: field.name,
        placeholder: field.placeholder,
        required: field.required,
        value: field.value
      }) as HTMLInputElement;
      
      input.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement;
        if (field.name === 'email') {
          this.formData.email = target.value;
        } else {
          (this.formData.shippingAddress as any)[field.name] = target.value;
        }
      });
      
      section.appendChild(input);
    });
    
    return section;
  }

  private renderOrderSummary(): void {
    if (!this.overlay) return;
    
    const summarySection = this.overlay.querySelector('.cb-checkout-summary') as HTMLElement;
    summarySection.innerHTML = ''; // Clear previous content
    
    const title = createElement('h3', 'cb-summary-title', {
      innerHTML: 'Order Summary'
    });
    summarySection.appendChild(title);
    
    const cartData = this.cart.getCartData();
    
    // Cart items with quantity controls
    const itemsList = createElement('div', 'cb-summary-items');
    cartData.items.forEach(item => {
      const itemElement = createElement('div', 'cb-summary-item');
      
      // Item info section
      const itemInfo = createElement('div', 'cb-summary-item-info');
      
      const itemName = createElement('div', 'cb-summary-item-name', {
        innerHTML: escapeHtml(item.product?.title || 'Product')
      });
      itemInfo.appendChild(itemName);
      
      if (item.product?.price) {
        const unitPrice = createElement('div', 'cb-summary-item-unit-price', {
          innerHTML: `${this.cart.formatPrice(item.product.price.toString())} each`
        });
        itemInfo.appendChild(unitPrice);
      }
      
      // Quantity controls section
      const quantityControls = createElement('div', 'cb-quantity-controls');
      
      const decreaseBtn = createElement('button', 'cb-quantity-btn cb-quantity-decrease', {
        innerHTML: '−',
        type: 'button',
        disabled: item.quantity <= 1
      }) as HTMLButtonElement;
      
      const quantityDisplay = createElement('span', 'cb-quantity-display', {
        innerHTML: item.quantity.toString()
      });
      
      const increaseBtn = createElement('button', 'cb-quantity-btn cb-quantity-increase', {
        innerHTML: '+',
        type: 'button'
      }) as HTMLButtonElement;
      
      // Add event listeners for quantity controls
      decreaseBtn.addEventListener('click', () => {
        if (item.quantity > 1) {
          this.updateItemQuantity(item.productId, item.quantity - 1);
        }
      });
      
      increaseBtn.addEventListener('click', () => {
        this.updateItemQuantity(item.productId, item.quantity + 1);
      });
      
      quantityControls.appendChild(decreaseBtn);
      quantityControls.appendChild(quantityDisplay);
      quantityControls.appendChild(increaseBtn);
      
      // Remove button
      const removeBtn = createElement('button', 'cb-remove-item', {
        innerHTML: '×',
        type: 'button',
        'aria-label': 'Remove item'
      }) as HTMLButtonElement;
      
      removeBtn.addEventListener('click', () => {
        this.removeItem(item.productId);
      });
      
      // Item price (total for this item)
      const itemPrice = createElement('div', 'cb-summary-item-price');
      if (item.product?.price) {
        const totalPrice = Decimal(item.product.price).mul(item.quantity);
        itemPrice.innerHTML = this.cart.formatPrice(totalPrice.toString());
      }
      
      // Assemble item element
      itemElement.appendChild(itemInfo);
      itemElement.appendChild(quantityControls);
      itemElement.appendChild(removeBtn);
      itemElement.appendChild(itemPrice);
      
      itemsList.appendChild(itemElement);
    });
    summarySection.appendChild(itemsList);
    
    // Order totals
    if (cartData.calculatedOrder) {
      const totalsSection = createElement('div', 'cb-summary-totals');
      
      const subtotal = createElement('div', 'cb-summary-line', {
        innerHTML: `<span>Subtotal:</span><span>${this.cart.formatPrice(cartData.calculatedOrder.subtotal.toString())}</span>`
      });
      
      const shipping = createElement('div', 'cb-summary-line', {
        innerHTML: `<span>Shipping:</span><span>${this.cart.formatPrice((cartData.calculatedOrder.shipping_total || '0').toString())}</span>`
      });
      
      const tax = createElement('div', 'cb-summary-line', {
        innerHTML: `<span>Tax:</span><span>${this.cart.formatPrice((cartData.calculatedOrder.tax_total || '0').toString())}</span>`
      });
      
      const total = createElement('div', 'cb-summary-line cb-summary-total', {
        innerHTML: `<span>Total:</span><span>${this.cart.formatPrice(cartData.calculatedOrder.total.toString())}</span>`
      });
      
      totalsSection.appendChild(subtotal);
      totalsSection.appendChild(shipping);
      totalsSection.appendChild(tax);
      totalsSection.appendChild(total);
      summarySection.appendChild(totalsSection);
    }
    
    // Shipping country info
    const countryInfo = createElement('div', 'cb-summary-country', {
      innerHTML: `Shipping to: ${Storage.getSelectedCountry()}`
    });
    summarySection.appendChild(countryInfo);
  }

  private async handleSubmit(): Promise<void> {
    if (this.isProcessing) return;
    
    // Validate form
    if (!this.validateForm()) {
      return;
    }
    
    // Disable submit button and show loading
    this.setProcessingState(true);
    
    try {
      // Call cart checkout with address data
      await this.cart.checkoutWithAddress(this.formData);
      
      // Success callback (this should redirect to payment)
      this.callbacks.onSuccess?.(this.formData);
    } catch (error: any) {
      this.setProcessingState(false);
      this.showError(error.message);
      this.callbacks.onError?.(error);
    }
  }

  private validateForm(): boolean {
    const requiredFields = [
      'email',
      'shippingAddress.recipient_name',
      'shippingAddress.street',
      'shippingAddress.city',
      'shippingAddress.state',
      'shippingAddress.country',
      'shippingAddress.zip'
    ];
    
    for (const field of requiredFields) {
      const value = field.includes('.') 
        ? (this.formData as any)[field.split('.')[0]][field.split('.')[1]]
        : (this.formData as any)[field];
      
      if (!value || value.trim() === '') {
        this.showError(`Please fill in all required fields`);
        return false;
      }
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.formData.email)) {
      this.showError('Please enter a valid email address');
      return false;
    }
    
    return true;
  }

  private setProcessingState(processing: boolean): void {
    this.isProcessing = processing;
    
    if (!this.overlay) return;
    
    const submitButton = this.overlay.querySelector('.cb-checkout-submit') as HTMLButtonElement;
    
    if (processing) {
      submitButton.disabled = true;
      submitButton.innerHTML = 'Processing...';
    } else {
      submitButton.disabled = false;
      submitButton.innerHTML = 'Complete Order';
    }
  }

  private showError(message: string): void {
    if (!this.overlay) return;
    
    // Remove existing error
    const existingError = this.overlay.querySelector('.cb-checkout-error');
    if (existingError) {
      existingError.remove();
    }
    
    // Add new error
    const errorElement = createElement('div', 'cb-checkout-error', {
      innerHTML: escapeHtml(message)
    });
    
    const formSection = this.overlay.querySelector('.cb-checkout-form') as HTMLElement;
    formSection.insertBefore(errorElement, formSection.firstChild);
    
    // Auto-remove error after 5 seconds
    setTimeout(() => {
      if (errorElement.parentNode) {
        errorElement.remove();
      }
    }, 5000);
  }

  private async updateItemQuantity(productId: string, newQuantity: number): Promise<void> {
    try {
      await this.cart.updateQuantity(productId, newQuantity);
      // Re-render the order summary with updated quantities
      this.renderOrderSummary();
    } catch (error) {
      this.showError('Failed to update quantity');
    }
  }

  private async removeItem(productId: string): Promise<void> {
    try {
      await this.cart.removeItem(productId);
      
      // Check if cart is empty after removal
      const cartData = this.cart.getCartData();
      if (cartData.isEmpty) {
        // Close checkout overlay if cart becomes empty
        this.handleCancel();
        return;
      }
      
      // Re-render the order summary
      this.renderOrderSummary();
    } catch (error) {
      this.showError('Failed to remove item');
    }
  }

  private handleCancel(): void {
    this.callbacks.onCancel?.();
    this.destroy();
  }

  destroy(): void {
    if (this.overlay && this.overlay.parentNode) {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Remove overlay
      this.overlay.parentNode.removeChild(this.overlay);
    }
    
    this.overlay = null;
  }
}