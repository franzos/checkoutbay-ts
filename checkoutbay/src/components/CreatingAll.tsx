import {
  AddressType,
  DimensionUnit,
  DiscountType,
  DiscountValueType,
  NewAddress,
  NewDiscount,
  NewPaymentGateway,
  NewProduct,
  NewShippingRateTemplate,
  NewStockMovement,
  NewWarehouse,
  PaymentGatewayConfig,
  PhysicalProperties,
  ShippingRate,
  ShippingRateCalculationMethod,
  ShippingSpeed,
  StockMovementReason,
  StripeConfig,
  WeightUnit,
} from '@gofranz/checkoutbay-common';
import { Currency } from '@gofranz/common';
import { FormValidateInput } from '@mantine/form';
import { Decimal } from 'decimal.js';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { useRustyState } from '../state';
import { RenderAddressFields } from './Addresses/AddressFields';
import { RenderDiscountFields } from './Discounts/DiscountFields';
import { EntityFormCreate } from './Entity/EntityFormCreate';
import { RenderPaymentMethodFields } from './PaymentMethods/PaymentMethodFields';
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

const initialProductValues: NewProduct = {
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
  shop_id: '',
};

const productValidation: FormValidateInput<NewProduct> = {
  title: (value: string | undefined) => (value ? null : 'Title is required'),
  slug: (value: string | undefined) => (value ? null : 'Slug is required'),
  description: (value: string | undefined) => (value ? null : 'Description is required'),
  price: (value: unknown) => (value ? null : 'Price is required'),
};

export function CreateProduct({
  submitFormCb,
}: {
    submitFormCb: (data: NewProduct) => Promise<void>;
}) {
  const shopId = useRustyState.getState().getShopId();
  return (
    <EntityFormCreate<NewProduct>
      title="Create Product"
      description="Add a new product to your store."
      initialValues={{
        ...initialProductValues,
        shop_id: shopId,
      }}
      validation={productValidation}
      submitFormCb={submitFormCb}
      renderFields={RenderProductFields}
      shopId={shopId}
    />
  );
}

const initialWarehouseValues: NewWarehouse = {
  title: '',
  code: '',
  is_active: true,
  address_id: '',
  shop_id: '',
};

const warehouseValidation: FormValidateInput<NewWarehouse> = {
  title: (value: string | undefined) => (value ? undefined : 'Title is required'),
  is_active: (value: boolean | undefined) => (value ? undefined : 'Active is required'),
};

export function CreateWarehouse({
  submitFormCb,
}: {
    submitFormCb: (data: NewWarehouse) => Promise<void>;
}) {
  const shopId = useRustyState.getState().getShopId();
  return (
    <EntityFormCreate<NewWarehouse>
      title="Create Warehouse"
      description="Add a new warehouse location."
      initialValues={{
        ...initialWarehouseValues,
        shop_id: shopId,
      }}
      validation={warehouseValidation}
      submitFormCb={submitFormCb}
      renderFields={RenderWarehouseFields}
      shopId={shopId}
    />
  );
}

