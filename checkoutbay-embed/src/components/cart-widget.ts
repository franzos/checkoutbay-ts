/**
 * Simple Cart Widget - floating cart icon with checkout
 */

import { createElement, escapeHtml } from '../utils/dom.js';
import { events } from '../core/events.js';
import { CheckoutOverlay } from './checkout-overlay.js';
import type { Cart } from '../core/cart.js';

interface CartWidgetConfig {
  position?: string;
}

export class CartWidget {
  private container: HTMLElement | null;
  private cart: Cart;
  private config: CartWidgetConfig;
  private cartIcon: HTMLElement | null;
  private checkoutOverlay: CheckoutOverlay | null;

  constructor(container: HTMLElement | null, cart: Cart, config: CartWidgetConfig = {}) {
    this.container = container;
    this.cart = cart;
    this.config = {
      position: 'top-right',
      ...config
    };
    this.cartIcon = null;
    this.checkoutOverlay = null;
    
    this.setupEventListeners();
  }

  render(): void {
    this.createCartIcon();
    this.updateCartIcon();
  }

  setupEventListeners(): void {
    const updateHandler = () => this.updateCartIcon();
    events.on('cart:updated', updateHandler);
    events.on('cart:calculated', updateHandler);
  }

  createCartIcon(): void {
    // Cart icon container
    this.cartIcon = createElement('div', `cb-cart-icon cb-cart-position-${this.config.position}`);
    
    // Cart icon button
    const iconButton = createElement('button', 'cb-cart-icon-button', {
      'aria-label': 'Shopping cart'
    });
    
    // Cart icon SVG
    const iconSvg = createElement('div', 'cb-cart-icon-svg', {
      innerHTML: `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="m1 1 4 4 12 8-3 3-8-8"></path>
          <path d="M4.5 7L19 7l-2 8H7z"></path>
        </svg>
      `
    });
    
    // Cart badge (item count)
    const badge = createElement('span', 'cb-cart-badge', {
      innerHTML: '0'
    });
    
    iconButton.appendChild(iconSvg);
    iconButton.appendChild(badge);
    this.cartIcon.appendChild(iconButton);
    
    // Add click handler
    iconButton.addEventListener('click', () => this.openCheckout());
    
    // Insert into container or body
    if (this.container) {
      this.container.appendChild(this.cartIcon);
    } else {
      document.body.appendChild(this.cartIcon);
    }
  }

  updateCartIcon(): void {
    if (!this.cartIcon) return;
    
    const cartData = this.cart.getCartData();
    const badge = this.cartIcon.querySelector('.cb-cart-badge') as HTMLElement;
    const totalItems = cartData.totalItems;
    
    // Update badge
    badge.innerHTML = totalItems.toString();
    badge.style.display = totalItems > 0 ? 'block' : 'none';
    
    // Update cart icon state
    if (totalItems > 0) {
      this.cartIcon.classList.add('cb-cart-has-items');
    } else {
      this.cartIcon.classList.remove('cb-cart-has-items');
    }
  }

  async openCheckout(): Promise<void> {
    const cartData = this.cart.getCartData();
    
    // Check if cart is empty
    if (cartData.isEmpty) {
      this.showMessage('Your cart is empty');
      return;
    }
    
    // Check if country is selected - if not, show a warning but still allow checkout
    if (!this.cart.isCountrySelected()) {
      this.showMessage('Please select a shipping country for accurate shipping costs');
      // Don't return - allow checkout to proceed
    }
    
    // Load products if needed
    try {
      await this.cart.loadProducts();
    } catch (error) {
      this.showMessage('Failed to load product information');
      return;
    }
    
    // Calculate order totals if not already done
    if (!cartData.calculatedOrder) {
      try {
        await this.cart.calculateOrder();
      } catch (error) {
        this.showMessage('Failed to calculate order totals');
        return;
      }
    }
    
    // Open checkout overlay
    this.checkoutOverlay = new CheckoutOverlay(this.cart, {
      onSuccess: (checkoutData: any) => {
        // Checkout overlay handles redirect to payment
        this.checkoutOverlay?.destroy();
        this.checkoutOverlay = null;
      },
      onCancel: () => {
        this.checkoutOverlay?.destroy();
        this.checkoutOverlay = null;
      },
      onError: (error: any) => {
        console.error('[CheckoutBay] Checkout error:', error);
        // Keep overlay open for user to retry
      }
    });
    
    this.checkoutOverlay.show();
  }

  showMessage(message: string): void {
    // Simple toast message
    const toast = createElement('div', 'cb-toast', {
      innerHTML: escapeHtml(message)
    });
    
    document.body.appendChild(toast);
    
    // Show toast
    requestAnimationFrame(() => {
      toast.classList.add('cb-toast-show');
    });
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.classList.remove('cb-toast-show');
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }
    }, 3000);
  }

  destroy(): void {
    if (this.cartIcon && this.cartIcon.parentNode) {
      this.cartIcon.parentNode.removeChild(this.cartIcon);
    }
    
    if (this.checkoutOverlay) {
      this.checkoutOverlay.destroy();
      this.checkoutOverlay = null;
    }
    
    this.cartIcon = null;
  }
}