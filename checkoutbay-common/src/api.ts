import axios, { AxiosInstance, AxiosError } from "axios";
import Decimal from "decimal.js";
import {
  CommonQueryParams,
  RustyAuthSpec,
  RustyVerifiedEmailsSpec,
  RustyDeposit,
  RustyDepositSpec,
  RustyVerifiedEmails,
  HttpNewVerifiedEmail,
  ShopEntityAccessParams,
  ShopEntitiesAccessParams,
  NewDepositHttp,
  ApiProps,
  makeUrl
} from "@gofranz/common";
import { Address, AddressesQueryParams, AddressesResponse, Discount, DiscountProductsQueryParams, DiscountProductsResponse, DiscountsQueryParams, DiscountsResponse, NewAddress, NewDiscount, NewOrderCalculation, NewOrderPaymentSubmission, NewPaymentGateway, NewProduct, NewPublicUserOrder, NewRegisteredUserOrder, NewShippingRateTemplate, NewShop, NewStockMovement, NewWarehouse, Order, OrderItem, OrderPayment, OrderRecord, OrdersQueryParams, OrdersResponse, PaymentGateway, PaymentGatewaysQueryParams, PaymentGatewaysResponse, PaymentsQueryParams, ProcessedOrder, ProcessedOrderPreview, ProcessedPublicUserOrder, ProcessedRegisteredUserOrder, Product, ProductsQueryParams, ProductsResponse, PublicFile, PublicProduct, PublicProductsResponse, PublicShippingRate, PublicShop, PublicStock, PublicWarehouse, ShippingRateTemplate, Shop, ShopsResponse, ShopUser, StockMovement, StockMovementsQueryParams, StockMovementsResponse, TaxRate, TaxRatesQuery, TemplatesQueryParams, TemplatesWithWarehouseIdResponse, UpdateDiscount, UpdatePaymentGateway, UpdateProduct, UpdateShippingRateTemplate, UpdateShop, UpdateStockMovement, UpdateWarehouse, VoucherCodeValidationRequest, VoucherCodeValidationResponse, Warehouse, WarehousesQueryParams, WarehousesResponse, WarehouseStockLevel } from "./types";

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

export class CheckoutbayApi {
  private baseUrl: string;
  private timeout: number;
  private client: AxiosInstance;
  private errorHandler?: (error: AxiosError) => void;
  auth?: RustyAuthSpec;

  constructor({ baseUrl, timeout, auth, errorHandler }: ApiProps) {
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

  newDeposit = async (deposit: NewDepositHttp) => {
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
  createAddress = async (
    { primaryEntityId }: ShopEntitiesAccessParams,
    addressData: NewAddress
  ): Promise<Address> => {
    const response = await this.client.post<Address>(
      `/a/shops/${primaryEntityId}/addresses`,
      addressData,
    );
    return response.data;
  };

  getAddresses = async (
    { primaryEntityId }: ShopEntitiesAccessParams,
    params?: AddressesQueryParams
  ): Promise<AddressesResponse> => {
    const response = await this.client.get<AddressesResponse>(
      makeUrl(`/a/shops/${primaryEntityId}/addresses`, params)
    );
    return response.data;
  };

  getAddress = async ({ primaryEntityId, entityId }: ShopEntityAccessParams): Promise<Address> => {
    const response = await this.client.get<Address>(
      `/a/shops/${primaryEntityId}/addresses/${entityId}`,
    );
    return response.data;
  };

  updateAddress = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams,
    addressData: Partial<Address>
  ): Promise<void> => {
    await this.client.patch<Address>(
      `/a/shops/${primaryEntityId}/addresses/${entityId}`,
      addressData
    );
  };

  deleteAddress = async ({ primaryEntityId, entityId }: ShopEntityAccessParams): Promise<void> => {
    await this.client.delete(`/a/shops/${primaryEntityId}/addresses/${entityId}`);
  };

  // Warehouse endpoints
  createWarehouse = async (
    { primaryEntityId }: ShopEntitiesAccessParams,
    warehouseData: NewWarehouse
  ): Promise<Warehouse> => {
    const response = await this.client.post<Warehouse>(
      `/a/shops/${primaryEntityId}/warehouses`,
      warehouseData,
    );
    return response.data;
  };

  getWarehouses = async (
    { primaryEntityId }: ShopEntitiesAccessParams,
    params?: WarehousesQueryParams
  ): Promise<WarehousesResponse> => {
    const response = await this.client.get<WarehousesResponse>(
      makeUrl(`/a/shops/${primaryEntityId}/warehouses`, params),
    );
    return response.data;
  };

  getWarehouse = async ({ primaryEntityId, entityId }: ShopEntityAccessParams): Promise<Warehouse> => {
    const response = await this.client.get<Warehouse>(
      `/a/shops/${primaryEntityId}/warehouses/${entityId}`,
    );
    return response.data;
  };

  updateWarehouse = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams,
    warehouseData: UpdateWarehouse
  ): Promise<void> => {
    await this.client.patch<Warehouse>(
      `/a/shops/${primaryEntityId}/warehouses/${entityId}`,
      warehouseData,
    );
  };

