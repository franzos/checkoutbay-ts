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

export interface ProductDetailProps {
  item: Product;
  submitCb: (id: string, updateProduct: UpdateProduct) => Promise<void>;
  deleteCb?: (formId: string) => Promise<void>;
}

export function ProductDetail(props: ProductDetailProps) {
  return (
    <>
      <EditProduct item={props.item} submitFormCb={props.submitCb} />
    </>
  );
}

export interface WarehouseDetailProps {
  item: Warehouse;
  submitCb: (id: string, updateWarehouse: UpdateWarehouse) => Promise<void>;
  deleteCb?: (formId: string) => Promise<void>;
}

export function WarehouseDetail(props: WarehouseDetailProps) {
  return (
    <>
      <EditWarehouse item={props.item} submitFormCb={props.submitCb} />
    </>
  );
}

export interface AddressDetailProps {
  item: Address;
  submitCb: (id: string, item: UpdateAddres) => Promise<void>;
  deleteCb?: (id: string) => Promise<void>;
}

export function AddressDetail(props: AddressDetailProps) {
  return (
    <>
      <EditAddress item={props.item} submitFormCb={props.submitCb} />
    </>
  );
}

export interface StockMovementDetailProps {
  item: StockMovement;
  submitCb: (
    id: string,
    updateStockMovement: UpdateStockMovement
  ) => Promise<void>;
  deleteCb?: (formId: string) => Promise<void>;
}

export function StockMovementDetail(props: StockMovementDetailProps) {
  return (
    <>
      <EditStockMovement item={props.item} submitFormCb={props.submitCb} />
    </>
  );
}

export interface PaymentMethodDetailProps {
  item: PaymentGateway;
  submitCb: (
    id: string,
    updatePaymentMethod: UpdatePaymentGateway
  ) => Promise<void>;
  deleteCb?: (formId: string) => Promise<void>;
}

export function PaymentMethodDetail(props: PaymentMethodDetailProps) {
  return (
    <>
      <EditPaymentMethod item={props.item} submitFormCb={props.submitCb} />
    </>
  );
}

export interface OrderDetailProps {
  item: Order;
  submitCb?: (id: string, updateOrder: Partial<Order>) => Promise<void>;
  deleteCb?: (formId: string) => Promise<void>;
  reload?: () => Promise<void>;
}

export function OrderDetail(props: OrderDetailProps) {
  return (
    <>
      <ViewOrder item={props.item} reload={props.reload} />
    </>
  );
}

export interface ShippingRateTemplateDetailProps {
  item: ShippingRateTemplate;
  submitCb: (
    id: string,
    updateShippingRateTemplate: UpdateShippingRateTemplate
  ) => Promise<void>;
  deleteCb?: (formId: string) => Promise<void>;
}

export function ShippingRateTemplateDetail(props: ShippingRateTemplateDetailProps) {
  return (
    <>
      <EditShippingRateTemplate item={props.item} submitFormCb={props.submitCb} />
    </>
  );
}

export interface ShopDetailProps {
  item: Shop;
  submitCb: (id: string, updateShop: UpdateShop) => Promise<void>;
  deleteCb?: (formId: string) => Promise<void>;
}

export function ShopDetail(props: ShopDetailProps) {
  return (
    <>
      <EditShop item={props.item} submitFormCb={props.submitCb} />
    </>
  );
}

export interface DiscountDetailProps {
  item: Discount;
  submitCb: (id: string, updateDiscount: UpdateDiscount) => Promise<void>;
  deleteCb?: (formId: string) => Promise<void>;
}

export function DiscountDetail(props: DiscountDetailProps) {
  return (
    <>
      <EditDiscount item={props.item} submitFormCb={props.submitCb} />
    </>
  );
}