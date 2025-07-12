import {
  Address,
  Order,
  PaymentGateway,
  Product,
  ShippingRateTemplate,
  Shop,
  StockMovement,
  Warehouse,
} from "@gofranz/checkoutbay-common";
import {
  addressValidation,
  productValidation,
  shippingRateTemplateValidation,
  shopValidation,
  stockMovementValidation,
  warehouseValidation,
} from "./CreatingAll";
import { EntityForm } from "./Entity/EntityForm";
import { RenderProductFields } from "./Products/ProductFields";
import { RenderWarehouseFields } from "./Warehouses/WarehouseFields";
import { RenderAddressFields } from "./Addresses/AddressFields";
import { RenderStockMovementsFields } from "./StockMovements/StockMovementFields";
import { RenderPaymentGatewayFields } from "./PaymentGateways/PaymentGatewayFields";
import { RenderOrder } from "./Orders/Order";
import { Entity } from "./Entity/Entity";
import { RenderShippingRateTemplateFields } from "./ShippingRateTemplates/ShippingRateTemplateFields";
import { renderShopFields } from "./Shop/ShopFields";

export interface EditProductProps {
  submitFormCb: (id: string, data: Partial<Product>) => Promise<void>;
  item: Partial<Product>;
}

export function EditProduct({ item, submitFormCb }: EditProductProps) {
  return (
    <EntityForm<Product>
      title="Edit Product"
      initialValues={item}
      validation={productValidation}
      submitFormCb={(data, id) => submitFormCb(id!, data)}
      id={item.id}
      renderFields={RenderProductFields}
      isEdit={true}
      shopId={item.shop_id!}
    />
  );
}

export interface EditWarehouseProps {
  submitFormCb: (id: string, data: Partial<Warehouse>) => Promise<void>;
  item: Partial<Warehouse>;
}

export function EditWarehouse({ item, submitFormCb }: EditWarehouseProps) {
  return (
    <EntityForm<Warehouse>
      title="Edit Warehouse"
      initialValues={item}
      validation={warehouseValidation}
      submitFormCb={(data, id) => submitFormCb(id!, data)}
      id={item.id}
      renderFields={RenderWarehouseFields}
      isEdit={true}
      shopId={item.shop_id!}
    />
  );
}

export interface EditAddressProps {
  submitFormCb: (id: string, data: Partial<Address>) => Promise<void>;
  item: Partial<Address>;
}

export function EditAddress({ item, submitFormCb }: EditAddressProps) {
  console.log(`Initial values: ${JSON.stringify(item)}`);
  return (
    <EntityForm<Address>
      title="Edit Address"
      initialValues={item}
      validation={addressValidation}
      submitFormCb={(data, id) => submitFormCb(id!, data)}
      id={item.id}
      renderFields={RenderAddressFields}
      isEdit={true}
      shopId={item.shop_id!}
    />
  );
}

export interface EditStockMovementProps {
  submitFormCb: (id: string, data: Partial<StockMovement>) => Promise<void>;
  item: Partial<StockMovement>;
}

export function EditStockMovement({
  item,
  submitFormCb,
}: EditStockMovementProps) {
  return (
    <EntityForm<StockMovement>
      title="Edit Stock Movement"
      initialValues={item}
      validation={stockMovementValidation}
      submitFormCb={(data, id) => submitFormCb(id!, data)}
      id={item.id}
      renderFields={RenderStockMovementsFields}
      isEdit={true}
      shopId={item.shop_id!}
    />
  );
}

export interface EditPaymentGatewayProps {
  submitFormCb: (id: string, data: Partial<PaymentGateway>) => Promise<void>;
  item: Partial<PaymentGateway>;
}

export function EditPaymentGateway({
  item,
  submitFormCb,
}: EditPaymentGatewayProps) {
  return (
    <EntityForm<PaymentGateway>
      title="Edit Payment Gateway"
      initialValues={item}
      validation={{}}
      submitFormCb={(data, id) => submitFormCb(id!, data)}
      id={item.id}
      renderFields={RenderPaymentGatewayFields}
      isEdit={true}
      shopId={item.shop_id!}
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
    data: Partial<ShippingRateTemplate>
  ) => Promise<void>;
  item: Partial<ShippingRateTemplate>;
}

export function EditShippingRateTemplate({
  item,
  submitFormCb,
}: EditShippingRateTemplateProps) {
  return (
    <EntityForm<ShippingRateTemplate>
      title="Edit Shipping Rate Template"
      initialValues={item}
      validation={shippingRateTemplateValidation}
      submitFormCb={(data, id) => submitFormCb(id!, data)}
      id={item.id}
      renderFields={RenderShippingRateTemplateFields}
      isEdit={true}
      shopId={item.shop_id!}
    />
  );
}

export interface EditShopProps {
  submitFormCb: (id: string, data: Partial<Shop>) => Promise<void>;
  item: Partial<Shop>;
}

export function EditShop({ item, submitFormCb }: EditShopProps) {
  return (
    <EntityForm<Shop>
      title="Edit Shop"
      initialValues={item}
      validation={shopValidation}
      submitFormCb={(data, id) => submitFormCb(id!, data)}
      id={item.id}
      renderFields={renderShopFields}
      isEdit={true}
      shopId={item.id!}
    />
  );
}