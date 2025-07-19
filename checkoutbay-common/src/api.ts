import axios, { AxiosInstance, AxiosError } from "axios";
import Decimal from "decimal.js";
import {
  CommonQueryParams,
  makeAuthHeaders,
  QueryParamsBase,
  RustyAuthSpec,
  RustyVerifiedEmailsSpec,
  RustyDeposit,
  RustyDepositSpec,
  RustyVerifiedEmails,
  HttpNewVerifiedEmail,
} from "@gofranz/common";
import { Address, AddressesResponse, Discount, DiscountProductsQueryParams, DiscountProductsResponse, DiscountsQueryParams, DiscountsResponse, NewAddress, NewDiscount, NewOrderCalculation, NewOrderPaymentSubmission, NewPaymentGateway, NewProduct, NewPublicUserOrder, NewRegisteredUserOrder, NewShippingRateTemplate, NewShop, NewStockMovement, NewWarehouse, Order, OrderItem, OrderPayment, OrderRecord, OrdersResponse, PaymentGateway, PaymentGatewaysResponse, ProcessedOrder, ProcessedOrderPreview, ProcessedPublicUserOrder, ProcessedRegisteredUserOrder, Product, PublicFile, PublicProduct, PublicProductsResponse, PublicShippingRate, PublicShop, PublicStock, PublicWarehouse, ShippingRateTemplate, Shop, ShopsResponse, ShopUser, StockMovement, StockMovementsResponse, TaxRate, TaxRatesQuery, TemplatesWithWarehouseIdResponse, UpdateDiscount, UpdatePaymentGateway, UpdateProduct, UpdateShippingRateTemplate, UpdateShop, UpdateStockMovement, UpdateWarehouse, VoucherCodeValidationRequest, VoucherCodeValidationResponse, Warehouse, WarehousesResponse, WarehouseStockLevel } from "./types";

function convertToDecimal(value: string | number | Decimal): Decimal {
  if (value instanceof Decimal) return value;
  return new Decimal(value);
}

// Type-safe decimal field converters
function convertOrderItemDecimals(item: any): OrderItem {
  return {
    ...item,
    unit_price: convertToDecimal(item.unit_price || 0),
    unit_tax: convertToDecimal(item.unit_tax || 0),
    unit_discount: convertToDecimal(item.unit_discount || 0),
    subtotal_before_discount: convertToDecimal(item.subtotal_before_discount || 0),
    discount_total: convertToDecimal(item.discount_total || 0),
    subtotal: convertToDecimal(item.subtotal || 0),
    tax_total: convertToDecimal(item.tax_total || 0),
    total: convertToDecimal(item.total || 0),
  };
}

function convertProcessedOrderItemDecimals(item: any) {
  return {
    ...item,
    unit_price: convertToDecimal(item.unit_price),
    unit_tax: convertToDecimal(item.unit_tax),
    unit_discount: convertToDecimal(item.unit_discount),
    subtotal_before_discount: convertToDecimal(item.subtotal_before_discount),
    discount_total: convertToDecimal(item.discount_total),
    subtotal: convertToDecimal(item.subtotal),
    tax_total: convertToDecimal(item.tax_total),
    total: convertToDecimal(item.total),
  };
}

// Type-specific order converters
function convertOrderDecimals(order: any): Order {
  const converted: Order = {
    ...order,
    shipping_total: convertToDecimal(order.shipping_total),
    subtotal_before_discount: convertToDecimal(order.subtotal_before_discount),
    discount_total: convertToDecimal(order.discount_total),
    subtotal: convertToDecimal(order.subtotal),
    tax_total: convertToDecimal(order.tax_total),
    total: convertToDecimal(order.total),
  };

  return converted;
}

function convertProcessedPublicUserOrder(order: any): any {
  return {
    ...order,
    shipping_total: convertToDecimal(order.shipping_total),
    subtotal_before_discount: convertToDecimal(order.subtotal_before_discount),
    discount_total: convertToDecimal(order.discount_total),
    subtotal: convertToDecimal(order.subtotal),
    tax_total: convertToDecimal(order.tax_total),
    total: convertToDecimal(order.total),
    items: order.items?.map(convertProcessedOrderItemDecimals) || []
  };
}

