import { Select, Stack, TextInput } from "@mantine/core";
import { Shop } from "@gofranz/checkoutbay-common";
import { RenderFieldsProps } from "../Entity/EntityForm";
import { Currency } from "@gofranz/common";

export function renderShopFields({ form, isEdit }: RenderFieldsProps<Shop>) {
  const currencyOptions = Object.values(Currency).map((currency) => ({
    value: currency,
    label: currency,
  }));

  return (
    <Stack gap={4}>
      <TextInput
        label="Name"
        placeholder="Shop Name"
        withAsterisk
        {...form.getInputProps("name")}
        error={form.errors.name}
      />

      <Select
        label="Default Currency"
        placeholder="Select a currency"
        withAsterisk
        data={currencyOptions}
        {...form.getInputProps("default_currency")}
        error={form.errors.default_currency}
      />

      {isEdit && (
        <>
          <TextInput
            label="Created At"
            placeholder="Creation Date"
            disabled
            {...form.getInputProps("created_at")}
            error={form.errors.created_at}
          />

          <TextInput
            label="Updated At"
            placeholder="Last Update Date"
            disabled
            {...form.getInputProps("updated_at")}
            error={form.errors.updated_at}
          />
        </>
      )}
    </Stack>
  );
}
