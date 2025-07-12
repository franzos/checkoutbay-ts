import axios, { AxiosInstance } from "axios";
import Decimal from "decimal.js";
import {
  Address,
  AddressesResponse,
  Warehouse,
  WarehousesResponse,
  Product,
  ProductsResponse,
  StockMovement,
  StockMovementsResponse,
  Order,
  OrdersResponse,
  NewRegisteredUserOrder,
  NewPublicUserOrder,
  PaymentGateway,
  PaymentGatewaysResponse,
  PublicProduct,
  PublicProductsResponse,
  PublicFile,
  PublicStock,
  PublicWarehouse,
  PublicProductsResponseComplete,
  TaxRate,
  TaxRatesQuery,
  ProcessedOrder,
  NewOrderCalculation,
  NewOrderPaymentSubmission,
  OrderPayment,
  ProductWarehouseStockLevels,
  OrderItem,
  Shop,
  ShopUser,
  ShopsResponse,
  ShippingRateTemplate,
  PublicShippingRate,
  ShippingRateTemplatesWithWarehouseIdsResponse,
  PublicShop,
  OrderRegisteredOrPublicUser,
  ProcessedOrderPreview,
} from "./types/index.js";
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

function convertToDecimal(value: string | number | Decimal): Decimal {
  if (value instanceof Decimal) return value;
  return new Decimal(value);
}

function convertOrderItemDecimals(item: OrderItem): OrderItem {
  return {
    ...item,
    unit_price: item.unit_price ? convertToDecimal(item.unit_price) : undefined,
    unit_tax: item.unit_tax ? convertToDecimal(item.unit_tax) : undefined,
    unit_discount: item.unit_discount
      ? convertToDecimal(item.unit_discount)
      : undefined,
    subtotal_before_discount: item.subtotal_before_discount
      ? convertToDecimal(item.subtotal_before_discount)
      : undefined,
    discount_total: item.discount_total
      ? convertToDecimal(item.discount_total)
      : undefined,
    subtotal: item.subtotal ? convertToDecimal(item.subtotal) : undefined,
    tax_total: item.tax_total ? convertToDecimal(item.tax_total) : undefined,
    total: item.total ? convertToDecimal(item.total) : undefined,
  };
}

function convertOrderDecimals(
  order: OrderRegisteredOrPublicUser
): OrderRegisteredOrPublicUser {
  const converted: OrderRegisteredOrPublicUser = {
    ...order,
    shipping_total: convertToDecimal(order.shipping_total),
    subtotal_before_discount: convertToDecimal(order.subtotal_before_discount),
    discount_total: convertToDecimal(order.discount_total),
    subtotal: convertToDecimal(order.subtotal),
    tax_total: convertToDecimal(order.tax_total),
    total: convertToDecimal(order.total),
  };

  // Only include items if they exist in the original order
  if ("items" in order && Array.isArray(order.items)) {
    converted.items = order.items.map(convertOrderItemDecimals);
  }

  return converted;
}

function convertProcessedOrderDecimals(order: ProcessedOrder): ProcessedOrder {
  const converted: ProcessedOrder = {
    ...order,
    shipping_total: convertToDecimal(order.shipping_total),
    subtotal_before_discount: convertToDecimal(order.subtotal_before_discount),
    discount_total: convertToDecimal(order.discount_total),
    subtotal: convertToDecimal(order.subtotal),
    tax_total: convertToDecimal(order.tax_total),
    total: convertToDecimal(order.total),
  };

  // Only include items if they exist in the original order
  if ("items" in order && Array.isArray(order.items)) {
    converted.items = order.items.map((item) => ({
      ...item,
      unit_price: convertToDecimal(item.unit_price),
      unit_tax: convertToDecimal(item.unit_tax),
      unit_discount: convertToDecimal(item.unit_discount),
      subtotal_before_discount: convertToDecimal(item.subtotal_before_discount),
      discount_total: convertToDecimal(item.discount_total),
      subtotal: convertToDecimal(item.subtotal),
      tax_total: convertToDecimal(item.tax_total),
      total: convertToDecimal(item.total),
    }));
  }

  return converted;
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
}

export class RustyShopAPI {
  private baseUrl: string;
  private timeout: number;
  private client: AxiosInstance;
  auth?: RustyAuthSpec;

