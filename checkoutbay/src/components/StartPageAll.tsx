import {
  Address,
  AddressesQueryParams,
  Discount,
  DiscountsQueryParams,
  Order,
  OrdersQueryParams,
  PaymentGateway,
  PaymentGatewaysQueryParams,
  Product,
  ProductsQueryParams,
  ShippingRateTemplate,
  StockMovement,
  StockMovementsQueryParams,
  TemplatesQueryParams,
  UpdateAddres,
  UpdateDiscount,
  UpdatePaymentGateway,
  UpdateProduct,
  UpdateShippingRateTemplate,
  UpdateStockMovement,
  UpdateWarehouse,
  Warehouse,
  WarehousesQueryParams,
} from "@gofranz/checkoutbay-common";
import { useTranslation } from 'react-i18next';
import { useRustyState } from "../state";
import { AddressesTable } from "./Addresses/AddressesTable";
import { DiscountsTable } from "./Discounts/DiscountsTable";
import { GeneralizedStartPage } from "./Entity/EntityStartPage";
import { OrdersTable } from "./Orders/OrdersTable";
import { PaymentMethodsTable } from "./PaymentMethods/PaymentMethodTable";
import { ProductsTable } from "./Products/ProductsTable";
import { ShippingRateTemplatesTable } from "./ShippingRateTemplates/ShippingRateTemplatesTable";
import { StockMovementsTable } from "./StockMovements/StockMovementsTable";
import { WarehousesTable } from "./Warehouses/WarehousesTable";

export function AccountProductStartPage() {
  const { t } = useTranslation();
  const api = useRustyState.getState().api;
  const shopId = useRustyState.getState().shopId;
  const shopCurrency = useRustyState.getState().shopCurrency();

  return (
    <GeneralizedStartPage<Product, ProductsQueryParams, UpdateProduct>
      TableComponent={ProductsTable}
      getFunction={api.getProducts}
      createPath={`/account/${shopId}/products/create`}
      openPath={(entity) => `/account/${entity.shop_id}products/${entity.id}`}
      updateCb={api.updateProduct}
      deleteCb={api.deleteProduct}
      buttonText={t('entities.newProduct')}
      headerText={t('entities.newProductDescription')}
      primaryEntityId={shopId}
      shopCurrency={shopCurrency}
    />
  );
}

export function AccountWarehouseStartPage() {
  const { t } = useTranslation();
  const api = useRustyState.getState().api;
  const shopId = useRustyState.getState().shopId;
  const shopCurrency = useRustyState.getState().shopCurrency();

  return (
    <GeneralizedStartPage<Warehouse, WarehousesQueryParams, UpdateWarehouse>
      TableComponent={WarehousesTable}
      getFunction={api.getWarehouses}
      createPath={`/account/${shopId}/warehouses/create`}
      openPath={(entity) => `/account/${entity.shop_id}/warehouses/${entity.id}`}
      updateCb={api.updateWarehouse}
      deleteCb={api.deleteWarehouse}
      buttonText={t('entities.newWarehouse')}
      headerText={t('entities.newWarehouseDescription')}
      primaryEntityId={shopId}
      shopCurrency={shopCurrency}
    />
  );
}

export function AccountAddressStartPage() {
  const { t } = useTranslation();
  const api = useRustyState.getState().api;
  const shopId = useRustyState.getState().shopId;
  const shopCurrency = useRustyState.getState().shopCurrency();

  return (
    <GeneralizedStartPage<Address, AddressesQueryParams, UpdateAddres>
      TableComponent={AddressesTable}
      getFunction={api.getAddresses}
      createPath={`/account/${shopId}/addresses/create`}
      openPath={(entity) => `/account/${entity.shop_id}/addresses/${entity.id}`}
      updateCb={api.updateAddress}
      deleteCb={api.deleteAddress}
      buttonText={t('entities.newAddress')}
      headerText={t('entities.newAddressDescription')}
      primaryEntityId={shopId}
      shopCurrency={shopCurrency}
    />
  );
}

