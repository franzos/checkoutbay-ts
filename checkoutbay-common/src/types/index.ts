// Export all generated types from Rust backend
export * from './generated';

// Additional convenience types
import { Decimal } from 'decimal.js';

// Generic response wrapper
export interface GenericListResponse<T> {
  data: T[];
  total: number;
}

// Response types using generated base types
export interface AddressesResponse extends GenericListResponse<import('./generated').InlineAddress> {}
export interface WarehousesResponse extends GenericListResponse<import('./generated').Warehouse> {}
export interface ProductsResponse extends GenericListResponse<import('./generated').Product> {}
export interface StockMovementsResponse extends GenericListResponse<import('./generated').StockMovement> {}
export interface ShopsResponse extends GenericListResponse<import('./generated').Shop> {}

// Tax calculation types (not generated from backend)
export interface TaxRatesQueryBase {
  destination_country?: string;
  destination_state?: string;
  transaction?: TransactionType;
  ignore_threshold?: boolean;
  origin_country?: string;
  origin_state?: string;
}

export interface TaxRatesQueryMinimal extends TaxRatesQueryBase {
  destination_country: string;
  ignore_threshold: boolean;
}

export interface TaxRatesQuery extends TaxRatesQueryMinimal {
  origin_country: string;
}

// Warehouse stock tracking (frontend-specific)
export interface WarehouseStockLevel {
  warehouse_title?: string;
  warehouse_id: string;
  stock_level: number;
}

export type ProductWarehouseStockLevels = [string, WarehouseStockLevel][]

// Extended types for frontend compatibility (keeping Decimal support)
export interface ProductExtended extends Omit<import('./generated').Product, 'price'> {
  price: Decimal;
}

export interface OrderItemExtended extends Omit<import('./generated').OrderItem, 
  'unit_price' | 'unit_tax' | 'unit_discount' | 'subtotal_before_discount' |
  'discount_total' | 'subtotal' | 'tax_total' | 'total'> {
  unit_price?: Decimal;
  unit_tax?: Decimal;
  unit_discount?: Decimal;
  subtotal_before_discount?: Decimal;
  discount_total?: Decimal;
  subtotal?: Decimal;
  tax_total?: Decimal;
  total?: Decimal;
}

export interface OrderExtended extends Omit<import('./generated').Order, 
  'shipping_total' | 'subtotal_before_discount' | 'discount_total' | 
  'subtotal' | 'tax_total' | 'total' | 'created_at' | 'updated_at'> {
  shipping_total: Decimal;
  subtotal_before_discount: Decimal;
  discount_total: Decimal;
  subtotal: Decimal;
  tax_total: Decimal;
  total: Decimal;
  created_at: Date;
  updated_at: Date;
  items: OrderItemExtended[];
}

// Order variant types for frontend
export interface OrderRegisteredUser extends OrderExtended {
  customer_user_id: string;
  shipping_address_id: string;
  billing_address_id: string;
  source: import('./generated').OrderSource.RegisteredUser;
}

export interface OrderPublicUser extends OrderExtended {
  shipping_address: import('./generated').InlineAddress;
  billing_address: import('./generated').InlineAddress;
  customer_user_email: string;
  source: import('./generated').OrderSource.PublicUser;
}

export type OrderRegisteredOrPublicUser = OrderRegisteredUser | OrderPublicUser;
export interface OrdersResponse extends GenericListResponse<OrderRegisteredOrPublicUser> {}

// Order creation types
export interface NewOrderCalculation extends TaxRatesQueryMinimal {
  id: string;
  shop_id: string;
  warehouse_id?: string;
  currency: import('@gofranz/common').Currency;
  shipping_method?: string;
  items: import('./generated').NewOrderSubmissionItem[];
  notes?: string;
}

export interface NewRegisteredUserOrder extends Omit<NewOrderCalculation,
  | "origin_country" | "origin_state" | "destination_country" 
  | "destination_state" | "transaction" | "ignore_threshold"> {
  shipping_address_id: string;
  billing_address_id: string;
}

export interface NewPublicUserOrder extends Omit<NewRegisteredUserOrder,
  "shipping_address_id" | "billing_address_id"> {
  customer_user_email: string;
  shipping_address?: import('./generated').InlineAddress;
  billing_address?: import('./generated').InlineAddress;
}

// Processed order types with Decimal support
export interface ProcessedOrderItemExtended extends Omit<import('./generated').ProcessedOrderItem,
  'unit_price' | 'unit_tax' | 'unit_discount' | 'subtotal_before_discount' |
  'discount_total' | 'subtotal' | 'tax_total' | 'total'> {
  unit_price: Decimal;
  unit_tax: Decimal;
  unit_discount: Decimal;
  subtotal_before_discount: Decimal;
  discount_total: Decimal;
  subtotal: Decimal;
  tax_total: Decimal;
  total: Decimal;
}

