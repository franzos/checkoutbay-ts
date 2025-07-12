/**
 * Cart state management
 */

import { Storage } from './storage.js';
import { events } from './events.js';
import { ShopAPI } from './api.js';
import { formatPrice } from '@gofranz/checkoutbay-common';
import type { ProcessedOrder, NewOrderCalculation, NewPublicUserOrder, NewOrderPaymentSubmission, PublicProduct, InlineAddress } from '@gofranz/checkoutbay-common';
import type { Currency } from '@gofranz/common';

interface CartItem {
  productId: string;
  quantity: number;
  product?: PublicProduct;
}

interface CartData {
  items: CartItem[];
  totalItems: number;
  isEmpty: boolean;
  calculatedOrder: ProcessedOrder | null;
  isLoading: boolean;
  error: string | null;
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

export class Cart {
  public shopId: string;
  public api: ShopAPI;
  public items: CartItem[];
  public calculatedOrder: ProcessedOrder | null;
  public isLoading: boolean;
  public error: string | null;

  constructor(shopId: string, apiBaseUrl: string) {
    this.shopId = shopId;
    this.api = new ShopAPI(apiBaseUrl);
    this.items = Storage.getCartItems();
    this.calculatedOrder = null;
    this.isLoading = false;
    this.error = null;
  }

  // Get total number of items in cart
  getTotalItems(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Check if cart is empty
  isEmpty(): boolean {
    return this.items.length === 0;
  }

  // Check if country is selected
  isCountrySelected(): boolean {
    return !!Storage.getSelectedCountry();
  }

  // Add item to cart
  async addItem(productId: string, quantity: number = 1): Promise<void> {
    // Add to cart first (optimistic update)
    const existingItem = this.items.find(item => item.productId === productId);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push({ productId, quantity });
    }
    
    Storage.setCartItems(this.items);
    events.emit('cart:updated', this.getCartData());
    
    // Try to calculate order which will validate the product exists
    try {
      await this.calculateOrder();
    } catch (error: any) {
      // If calculation fails, it might be due to invalid product
      // Remove the item we just added and re-throw the error
      if (existingItem) {
        existingItem.quantity -= quantity;
        if (existingItem.quantity <= 0) {
          this.items = this.items.filter(item => item.productId !== productId);
        }
      } else {
        this.items = this.items.filter(item => item.productId !== productId);
      }
      
      Storage.setCartItems(this.items);
      events.emit('cart:updated', this.getCartData());
      
      // Check if this looks like a product not found error
      if (error.message && (error.message.includes('404') || error.message.includes('not found') || error.status === 404)) {
        throw new Error(`Product '${productId}' not found`);
      }
      
      console.error('[CheckoutBay] Failed to calculate order:', error);
      throw error;
    }
  }

  // Remove item from cart
  async removeItem(productId: string): Promise<void> {
    this.items = this.items.filter(item => item.productId !== productId);
    Storage.setCartItems(this.items);
    events.emit('cart:updated', this.getCartData());
    
    try {
      await this.calculateOrder();
    } catch (error) {
      console.error('[CheckoutBay] Failed to calculate order:', error);
    }
  }

  // Update item quantity
  async updateQuantity(productId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    
    const item = this.items.find(item => item.productId === productId);
    if (item) {
      item.quantity = quantity;
      Storage.setCartItems(this.items);
      events.emit('cart:updated', this.getCartData());
      
      try {
        await this.calculateOrder();
      } catch (error) {
        console.error('[CheckoutBay] Failed to calculate order:', error);
      }
    }
  }

  // Load product details for cart items
  async loadProducts(): Promise<void> {
    if (this.items.length === 0) return;

    try {
      const response = await this.api.getPublicProducts(
        this.shopId,
        Storage.getSelectedWarehouse()
      );
      
      // Update items with product details
      this.items = this.items.map(item => {
        const product = response.data.find(p => p.id === item.productId);
        return { ...item, product };
      }).filter(item => item.product); // Remove items where product not found
      
      Storage.setCartItems(this.items);
      events.emit('cart:updated', this.getCartData());
    } catch (error: any) {
      this.error = error.message || 'Failed to load products';
      events.emit('cart:error', this.error);
      throw error;
    }
  }

