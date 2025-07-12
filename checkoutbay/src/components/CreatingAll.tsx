import { FormValidateInput } from '@mantine/form';
import { Currency } from '@gofranz/common';
import {
  Address,
  AddressType,
  DimensionUnit,
  InlineAddress,
  PaymentGateway,
  PaymentGatewayProvider,
  PhysicalProperties,
  Product,
  ShippingRate,
  ShippingRateCalculationMethod,
  ShippingRateTemplate,
  ShippingSpeed,
  Shop,
  StockMovement,
  Warehouse,
  WeightUnit,
} from '@gofranz/checkoutbay-common';
import { Decimal } from 'decimal.js';
import { v4 as uuidv4 } from 'uuid';
import { useRustyState } from '../state';
import { RenderAddressFields } from './Addresses/AddressFields';
import { EntityForm } from './Entity/EntityForm';
import { RenderPaymentGatewayFields } from './PaymentGateways/PaymentGatewayFields';
import { RenderProductFields } from './Products/ProductFields';
import { RenderShippingRateTemplateFields } from './ShippingRateTemplates/ShippingRateTemplateFields';
import { RenderStockMovementsFields } from './StockMovements/StockMovementFields';
import { RenderWarehouseFields } from './Warehouses/WarehouseFields';

export const initialPhysicalPropertiesValues: PhysicalProperties = {
  weight: 0,
  length: 0,
  width: 0,
  height: 0,
  weight_unit: WeightUnit.Grams,
  dimension_unit: DimensionUnit.Centimeters,
};

const initialProductValues: Partial<Product> = {
  title: '',
  cover_url: undefined,
  slug: '',
  description: '',
  sku: '',
  price: Decimal(0),
  allow_negative_stock: false,
  is_live: false,
  requires_shipping: true,
  categories: [],
  tags: [],
  data: '',
  data_public: '',
  physical_properties: initialPhysicalPropertiesValues,
};

const getInitialProductValues = (shopId: string) => {
  return {
    ...initialProductValues,
    shop_id: shopId,
  };
};

export const productValidation: FormValidateInput<Partial<Product>> = {
  title: (value: string | undefined) => (value ? null : 'Title is required'),
  slug: (value: string | undefined) => (value ? null : 'Slug is required'),
  description: (value: string | undefined) => (value ? null : 'Description is required'),
  price: (value: any) => (value ? null : 'Price is required'),
};

export function CreateProduct({
  submitFormCb,
}: {
  submitFormCb: (data: Partial<Product>) => Promise<void>;
}) {
  const shopId = useRustyState.getState().getShopId();
  return (
    <EntityForm<Partial<Product>>
      title="Create Product"
      description="Add a new product to your store."
      initialValues={getInitialProductValues(shopId)}
      validation={productValidation}
      submitFormCb={submitFormCb}
      renderFields={RenderProductFields}
      shopId={shopId}
    />
  );
}

const initialWarehouseValues: Partial<Warehouse> = {
  title: '',
  code: '',
  is_active: true,
};

const getInitialWarehouseValues = (shopId: string) => {
  return {
    ...initialWarehouseValues,
    shop_id: shopId,
  };
};

export const warehouseValidation: FormValidateInput<Partial<Warehouse>> = {
  title: (value: string | undefined) => (value ? undefined : 'Title is required'),
  is_active: (value: boolean | undefined) => (value ? undefined : 'Active is required'),
};

export function CreateWarehouse({
  submitFormCb,
}: {
  submitFormCb: (data: Partial<Warehouse>) => Promise<void>;
}) {
  const shopId = useRustyState.getState().getShopId();
  return (
    <EntityForm<Warehouse>
      title="Create Warehouse"
      description="Add a new warehouse location."
      initialValues={getInitialWarehouseValues(shopId)}
      validation={warehouseValidation}
      submitFormCb={submitFormCb}
      renderFields={RenderWarehouseFields}
      shopId={shopId}
    />
  );
}

