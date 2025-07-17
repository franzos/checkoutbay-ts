import { Address, Discount, PaymentGateway, Product, ShippingRateTemplate, Shop, StockMovement, UpdateAddres, UpdateDiscount, UpdatePaymentGateway, UpdateProduct, UpdateShippingRateTemplate, UpdateShop, UpdateStockMovement, UpdateWarehouse, Warehouse } from "@gofranz/checkoutbay-common";
import { Text } from "@mantine/core";
import { useRustyState } from "../state";
import {
  AddressDetail,
  DiscountDetail,
  OrderDetail,
  PaymentMethodDetail,
  ProductDetail,
  ShippingRateTemplateDetail,
  ShopDetail,
  StockMovementDetail,
  WarehouseDetail,
} from "./DetailAll";
import { GeneralizedViewPage } from "./Entity/EntityViewPage";

export function AccountProductViewPage() {
  return (
    <GeneralizedViewPage<Product, UpdateProduct>
      DetailComponent={ProductDetail}
      getFunction={useRustyState.getState().api.getProduct}
      submitCb={useRustyState.getState().api.updateProduct}
      deleteCb={useRustyState.getState().api.deleteProduct}
    />
  );
}

export function AccountWarehouseViewPage() {
  return (
    <GeneralizedViewPage<Warehouse, UpdateWarehouse>
      DetailComponent={WarehouseDetail}
      getFunction={useRustyState.getState().api.getWarehouse}
      submitCb={useRustyState.getState().api.updateWarehouse}
      deleteCb={useRustyState.getState().api.deleteWarehouse}
    />
  );
}

export function AccountAddressViewPage() {
  return (
    <GeneralizedViewPage<Address, UpdateAddres>
      DetailComponent={AddressDetail}
      getFunction={useRustyState.getState().api.getAddress}
      submitCb={useRustyState.getState().api.updateAddress}
      deleteCb={useRustyState.getState().api.deleteAddress}
    />
  );
}

export function AccountStockMovementViewPage() {
  return (
    <GeneralizedViewPage<StockMovement, UpdateStockMovement>
      DetailComponent={StockMovementDetail}
      getFunction={useRustyState.getState().api.getStockMovement}
      submitCb={useRustyState.getState().api.updateStockMovement}
      deleteCb={useRustyState.getState().api.deleteStockMovement}
    />
  );
}

export function AccountPaymentMethodViewPage() {
  return (
    <GeneralizedViewPage<PaymentGateway, UpdatePaymentGateway>
      DetailComponent={PaymentMethodDetail}
      getFunction={useRustyState.getState().api.getPaymentGateway}
      submitCb={useRustyState.getState().api.updatePaymentGateway}
      deleteCb={useRustyState.getState().api.deletePaymentGateway}
    />
  );
}

export function AccountOrderViewPage() {
  return (
    <GeneralizedViewPage
      DetailComponent={OrderDetail}
      getFunction={useRustyState.getState().api.getOrder}
      // submitCb={useRustyState.getState().api.updateOrder}
      // deleteCb={useRustyState.getState().api.deleteOrder}
    />
  );
}

export function AccountShippingRateTemplateViewPage() {
  return (
    <GeneralizedViewPage<ShippingRateTemplate, UpdateShippingRateTemplate>
      DetailComponent={ShippingRateTemplateDetail}
      getFunction={useRustyState.getState().api.getShippingRateTemplate}
      submitCb={useRustyState.getState().api.updateShippingRateTemplate}
      deleteCb={useRustyState.getState().api.deleteShippingRateTemplate}
    />
  );
}

export function ShopViewPage() {
  return (
    <>
    <Text>Shop</Text>
      <GeneralizedViewPage<Shop, UpdateShop>
      DetailComponent={ShopDetail}
      getFunction={useRustyState.getState().api.getShop}
      submitCb={useRustyState.getState().api.updateShop}
      deleteCb={useRustyState.getState().api.deleteShop}
    />
    </>
  );
}

export function AccountDiscountViewPage() {
  return (
    <GeneralizedViewPage<Discount, UpdateDiscount>
      DetailComponent={DiscountDetail}
      getFunction={useRustyState.getState().api.getDiscount}
      submitCb={useRustyState.getState().api.updateDiscount}
      deleteCb={useRustyState.getState().api.deleteDiscount}
    />
  );
}