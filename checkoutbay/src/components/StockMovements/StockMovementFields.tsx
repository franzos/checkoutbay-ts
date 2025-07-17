import {
  NewStockMovement,
  Product,
  StockMovementReason,
  UpdateStockMovement,
  Warehouse,
} from "@gofranz/checkoutbay-common";
import { Box, Loader, NumberInput, Select, Stack, Text, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { useRustyState } from "../../state";
import { RenderFieldsCreateProps } from "../Entity/EntityFormCreate";
import { RenderFieldsEditProps } from "../Entity/EntityFormEdit";

type FormMarkup = UseFormReturnType<NewStockMovement, (values: NewStockMovement) => NewStockMovement>;

export function RenderStockMovementsFields(props: RenderFieldsCreateProps<NewStockMovement>): JSX.Element;
export function RenderStockMovementsFields(props: RenderFieldsEditProps<UpdateStockMovement>): JSX.Element;
export function RenderStockMovementsFields({
  form,
  setParentLoading,
  shopId,
  isEditing
}: RenderFieldsCreateProps<NewStockMovement> | RenderFieldsEditProps<UpdateStockMovement>): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const api = useRustyState.getState().api;
  const { t } = useTranslation();

  const loading = (loading: boolean) => {
    setIsLoading(loading);
    setParentLoading(loading);
  }

  useEffect(() => {
    const loadData = async () => {
      loading(true);
      try {
        const [productsResponse, warehousesResponse] = await Promise.all([
          api.getProducts({ shop_id: shopId }),
          api.getWarehouses({ shop_id: shopId }),
        ]);
        setProducts(productsResponse.data);
        setWarehouses(warehousesResponse.data);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        loading(false);
      }
    };
    loadData();
  }, [api]);

  const productOptions = products.map((product) => ({
    value: product.id as string,
    label: `${product.title}, ${product.sku}`,
  }));

  const warehouseOptions = warehouses.map((warehouse) => ({
    value: warehouse.id as string,
    label: `${warehouse.title}, ${warehouse.code}`,
  }));

  const stockMovementReasonOptions = Object.values(StockMovementReason).map(
    (reason) => ({
      value: reason,
      label: reason,
    })
  );

  if (isLoading) {
    return <Box><Loader m="lg" /></Box>;
  }

  return (
    <Stack gap={3}>

      <Select
        label={t('stockMovements.reason')}
        placeholder={t('stockMovements.selectReason')}
        withAsterisk
        data={stockMovementReasonOptions}
        {...(form as FormMarkup).getInputProps("reason")}
        defaultValue={form.values.reason}
      />

      <Text size="xs">{t('stockMovements.reasonDescription')}</Text>

      <NumberInput
        label={t('stockMovements.quantity')}
        placeholder={t('stockMovements.quantityPlaceholder')}
        withAsterisk
        {...(form as FormMarkup).getInputProps("quantity")}
        thousandSeparator=" "
        allowDecimal={true}
      />

      <Text size="xs">{t('stockMovements.quantityDescription')}</Text>

      {!isEditing && (
        <>
          <Select
            label={t('stockMovements.product')}
            placeholder={t('stockMovements.selectProduct')}
            withAsterisk
            data={productOptions}
            {...(form as FormMarkup).getInputProps("product_id")}
            defaultValue={form.values.product_id}
          />

          <Select
            label={t('stockMovements.warehouse')}
            placeholder={t('stockMovements.selectWarehouse')}
            withAsterisk
            data={warehouseOptions}
            {...(form as FormMarkup).getInputProps("warehouse_id")}
            defaultValue={form.values.warehouse_id}
          />
        </>
      )}

      <Text size="xs">{t('stockMovements.warehouseTransferNote')}</Text>

      <TextInput
        label={t('stockMovements.reference')}
        placeholder={t('stockMovements.referencePlaceholder')}
        {...(form as FormMarkup).getInputProps("reference")}
      />

      <Text size="xs">{t('stockMovements.referenceDescription')}</Text>

    </Stack>
  );
}