  deleteWarehouse = async ({ primaryEntityId, entityId }: ShopEntityAccessParams): Promise<void> => {
    await this.client.delete(`/a/shops/${primaryEntityId}/warehouses/${entityId}`, {
      timeout: this.timeout
    });
  };

  // Product endpoints
  createProduct = async (
    { primaryEntityId }: ShopEntitiesAccessParams,
    productData: NewProduct
  ): Promise<Product> => {
    const response = await this.client.post<Product>(
      `/a/shops/${primaryEntityId}/products`,
      productData,
    );
    return response.data;
  };

  getProducts = async (
    { primaryEntityId }: ShopEntitiesAccessParams,
    params?: ProductsQueryParams
  ): Promise<ProductsResponse> => {
    const { data } = await this.client.get<{ data: Product[], total: number }>(
      makeUrl(`/a/shops/${primaryEntityId}/products`, params),
    );
    return {
      ...data,
      data: data.data.map((product) => ({
        ...product,
        price: convertToDecimal(product.price),
      })),
    };
  };

  getProduct = async ({ primaryEntityId, entityId }: ShopEntityAccessParams): Promise<Product> => {
    const response = await this.client.get<Product>(
      `/a/shops/${primaryEntityId}/products/${entityId}`,
    );
    return {
      ...response.data,
      price: new Decimal(response.data.price),
    };
  };

