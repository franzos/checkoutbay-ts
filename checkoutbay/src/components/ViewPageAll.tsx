import { Text } from "@mantine/core";
import { useRustyState } from "../state";
import {
  AddressDetail,
  OrderDetail,
  PaymentGatewayDetail,
  ProductDetail,
  ShippingRateTemplateDetail,
  ShopDetail,
  StockMovementDetail,
  WarehouseDetail,
} from "./DetailAll";
import { GeneralizedViewPage } from "./Entity/EntityViewPage";

export function AccountProductViewPage() {
  return (
    <GeneralizedViewPage
      DetailComponent={ProductDetail}
      getFunction={useRustyState.getState().api.getProduct}
      submitCb={useRustyState.getState().api.updateProduct}
      deleteCb={useRustyState.getState().api.deleteProduct}
    />
  );
}

export function AccountWarehouseViewPage() {
  return (
    <GeneralizedViewPage
      DetailComponent={WarehouseDetail}
      getFunction={useRustyState.getState().api.getWarehouse}
      submitCb={useRustyState.getState().api.updateWarehouse}
      deleteCb={useRustyState.getState().api.deleteWarehouse}
    />
  );
}

export function AccountAddressViewPage() {
  return (
    <GeneralizedViewPage
      DetailComponent={AddressDetail}
      getFunction={useRustyState.getState().api.getAddress}
      submitCb={useRustyState.getState().api.updateAddress}
      deleteCb={useRustyState.getState().api.deleteAddress}
    />
  );
}

export function AccountStockMovementViewPage() {
  return (
    <GeneralizedViewPage
      DetailComponent={StockMovementDetail}
      getFunction={useRustyState.getState().api.getStockMovement}
      submitCb={useRustyState.getState().api.updateStockMovement}
      deleteCb={useRustyState.getState().api.deleteStockMovement}
    />
  );
}

export function AccountPaymentGatewayViewPage() {
  return (
    <GeneralizedViewPage
      DetailComponent={PaymentGatewayDetail}
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
    <GeneralizedViewPage
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
    <GeneralizedViewPage
      DetailComponent={ShopDetail}
      getFunction={useRustyState.getState().api.getShop}
      submitCb={useRustyState.getState().api.updateShop}
      deleteCb={useRustyState.getState().api.deleteShop}
    />
    </>
  );
}