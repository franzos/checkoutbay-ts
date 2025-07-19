import {
  Address,
  Discount,
  DiscountType,
  DiscountValueType,
  Order,
  PaymentGateway,
  PaymentGatewayConfig,
  Product,
  ShippingRate,
  ShippingRateTemplate,
  Shop,
  StockMovement,
  UpdateAddres,
  UpdateDiscount,
  UpdatePaymentGateway,
  UpdateProduct,
  UpdateShippingRateTemplate,
  UpdateShop,
  UpdateStockMovement,
  UpdateWarehouse,
  Warehouse,
} from "@gofranz/checkoutbay-common";
import { Entity } from "@gofranz/common-components";
import { FormValidateInput } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { RenderAddressFields } from "./Addresses/AddressFields";
import { RenderDiscountFields } from "./Discounts/DiscountFields";
import { EntityFormEdit } from "./Entity/EntityFormEdit";
import { RenderOrder } from "./Orders/Order";
import { RenderPaymentMethodFields } from "./PaymentMethods/PaymentMethodFields";
import { RenderProductFields } from "./Products/ProductFields";
import { RenderShippingRateTemplateFields } from "./ShippingRateTemplates/ShippingRateTemplateFields";
import { RenderShopFields } from "./Shop/ShopFields";
import { RenderStockMovementsFields } from "./StockMovements/StockMovementFields";
import { RenderWarehouseFields } from "./Warehouses/WarehouseFields";

export interface EditProductProps {
  submitFormCb: (id: string, data: UpdateProduct) => Promise<void>;
  item: Product;
}

export const productValidation: FormValidateInput<UpdateProduct> = {
  title: (value: string | undefined) => (value ? null : 'Title is required'),
  slug: (value: string | undefined) => (value ? null : 'Slug is required'),
  description: (value: string | undefined) => (value ? null : 'Description is required'),
  price: (value: unknown) => (value ? null : 'Price is required'),
};

export function EditProduct({ item, submitFormCb }: EditProductProps) {
  return (
    <EntityFormEdit<UpdateProduct>
      title="Edit Product"
      initialValues={item}
      validation={productValidation}
      submitFormCb={submitFormCb}
      id={item.id}
      renderFields={RenderProductFields}
      shopId={item.shop_id}
    />
  );
}

export interface EditWarehouseProps {
  submitFormCb: (id: string, data: UpdateWarehouse) => Promise<void>;
  item: Warehouse;
}

const warehouseValidation: FormValidateInput<UpdateWarehouse> = {
  title: (value: string | undefined) => (value ? undefined : 'Title is required'),
  is_active: (value: boolean | undefined) => (value ? undefined : 'Active is required'),
};

export function EditWarehouse({ item, submitFormCb }: EditWarehouseProps) {
  return (
    <EntityFormEdit<UpdateWarehouse>
      title="Edit Warehouse"
      initialValues={item}
      validation={warehouseValidation}
      submitFormCb={submitFormCb}
      id={item.id}
      renderFields={RenderWarehouseFields}
      shopId={item.shop_id}
    />
  );
}

export interface EditAddressProps {
  submitFormCb: (id: string, data: UpdateAddres) => Promise<void>;
  item: Address;
}

export const addressValidation: FormValidateInput<UpdateAddres> = {
  street: (value: string | undefined) => (value ? undefined : 'Street is required'),
  city: (value: string | undefined) => (value ? undefined : 'City is required'),
  // state: (value: string) => (value ? null : "State is required"),
  country: (value: string | undefined) => (value ? undefined : 'Country is required'),
  zip: (value: string | undefined) => (value ? undefined : 'ZIP is required'),
};


export function EditAddress({ item, submitFormCb }: EditAddressProps) {
  console.log(`Initial values: ${JSON.stringify(item)}`);
  return (
    <EntityFormEdit<UpdateAddres>
      title="Edit Address"
      initialValues={item}
      validation={addressValidation}
      submitFormCb={submitFormCb}
      id={item.id}
      renderFields={RenderAddressFields}
      // TODO
      shopId={item.shop_id as string}
    />
  );
}

export interface EditStockMovementProps {
  submitFormCb: (id: string, data: UpdateStockMovement) => Promise<void>;
  item: StockMovement;
}

const stockMovementValidation: FormValidateInput<UpdateStockMovement> = {
  quantity: (value: number | undefined) => (value ? undefined : 'Quantity is required'),
  reason: (value: string | undefined) => (value ? undefined : 'Reason is required'),
};

export function EditStockMovement({
  item,
  submitFormCb,
}: EditStockMovementProps) {
  return (
    <EntityFormEdit<UpdateStockMovement>
      title="Edit Stock Movement"
      initialValues={item}
      validation={stockMovementValidation}
      submitFormCb={submitFormCb}
      id={item.id}
      renderFields={RenderStockMovementsFields}
      shopId={item.shop_id}
    />
  );
}

