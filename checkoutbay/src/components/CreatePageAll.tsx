import { useRustyState } from "../state";
import {
  CreateAddress,
  CreatePaymentGateway,
  CreateProduct,
  CreateShippingRateTemplate,
  CreateStockMovement,
  CreateWarehouse,
} from "./CreatingAll";
import {
  Address,
  PaymentGateway,
  Product,
  ShippingRateTemplate,
  StockMovement,
  Warehouse,
} from "@gofranz/checkoutbay-common";
import { GeneralizedCreatePage } from "./Entity/EntityCreatePage";

export function AccountProductCreatePage() {
  return (
    <GeneralizedCreatePage<Product>
      CreateComponent={CreateProduct}
      createFunction={useRustyState.getState().api.createProduct}
      redirectPath={(entity) => `/account/products/${entity.id}`}
    />
  );
}

export function AccountWarehouseCreatePage() {
  return (
    <GeneralizedCreatePage<Warehouse>
      CreateComponent={CreateWarehouse}
      createFunction={useRustyState.getState().api.createWarehouse}
      redirectPath={(entity) => `/account/warehouses/${entity.id}`}
    />
  );
}

export function AccountAddressCreatePage() {
  return (
    <GeneralizedCreatePage<Address>
      CreateComponent={CreateAddress}
      createFunction={useRustyState.getState().api.createAddress}
      redirectPath={(entity) => `/account/addresses/${entity.id}`}
    />
  );
}

export function AccountStockMovementCreatePage() {
  return (
    <GeneralizedCreatePage<StockMovement>
      CreateComponent={CreateStockMovement}
      createFunction={useRustyState.getState().api.createStockMovement}
      redirectPath={(entity) => `/account/stock-movements/${entity.id}`}
    />
  );
}

export function AccountPaymentGatewayCreatePage() {
  return (
    <GeneralizedCreatePage<PaymentGateway>
      CreateComponent={CreatePaymentGateway}
      createFunction={useRustyState.getState().api.createPaymentGateway}
      redirectPath={(entity) => `/account/payment-gateways/${entity.id}`}
    />
  );
}

export function AccountShippingRateTemplateCreatePage() {
  return (
    <GeneralizedCreatePage<ShippingRateTemplate>
      CreateComponent={CreateShippingRateTemplate}
      createFunction={useRustyState.getState().api.createShippingRateTemplate}
      redirectPath={(entity) => `/account/shipping-rate-templates/${entity.id}`}
    />
  );
}