const initialAddressValues: NewAddress = {
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

export const addressValidation: FormValidateInput<NewAddress> = {
  street: (value: string | undefined) => (value ? undefined : 'Street is required'),
  city: (value: string | undefined) => (value ? undefined : 'City is required'),
  // state: (value: string) => (value ? null : "State is required"),
  country: (value: string | undefined) => (value ? undefined : 'Country is required'),
  zip: (value: string | undefined) => (value ? undefined : 'ZIP is required'),
};

export function CreateAddress({
  submitFormCb,
}: {
    submitFormCb: (data: NewAddress) => Promise<void>;
}) {
  const shopId = useRustyState.getState().getShopId();
  return (
    <EntityFormCreate<NewAddress>
      title="Create Address"
      description="Add a new address to your account."
      initialValues={{
        ...initialAddressValues,
        shop_id: shopId,
      }}
      validation={addressValidation}
      submitFormCb={submitFormCb}
      renderFields={RenderAddressFields}
      shopId={shopId}
    />
  );
}

const stockMovementInitialValues: NewStockMovement = {
  quantity: 0,
  product_id: '',
  warehouse_id: '',
  reason: StockMovementReason.Purchase,
  shop_id: '',
};

const stockMovementValidation: FormValidateInput<NewStockMovement> = {
  quantity: (value: number | undefined) => (value ? undefined : 'Quantity is required'),
  product_id: (value: string | undefined) => (value ? undefined : 'Product is required'),
  warehouse_id: (value: string | undefined) => (value ? undefined : 'Warehouse is required'),
  reason: (value: string | undefined) => (value ? undefined : 'Reason is required'),
};

export function CreateStockMovement({
  submitFormCb,
}: {
    submitFormCb: (data: NewStockMovement) => Promise<void>;
}) {
  const shopId = useRustyState.getState().getShopId();
  return (
    <EntityFormCreate<NewStockMovement>
      title="Create Stock Movement"
      description="Add a new stock movement to your account."
      initialValues={{
        ...stockMovementInitialValues,
        shop_id: shopId,
      }}
      validation={stockMovementValidation}
      submitFormCb={submitFormCb}
      renderFields={RenderStockMovementsFields}
      shopId={shopId}
    />
  );
}
const paymentGatewayInitialValues: NewPaymentGateway = {
  title: '',
  provider_config: {
    type: 'STRIPE',
    content: {} as StripeConfig,
  },
  is_test_mode: false,
  shop_id: '',
};

const createPaymentGatewayValidation: FormValidateInput<NewPaymentGateway> = {
  title: (value: string | undefined) => (value ? undefined : 'Title is required'),
  provider_config: (value: PaymentGatewayConfig | undefined) => {
    if (!value) {
      return 'Provider is required';
    }
    return undefined;
  },
};

export function CreatePaymentMethod({
  submitFormCb,
}: {
    submitFormCb: (data: NewPaymentGateway) => Promise<void>;
}) {
  const { t } = useTranslation();
  const shopId = useRustyState.getState().getShopId();
  return (
    <EntityFormCreate<NewPaymentGateway>
      title={t('entities.createPaymentMethod')}
      description={t('entities.createPaymentMethodDescription')}
      initialValues={{
        ...paymentGatewayInitialValues,
        shop_id: shopId,
      }}
      validation={createPaymentGatewayValidation}
      submitFormCb={submitFormCb}
      renderFields={RenderPaymentMethodFields}
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

const shippingRateTemplateInitialValues: NewShippingRateTemplate = {
  title: '',
  description: '',
  provider: '',
  rates: [initialShippingRateRatesValues],
  currency: Currency.EUR,
  method: ShippingRateCalculationMethod.ByOrder,
  service_level: ShippingSpeed.Standard,
  shop_id: '',
};

const shippingRateTemplateValidation: FormValidateInput<NewShippingRateTemplate> = {
  provider: (value: string | undefined) => (value ? undefined : 'Provider is required'),
  rates: (value: ShippingRate[] | undefined) => (value ? undefined : 'Rates is required'),
  currency: (value: Currency | undefined) => (value ? undefined : 'Currency is required'),
  method: (value: string | undefined) => (value ? undefined : 'Method is required'),
  service_level: (value: string | undefined) => (value ? undefined : 'Service Level is required'),
};

export function CreateShippingRateTemplate({
  submitFormCb,
}: {
    submitFormCb: (data: NewShippingRateTemplate) => Promise<void>;
}) {
  const shopId = useRustyState.getState().getShopId();
  const defaultCurrency = useRustyState.getState().shopCurrency();

  return (
    <EntityFormCreate<NewShippingRateTemplate>
      title="Create Shipping Rate Template"
      description="Add a new shipping rate template to your account."
      initialValues={{
        ...shippingRateTemplateInitialValues,
        shop_id: shopId,
        currency: defaultCurrency,
      }}
      validation={shippingRateTemplateValidation}
      submitFormCb={submitFormCb}
      renderFields={RenderShippingRateTemplateFields}
      shopId={shopId}
    />
  );
}

// export const initialShopValues = {
//   name: '',
//   default_currency: Currency.EUR,
// };

// const shopValidation: FormValidateInput<Shop> = {
//   name: (value: string | undefined) => (value ? undefined : 'Name is required'),
//   default_currency: (value: Currency | undefined) =>
//     value ? undefined : 'Default currency is required',
// };

const initialDiscountValues: NewDiscount = {
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
  shop_id: '',
};

export const discountValidation: FormValidateInput<NewDiscount> = {
  title: (value: string | undefined) => (value ? undefined : 'Title is required'),
  shop_id: (value: string | undefined) => (value ? undefined : 'Shop ID is required'),
  discount_type: (value: DiscountType | undefined) => (value ? undefined : 'Discount type is required'),
  value: (value: unknown, values: NewDiscount) => {
    // For volume discounts, value is automatically set to 0 and not required
    if (values.discount_type === DiscountType.VolumeDiscount) {
      return undefined;
    }
    return (value && value > 0 ? undefined : 'Value must be greater than 0');
  },
  value_type: (value: DiscountValueType | undefined, values: NewDiscount) => {
    // For volume discounts, value_type is automatically set and not required
    if (values.discount_type === DiscountType.VolumeDiscount) {
      return undefined;
    }
    return (value ? undefined : 'Value type is required');
  },
  minimum_spend_amount: (value: unknown) => {
    if (value !== undefined && (typeof value !== 'number' || value < 0)) {
      return 'Minimum spend amount must be 0 or greater';
    }
    return undefined;
  },
  start_date: (value: string | undefined) => (value ? undefined : 'Start date is required'),
  end_date: (value: string | undefined, values: NewDiscount) => {
    if (!value) return 'End date is required';
    if (values.start_date && new Date(value) <= new Date(values.start_date)) {
      return 'End date must be after start date';
    }
    return undefined;
  },
  product_ids: (value: string[] | undefined) => {
    if (value && (!Array.isArray(value) || value.some(id => typeof id !== 'string'))) {
      return 'Product IDs must be an array of strings';
    }
    return undefined;
  },
};

export function CreateDiscount({
  submitFormCb,
}: {
  submitFormCb: (data: NewDiscount) => Promise<void>;
}) {
  const shopId = useRustyState.getState().getShopId();
  return (
    <EntityFormCreate<NewDiscount>
      title="Create Discount"
      description="Add a new discount to your store."
      initialValues={{
        ...initialDiscountValues,
        shop_id: shopId,
      }}
      validation={discountValidation}
      submitFormCb={submitFormCb}
      renderFields={RenderDiscountFields}
      shopId={shopId}
    />
  );
}