export interface EditPaymentMethodProps {
  submitFormCb: (id: string, data: UpdatePaymentGateway) => Promise<void>;
  item: PaymentGateway;
}

const createPaymentGatewayValidation: FormValidateInput<UpdatePaymentGateway> = {
  title: (value: string | undefined) => (value ? undefined : 'Title is required'),
  provider_config: (value: PaymentGatewayConfig | undefined) => {
    if (!value) {
      return 'Provider is required';
    }
    return undefined;
  },
};

export function EditPaymentMethod({
  item,
  submitFormCb,
}: EditPaymentMethodProps) {
  const { t } = useTranslation();
  return (
    <EntityFormEdit<UpdatePaymentGateway>
      title={t('entities.editPaymentMethod')}
      initialValues={item}
      validation={createPaymentGatewayValidation}
      submitFormCb={submitFormCb}
      id={item.id}
      renderFields={RenderPaymentMethodFields}
      shopId={item.shop_id}
    />
  );
}

export interface ViewOrderProps {
  item: Order;
  reload?: () => Promise<void>;
}

export function ViewOrder({ item, reload }: ViewOrderProps) {
  return (
    <Entity<Order>
      title="View Order"
      data={item}
      render={RenderOrder}
      reload={reload}
    />
  );
}

export interface EditShippingRateTemplateProps {
  submitFormCb: (
    id: string,
    data: UpdateShippingRateTemplate
  ) => Promise<void>;
  item: ShippingRateTemplate
}

const shippingRateTemplateValidation: FormValidateInput<UpdateShippingRateTemplate> = {
  rates: (value: ShippingRate[] | undefined) => (value ? undefined : 'Rates is required'),
  method: (value: string | undefined) => (value ? undefined : 'Method is required'),
  service_level: (value: string | undefined) => (value ? undefined : 'Service Level is required'),
};

export function EditShippingRateTemplate({
  item,
  submitFormCb,
}: EditShippingRateTemplateProps) {
  // Sanitize null/undefined string fields to prevent React input warnings
  const sanitizedItem = {
    ...item,
    title: item.title ?? '',
    description: item.description ?? '',
  };

  return (
    <EntityFormEdit<UpdateShippingRateTemplate>
      title="Edit Shipping Rate Template"
      initialValues={sanitizedItem}
      validation={shippingRateTemplateValidation}
      submitFormCb={submitFormCb}
      id={item.id}
      renderFields={RenderShippingRateTemplateFields}
      shopId={item.shop_id}
    />
  );
}

export interface EditShopProps {
  submitFormCb: (id: string, data: UpdateShop) => Promise<void>;
  item: Shop;
}

const shopValidation: FormValidateInput<UpdateShop> = {
  name: (value: string | undefined) => (value ? undefined : 'Name is required'),
};

export function EditShop({ item, submitFormCb }: EditShopProps) {
  return (
    <EntityFormEdit<UpdateShop>
      title="Edit Shop"
      initialValues={item}
      validation={shopValidation}
      submitFormCb={submitFormCb}
      id={item.id}
      renderFields={RenderShopFields}
      shopId={item.id}
    />
  );
}

export interface EditDiscountProps {
  submitFormCb: (id: string, data: UpdateDiscount) => Promise<void>;
  item: Discount;
}

export const discountValidation: FormValidateInput<UpdateDiscount> = {
  title: (value: string | undefined) =>
    !value || value.trim().length > 0 ? undefined : 'Title cannot be empty',

  discount_type: (value: DiscountType | undefined) =>
    !value || Object.values(DiscountType).includes(value) ? undefined : 'Invalid discount type',

  value: (value: unknown, values: UpdateDiscount) => {
    if (values.discount_type === DiscountType.VolumeDiscount) {
      return undefined; // Volume discounts don't use this field
    }
    if (value !== undefined && (typeof value !== 'number' || value <= 0)) {
      return 'Value must be greater than 0';
    }
    return undefined;
  },

  value_type: (value: DiscountValueType | undefined, values: UpdateDiscount) => {
    if (values.discount_type === DiscountType.VolumeDiscount) {
      return undefined; // Volume discounts don't use this field
    }
    if (values.value !== undefined && !value) {
      return 'Value type is required when value is provided';
    }
    return undefined;
  },

  minimum_spend_amount: (value: unknown) => {
    if (value !== undefined && (typeof value !== 'number' || value < 0)) {
      return 'Minimum spend amount must be 0 or greater';
    }
    return undefined;
  },

  start_date: (value: string | undefined) =>
    value ? undefined : 'Start date is required',

  end_date: (value: string | undefined, values: UpdateDiscount) => {
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

export function EditDiscount({ item, submitFormCb }: EditDiscountProps) {
  return (
    <EntityFormEdit<UpdateDiscount>
      title="Edit Discount"
      initialValues={item}
      validation={discountValidation}
      submitFormCb={submitFormCb}
      id={item.id}
      renderFields={RenderDiscountFields}
      shopId={item.shop_id}
    />
  );
}