const initialAddressValues = {
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

const getInitialAddressValues = (shopId: string) => {
  return {
    ...initialAddressValues,
    shop_id: shopId,
  };
};

export const addressValidation: FormValidateInput<Partial<Address>> = {
  street: (value: string | undefined) => (value ? undefined : 'Street is required'),
  city: (value: string | undefined) => (value ? undefined : 'City is required'),
  // state: (value: string) => (value ? null : "State is required"),
  country: (value: string | undefined) => (value ? undefined : 'Country is required'),
  zip: (value: string | undefined) => (value ? undefined : 'ZIP is required'),
};

export function CreateAddress({
  submitFormCb,
}: {
  submitFormCb: (data: Partial<Address>) => Promise<void>;
}) {
  const shopId = useRustyState.getState().getShopId();
  return (
    <EntityForm<InlineAddress>
      title="Create Address"
      description="Add a new address to your account."
      initialValues={getInitialAddressValues(shopId)}
      validation={addressValidation}
      submitFormCb={submitFormCb}
      renderFields={RenderAddressFields}
      shopId={shopId}
    />
  );
}

const stockMovementInitialValues = {
  quantity: 0,
  product_id: '',
  warehouse_id: '',
  reason: '',
};

const getInitialStockMovementValues = (shopId: string) => {
  return {
    ...stockMovementInitialValues,
    shop_id: shopId,
  };
};

export const stockMovementValidation: FormValidateInput<Partial<StockMovement>> = {
  quantity: (value: number | undefined) => (value ? undefined : 'Quantity is required'),
  product_id: (value: string | undefined) => (value ? undefined : 'Product is required'),
  warehouse_id: (value: string | undefined) => (value ? undefined : 'Warehouse is required'),
  reason: (value: string | undefined) => (value ? undefined : 'Reason is required'),
};

export function CreateStockMovement({
  submitFormCb,
}: {
  submitFormCb: (data: any) => Promise<void>;
}) {
  const shopId = useRustyState.getState().getShopId();
  return (
    <EntityForm<any>
      title="Create Stock Movement"
      description="Add a new stock movement to your account."
      initialValues={getInitialStockMovementValues(shopId)}
      validation={stockMovementValidation}
      submitFormCb={submitFormCb}
      renderFields={RenderStockMovementsFields}
      shopId={shopId}
    />
  );
}
const paymentGatewayInitialValues = {
  title: '',
  provider: '',
  public_key: '',
  secret_key: '',
  product_id: '',
  is_test_mode: false,
  webhook_url: '',
  webhook_secret: '',
};

const getInitialPaymentGatewayValues = (shopId: string) => {
  return {
    ...paymentGatewayInitialValues,
    shop_id: shopId,
  };
};

export const paymentGatewayValidation: FormValidateInput<Partial<PaymentGateway>> = {
  title: (value: string | undefined) => (value ? undefined : 'Title is required'),
  provider: (value: PaymentGatewayProvider | undefined) => (value ? undefined : 'Provider is required'),
  public_key: (value: string | undefined) => (value ? undefined : 'Public key is required'),
  secret_key: (value: string | undefined) => (value ? undefined : 'Secret key is required'),
  product_id: (value: string | undefined) => (value ? undefined : 'Product is required'),
  webhook_url: (value: string | undefined) => (value ? undefined : 'Webhook URL is required'),
  webhook_secret: (value: string | undefined) => (value ? undefined : 'Webhook secret is required'),
};

export function CreatePaymentGateway({
  submitFormCb,
}: {
    submitFormCb: (data: Partial<PaymentGateway>) => Promise<void>;
}) {
  const shopId = useRustyState.getState().getShopId();
  return (
    <EntityForm<any>
      title="Create Payment Gateway"
      description="Add a new payment gateway to your account."
      initialValues={getInitialPaymentGatewayValues(shopId)}
      validation={paymentGatewayValidation}
      submitFormCb={submitFormCb}
      renderFields={RenderPaymentGatewayFields}
      shopId={shopId}
    />
  );
}

export const initialShippingRateRatesValues: ShippingRate = {
  id: uuidv4(),
  countries: [],
  amount: Decimal(0),
  free_above_value: Decimal(0),
};

const shippingRateTemplateInitialValues: Partial<ShippingRateTemplate> = {
  title: undefined,
  description: undefined,
  provider: '',
  rates: [initialShippingRateRatesValues],
  currency: Currency.EUR,
  method: ShippingRateCalculationMethod.ByOrder,
  service_level: ShippingSpeed.Standard,
  shop_id: '',
};

const getInitialShippingRateTemplateValues = (shopId: string, defaultCurrency: Currency) => {
  return {
    ...shippingRateTemplateInitialValues,
    shop_id: shopId,
    currency: defaultCurrency,
  };
};

export const shippingRateTemplateValidation: FormValidateInput<Partial<ShippingRateTemplate>> = {
  provider: (value: string | undefined) => (value ? undefined : 'Provider is required'),
  rates: (value: ShippingRate[] | undefined) => (value ? undefined : 'Rates is required'),
  currency: (value: Currency | undefined) => (value ? undefined : 'Currency is required'),
  method: (value: string | undefined) => (value ? undefined : 'Method is required'),
  service_level: (value: string | undefined) => (value ? undefined : 'Service Level is required'),
};

export function CreateShippingRateTemplate({
  submitFormCb,
}: {
    submitFormCb: (data: Partial<ShippingRateTemplate>) => Promise<void>;
}) {
  const shopId = useRustyState.getState().getShopId();
  const defaultCurrency = useRustyState.getState().shopCurrency();

  return (
    <EntityForm<ShippingRateTemplate>
      title="Create Shipping Rate Template"
      description="Add a new shipping rate template to your account."
      initialValues={getInitialShippingRateTemplateValues(shopId, defaultCurrency)}
      validation={shippingRateTemplateValidation}
      submitFormCb={submitFormCb}
      renderFields={RenderShippingRateTemplateFields}
      shopId={shopId}
    />
  );
}

export const initialShopValues = {
  name: '',
  default_currency: Currency.EUR,
};

export const shopValidation: FormValidateInput<Partial<Shop>> = {
  name: (value: string | undefined) => (value ? undefined : 'Name is required'),
  default_currency: (value: Currency | undefined) =>
    value ? undefined : 'Default currency is required',
};
