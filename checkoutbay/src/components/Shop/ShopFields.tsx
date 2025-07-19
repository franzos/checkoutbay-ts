import { NewShop, UpdateShop } from "@gofranz/checkoutbay-common";
import { Currency } from "@gofranz/common";
import { RenderFieldsCreateProps, RenderFieldsEditProps } from "@gofranz/common-components";
import { Select, Stack, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";

type FormMarkup = UseFormReturnType<NewShop, (values: NewShop) => NewShop>;

export function RenderShopFields(props: RenderFieldsCreateProps<NewShop>): JSX.Element;
export function RenderShopFields(props: RenderFieldsEditProps<UpdateShop>): JSX.Element;
export function RenderShopFields({
  form,
}: RenderFieldsCreateProps<NewShop> | RenderFieldsEditProps<UpdateShop>): JSX.Element {
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
        {...(form as FormMarkup).getInputProps("name")}
        error={form.errors.name}
      />

      <Select
        label="Default Currency"
        placeholder="Select a currency"
        withAsterisk
        data={currencyOptions}
        {...(form as FormMarkup).getInputProps("default_currency")}
        error={form.errors.default_currency}
      />
    </Stack>
  );
}