  constructor({ baseUrl, timeout, auth }: RustyShopApiProps) {
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

    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to handle authentication timing
    this.client.interceptors.request.use(async (config) => {
      // Check if this request needs auth (has Authorization header or uses auth endpoints)
      const needsAuth = config.url?.startsWith('/a/') || 
                       (config.headers && 'Authorization' in config.headers);
      
      if (needsAuth && this.auth && !this.auth.hasValidAccessToken()) {
        // Wait for auth to be ready
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      return config;
    });
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

  private getAuthHeaders = () => {
    return makeAuthHeaders(this.getAccessToken());
  };

  private getAxiosConfig = () => {
    return { headers: this.getAuthHeaders(), timeout: this.timeout };
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
  createAddress = async (addressData: Partial<Address>): Promise<Address> => {
    const response = await this.client.post<Address>(
      "/a/addresses",
      addressData,
      this.getAxiosConfig()
    );
    return response.data;
  };

  getAddresses = async (
    params: ShopQueryParams
  ): Promise<AddressesResponse> => {
    const response = await this.client.get<AddressesResponse>(
      makeUrl("/a/addresses", params),
      {
        headers: this.getAuthHeaders(),
      }
    );
    return response.data;
  };

  getAddress = async (addressId: string): Promise<Address> => {
    const response = await this.client.get<Address>(
      `/a/addresses/${addressId}`,
      this.getAxiosConfig()
    );
    return response.data;
  };

  updateAddress = async (
    addressId: string,
    addressData: Partial<Address>
  ): Promise<void> => {
    await this.client.patch<Address>(
      `/a/addresses/${addressId}`,
      addressData,
      this.getAxiosConfig()
    );
  };

  deleteAddress = async (addressId: string): Promise<void> => {
    await this.client.delete(`/a/addresses/${addressId}`, {
      headers: this.getAuthHeaders(),
    });
  };

  // Warehouse endpoints
  createWarehouse = async (
    warehouseData: Partial<Warehouse>
  ): Promise<Warehouse> => {
    const response = await this.client.post<Warehouse>(
      "/a/warehouses",
      warehouseData,
      this.getAxiosConfig()
    );
    return response.data;
  };

  getWarehouses = async (
    params: ShopQueryParams
  ): Promise<WarehousesResponse> => {
    const response = await this.client.get<WarehousesResponse>(
      makeUrl("/a/warehouses", params),
      this.getAxiosConfig()
    );
    return response.data;
  };

  getWarehouse = async (warehouseId: string): Promise<Warehouse> => {
    const response = await this.client.get<Warehouse>(
      `/a/warehouses/${warehouseId}`,
      this.getAxiosConfig()
    );
    return response.data;
  };

  updateWarehouse = async (
    warehouseId: string,
    warehouseData: Partial<Warehouse>
  ): Promise<void> => {
    await this.client.patch<Warehouse>(
      `/a/warehouses/${warehouseId}`,
      warehouseData,
      this.getAxiosConfig()
    );
  };

  deleteWarehouse = async (warehouseId: string): Promise<void> => {
    await this.client.delete(`/a/warehouses/${warehouseId}`, {
      headers: this.getAuthHeaders(),
    });
  };

  // Product endpoints
  createProduct = async (productData: Partial<Product>): Promise<Product> => {
    const response = await this.client.post<Product>(
      "/a/products",
      productData,
      this.getAxiosConfig()
    );
    return response.data;
  };

  getProducts = async (
    params: ProductQueryParams
  ): Promise<import('./types/index').GenericListResponse<Product>> => {
    const { data } = await this.client.get<{ data: import('./types/generated').Product[], total: number }>(
      makeUrl("/a/products", params),
      {
        headers: this.getAuthHeaders(),
      }
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
      this.getAxiosConfig()
    );
    return {
      ...response.data,
      price: new Decimal(response.data.price),
    };
  };

  updateProduct = async (
    productId: string,
    productData: Partial<Product>
  ): Promise<void> => {
    await this.client.patch<Product>(
      `/a/products/${productId}`,
      productData,
      this.getAxiosConfig()
    );
  };

  deleteProduct = async (productId: string): Promise<void> => {
    await this.client.delete(`/a/products/${productId}`, {
      headers: this.getAuthHeaders(),
    });
  };

  // Stock Movement endpoints
  createStockMovement = async (
    stockData: Partial<StockMovement>
  ): Promise<StockMovement> => {
    const response = await this.client.post<StockMovement>(
      "/a/stock_movements",
      stockData,
      this.getAxiosConfig()
    );
    return response.data;
  };

  getStockMovements = async (
    params: ShopQueryParams
  ): Promise<StockMovementsResponse> => {
    const response = await this.client.get<StockMovementsResponse>(
      makeUrl("/a/stock_movements", params),
      this.getAxiosConfig()
    );
    return response.data;
  };

  getStockMovement = async (
    stockMovementId: string
  ): Promise<StockMovement> => {
    const response = await this.client.get<StockMovement>(
      `/a/stock_movements/${stockMovementId}`,
      this.getAxiosConfig()
    );
    return response.data;
  };

  updateStockMovement = async (
    stockMovementId: string,
    stockData: Partial<StockMovement>
  ): Promise<void> => {
    await this.client.patch<StockMovement>(
      `/a/stock_movements/${stockMovementId}`,
      stockData,
      this.getAxiosConfig()
    );
  };

  deleteStockMovement = async (stockMovementId: string): Promise<void> => {
    await this.client.delete(
      `/a/stock_movements/${stockMovementId}`,
      this.getAxiosConfig()
    );
  };

  getStockMovementsByProducts = async (
    product_ids: string[],
    shop_id: string
  ): Promise<ProductWarehouseStockLevels> => {
    const response = await this.client.post<ProductWarehouseStockLevels>(
      "/a/stock_movements/by_products",
      {
        product_ids,
        shop_id,
      },
      this.getAxiosConfig()
    );
    return response.data;
  };

  // Order endpoints
  getOrders = async (params: ShopQueryParams): Promise<OrdersResponse> => {
    const response = await this.client.get<OrdersResponse>(
      makeUrl("/a/orders", params),
      this.getAxiosConfig()
    );

    const convertedOrders = response.data.data.map((order) =>
      evaluateObjectWithDates(
        convertOrderDecimals(order as OrderRegisteredOrPublicUser)
      )
    );

    return {
      ...response.data,
      data: convertedOrders,
    };
  };

  getOrder = async (orderId: string): Promise<OrderRegisteredOrPublicUser> => {
    const response = await this.client.get<OrderRegisteredOrPublicUser>(
      `/a/orders/${orderId}`,
      this.getAxiosConfig()
    );

    return evaluateObjectWithDates(convertOrderDecimals(response.data));
  };

  getOrderItems = async (orderId: string): Promise<OrderItem[]> => {
    const response = await this.client.get<OrderItem[]>(
      `/a/orders/${orderId}/items`,
      this.getAxiosConfig()
    );
    return response.data.map(convertOrderItemDecimals);
  };

  markOrderAsPaid = async (orderId: string): Promise<void> => {
    await this.client.post<void>(
      `/a/orders/${orderId}/paid`,
      {},
      this.getAxiosConfig()
    );
  };

  markOrderAsShipped = async (orderId: string): Promise<void> => {
    await this.client.post<void>(
      `/a/orders/${orderId}/shipped`,
      {},
      this.getAxiosConfig()
    );
  };

  markOrderAsDelivered = async (orderId: string): Promise<void> => {
    await this.client.post<void>(
      `/a/orders/${orderId}/delivered`,
      {},
      this.getAxiosConfig()
    );
  };

  getOrderInvoice = async (orderId: string): Promise<string> => {
    const response = await this.client.get<string>(
      `/a/orders/${orderId}/invoice`,
      {
        ...this.getAxiosConfig(),
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
    await this.client.post<Order>("/a/order", orderData, this.getAxiosConfig());
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
    gatewayData: Partial<PaymentGateway>
  ): Promise<PaymentGateway> => {
    const response = await this.client.post<PaymentGateway>(
      "/a/payment_gateways",
      gatewayData,
      this.getAxiosConfig()
    );
    return response.data;
  };

  getPaymentGateways = async (
    params: ShopQueryParams
  ): Promise<PaymentGatewaysResponse> => {
    const response = await this.client.get<PaymentGatewaysResponse>(
      makeUrl("/a/payment_gateways", params),
      this.getAxiosConfig()
    );
    return response.data;
  };

  getPaymentGateway = async (gatewayId: string): Promise<PaymentGateway> => {
    const response = await this.client.get<PaymentGateway>(
      `/a/payment_gateways/${gatewayId}`,
      this.getAxiosConfig()
    );
    return response.data;
  };

  updatePaymentGateway = async (
    gatewayId: string,
    gatewayData: Partial<PaymentGateway>
  ): Promise<void> => {
    await this.client.patch<PaymentGateway>(
      `/a/payment_gateways/${gatewayId}`,
      gatewayData,
      this.getAxiosConfig()
    );
  };

  deletePaymentGateway = async (gatewayId: string): Promise<void> => {
    await this.client.delete(
      `/a/payment_gateways/${gatewayId}`,
      this.getAxiosConfig()
    );
  };

  createShop = async (shopData: Partial<Shop>): Promise<Shop> => {
    const response = await this.client.post<Shop>(
      "/a/shops",
      shopData,
      this.getAxiosConfig()
    );
    return response.data;
  };

  getShops = async (): Promise<ShopsResponse> => {
    const response = await this.client.get<ShopsResponse>(
      "/a/shops",
      this.getAxiosConfig()
    );
    return response.data;
  };

  getShop = async (shopId: string): Promise<Shop> => {
    const response = await this.client.get<Shop>(
      `/a/shops/${shopId}`,
      this.getAxiosConfig()
    );
    return response.data;
  };

  updateShop = async (
    shopId: string,
    shopData: Partial<Shop>
  ): Promise<void> => {
    await this.client.patch(
      `/a/shops/${shopId}`,
      shopData,
      this.getAxiosConfig()
    );
  };

  deleteShop = async (shopId: string): Promise<void> => {
    await this.client.delete(`/a/shops/${shopId}`, this.getAxiosConfig());
  };

  addShopUser = async (shopId: string, data: ShopUser): Promise<void> => {
    await this.client.post(
      `/a/shops/${shopId}/users`,
      data,
      this.getAxiosConfig()
    );
  };

  updateShopUserRole = async (
    shopId: string,
    userId: string,
    role: string
  ): Promise<void> => {
    await this.client.patch(
      `/a/shops/${shopId}/users/${userId}/role`,
      { role },
      this.getAxiosConfig()
    );
  };

  removeShopUser = async (shopId: string, userId: string): Promise<void> => {
    await this.client.delete(
      `/a/shops/${shopId}/users/${userId}`,
      this.getAxiosConfig()
    );
  };

  createShippingRateTemplate = async (
    templateData: Partial<ShippingRateTemplate>
  ): Promise<ShippingRateTemplate> => {
    const response = await this.client.post<ShippingRateTemplate>(
      "/a/shipping-rate-templates",
      templateData,
      this.getAxiosConfig()
    );
    return response.data;
  };

  getShippingRateTemplates = async (
    params: ShopQueryParams
  ): Promise<ShippingRateTemplatesWithWarehouseIdsResponse> => {
    const response =
      await this.client.get<ShippingRateTemplatesWithWarehouseIdsResponse>(
        makeUrl("/a/shipping-rate-templates", params),
        this.getAxiosConfig()
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
      `/a/shipping-rate-templates/${templateId}`,
      this.getAxiosConfig()
    );
    return response.data;
  };

  updateShippingRateTemplate = async (
    templateId: string,
    templateData: Partial<ShippingRateTemplate>
  ): Promise<void> => {
    await this.client.patch<ShippingRateTemplate>(
      `/a/shipping-rate-templates/${templateId}`,
      templateData,
      this.getAxiosConfig()
    );
  };

  deleteShippingRateTemplate = async (templateId: string): Promise<void> => {
    await this.client.delete(
      `/a/shipping-rate-templates/${templateId}`,
      this.getAxiosConfig()
    );
  };

  relateTemplateToWarehouse = async (
    templateId: string,
    warehouseId: string
  ): Promise<void> => {
    await this.client.post(
      `/a/shipping-rate-templates/${templateId}/warehouses/${warehouseId}`,
      {},
      this.getAxiosConfig()
    );
  };

  removeTemplateFromWarehouse = async (
    templateId: string,
    warehouseId: string
  ): Promise<void> => {
    await this.client.delete(
      `/a/shipping-rate-templates/${templateId}/warehouses/${warehouseId}`,
      this.getAxiosConfig()
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
  ): Promise<PublicProductsResponseComplete> => {
    const params = new URLSearchParams();

    console.debug(
      `[api] => getPublicProductsComplete: shopId: ${shopId}, params: `,
      params
    );

    const response = await this.client.get<PublicProductsResponseComplete>(
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
}
