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
import {
  EditAddress,
  EditDiscount,
  EditPaymentMethod,
  EditProduct,
  EditShippingRateTemplate,
  EditShop,
  EditStockMovement,
  EditWarehouse,
  ViewOrder,
} from "./EditingAll";
import { GeneralizedViewPageDetailComponentProps } from "@gofranz/common-components";

export function ProductDetail(props: GeneralizedViewPageDetailComponentProps<Product, UpdateProduct>) {
  return (
    <>
      <EditProduct item={props.item} submitCb={props.submitCb} />
    </>
  );
}

export function WarehouseDetail(props: GeneralizedViewPageDetailComponentProps<Warehouse, UpdateWarehouse>) {
  return (
    <>
      <EditWarehouse item={props.item} submitCb={props.submitCb} />
    </>
  );
}

export function AddressDetail(props: GeneralizedViewPageDetailComponentProps<Address, UpdateAddres>) {
  return (
    <>
      <EditAddress item={props.item} submitCb={props.submitCb} />
    </>
  );
}

export function StockMovementDetail(props: GeneralizedViewPageDetailComponentProps<StockMovement, UpdateStockMovement>) {
  return (
    <>
      <EditStockMovement item={props.item} submitCb={props.submitCb} />
    </>
  );
}

export function PaymentMethodDetail(props: GeneralizedViewPageDetailComponentProps<PaymentGateway, UpdatePaymentGateway>) {
  return (
    <>
      <EditPaymentMethod item={props.item} submitCb={props.submitCb} />
    </>
  );
}

export function OrderDetail(props: GeneralizedViewPageDetailComponentProps<Order, Partial<Order>>) {
  return (
    <>
      <ViewOrder item={props.item} reload={props.reload} />
    </>
  );
}

export function ShippingRateTemplateDetail(props: GeneralizedViewPageDetailComponentProps<ShippingRateTemplate, UpdateShippingRateTemplate>) {
  return (
    <>
      <EditShippingRateTemplate item={props.item} submitCb={props.submitCb} />
    </>
  );
}

export function ShopDetail(props: GeneralizedViewPageDetailComponentProps<Shop, UpdateShop>) {
  return (
    <>
      <EditShop item={props.item} submitCb={props.submitCb} />
    </>
  );
}

export function DiscountDetail(props: GeneralizedViewPageDetailComponentProps<Discount, UpdateDiscount>) {
  return (
    <>
      <EditDiscount item={props.item} submitCb={props.submitCb} />
    </>
  );
}