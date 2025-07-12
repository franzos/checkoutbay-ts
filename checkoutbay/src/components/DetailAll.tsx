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
  EditAddress,
  EditPaymentGateway,
  EditProduct,
  EditShippingRateTemplate,
  EditShop,
  EditStockMovement,
  EditWarehouse,
  ViewOrder,
} from "./EditingAll";

export interface ProductDetailProps {
  item: Partial<Product>;
  submitCb: (id: string, updateProduct: Partial<Product>) => Promise<void>;
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
  item: Partial<Warehouse>;
  submitCb: (id: string, updateWarehouse: Partial<Warehouse>) => Promise<void>;
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
  submitCb: (id: string, item: Partial<Address>) => Promise<void>;
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
  item: Partial<StockMovement>;
  submitCb: (
    id: string,
    updateStockMovement: Partial<StockMovement>
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

export interface PaymentGatewayDetailProps {
  item: PaymentGateway;
  submitCb: (
    id: string,
    updatePaymentGateway: Partial<PaymentGateway>
  ) => Promise<void>;
  deleteCb?: (formId: string) => Promise<void>;
}

export function PaymentGatewayDetail(props: PaymentGatewayDetailProps) {
  return (
    <>
      <EditPaymentGateway item={props.item} submitFormCb={props.submitCb} />
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
    updateShippingRateTemplate: Partial<ShippingRateTemplate>
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
  item: Partial<Shop>;
  submitCb: (id: string, updateShop: Partial<Shop>) => Promise<void>;
  deleteCb?: (formId: string) => Promise<void>;
}

export function ShopDetail(props: ShopDetailProps) {
  return (
    <>
      <EditShop item={props.item} submitFormCb={props.submitCb} />
    </>
  );
}