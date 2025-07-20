/**
 * Shop API client for CheckoutBay
 * Wrapper around CheckoutbayApi from @gofranz/checkoutbay-common
 */

import type {
  NewOrderCalculation,
  NewOrderPaymentSubmission,
  NewPublicUserOrder,
  OrderPayment,
  ProcessedOrder,
  ProcessedOrderPreview,
  PublicProduct,
  PublicProductsResponse,
  PublicShippingRate,
  PublicShop,
  PublicWarehouse
} from '@gofranz/checkoutbay-common';
import { CheckoutbayApi } from '@gofranz/checkoutbay-common';

export class ShopAPI {
  private api: CheckoutbayApi;

  constructor(baseUrl: string = 'https://api.checkoutbay.com/v1') {
    this.api = new CheckoutbayApi({
      baseUrl,
      timeout: 10000
    });
  }

  // Get shop details
  async getPublicShop(shopId: string): Promise<PublicShop> {
    return this.api.getPublicShop(shopId);
  }

  // Get all products for a shop
  async getPublicProducts(shopId: string, warehouseId?: string | null): Promise<PublicProductsResponse> {
    return this.api.getPublicProductsComplete(shopId, undefined, undefined, warehouseId || undefined);
  }

  // Get single product
  async getPublicProduct(shopId: string, productId: string): Promise<PublicProduct> {
    return this.api.getPublicProduct(shopId, productId);
  }

  // Get available warehouses
  async getPublicWarehouses(shopId: string): Promise<PublicWarehouse[]> {
    return this.api.getPublicWarehouses(shopId);
  }

  // Get shipping rates for a shop
  async getPublicShippingRates(shopId: string): Promise<PublicShippingRate[]> {
    return this.api.getPublicShippingRates(shopId);
  }

  // Calculate order total
  async calculateOrder(orderData: NewOrderCalculation): Promise<ProcessedOrder> {
    return this.api.calculateOrder(orderData);
  }

  // Create order
  async createOrder(orderData: NewPublicUserOrder): Promise<void> {
    return this.api.createPublicOrder(orderData);
  }

  // Create order payment
  async createOrderPayment(paymentData: NewOrderPaymentSubmission): Promise<OrderPayment> {
    return this.api.createOrderPayment(paymentData);
  }

  // Get order status
  async getOrderStatus(orderId: string): Promise<ProcessedOrderPreview> {
    return this.api.orderStatus(orderId);
  }
}