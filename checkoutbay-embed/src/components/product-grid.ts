/**
 * Simple Product Grid Component
 */

import type { PublicProduct, ProductTranslations } from '@gofranz/checkoutbay-common';
import type { Cart } from '../core/cart.js';
import { events } from '../core/events.js';
import { Storage } from '../core/storage.js';
import { createElement, escapeHtml } from '../utils/dom.js';

interface ProductGridConfig {
  columns?: string;
  showDescription?: boolean;
}

/**
 * Helper function to get translated text, falling back to English
 */
function getTranslatedText(translations: ProductTranslations, preferredLanguage: string = 'en'): string {
  // Try preferred language first, then fallback to English, then any available language
  return translations[preferredLanguage as keyof ProductTranslations] || 
         translations.en || 
         Object.values(translations).find(text => text) || 
         '';
}

export class ProductGrid {
  private container: HTMLElement;
  private cart: Cart;
  private config: ProductGridConfig;
  private products: PublicProduct[];

  constructor(container: HTMLElement, cart: Cart, config: ProductGridConfig = {}) {
    this.container = container;
    this.cart = cart;
    this.config = {
      columns: 'auto-fill',
      showDescription: true,
      ...config
    };
    this.products = [];
    
    // Listen for country changes
    this.setupEventListeners();
  }

  setupEventListeners(): void {
    // Listen for country selection changes
    events.on('checkoutbay:country-changed', () => {
      this.render();
    });
  }

  async render(): Promise<void> {
    this.container.className = 'cb-product-grid';
    
    console.log('[ProductGrid] Loading products for shop:', this.cart.shopId);
    this.showLoading();

    try {
      await this.loadProducts();
      this.renderProducts();
    } catch (error: any) {
      console.error('[ProductGrid] Error loading products:', error);
      this.showError(error.message);
    }
  }

  async loadProducts(): Promise<void> {
    console.log('[ProductGrid] Loading products for shop:', this.cart.shopId, 'warehouse:', Storage.getSelectedWarehouse());
    const response = await this.cart.api.getPublicProducts(
      this.cart.shopId,
      Storage.getSelectedWarehouse()
    );
    this.products = response.data || [];
    console.log('[ProductGrid] Loaded', this.products.length, 'products');
  }

  renderProducts(): void {
    this.container.innerHTML = '';

    if (this.products.length === 0) {
      this.showError('No products available');
      return;
    }

    // Create grid container
    const grid = createElement('div', 'cb-products-grid');
    
    this.products.forEach(product => {
      const productCard = this.createProductCard(product);
      grid.appendChild(productCard);
    });

    this.container.appendChild(grid);
  }

  createProductCard(product: PublicProduct): HTMLElement {
    const card = createElement('div', 'cb-product-card');
    
    // Product image
    const imageUrl = product.cover_url;
    if (imageUrl) {
      const image = createElement('img', 'cb-product-image', {
        src: imageUrl,
        alt: escapeHtml(product.title),
        loading: 'lazy'
      });
      card.appendChild(image);
    }
    
    // Product info
    const info = createElement('div', 'cb-product-info');
    
    const name = createElement('h3', 'cb-product-name', {
      innerHTML: escapeHtml(product.title)
    });
    info.appendChild(name);
    
    if (this.config.showDescription && product.description) {
      const descriptionText = getTranslatedText(product.description);
      if (descriptionText) {
        const description = createElement('p', 'cb-product-description', {
          innerHTML: escapeHtml(descriptionText)
        });
        info.appendChild(description);
      }
    }
    
    const price = createElement('div', 'cb-product-price', {
      innerHTML: this.cart.formatPrice(product.price)
    });
    info.appendChild(price);
    
    // Add to cart button
    const button = createElement('button', 'cb-button cb-button-primary cb-add-to-cart', {
      innerHTML: 'Add to Cart',
      'data-product-id': product.id
    });
    
    button.addEventListener('click', () => {
      this.addToCart(product.id);
    });
    
    info.appendChild(button);
    card.appendChild(info);
    
    return card;
  }

  async addToCart(productId: string): Promise<void> {
    try {
      await this.cart.addItem(productId, 1);
      this.showMessage('Added to cart!');
    } catch (error) {
      this.showMessage('Failed to add to cart', 'error');
    }
  }

  showLoading(): void {
    this.container.innerHTML = '<div class="cb-loading">Loading products...</div>';
  }

  showError(message: string): void {
    this.container.innerHTML = `<div class="cb-error">Error: ${escapeHtml(message)}</div>`;
  }

  showMessage(message: string, type: 'success' | 'error' = 'success'): void {
    const messageElement = createElement('div', `cb-message cb-message-${type}`, {
      innerHTML: escapeHtml(message)
    });
    
    this.container.insertBefore(messageElement, this.container.firstChild);
    
    setTimeout(() => {
      if (messageElement.parentNode) {
        messageElement.remove();
      }
    }, 2000);
  }

  destroy(): void {
    // Remove event listeners
    events.off('checkoutbay:country-changed', () => {});
    
    if (this.container) {
      this.container.innerHTML = '';
    }
  }
}