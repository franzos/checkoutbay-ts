/**
 * Simple Product Buttons - converts existing elements to add-to-cart buttons
 */

import { getDataAttribute } from '../utils/dom.js';
import type { Cart } from '../core/cart.js';

interface ButtonInfo {
  element: HTMLElement;
  productId: string;
  quantity: number;
  clickHandler: (e: Event) => Promise<void>;
}

export class ProductButtons {
  private cart: Cart;
  private buttons: ButtonInfo[];

  constructor(cart: Cart) {
    this.cart = cart;
    this.buttons = [];
  }

  init(): void {
    this.findAndSetupButtons();
  }

  findAndSetupButtons(): void {
    // Find elements with product-id attributes (as per TODO.md spec)
    const elements = document.querySelectorAll('[product-id]');
    
    elements.forEach(element => {
      const htmlElement = element as HTMLElement;
      const productId = htmlElement.getAttribute('product-id');
      const quantity = parseInt(getDataAttribute(htmlElement, 'quantity', '1'));
      
      if (!productId) {
        console.warn('[CheckoutBay] Button missing product-id attribute:', element);
        return;
      }

      // Style as clickable
      htmlElement.style.cursor = 'pointer';
      htmlElement.classList.add('cb-product-button');
      
      // Add click handler
      const clickHandler = async (e: Event) => {
        e.preventDefault();
        await this.addToCart(htmlElement, productId, quantity);
      };
      
      htmlElement.addEventListener('click', clickHandler);
      
      this.buttons.push({
        element: htmlElement,
        productId,
        quantity,
        clickHandler
      });
    });
  }

  async addToCart(element: HTMLElement, productId: string, quantity: number): Promise<void> {
    console.log('[CheckoutBay] Attempting to add product to cart:', productId, 'quantity:', quantity);
    
    try {
      await this.cart.addItem(productId, quantity);
      
      // Success - no visual changes to button
      console.log('[CheckoutBay] Product successfully added to cart:', productId);
      
    } catch (error: any) {
      console.error('[CheckoutBay] Failed to add product to cart:', error);
      
      // Show alert with specific error message
      let alertMessage = 'Failed to add product to cart.';
      if (error.message && error.message.includes('not found')) {
        alertMessage = `Product not found. The product ID "${productId}" does not exist.`;
      } else if (error.message) {
        alertMessage = `Error: ${error.message}`;
      }
      
      alert(alertMessage);
    }
  }

  destroy(): void {
    // Remove event listeners
    this.buttons.forEach(({ element, clickHandler }) => {
      element.removeEventListener('click', clickHandler);
      element.classList.remove('cb-product-button');
    });
    
    this.buttons = [];
  }
}