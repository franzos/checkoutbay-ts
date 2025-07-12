/**
 * CheckoutBay Embed Library
 * Main entry point and auto-initialization
 */

import { Cart } from './core/cart.js';
import { Storage } from './core/storage.js';
import { events } from './core/events.js';
import { ProductGrid } from './components/product-grid.js';
import { CartWidget } from './components/cart-widget.js';
import { ProductButtons } from './components/product-buttons.js';
import { CountrySelectionModal } from './components/country-selection-modal.js';
import { PaymentResultOverlay } from "./components/payment-result-overlay.js";
import { baseStyles, cartStyles, productStyles } from './styles/base.js';
import {
  injectStyles,
  findElements,
  getDataAttribute,
  escapeHtml,
} from "./utils/dom.js";
import { getAllCountries } from './utils/countries.js';

interface CheckoutBayConfig {
  apiBaseUrl?: string;
  autoInit?: boolean;
  shopId?: string;
  successUrl?: string;
  errorUrl?: string;
  defaultCountry?: string;
  onReady?: (api: any) => void;
}

declare global {
  interface Window {
    CheckoutBayConfig?: CheckoutBayConfig;
    CheckoutBay?: any;
  }
}

class CheckoutBayEmbed {
  public config: CheckoutBayConfig;
  private cart: Cart | null;
  private components: any[];
  private styleElement: HTMLStyleElement | null;

  constructor() {
    this.config = {
      apiBaseUrl: 'https://api.checkoutbay.com/v1',
      autoInit: true,
      shopId: undefined,
      successUrl: undefined,
      errorUrl: undefined,
      defaultCountry: undefined,
      ...window.CheckoutBayConfig
    };
    
    this.cart = null;
    this.components = [];
    this.styleElement = null;
    
    console.log('[CheckoutBay] Initializing embed library', this.config);
  }

