import { NewAddress, UpdateAddres } from "@gofranz/checkoutbay-common";
import {
  Box,
  Loader,
  Select,
  Stack,
  Switch,
  TextInput
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Country, Subdivision } from "rust_iso3166-ts";
import { RenderFieldsCreateProps } from "../Entity/EntityFormCreate";
import { RenderFieldsEditProps } from "../Entity/EntityFormEdit";

type FormMarkup = UseFormReturnType<NewAddress, (values: NewAddress) => NewAddress>;

export function RenderAddressFields(props: RenderFieldsCreateProps<NewAddress>): JSX.Element;
export function RenderAddressFields(props: RenderFieldsEditProps<UpdateAddres>): JSX.Element;
export function RenderAddressFields({
  form,
  setParentLoading,
}: RenderFieldsCreateProps<NewAddress> | RenderFieldsEditProps<UpdateAddres>): JSX.Element {
  const [countries, setCountries] = useState<Array<{ value: string; label: string }>>([]);
  const [states, setStates] = useState<Array<{ value: string; label: string }>>([]);
  const [stateDisabled, setStateDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [iso3166Data, setIso3166Data] = useState<{
    countries: Country[];
    states: Subdivision[];
  } | null>(null);
  const { t } = useTranslation();

  const loading = (loading: boolean) => {
    setIsLoading(loading);
    setParentLoading(loading);
  }

  useEffect(() => {
    const loadIsoData = async () => {
      loading(true);
      try {
        const { countries, subdivisions } = await import("rust_iso3166-ts");
        const iso31661 = countries();
        const iso31662 = subdivisions();
        setIso3166Data({ countries: iso31661, states: iso31662 });

        // Initialize countries
        const formattedCountries = iso31661
          .map((country) => ({
            value: country.alpha2,
            label: country.name,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setCountries(formattedCountries);
      } catch (error) {
        console.error("Failed to load ISO data:", error);
      } finally {
        loading(false);
      }
    };

    loadIsoData();
  }, []);

  const onCountryChange = (value: string | undefined | null) => {
    if (!value || !iso3166Data) {
      setStates([]);
      setStateDisabled(true);
      return;
    }

    const countryStates = iso3166Data.states.filter(
      (state) => state.country === value
    );

    if (countryStates.length === 0) {
      setStates([]);
      setStateDisabled(true);
      if (form.values.state) {
        (form as FormMarkup).setFieldValue("state", "");
      }
    } else {
      setStates(
        countryStates
          .map((state) => ({
            value: state.alpha2,
            label: state.name,
          }))
          .sort((a, b) => a.label.localeCompare(b.label))
      );
      setStateDisabled(false);
    }
  }

  useEffect(() => {
    if (!iso3166Data || !form.values.country) {
      return;
    }

    onCountryChange(form.values.country);
  }, [form.values.country, iso3166Data]);

  if (isLoading) {
    return <Box><Loader m="lg"/></Box>;
  }

  return (
    <Stack gap={3}>
      <TextInput
        label={t('addresses.recipientName')}
        placeholder={t('addresses.recipientNamePlaceholder')}
        {...(form as FormMarkup).getInputProps("recipient_name")}
        error={form.errors.recipient_name}
      />

      <TextInput
        label={t('addresses.street')}
        placeholder={t('addresses.streetPlaceholder')}
        withAsterisk
        {...(form as FormMarkup).getInputProps("street")}
        error={form.errors.street}
      />

      <TextInput
        label={t('addresses.street2')}
        placeholder={t('addresses.street2Placeholder')}
        {...(form as FormMarkup).getInputProps("street2")}
        error={form.errors.street2}
      />

      <TextInput
        label={t('addresses.city')}
        placeholder={t('addresses.cityPlaceholder')}
        withAsterisk
        {...(form as FormMarkup).getInputProps("city")}
        error={form.errors.city}
      />

      <Select
        label={t('addresses.country')}
        placeholder={t('addresses.selectCountry')}
        data={countries}
        withAsterisk
        {...(form as FormMarkup).getInputProps("country")}
        defaultValue={form.values.country}
        error={form.errors.country}
        searchable
        onChange={(value) => {
          if (value) {
            (form as FormMarkup).setFieldValue("country", value);
          }
          (form as FormMarkup).setFieldValue("state", null);
          onCountryChange(value);
        }}
      />

      <Select
        label={t('addresses.stateProvinceRegion')}
        placeholder={t('addresses.selectState')}
        data={states}
        {...(form as FormMarkup).getInputProps("state")}
        defaultValue={form.values.state}
        disabled={stateDisabled}
        error={form.errors.state}
        searchable
      />

      <TextInput
        label={t('addresses.zip')}
        placeholder={t('addresses.zipPlaceholder')}
        withAsterisk
        {...(form as FormMarkup).getInputProps("zip")}
        error={form.errors.zip}
      />

      <TextInput
        label={t('addresses.phone')}
        placeholder={t('addresses.phonePlaceholder')}
        {...(form as FormMarkup).getInputProps("phone")}
        error={form.errors.phone}
      />

      <TextInput
        label={t('addresses.vatNumber')}
        placeholder={t('addresses.vatNumberPlaceholder')}
        {...(form as FormMarkup).getInputProps("vat_number")}
        error={form.errors.vat_number}
      />

      <TextInput
        label={t('addresses.companyName')}
        placeholder={t('addresses.companyNamePlaceholder')}
        {...(form as FormMarkup).getInputProps("company_name")}
        error={form.errors.company_name}
      />

      <Switch
        label={t('addresses.isDefault')}
        {...(form as FormMarkup).getInputProps("is_default")}
        defaultChecked={form.values.is_default}
      />
    </Stack>
  );
}