export function AccountStockMovementStartPage() {
  const { t } = useTranslation();
  const api = useRustyState.getState().api;
  const shopId = useRustyState.getState().shopId;
  const shopCurrency = useRustyState.getState().shopCurrency();

  return (
    <GeneralizedStartPage<StockMovement, StockMovementsQueryParams, UpdateStockMovement>
      TableComponent={StockMovementsTable}
      getFunction={api.getStockMovements}
      createPath={`/account/${shopId}/stock-movements/create`}
      openPath={(entity) => `/account/${entity.shop_id}/stock-movements/${entity.id}`}
      updateCb={api.updateStockMovement}
      deleteCb={api.deleteStockMovement}
      buttonText={t('entities.newStockMovement')}
      headerText={t('entities.newStockMovementDescription')}
      primaryEntityId={shopId}
      shopCurrency={shopCurrency}
    />
  );
}

export function AccountPaymentMethodStartPage() {
  const { t } = useTranslation();
  const api = useRustyState.getState().api;
  const shopId = useRustyState.getState().shopId;
  const shopCurrency = useRustyState.getState().shopCurrency();

  return (
    <GeneralizedStartPage<PaymentGateway, PaymentGatewaysQueryParams, UpdatePaymentGateway>
      TableComponent={PaymentMethodsTable}
      getFunction={api.getPaymentGateways}
      createPath={`/account/${shopId}/payment-methods/create`}
      openPath={(entity) => `/account/${entity.shop_id}/payment-methods/${entity.id}`}
      updateCb={api.updatePaymentGateway}
      deleteCb={api.deletePaymentGateway}
      buttonText={t('entities.newPaymentMethod')}
      headerText={t('entities.newPaymentMethodDescription')}
      primaryEntityId={shopId}
      shopCurrency={shopCurrency}
    />
  );
}

export function AccountOrderStartPage() {
  const { t } = useTranslation();
  const api = useRustyState.getState().api;
  const shopId = useRustyState.getState().shopId;
  const shopCurrency = useRustyState.getState().shopCurrency();

  return (
    <GeneralizedStartPage<Order, OrdersQueryParams, undefined>
      TableComponent={OrdersTable}
      getFunction={api.getOrders}
      // createPath="/account/orders/create"
      openPath={(entity) => `/account/${entity.shop_id}/orders/${entity.id}`}
      // changeCb={api.getAddresses}
      // updateCb={api.updateOrder}
      // deleteCb={api.deleteOrder}
      buttonText={t('entities.newOrder')}
      headerText={t('entities.newOrderDescription')}
      primaryEntityId={shopId}
      shopCurrency={shopCurrency}
    />
  );
}

export function ShippingRateTemplateStartPage() {
  const { t } = useTranslation();
  const api = useRustyState.getState().api;
  const shopId = useRustyState.getState().shopId;
  const shopCurrency = useRustyState.getState().shopCurrency();

  return (
    <GeneralizedStartPage<ShippingRateTemplate, TemplatesQueryParams, UpdateShippingRateTemplate>
      TableComponent={ShippingRateTemplatesTable}
      getFunction={api.getShippingRateTemplates}
      createPath={`/account/${shopId}/shipping-rate-templates/create`}
      openPath={(entity) => `/account/${entity.shop_id}/shipping-rate-templates/${entity.id}`}
      updateCb={api.updateShippingRateTemplate}
      deleteCb={api.deleteShippingRateTemplate}
      buttonText={t('entities.newShippingRateTemplate')}
      headerText={t('entities.newShippingRateTemplateDescription')}
      primaryEntityId={shopId}
      shopCurrency={shopCurrency}
    />
  );
}

export function AccountDiscountStartPage() {
  const api = useRustyState.getState().api;
  const shopId = useRustyState.getState().shopId;
  const shopCurrency = useRustyState.getState().shopCurrency();

  return (
    <GeneralizedStartPage<Discount, DiscountsQueryParams, UpdateDiscount>
      TableComponent={DiscountsTable}
      getFunction={api.getDiscounts}
      createPath={`/account/${shopId}/discounts/create`}
      openPath={(entity) => `/account/${entity.shop_id}/discounts/${entity.id}`}
      updateCb={api.updateDiscount}
      deleteCb={api.deleteDiscount}
      buttonText="New Discount"
      headerText="Create and manage discounts for your store"
      primaryEntityId={shopId}
      shopCurrency={shopCurrency}
    />
  );
}