  init(): void {
    // Inject styles
    this.injectStyles();
    
    // Wait for DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initComponents());
    } else {
      this.initComponents();
    }
  }

  injectStyles(): void {
    const allStyles = baseStyles + cartStyles + productStyles;
    this.styleElement = injectStyles(allStyles);
  }

  async initComponents(): Promise<void> {
    // Get shop ID from config only
    const shopId = this.getShopId();
    if (!shopId) {
      console.error('[CheckoutBay] No shop ID provided. You must set window.CheckoutBayConfig.shopId');
      this.showConfigurationError();
      return;
    }

    // Initialize cart
    this.cart = new Cart(shopId, this.config.apiBaseUrl || 'https://api.checkoutbay.com/v1');
    
    // Check for payment return parameters first
    this.handlePaymentReturn();
    
    // Set default country if provided in config
    if (this.config.defaultCountry) {
      Storage.setSelectedCountry(this.config.defaultCountry);
      console.log('[CheckoutBay] Using default country:', this.config.defaultCountry);
    }
    
    // Initialize components based on elements found in DOM
    this.initProductGrids();
    this.initCartWidgets();
    this.initProductButtons();
    this.initCountrySelector();
    
    // Expose global methods
    this.exposeGlobalAPI();
    
    console.log('[CheckoutBay] Initialization complete');
  }

  getShopId(): string | null {
    // Only accept shop ID from config, no fallbacks
    if (this.config.shopId) {
      return this.config.shopId;
    }
    
    return null;
  }

  handlePaymentReturn(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const purchase = urlParams.get('purchase');
    const shopId = urlParams.get('shop_id');
    const orderId = urlParams.get('order');
    
    if (purchase && shopId && orderId && this.cart) {
      // Clear cart on successful payment
      if (purchase === "success") {
        this.cart.clear();
        this.showPaymentResultOverlay({
          type: "success",
          orderId: orderId,
          shopId: shopId,
          message: "Thank you! Your order has been placed successfully.",
        });
      } else if (purchase === "failed" || purchase === "cancel") {
        const message =
          purchase === "cancel"
            ? "Payment was cancelled. Your cart has been preserved."
            : "Payment failed. Please try again.";
        this.showPaymentResultOverlay({
          type: purchase === "cancel" ? "cancelled" : "error",
          orderId: orderId,
          shopId: shopId,
          message: message,
        });
      }
    }
  }

  showPaymentResultOverlay(resultData: {
    type: 'success' | 'error' | 'cancelled';
    orderId: string;
    shopId?: string;
    message: string;
  }): void {
    const overlay = new PaymentResultOverlay(resultData, {
      onClose: () => {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        // Optional: emit event when overlay closes
        events.emit("payment-result:closed", resultData);
      }
    });
    
    overlay.show();
  }

  showConfigurationError(): void {
    // Show configuration error in all product grid containers
    const containers = findElements('#cb-products, [data-cb-products]');
    containers.forEach(container => {
      container.innerHTML = `
        <div class="cb-error">
          <h3>Configuration Required</h3>
          <p>Shop ID must be provided via window.CheckoutBayConfig.shopId</p>
          <pre>window.CheckoutBayConfig = { shopId: 'your-shop-uuid' };</pre>
        </div>
      `;
    });
  }

  initCountrySelector(): void {
    // Initialize country selector components in DOM
    const containers = findElements('#cb-countries, [data-cb-countries]');
    
    containers.forEach(container => {
      // Create a simple country selector that loads available countries
      this.createCountrySelector(container);
    });
  }

  async createCountrySelector(container: HTMLElement): Promise<void> {
    if (!this.cart) return;
    
    container.className = 'cb-countries-list';
    container.innerHTML = '<div class="cb-loading">Loading countries...</div>';
    
    try {
      // Fetch shipping rates to get available countries
      const shippingRates = await this.cart.api.getPublicShippingRates(this.cart.shopId);
      
      // Import the function to get available countries
      const { getAvailableCountriesForShipping } = await import('./utils/countries.js');
      const availableCountries = getAvailableCountriesForShipping(shippingRates);
      
      // Create text list of countries
      if (availableCountries.length > 0) {
        const countryNames = availableCountries.map(country => country.name);
        const countryText = countryNames.join(', ');
        
        container.innerHTML = `<div class="cb-countries-text">We ship to: ${escapeHtml(countryText)}</div>`;
      } else {
        container.innerHTML = '<div class="cb-countries-text">No shipping countries available</div>';
      }
      
    } catch (error: any) {
      console.error('[CheckoutBay] Failed to load countries list:', error);
      container.innerHTML = `<div class="cb-error">Failed to load countries: ${escapeHtml(error.message)}</div>`;
    }
  }

  initProductGrids(): void {
    if (!this.cart) return;
    
    const containers = findElements('#cb-products, [data-cb-products]');
    
    containers.forEach(container => {
      const config = {
        columns: getDataAttribute(container, 'columns', 'auto-fill'),
        showDescription: getDataAttribute(container, 'show-description', 'true') === 'true',
        showQuantitySelector: getDataAttribute(container, 'show-quantity', 'true') === 'true'
      };
      
      const productGrid = new ProductGrid(container, this.cart!, config);
      // Show initial state (will show "select country" message if no country selected)
      productGrid.render();
      this.components.push(productGrid);
    });
  }

  initCartWidgets(): void {
    if (!this.cart) return;
    
    const containers = findElements('#cb-cart, [data-cb-cart]');
    
    containers.forEach(container => {
      const config = {
        position: getDataAttribute(container, 'position', 'top-right'),
        showSidebar: getDataAttribute(container, 'show-sidebar', 'true') === 'true'
      };
      
      const cartWidget = new CartWidget(container, this.cart!, config);
      cartWidget.render();
      this.components.push(cartWidget);
    });
  }

  initProductButtons(): void {
    if (!this.cart) return;
    
    const productButtons = new ProductButtons(this.cart);
    productButtons.init();
    this.components.push(productButtons);
  }

  exposeGlobalAPI(): void {
    if (!this.cart) return;
    
    // Expose methods for external use
    window.CheckoutBay = {
      // Cart methods
      addToCart: (productId: string, quantity: number = 1) => this.cart!.addItem(productId, quantity),
      removeFromCart: (productId: string) => this.cart!.removeItem(productId),
      updateQuantity: (productId: string, quantity: number) => this.cart!.updateQuantity(productId, quantity),
      clearCart: () => this.cart!.clear(),
      getCart: () => this.cart!.getCartData(),
      checkout: () => this.cart!.checkoutWithAddress,
      
      // Event methods
      on: (event: string, callback: (data: any) => void) => events.on(event, callback),
      off: (event: string, callback: (data: any) => void) => events.off(event, callback),
      
      // Utility methods
      refresh: () => this.refresh(),
      setShopId: async (shopId: string) => {
        console.warn('[CheckoutBay] setShopId is deprecated. Set window.CheckoutBayConfig.shopId and reload the page.');
        this.config.shopId = shopId;
        await this.refresh();
      },
      setCountry: (countryCode: string) => {
        Storage.setSelectedCountry(countryCode);
        if (this.cart) {
          this.cart.calculateOrder();
        }
        // Emit country change event
        events.emit('checkoutbay:country-changed', countryCode);
      },
      
      setWarehouse: (warehouseId: string) => {
        Storage.setSelectedWarehouse(warehouseId);
        if (this.cart) {
          this.cart.calculateOrder();
        }
        // Emit warehouse change event
        events.emit('checkoutbay:warehouse-changed', warehouseId);
      },
      
      getSelectedCountry: () => Storage.getSelectedCountry(),
      getSelectedWarehouse: () => Storage.getSelectedWarehouse(),
      
      showCountrySelector: async () => {
        if (!this.cart) throw new Error('Cart not initialized');
        
        try {
          // Create and show a modal with country selection
          const modal = new CountrySelectionModal(
            this.cart.api,
            this.cart.shopId,
            {
              onSelect: (country: string, warehouse?: string) => {
                Storage.setSelectedCountry(country);
                if (warehouse) {
                  Storage.setSelectedWarehouse(warehouse);
                }
                
                // Recalculate cart
                if (this.cart && !this.cart.isEmpty()) {
                  this.cart.calculateOrder();
                }
                
                // Emit events
                events.emit('checkoutbay:country-changed', country);
                if (warehouse) {
                  events.emit('checkoutbay:warehouse-changed', warehouse);
                }
                
                modal.destroy();
              },
              onCancel: () => {
                modal.destroy();
              }
            }
          );
          
          await modal.show();
        } catch (error) {
          console.error('[CheckoutBay] Failed to show country selector:', error);
          throw error;
        }
      },
      
      // Utility methods for demo/external use
      getAllCountries: () => getAllCountries(),
      api: this.cart.api,
      
      // Configuration
      config: this.config,
      version: '1.0.0'
    };
    
    // Emit ready event
    events.emit('checkoutbay:ready', window.CheckoutBay);
    
    // Also dispatch a DOM event for external listeners
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      const event = new CustomEvent('checkoutbay:ready', { 
        detail: window.CheckoutBay 
      });
      window.dispatchEvent(event);
    }
    
    // Call user's onReady callback if provided
    if (this.config.onReady && typeof this.config.onReady === 'function') {
      this.config.onReady(window.CheckoutBay);
    }
  }

  async refresh(): Promise<void> {
    console.log('[CheckoutBay] Refreshing library components');
    
    // Destroy existing components with proper cleanup
    const destroyPromises = this.components.map(component => {
      return new Promise<void>((resolve) => {
        if (component.destroy) {
          try {
            component.destroy();
          } catch (error) {
            console.warn('[CheckoutBay] Error destroying component:', error);
          }
        }
        // Give a short delay for cleanup
        setTimeout(resolve, 10);
      });
    });
    
    // Wait for all components to be destroyed
    await Promise.all(destroyPromises);
    this.components = [];
    
    // Clear cart reference so it gets recreated with new shop ID
    this.cart = null;
    
    // Re-initialize with a small delay to ensure DOM is stable
    setTimeout(async () => {
      await this.initComponents();
      console.log('[CheckoutBay] Library refresh complete');
    }, 50);
  }

  destroy(): void {
    console.log('[CheckoutBay] Destroying embed library');
    
    // Cleanup components
    this.components.forEach(component => {
      if (component.destroy) {
        component.destroy();
      }
    });
    this.components = [];
    
    // Remove styles
    if (this.styleElement) {
      this.styleElement.remove();
      this.styleElement = null;
    }
    
    // Clear references
    this.cart = null;
    
    // Remove global API
    delete window.CheckoutBay;
    
    console.log('[CheckoutBay] Library destroyed');
  }
}

// Auto-initialize when script loads
const embed = new CheckoutBayEmbed();

if (embed.config.autoInit !== false) {
  embed.init();
}

// Export for manual initialization if needed
export default CheckoutBayEmbed;