function convertProcessedRegisteredUserOrder(order: any): Order {
  return {
    ...order,
    shipping_total: convertToDecimal(order.shipping_total),
    subtotal_before_discount: convertToDecimal(order.subtotal_before_discount),
    discount_total: convertToDecimal(order.discount_total),
    subtotal: convertToDecimal(order.subtotal),
    tax_total: convertToDecimal(order.tax_total),
    total: convertToDecimal(order.total),
    items: order.items?.map(convertProcessedOrderItemDecimals) || []
  };
}

function convertProcessedOrderCalculation(order: any) {
  return {
    ...order,
    shipping_total: convertToDecimal(order.shipping_total),
    subtotal_before_discount: convertToDecimal(order.subtotal_before_discount),
    discount_total: convertToDecimal(order.discount_total),
    subtotal: convertToDecimal(order.subtotal),
    tax_total: convertToDecimal(order.tax_total),
    total: convertToDecimal(order.total),
    items: order.items?.map(convertProcessedOrderItemDecimals) || []
  };
}

// Discriminated union converter for ProcessedOrder types
function convertProcessedOrderDecimals(order: any): any {
  // Handle OrderRecord discriminated union format
  if (!(order as ProcessedRegisteredUserOrder).customer_user_id) {
    return convertProcessedPublicUserOrder(order)
  } else if ((order as ProcessedRegisteredUserOrder).customer_user_id) {
    return convertProcessedRegisteredUserOrder(order)
  }

  // Handle direct ProcessedOrder objects - try to determine type by fields
  if ('customer_user_email' in order) {
    return convertProcessedPublicUserOrder(order);
  } else if ('customer_user_id' in order) {
    return convertProcessedRegisteredUserOrder(order);
  } else {
    // Fallback to calculation type
    return convertProcessedOrderCalculation(order);
  }
}

// Helper for converting OrderRecord items
function convertOrderRecordDecimals(order: Order): Order {
  if (!order.customer_user_id) {
    return convertProcessedPublicUserOrder(order)
  } else {
    return convertProcessedRegisteredUserOrder(order)
  }
}

export interface ObjectWithDates<T = any> {
  created_at?: string | Date;
  updated_at?: string | Date;
  [key: string]: T | string | Date | undefined;
}

function evaluateObjectWithDates<T extends ObjectWithDates>(
  data: T
): T & { created_at?: Date; updated_at?: Date } {
  return {
    ...data,
    created_at: data.created_at ? new Date(data.created_at) : undefined,
    updated_at: data.updated_at ? new Date(data.updated_at) : undefined,
  };
}

function makeUrl(
  url: string,
  params?:
    | QueryParamsBase
    | ShopQueryParams
    | ItemQueryParams
    | ProductQueryParams
) {
  if (params) {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );
    return `${url}?${new URLSearchParams(
      filteredParams as Record<string, string>
    )}`;
  }
  return url;
}

export interface ShopQueryParams extends QueryParamsBase {
  shop_id: string;
}

export interface ItemQueryParams extends QueryParamsBase {
  is_live: boolean;
}

export interface ProductQueryParams extends ShopQueryParams {
  warehouse_id?: string;
}

export interface RustyShopApiProps {
  baseUrl?: string;
  timeout?: number;
  auth?: RustyAuthSpec;
  errorHandler?: (error: AxiosError) => void;
}

export class RustyShopAPI {
  private baseUrl: string;
  private timeout: number;
  private client: AxiosInstance;
  private errorHandler?: (error: AxiosError) => void;
  auth?: RustyAuthSpec;