  updateProduct = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams,
    productData: UpdateProduct
  ): Promise<void> => {
    await this.client.patch<Product>(
      `/a/shops/${primaryEntityId}/products/${entityId}`,
      productData,
    );
  };

  deleteProduct = async ({ primaryEntityId, entityId }: ShopEntityAccessParams): Promise<void> => {
    await this.client.delete(`/a/shops/${primaryEntityId}/products/${entityId}`, {
      timeout: this.timeout
    });
  };

  // Stock Movement endpoints
  createStockMovement = async (
    { primaryEntityId }: ShopEntitiesAccessParams,
    stockData: NewStockMovement
  ): Promise<StockMovement> => {
    const response = await this.client.post<StockMovement>(
      `/a/shops/${primaryEntityId}/stock-movements`,
      stockData,
    );
    return response.data;
  };

  getStockMovements = async (
    { primaryEntityId }: ShopEntitiesAccessParams,
    params?: StockMovementsQueryParams
  ): Promise<StockMovementsResponse> => {
    const response = await this.client.get<StockMovementsResponse>(
      makeUrl(`/a/shops/${primaryEntityId}/stock-movements`, params),
    );
    return response.data;
  };

  getStockMovement = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams
  ): Promise<StockMovement> => {
    const response = await this.client.get<StockMovement>(
      `/a/shops/${primaryEntityId}/stock-movements/${entityId}`,
    );
    return response.data;
  };

  updateStockMovement = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams,
    stockData: UpdateStockMovement
  ): Promise<void> => {
    await this.client.patch<StockMovement>(
      `/a/shops/${primaryEntityId}/stock-movements/${entityId}`,
      stockData,
    );
  };

  deleteStockMovement = async ({ primaryEntityId, entityId }: ShopEntityAccessParams): Promise<void> => {
    await this.client.delete(
      `/a/shops/${primaryEntityId}/stock-movements/${entityId}`,
    );
  };

  getStockMovementsByProducts = async (
    { primaryEntityId }: ShopEntitiesAccessParams,
    product_ids: string[]
  ): Promise<[string, WarehouseStockLevel][]> => {
    const response = await this.client.post<[string, WarehouseStockLevel][]>(
      `/a/shops/${primaryEntityId}/stock-movements/by-products`,
      {
        product_ids,
      },
    );
    return response.data;
  };

  // Order endpoints
  getOrders = async (
    { primaryEntityId }: ShopEntitiesAccessParams,
    params?: OrdersQueryParams
  ): Promise<OrdersResponse> => {
    const response = await this.client.get<OrdersResponse>(
      makeUrl(`/a/shops/${primaryEntityId}/orders`, params),
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

  getOrder = async ({ primaryEntityId, entityId }: ShopEntityAccessParams): Promise<Order> => {
    const response = await this.client.get<Order>(
      `/a/shops/${primaryEntityId}/orders/${entityId}`,
    );

    return evaluateObjectWithDates(convertOrderDecimals(response.data));
  };

  getOrderItems = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams
  ): Promise<OrderItem[]> => {
    const response = await this.client.get<OrderItem[]>(
      `/a/shops/${primaryEntityId}/orders/${entityId}/items`,
    );
    return response.data.map(convertOrderItemDecimals);
  };

  markOrderAsPaid = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams
  ): Promise<void> => {
    await this.client.post<void>(
      `/a/shops/${primaryEntityId}/orders/${entityId}/paid`,
    );
  };

  markOrderAsShipped = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams
  ): Promise<void> => {
    await this.client.post<void>(
      `/a/shops/${primaryEntityId}/orders/${entityId}/shipped`,
    );
  };

  markOrderAsDelivered = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams
  ): Promise<void> => {
    await this.client.post<void>(
      `/a/shops/${primaryEntityId}/orders/${entityId}/delivered`,
    );
  };

  getOrderInvoice = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams
  ): Promise<string> => {
    const response = await this.client.get<string>(
      `/a/shops/${primaryEntityId}/orders/${entityId}/invoice`,
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
    { primaryEntityId }: ShopEntitiesAccessParams,
    gatewayData: NewPaymentGateway
  ): Promise<PaymentGateway> => {
    const response = await this.client.post<PaymentGateway>(
      `/a/shops/${primaryEntityId}/payment-gateways`,
      gatewayData,
    );
    return response.data;
  };

  getPaymentGateways = async (
    { primaryEntityId }: ShopEntitiesAccessParams,
    params?: PaymentGatewaysQueryParams
  ): Promise<PaymentGatewaysResponse> => {
    const response = await this.client.get<PaymentGatewaysResponse>(
      makeUrl(`/a/shops/${primaryEntityId}/payment-gateways`, params),
    );
    return response.data;
  };

  getPaymentGateway = async ({ primaryEntityId, entityId }: ShopEntityAccessParams): Promise<PaymentGateway> => {
    const response = await this.client.get<PaymentGateway>(
      `/a/shops/${primaryEntityId}/payment-gateways/${entityId}`,
    );
    return response.data;
  };

  updatePaymentGateway = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams,
    gatewayData: UpdatePaymentGateway
  ): Promise<void> => {
    await this.client.patch<PaymentGateway>(
      `/a/shops/${primaryEntityId}/payment-gateways/${entityId}`,
      gatewayData,
    );
  };

  deletePaymentGateway = async ({ primaryEntityId, entityId }: ShopEntityAccessParams): Promise<void> => {
    await this.client.delete(
      `/a/shops/${primaryEntityId}/payment-gateways/${entityId}`,
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

  getShop = async ({ entityId }: { entityId: string }): Promise<Shop> => {
    const response = await this.client.get<Shop>(
      `/a/shops/${entityId}`
    );
    return response.data;
  };

  updateShop = async (
    { entityId }: { entityId: string },
    shopData: UpdateShop
  ): Promise<void> => {
    await this.client.patch(
      `/a/shops/${entityId}`,
      shopData
    );
  };

  deleteShop = async ({ entityId }: { entityId: string }): Promise<void> => {
    await this.client.delete(`/a/shops/${entityId}`);
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

  // Payment endpoints
  getPayments = async (
    { primaryEntityId }: ShopEntitiesAccessParams,
    params?: PaymentsQueryParams
  ): Promise<{ data: OrderPayment[]; total: number }> => {
    const response = await this.client.get<{ data: OrderPayment[]; total: number }>(
      makeUrl(`/a/shops/${primaryEntityId}/payments`, params)
    );
    return {
      ...response.data,
      data: response.data.data.map((payment) => ({
        ...payment,
        amount: convertToDecimal(payment.amount),
      })),
    };
  };

  getPayment = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams
  ): Promise<OrderPayment> => {
    const response = await this.client.get<OrderPayment>(
      `/a/shops/${primaryEntityId}/payments/${entityId}`
    );
    return {
      ...response.data,
      amount: convertToDecimal(response.data.amount),
    };
  };

  updatePaymentStatus = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams,
    status: string,
    error_message?: string
  ): Promise<void> => {
    await this.client.patch(
      `/a/shops/${primaryEntityId}/payments/${entityId}/status`,
      { status, error_message }
    );
  };

  createShippingRateTemplate = async (
    { primaryEntityId }: ShopEntitiesAccessParams,
    templateData: NewShippingRateTemplate
  ): Promise<ShippingRateTemplate> => {
    const response = await this.client.post<ShippingRateTemplate>(
      `/a/shops/${primaryEntityId}/shipping-rate-templates`,
      templateData
    );
    return response.data;
  };

  getShippingRateTemplates = async (
    { primaryEntityId }: ShopEntitiesAccessParams,
    params?: TemplatesQueryParams
  ): Promise<TemplatesWithWarehouseIdResponse> => {
    const response =
      await this.client.get<TemplatesWithWarehouseIdResponse>(
        makeUrl(`/a/shops/${primaryEntityId}/shipping-rate-templates`, params)
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
    { primaryEntityId, entityId }: ShopEntityAccessParams
  ): Promise<ShippingRateTemplate> => {
    const response = await this.client.get<ShippingRateTemplate>(
      `/a/shops/${primaryEntityId}/shipping-rate-templates/${entityId}`
    );
    return response.data;
  };

  updateShippingRateTemplate = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams,
    templateData: UpdateShippingRateTemplate
  ): Promise<void> => {
    await this.client.patch<ShippingRateTemplate>(
      `/a/shops/${primaryEntityId}/shipping-rate-templates/${entityId}`,
      templateData
    );
  };

  deleteShippingRateTemplate = async ({ primaryEntityId, entityId }: ShopEntityAccessParams): Promise<void> => {
    await this.client.delete(
      `/a/shops/${primaryEntityId}/shipping-rate-templates/${entityId}`
    );
  };

  relateTemplateToWarehouse = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams,
    warehouseId: string
  ): Promise<void> => {
    await this.client.post(
      `/a/shops/${primaryEntityId}/shipping-rate-templates/${entityId}/warehouses/${warehouseId}`,
    );
  };

  removeTemplateFromWarehouse = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams,
    warehouseId: string
  ): Promise<void> => {
    await this.client.delete(
      `/a/shops/${primaryEntityId}/shipping-rate-templates/${entityId}/warehouses/${warehouseId}`
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
  createDiscount = async (
    { primaryEntityId }: ShopEntitiesAccessParams,
    data: NewDiscount
  ): Promise<Discount> => {
    const response = await this.client.post<Discount>(
      `/a/shops/${primaryEntityId}/discounts`,
      data
    );
    return response.data;
  };

  getDiscounts = async (
    { primaryEntityId }: ShopEntitiesAccessParams,
    params?: DiscountsQueryParams
  ): Promise<DiscountsResponse> => {
    const response = await this.client.get<DiscountsResponse>(
      makeUrl(`/a/shops/${primaryEntityId}/discounts`, params)
    );
    return response.data;
  };

  getDiscount = async ({ primaryEntityId, entityId }: ShopEntityAccessParams): Promise<Discount> => {
    const response = await this.client.get<Discount>(
      `/a/shops/${primaryEntityId}/discounts/${entityId}`
    );
    return response.data;
  };

  updateDiscount = async ({ primaryEntityId, entityId }: ShopEntityAccessParams, data: UpdateDiscount): Promise<void> => {
    await this.client.patch<void>(
      `/a/shops/${primaryEntityId}/discounts/${entityId}`,
      data
    );
  };

  deleteDiscount = async ({ primaryEntityId, entityId }: ShopEntityAccessParams): Promise<void> => {
    await this.client.delete(
      `/a/shops/${primaryEntityId}/discounts/${entityId}`
    );
  };

  validateVoucherCode = async (primaryEntityId: string, data: VoucherCodeValidationRequest): Promise<VoucherCodeValidationResponse> => {
    const response = await this.client.post<VoucherCodeValidationResponse>(
      `/a/shops/${primaryEntityId}/discounts/validate-voucher`,
      data
    );
    return response.data;
  };

  getProductDiscounts = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams,
  ): Promise<Discount[]> => {
    const response = await this.client.get<Discount[]>(
      `/a/shops/${primaryEntityId}/products/${entityId}/discounts`
    );
    return response.data;
  };

  // Discount Product Management endpoints
  getDiscountProducts = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams,
    params?: DiscountProductsQueryParams
  ): Promise<DiscountProductsResponse> => {
    const response = await this.client.get<DiscountProductsResponse>(
      makeUrl(`/a/shops/${primaryEntityId}/discounts/${entityId}/products`, params)
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
    { primaryEntityId, entityId }: ShopEntityAccessParams,
    productId: string
  ): Promise<void> => {
    await this.client.post(
      `/a/shops/${primaryEntityId}/discounts/${entityId}/products/${productId}`
    );
  };

  removeProductFromDiscount = async (
    { primaryEntityId, entityId }: ShopEntityAccessParams,
    productId: string
  ): Promise<void> => {
    await this.client.delete(
      `/a/shops/${primaryEntityId}/discounts/${entityId}/products/${productId}`
    );
  };
}
