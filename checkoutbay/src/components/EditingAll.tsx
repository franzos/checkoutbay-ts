import {
  Address,
  Discount,
  Order,
  PaymentGateway,
  Product,
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
import { Entity, EntityFormEdit, GeneralizedViewPageDetailComponentProps } from "@gofranz/common-components";
import { FormValidateInput } from "@mantine/form";
import { useTranslation } from "react-i18next";
import { RenderAddressFields } from "./Addresses/AddressFields";
import { RenderDiscountFields } from "./Discounts/DiscountFields";
import { RenderOrder } from "./Orders/Order";
import { RenderPaymentMethodFields } from "./PaymentMethods/PaymentMethodFields";
import { RenderProductFields } from "./Products/ProductFields";
import { RenderShippingRateTemplateFields } from "./ShippingRateTemplates/ShippingRateTemplateFields";
import { RenderShopFields } from "./Shop/ShopFields";
import { RenderStockMovementsFields } from "./StockMovements/StockMovementFields";
import { RenderWarehouseFields } from "./Warehouses/WarehouseFields";

export function EditProduct(props: GeneralizedViewPageDetailComponentProps<Product, UpdateProduct>) {
  return (
    <EntityFormEdit<UpdateProduct>
      title="Edit Product"
      initialValues={props.item}
      validation={{}}
      submitFormCb={props.submitCb}
      id={props.item.id}
      renderFields={RenderProductFields}
      primaryEntityId={props.item.shop_id}
    />
  );
}


export function EditWarehouse(props: GeneralizedViewPageDetailComponentProps<Warehouse, UpdateWarehouse>) {
  return (
    <EntityFormEdit<UpdateWarehouse>
      title="Edit Warehouse"
      initialValues={props.item}
      validation={{}}
      submitFormCb={props.submitCb}
      id={props.item.id}
      renderFields={RenderWarehouseFields}
      primaryEntityId={props.item.shop_id}
    />
  );
}

export function EditAddress(props: GeneralizedViewPageDetailComponentProps<Address, UpdateAddres>) {
  if (!props.item.shop_id) {
    throw new Error("Address must have a shop_id");
  }
  return (
    <EntityFormEdit<UpdateAddres>
      title="Edit Address"
      initialValues={props.item}
      validation={{}}
      submitFormCb={props.submitCb}
      id={props.item.id}
      renderFields={RenderAddressFields}
      primaryEntityId={props.item.shop_id as string}
    />
  );
}

export function EditStockMovement(props: GeneralizedViewPageDetailComponentProps<StockMovement, UpdateStockMovement>) {
  return (
    <EntityFormEdit<UpdateStockMovement>
      title="Edit Stock Movement"
      initialValues={props.item}
      validation={{}}
      submitFormCb={props.submitCb}
      id={props.item.id}
      renderFields={RenderStockMovementsFields}
      primaryEntityId={props.item.shop_id}
    />
  );
}

export function EditPaymentMethod(props: GeneralizedViewPageDetailComponentProps<PaymentGateway, UpdatePaymentGateway>) {
  const { t } = useTranslation();
  return (
    <EntityFormEdit<UpdatePaymentGateway>
      title={t('entities.editPaymentMethod')}
      initialValues={props.item}
      validation={{}}
      submitFormCb={props.submitCb}
      id={props.item.id}
      renderFields={RenderPaymentMethodFields}
      primaryEntityId={props.item.shop_id}
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

export function EditShippingRateTemplate(props: GeneralizedViewPageDetailComponentProps<ShippingRateTemplate, UpdateShippingRateTemplate>) {
  // Sanitize null/undefined string fields to prevent React input warnings
  const sanitizedItem = {
    ...props.item,
    title: props.item.title ?? '',
    description: props.item.description ?? '',
  };

  return (
    <EntityFormEdit<UpdateShippingRateTemplate>
      title="Edit Shipping Rate Template"
      initialValues={sanitizedItem}
      validation={{}}
      submitFormCb={props.submitCb}
      id={props.item.id}
      renderFields={RenderShippingRateTemplateFields}
      primaryEntityId={props.item.shop_id}
    />
  );
}

const shopValidation: FormValidateInput<UpdateShop> = {
  name: (value: string | undefined) => (value ? undefined : 'Name is required'),
};

export function EditShop(props: GeneralizedViewPageDetailComponentProps<Shop, UpdateShop>) {
  return (
    <EntityFormEdit<UpdateShop>
      title="Edit Shop"
      initialValues={props.item}
      validation={shopValidation}
      submitFormCb={props.submitCb}
      id={props.item.id}
      renderFields={RenderShopFields}
      primaryEntityId={props.item.id}
    />
  );
}

export function EditDiscount(props: GeneralizedViewPageDetailComponentProps<Discount, UpdateDiscount>) {
  return (
    <EntityFormEdit<UpdateDiscount>
      title="Edit Discount"
      initialValues={props.item}
      validation={{}}
      submitFormCb={props.submitCb}
      id={props.item.id}
      renderFields={RenderDiscountFields}
      primaryEntityId={props.item.shop_id}
    />
  );
}