  constructor({ baseUrl, timeout, auth, errorHandler }: RustyShopApiProps) {
    if (baseUrl) {
      this.baseUrl = baseUrl;
    } else {
      this.baseUrl = "https://api.checkoutbay.com/v1";
    }

    console.info(`[api] => baseUrl: ${this.baseUrl}`);

    if (timeout) {
      this.timeout = timeout;
    } else {
      this.timeout = 5000;
    }

    if (auth) {
      this.auth = auth;
    } else {
      console.warn("Auth config not set");
    }

    this.errorHandler = errorHandler;

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to automatically handle authentication
    this.client.interceptors.request.use(async (config) => {
      // Check if this request needs auth (uses auth endpoints)
      const needsAuth = config.url?.startsWith('/a/');

      if (needsAuth && this.auth) {
        if (!this.auth.hasValidAccessToken()) {
          await new Promise((resolve) => setTimeout(resolve, 500)); // Wait for auth to be ready
        }
        const token = this.auth.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    // Add response interceptor to handle errors generically
    this.client.interceptors.response.use(
      (response) => response, // Pass through successful responses
      (error: AxiosError) => {
        if (this.errorHandler) {
          this.errorHandler(error);
        }
        return Promise.reject(error); // Still reject so specific handlers can override
      }
    );
  }

  getAuthApi = (): RustyAuthSpec => {
    if (!this.auth) {
      throw new Error("Auth config not set");
    }
    return this.auth;
  };

  hasValidSession = () => {
    return this.auth ? this.auth.hasValidSession() : false;
  };

  private getDepositApi = (): RustyDepositSpec => {
    return new RustyDeposit({ client: this.client });
  };

  private getVerifiedEmailsApi = (): RustyVerifiedEmailsSpec => {
    return new RustyVerifiedEmails({ client: this.client });
  };

  private getAccessToken = () => {
    return this.getAuthApi().getAccessToken();
  };

  getAccountBalance = async () => {
    return this.getDepositApi().getAccountBalance(this.getAccessToken());
  };

  getDeposits = async (query: CommonQueryParams) => {
    return this.getDepositApi().getDeposits(query, this.getAccessToken());
  };

  getDeposit = async (id: string) => {
    return this.getDepositApi().getDeposit(id, this.getAccessToken());
  };

  newDeposit = async (deposit: import('@gofranz/common').NewDepositHttp) => {
    return this.getDepositApi().newDeposit(deposit, this.getAccessToken());
  };

  newVerifiedEmail = async (data: HttpNewVerifiedEmail) => {
    return this.getVerifiedEmailsApi().newVerifiedEmail(
      data,
      this.getAccessToken()
    );
  };

  verifyVerifiedEmail = async (id: string) => {
    return this.getVerifiedEmailsApi().verifyVerifiedEmail(
      id,
      this.getAccessToken()
    );
  };

  deleteVerifiedEmail = async (id: string) => {
    return this.getVerifiedEmailsApi().deleteVerifiedEmail(
      id,
      this.getAccessToken()
    );
  };

  getVerifiedEmails = async () => {
    return this.getVerifiedEmailsApi().getVerifiedEmails(this.getAccessToken());
  };

  // Address endpoints
  createAddress = async (addressData: NewAddress): Promise<Address> => {
    const response = await this.client.post<Address>(
      "/a/addresses",
      addressData,
    );
    return response.data;
  };

  getAddresses = async (
    params: ShopQueryParams
  ): Promise<AddressesResponse> => {
    const response = await this.client.get<AddressesResponse>(
      makeUrl("/a/addresses", params)
    );
    return response.data;
  };

  getAddress = async (addressId: string): Promise<Address> => {
    const response = await this.client.get<Address>(
      `/a/addresses/${addressId}`
    );
    return response.data;
  };

  updateAddress = async (
    addressId: string,
    addressData: Partial<Address>
  ): Promise<void> => {
    await this.client.patch<Address>(
      `/a/addresses/${addressId}`,
      addressData
    );
  };

  deleteAddress = async (addressId: string): Promise<void> => {
    await this.client.delete(`/a/addresses/${addressId}`);
  };

  // Warehouse endpoints
  createWarehouse = async (
    warehouseData: NewWarehouse
  ): Promise<Warehouse> => {
    const response = await this.client.post<Warehouse>(
      "/a/warehouses",
      warehouseData,
    );
    return response.data;
  };

  getWarehouses = async (
    params: ShopQueryParams
  ): Promise<WarehousesResponse> => {
    const response = await this.client.get<WarehousesResponse>(
      makeUrl("/a/warehouses", params),
    );
    return response.data;
  };

  getWarehouse = async (warehouseId: string): Promise<Warehouse> => {
    const response = await this.client.get<Warehouse>(
      `/a/warehouses/${warehouseId}`,
    );
    return response.data;
  };

  updateWarehouse = async (
    warehouseId: string,
    warehouseData: UpdateWarehouse
  ): Promise<void> => {
    await this.client.patch<Warehouse>(
      `/a/warehouses/${warehouseId}`,
      warehouseData,
    );
  };

  deleteWarehouse = async (warehouseId: string): Promise<void> => {
    await this.client.delete(`/a/warehouses/${warehouseId}`, {
      timeout: this.timeout
    });
  };

  // Product endpoints
  createProduct = async (productData: NewProduct): Promise<Product> => {
    const response = await this.client.post<Product>(
      "/a/products",
      productData,
    );
    return response.data;
  };

  getProducts = async (
    params: ProductQueryParams
  ): Promise<import('./types/index').GenericListResponse<Product>> => {
    const { data } = await this.client.get<{ data: import('./types/generated').Product[], total: number }>(
      makeUrl("/a/products", params),
    );
    return {
      ...data,
      data: data.data.map((product) => ({
        ...product,
        price: convertToDecimal(product.price),
      })),
    };
  };

  getProduct = async (productId: string): Promise<Product> => {
    const response = await this.client.get<Product>(
      `/a/products/${productId}`,
    );
    return {
      ...response.data,
      price: new Decimal(response.data.price),
    };
  };

  updateProduct = async (
    productId: string,
    productData: UpdateProduct
  ): Promise<void> => {
    await this.client.patch<Product>(
      `/a/products/${productId}`,
      productData,
    );
  };

  deleteProduct = async (productId: string): Promise<void> => {
    await this.client.delete(`/a/products/${productId}`, {
      timeout: this.timeout
    });
  };

  // Stock Movement endpoints
  createStockMovement = async (
    stockData: NewStockMovement
  ): Promise<StockMovement> => {
    const response = await this.client.post<StockMovement>(
      "/a/stock_movements",
      stockData,
    );
    return response.data;
  };

  getStockMovements = async (
    params: ShopQueryParams
  ): Promise<StockMovementsResponse> => {
    const response = await this.client.get<StockMovementsResponse>(
      makeUrl("/a/stock_movements", params),
    );
    return response.data;
  };

  getStockMovement = async (
    stockMovementId: string
  ): Promise<StockMovement> => {
    const response = await this.client.get<StockMovement>(
      `/a/stock_movements/${stockMovementId}`,
    );
    return response.data;
  };

  updateStockMovement = async (
    stockMovementId: string,
    stockData: UpdateStockMovement
  ): Promise<void> => {
    await this.client.patch<StockMovement>(
      `/a/stock_movements/${stockMovementId}`,
      stockData,
    );
  };

  deleteStockMovement = async (stockMovementId: string): Promise<void> => {
    await this.client.delete(
      `/a/stock_movements/${stockMovementId}`,
    );
  };

  getStockMovementsByProducts = async (
    product_ids: string[],
    shop_id: string
  ): Promise<[string, WarehouseStockLevel][]> => {
    const response = await this.client.post<[string, WarehouseStockLevel][]>(
      "/a/stock_movements/by_products",
      {
        product_ids,
        shop_id,
      },
    );
    return response.data;
  };

  // Order endpoints
  getOrders = async (params: ShopQueryParams): Promise<OrdersResponse> => {
    const response = await this.client.get<OrdersResponse>(
      makeUrl("/a/orders", params),
    );

    const convertedOrders = response.data.data.map((order) =>
      evaluateObjectWithDates(
        convertOrderRecordDecimals(order)
      )
    );

    return {
      ...response.data,
      data: convertedOrders,
    };
  };

  getOrder = async (orderId: string): Promise<Order> => {
    const response = await this.client.get<Order>(
      `/a/orders/${orderId}`,
    );

    return evaluateObjectWithDates(convertOrderDecimals(response.data));
  };

  getOrderItems = async (orderId: string): Promise<OrderItem[]> => {
    const response = await this.client.get<OrderItem[]>(
      `/a/orders/${orderId}/items`,
    );
    return response.data.map(convertOrderItemDecimals);
  };

  markOrderAsPaid = async (orderId: string): Promise<void> => {
    await this.client.post<void>(
      `/a/orders/${orderId}/paid`,
    );
  };

  markOrderAsShipped = async (orderId: string): Promise<void> => {
    await this.client.post<void>(
      `/a/orders/${orderId}/shipped`,
    );
  };

  markOrderAsDelivered = async (orderId: string): Promise<void> => {
    await this.client.post<void>(
      `/a/orders/${orderId}/delivered`,
    );
  };

  getOrderInvoice = async (orderId: string): Promise<string> => {
    const response = await this.client.get<string>(
      `/a/orders/${orderId}/invoice`,
      {
        responseType: "blob",
      }
    );
    return response.data;
  };

  // Order Creation endpoints
  calculateOrder = async (
    orderData: NewOrderCalculation
  ): Promise<ProcessedOrder> => {
    const response = await this.client.post<ProcessedOrder>(
      "/public/order-calculation",
      orderData
    );
    return convertProcessedOrderDecimals(response.data);
  };

  createOrder = async (orderData: NewRegisteredUserOrder): Promise<void> => {
    await this.client.post<Order>("/a/order", orderData);
  };

  createPublicOrder = async (orderData: NewPublicUserOrder): Promise<void> => {
    await this.client.post("/public/order", orderData);
  };

  createOrderPayment = async (
    data: NewOrderPaymentSubmission
  ): Promise<OrderPayment> => {
    const result = await this.client.post<OrderPayment>(
      "/public/order/payment",
      data
    );
    return {
      ...result.data,
      amount: convertToDecimal(result.data.amount),
    };
  };

  orderStatus = async (orderId: string): Promise<ProcessedOrderPreview> => {
    const response = await this.client.get<ProcessedOrderPreview>(
      `/public/order/${orderId}/status`
    );
    return response.data;
  };

  // Payment Gateway endpoints
  createPaymentGateway = async (
    gatewayData: NewPaymentGateway
  ): Promise<PaymentGateway> => {
    const response = await this.client.post<PaymentGateway>(
      "/a/payment_gateways",
      gatewayData,
    );
    return response.data;
  };

  getPaymentGateways = async (
    params: ShopQueryParams
  ): Promise<PaymentGatewaysResponse> => {
    const response = await this.client.get<PaymentGatewaysResponse>(
      makeUrl("/a/payment_gateways", params),
    );
    return response.data;
  };

  getPaymentGateway = async (gatewayId: string): Promise<PaymentGateway> => {
    const response = await this.client.get<PaymentGateway>(
      `/a/payment_gateways/${gatewayId}`,
    );
    return response.data;
  };

  updatePaymentGateway = async (
    gatewayId: string,
    gatewayData: UpdatePaymentGateway
  ): Promise<void> => {
    await this.client.patch<PaymentGateway>(
      `/a/payment_gateways/${gatewayId}`,
      gatewayData,
    );
  };

  deletePaymentGateway = async (gatewayId: string): Promise<void> => {
    await this.client.delete(
      `/a/payment_gateways/${gatewayId}`,
    );
  };

  createShop = async (shopData: NewShop): Promise<Shop> => {
    const response = await this.client.post<Shop>(
      "/a/shops",
      shopData
    );
    return response.data;
  };

  getShops = async (): Promise<ShopsResponse> => {
    const response = await this.client.get<ShopsResponse>(
      "/a/shops"
    );
    return response.data;
  };

  getShop = async (shopId: string): Promise<Shop> => {
    const response = await this.client.get<Shop>(
      `/a/shops/${shopId}`
    );
    return response.data;
  };

  updateShop = async (
    shopId: string,
    shopData: UpdateShop
  ): Promise<void> => {
    await this.client.patch(
      `/a/shops/${shopId}`,
      shopData
    );
  };

  deleteShop = async (shopId: string): Promise<void> => {
    await this.client.delete(`/a/shops/${shopId}`);
  };

  addShopUser = async (shopId: string, data: ShopUser): Promise<void> => {
    await this.client.post(
      `/a/shops/${shopId}/users`,
      data
    );
  };

  updateShopUserRole = async (
    shopId: string,
    userId: string,
    role: string
  ): Promise<void> => {
    await this.client.patch(
      `/a/shops/${shopId}/users/${userId}/role`,
      { role }
    );
  };

  removeShopUser = async (shopId: string, userId: string): Promise<void> => {
    await this.client.delete(
      `/a/shops/${shopId}/users/${userId}`
    );
  };

  createShippingRateTemplate = async (
    templateData: NewShippingRateTemplate
  ): Promise<ShippingRateTemplate> => {
    const response = await this.client.post<ShippingRateTemplate>(
      "/a/shipping-rate-templates",
      templateData
    );
    return response.data;
  };

  getShippingRateTemplates = async (
    params: ShopQueryParams
  ): Promise<TemplatesWithWarehouseIdResponse> => {
    const response =
      await this.client.get<TemplatesWithWarehouseIdResponse>(
        makeUrl("/a/shipping-rate-templates", params)
      );

    return {
      ...response.data,
      data: response.data.data.map((template) => ({
        ...template,
        rates: template.rates.map((rate) => ({
          ...rate,
          amount: convertToDecimal(rate.amount),
          free_above_value: rate.free_above_value
            ? convertToDecimal(rate.free_above_value)
            : undefined,
        })),
      })),
    };
  };

  getShippingRateTemplate = async (
    templateId: string
  ): Promise<ShippingRateTemplate> => {
    const response = await this.client.get<ShippingRateTemplate>(
      `/a/shipping-rate-templates/${templateId}`
    );
    return response.data;
  };

  updateShippingRateTemplate = async (
    templateId: string,
    templateData: UpdateShippingRateTemplate
  ): Promise<void> => {
    await this.client.patch<ShippingRateTemplate>(
      `/a/shipping-rate-templates/${templateId}`,
      templateData
    );
  };

  deleteShippingRateTemplate = async (templateId: string): Promise<void> => {
    await this.client.delete(
      `/a/shipping-rate-templates/${templateId}`
    );
  };

  relateTemplateToWarehouse = async (
    templateId: string,
    warehouseId: string
  ): Promise<void> => {
    await this.client.post(
      `/a/shipping-rate-templates/${templateId}/warehouses/${warehouseId}`,
    );
  };

  removeTemplateFromWarehouse = async (
    templateId: string,
    warehouseId: string
  ): Promise<void> => {
    await this.client.delete(
      `/a/shipping-rate-templates/${templateId}/warehouses/${warehouseId}`
    );
  };

  // Public endpoints
  getPublicShop = async (shopId: string): Promise<PublicShop> => {
    const response = await this.client.get<PublicShop>(
      `/public/${shopId}/shop`
    );
    return response.data;
  };

  getPublicProducts = async (
    shopId: string,
    is_live: boolean = true,
    limit?: number,
    offset?: number,
    warehouse_id?: string
  ): Promise<PublicProductsResponse> => {
    const response = await this.client.get<PublicProductsResponse>(
      makeUrl(`/public/${shopId}/products`, {
        is_live,
        limit,
        offset,
        warehouse_id,
      })
    );
    return {
      ...response.data,
      data: response.data.data.map((product) => ({
        ...product,
        price: convertToDecimal(product.price),
      })),
    };
  };

  getPublicProductsComplete = async (
    shopId: string,
    limit?: number,
    offset?: number,
    warehouse_id?: string
  ): Promise<PublicProductsResponse> => {
    const params = new URLSearchParams();

    console.debug(
      `[api] => getPublicProductsComplete: shopId: ${shopId}, params: `,
      params
    );

    const response = await this.client.get<PublicProductsResponse>(
      makeUrl(`/public/${shopId}/products-complete`, {
        limit,
        offset,
        warehouse_id,
      })
    );

    return {
      ...response.data,
      data: response.data.data.map((product) => ({
        ...product,
        price: convertToDecimal(product.price),
      })),
    };
  };

  getPublicProduct = async (
    shopId: string,
    productId: string
  ): Promise<PublicProduct> => {
    const response = await this.client.get<PublicProduct>(
      `/public/${shopId}/products/${productId}`
    );
    return {
      ...response.data,
      price: convertToDecimal(response.data.price),
    };
  };

  getPublicProductsFiles = async (
    shopId: string,
    productIds: string[]
  ): Promise<PublicFile[]> => {
    const response = await this.client.post<PublicFile[]>(
      `/public/${shopId}/products/files`,
      { product_ids: productIds }
    );
    return response.data;
  };

  getPublicProductsStock = async (
    shopId: string,
    productIds: string[]
  ): Promise<PublicStock[]> => {
    const response = await this.client.post<PublicStock[]>(
      `/public/${shopId}/warehouses/stock`,
      { product_ids: productIds }
    );
    return response.data;
  };

  getPublicWarehouses = async (shopId: string): Promise<PublicWarehouse[]> => {
    const response = await this.client.get<PublicWarehouse[]>(
      `/public/${shopId}/warehouses`
    );
    return response.data;
  };

  getTaxRates = async (query: TaxRatesQuery): Promise<TaxRate[]> => {
    const response = await this.client.post<TaxRate[]>(
      "/public/taxes/general",
      query
    );
    return response.data;
  };

  getPublicShippingRates = async (
    shopId: string
  ): Promise<PublicShippingRate[]> => {
    const response = await this.client.get<PublicShippingRate[]>(
      `/public/${shopId}/shipping-rates`
    );
    return [
      ...response.data.map((rate) => ({
        ...rate,
        rates: rate.rates.map((rate) => ({
          ...rate,
          amount: convertToDecimal(rate.amount),
          free_above_value: rate.free_above_value
            ? convertToDecimal(rate.free_above_value)
            : undefined,
        })),
      })),
    ];
  };

  // Discount endpoints
  createDiscount = async (data: NewDiscount): Promise<Discount> => {
    const response = await this.client.post<Discount>(
      '/a/discounts',
      data
    );
    return response.data;
  };

  getDiscounts = async (params: DiscountsQueryParams): Promise<DiscountsResponse> => {
    const response = await this.client.get<DiscountsResponse>(
      makeUrl('/a/discounts', params)
    );
    return response.data;
  };

  getDiscount = async (discountId: string): Promise<Discount> => {
    const response = await this.client.get<Discount>(
      `/a/discounts/${discountId}`
    );
    return response.data;
  };

  updateDiscount = async (discountId: string, data: UpdateDiscount): Promise<void> => {
    await this.client.patch<void>(
      `/a/discounts/${discountId}`,
      data
    );
  };

  deleteDiscount = async (discountId: string): Promise<void> => {
    await this.client.delete(
      `/a/discounts/${discountId}`
    );
  };

  validateVoucherCode = async (data: VoucherCodeValidationRequest): Promise<VoucherCodeValidationResponse> => {
    const response = await this.client.post<VoucherCodeValidationResponse>(
      '/public/discounts/validate-voucher',
      data
    );
    return response.data;
  };

  getProductDiscounts = async (productId: string, shopId: string): Promise<Discount[]> => {
    const response = await this.client.get<Discount[]>(
      makeUrl(`/a/products/${productId}/discounts`, { shop_id: shopId })
    );
    return response.data;
  };

  // Discount Product Management endpoints
  getDiscountProducts = async (
    discountId: string,
    params?: DiscountProductsQueryParams
  ): Promise<DiscountProductsResponse> => {
    const response = await this.client.get<DiscountProductsResponse>(
      makeUrl(`/a/discounts/${discountId}/products`, params)
    );
    return {
      ...response.data,
      data: response.data.data.map((product) => ({
        ...product,
        price: convertToDecimal(product.price),
      })),
    };
  };

  addProductToDiscount = async (
    discountId: string,
    productId: string
  ): Promise<void> => {
    await this.client.post(
      `/a/discounts/${discountId}/products/${productId}`
    );
  };

  removeProductFromDiscount = async (
    discountId: string,
    productId: string
  ): Promise<void> => {
    await this.client.delete(
      `/a/discounts/${discountId}/products/${productId}`
    );
  };
}