export interface OrderTotalExtended extends Omit<import('./generated').OrderTotal,
  'shipping_total' | 'subtotal_before_discount' | 'discount_total' |
  'subtotal' | 'tax_total' | 'total'> {
  shipping_total: Decimal;
  subtotal_before_discount: Decimal;
  discount_total: Decimal;
  subtotal: Decimal;
  tax_total: Decimal;
  total: Decimal;
}

export interface ProcessedOrderPreview extends OrderTotalExtended {
  id: string;
  shop_id: string;
  warehouse_id: string;
  currency: import('@gofranz/common').Currency;
  status: import('./generated').OrderStatus;
  totals: OrderTotalExtended;
}

export interface ProcessedOrder extends ProcessedOrderPreview {
  shipping_method: string;
  notes?: string;
  items: ProcessedOrderItemExtended[];
}

// Payment Gateway types (not generated)
export interface PaymentGateway {
  id: string;
  title: string;
  provider: import('./generated').PaymentGatewayProvider;
  public_key: string;
  secret_key: string;
  product_id: string;
  is_test_mode: boolean;
  webhook_url: string;
  webhook_secret: string;
  shop_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PaymentGatewaysResponse extends GenericListResponse<PaymentGateway> {}

// Public types (simplified versions)
export interface PublicProduct extends Omit<ProductExtended, "data" | "allow_negative_stock" | "shop_id"> {}
export interface PublicProductsResponse extends GenericListResponse<PublicProduct> {}

export interface PublicFileExtended {
  // From PublicFile
  id: string;
  filename: string;
  product_id: string;
  // Extended properties
  name: string;
  mime_type: string;
  size: number;
  url: string;
  created_at: Date;
  updated_at: Date;
}

export interface PublicProductsResponseComplete {
  data: PublicProduct[];
  files?: PublicFileExtended[];
  stock?: import('./generated').PublicStock[];
  warehouses?: import('./generated').PublicWarehouse[];
  total: number;
}

// Tax types (not generated)
export enum TaxType {
  VAT = "vat",
  GST = "gst", 
  HST = "hst",
  PST = "pst",
  StateSalesTax = "state_sales_tax",
  CompoundTax = "compound_tax",
}

export interface TaxRate {
  rate: number;
  tax_type: TaxType;
  compound: boolean;
}

export enum TransactionType {
  B2B,
  B2C,
}

// Payment submission types (not generated)
export interface NewOrderPaymentSubmission {
  order_id: string;
  payment_gateway_id?: string;
  success_url?: string;
  cancel_url?: string;
}

export interface OrderPaymentExtended extends Omit<import('./generated').OrderPayment, 'amount' | 'created_at' | 'updated_at'> {
  amount: Decimal;
  created_at: Date;
  updated_at: Date;
}

export interface OrderPaymentWithParsedData extends Omit<OrderPaymentExtended, "data"> {
  data?: {
    redirect_url: string
  }
}

// Public shop types
export interface PublicShop {
  id: string;
  name: string;
  default_currency: import('@gofranz/common').Currency;
}

// Shipping types with Decimal support
export interface ShippingRate {
  id: string;
  countries: string[];
  amount: Decimal;
  free_above_value?: Decimal;
}

export interface PublicShippingRate {
  id: string;
  warehouse_id: string;
  provider: string;
  rates: ShippingRate[];
  currency: import('@gofranz/common').Currency;
  method: import('./generated').ShippingRateCalculationMethod;
  service_level: import('./generated').ShippingSpeed;
}

export interface ShippingRateTemplate extends Omit<PublicShippingRate, "warehouse_id"> {
  title?: string;
  description?: string;
  shop_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface ShippingRateTemplateWithWarehouseIds extends Omit<PublicShippingRate, "warehouse_id"> {
  title?: string;
  description?: string;
  shop_id: string;
  created_at: Date;
  updated_at: Date;
  warehouse_ids: string[];
}

export interface ShippingRateTemplatesResponse extends GenericListResponse<ShippingRateTemplate> {}
export interface ShippingRateTemplatesWithWarehouseIdsResponse extends GenericListResponse<ShippingRateTemplateWithWarehouseIds> {}

export interface WarehouseShippingTemplate {
  id: string;
  warehouse_id: string;
  template_id: string;
  created_at: Date;
}

// Re-export for convenience
export { Currency } from '@gofranz/common';
export { Decimal };

// Legacy type aliases for backward compatibility
export type Address = import('./generated').InlineAddress;
export type Warehouse = import('./generated').Warehouse;
export type Product = ProductExtended;
export type StockMovement = import('./generated').StockMovement;
export type Shop = import('./generated').Shop;
export type ShopUser = import('./generated').ShopUser;
export type OrderItem = OrderItemExtended;
export type Order = OrderExtended;
export type OrderPayment = OrderPaymentExtended;