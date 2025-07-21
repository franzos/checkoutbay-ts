import { Currency } from "@gofranz/common";
import Decimal from "decimal.js";
import { PhysicalProperties, WeightUnit, DimensionUnit, NewProduct, NewWarehouse, NewAddress, AddressType, NewStockMovement, StockMovementReason, NewPaymentGateway, StripeConfig, ShippingRate, NewShippingRateTemplate, ShippingRateCalculationMethod, ShippingSpeed, NewDiscount, DiscountType, DiscountValueType } from "./generated";
import { v4 as uuidv4 } from 'uuid'

export const NewProductPhysicalPropertiesDefault: PhysicalProperties = {
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  weight_unit: WeightUnit.Grams,
  dimension_unit: DimensionUnit.Centimeters,
};

export const NewProductDefault: NewProduct = {
  title: '',
  cover_url: undefined,
  slug: '',
  description: {
    en: '',
    de: undefined,
    fr: undefined,
    es: undefined,
    pt: undefined,
    zh: undefined,
    th: undefined,
    ar: undefined,
  },
  description_long: {
    en: '',
    de: undefined,
    fr: undefined,
    es: undefined,
    pt: undefined,
    zh: undefined,
    th: undefined,
    ar: undefined,
  },
  sku: '',
  price: Decimal(0),
  allow_negative_stock: false,
  is_live: false,
  requires_shipping: true,
  categories: [],
  tags: [],
  data: '',
  data_public: '',
  physical_properties: NewProductPhysicalPropertiesDefault,
};

export const NewWarehouseDefault: NewWarehouse = {
  title: '',
  code: '',
  is_active: true,
  address_id: '',
};

export const NewAddressDefault: NewAddress = {
  recipient_name: '',
  street: '',
  street2: '',
  city: '',
  state: '',
  country: '',
  zip: '',
  phone: '',
  vat_number: '',
  company_name: '',
  is_default: false,
  kind: AddressType.Shop,
};

export const NewStockMovementDefault: NewStockMovement = {
  quantity: 0,
  product_id: '',
  warehouse_id: '',
  reason: StockMovementReason.Purchase,
};

export const NewPaymentGatewayDefault: NewPaymentGateway = {
  title: '',
  provider_config: {
    type: 'STRIPE',
    content: {} as StripeConfig,
  },
  is_test_mode: false,
};

export const initialShippingRateRatesValues: ShippingRate = {
  id: uuidv4(),
  countries: [],
  amount: Decimal(0),
  free_above_value: Decimal(0),
};

export const NewShippingRateTemplateDefault: NewShippingRateTemplate = {
  title: '',
  description: '',
  provider: '',
  rates: [initialShippingRateRatesValues],
  currency: Currency.EUR,
  method: ShippingRateCalculationMethod.ByOrder,
  service_level: ShippingSpeed.Standard,
};

export const NewDiscountDefault: NewDiscount = {
  title: '',
  description: '',
  discount_type: DiscountType.TemporaryDiscount,
  value: 0,
  value_type: DiscountValueType.FixedAmount,
  minimum_spend_amount: undefined,
  config: undefined,
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  product_ids: [],
};