  // Calculate order totals
  async calculateOrder(): Promise<void> {
    if (this.items.length === 0) {
      this.calculatedOrder = null;
      return;
    }

    const selectedCountry = Storage.getSelectedCountry();
    if (!selectedCountry) {
      this.error = 'Please select a shipping country to calculate order total';
      events.emit('cart:error', this.error);
      return;
    }

    this.isLoading = true;
    this.error = null;
    events.emit('cart:loading', true);

    try {
      const orderData: NewOrderCalculation = {
        id: this.generateOrderId(),
        shop_id: this.shopId,
        warehouse_id: Storage.getSelectedWarehouse() || undefined,
        currency: 'USD' as Currency,
        destination_country: selectedCountry,
        ignore_threshold: false,
        items: this.items.map(item => ({
          product_id: item.productId,
          quantity: item.quantity
        }))
      };

      this.calculatedOrder = await this.api.calculateOrder(orderData);
      events.emit('cart:calculated', this.calculatedOrder);
    } catch (error: any) {
      this.error = error.message || 'Failed to calculate order';
      events.emit('cart:error', this.error);
      throw error;
    } finally {
      this.isLoading = false;
      events.emit('cart:loading', false);
    }
  }

  // Clear cart
  clear(): void {
    this.items = [];
    this.calculatedOrder = null;
    Storage.setCartItems([]);
    events.emit('cart:updated', this.getCartData());
  }

  // Get cart data for events
  getCartData(): CartData {
    return {
      items: this.items,
      totalItems: this.getTotalItems(),
      isEmpty: this.isEmpty(),
      calculatedOrder: this.calculatedOrder,
      isLoading: this.isLoading,
      error: this.error
    };
  }

  // Generate unique order ID
  generateOrderId(): string {
    return 'order-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  // Create order and initiate payment with address information
  async checkoutWithAddress(checkoutData: CheckoutData): Promise<void> {
    if (this.isEmpty()) {
      throw new Error('Cart is empty');
    }

    if (!this.calculatedOrder) {
      await this.calculateOrder();
    }

    if (!this.calculatedOrder) {
      throw new Error('Unable to calculate order totals');
    }

    try {
      // Step 1: Create the order with full address information
      const orderData: NewPublicUserOrder = {
        id: this.generateOrderId(),
        shop_id: this.shopId,
        warehouse_id: Storage.getSelectedWarehouse() || undefined,
        currency: 'USD' as Currency,
        items: this.items.map(item => ({
          product_id: item.productId,
          quantity: item.quantity
        })),
        customer_user_email: checkoutData.email,
        shipping_address: {
          recipient_name: checkoutData.shippingAddress.recipient_name,
          street: checkoutData.shippingAddress.street,
          city: checkoutData.shippingAddress.city,
          state: checkoutData.shippingAddress.state,
          country: checkoutData.shippingAddress.country,
          zip: checkoutData.shippingAddress.zip,
          phone: checkoutData.shippingAddress.phone || ''
        } as InlineAddress,
        billing_address: (checkoutData.billingAddress || checkoutData.shippingAddress) as InlineAddress
      };

      // Create the order
      await this.api.createOrder(orderData);

      // Step 2: Create payment with configurable redirect URLs
      const config = (window as any).CheckoutBayConfig || {};
      const baseUrl = window.location.origin + window.location.pathname;
      
      // Use configured URLs or fallback to current page with query params
      const successUrl = config.successUrl || baseUrl;
      const cancelUrl = config.cancelUrl || baseUrl;
      
      const paymentData: NewOrderPaymentSubmission = {
        order_id: orderData.id,
        payment_gateway_id: undefined, // Use default payment gateway
        success_url: successUrl,
        cancel_url: cancelUrl
      };

      const payment = await this.api.createOrderPayment(paymentData);

      // Step 3: Parse payment data and redirect
      let redirectUrl: string | null = null;
      if (payment.data) {
        try {
          const paymentInfo = typeof payment.data === 'string' 
            ? JSON.parse(payment.data) 
            : payment.data;
          redirectUrl = paymentInfo.redirect_url;
        } catch (error) {
          console.error('[CheckoutBay] Failed to parse payment data:', error);
        }
      }

      if (redirectUrl) {
        // Redirect to payment page as per TODO spec
        window.location.href = redirectUrl;
        
        // Emit checkout event
        events.emit('checkout:initiated', {
          orderId: orderData.id,
          paymentId: payment.id,
          redirectUrl: redirectUrl
        });
      } else {
        throw new Error('No payment redirect URL received');
      }

    } catch (error: any) {
      const message = error.message || 'Checkout failed';
      events.emit('checkout:error', message);
      throw new Error(message);
    }
  }

  // Format price with currency using shared utility
  formatPrice(amount: any, currency: string = 'USD'): string {
    return formatPrice(amount, currency);
  }
}