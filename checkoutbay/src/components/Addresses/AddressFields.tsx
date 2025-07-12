import { Address } from "@gofranz/checkoutbay-common";
import {
  TextInput,
  Switch,
  Select,
  Loader,
  Stack,
  Box
} from "@mantine/core";
import { Country, Subdivision } from "rust_iso3166-ts";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RenderFieldsProps } from "../Entity/EntityForm";

export function RenderAddressFields({ form, setParentLoading }: RenderFieldsProps<Address>) {
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
        form.setFieldValue("state", "");
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
        {...form.getInputProps("recipient_name")}
        error={form.errors.recipient_name}
      />

      <TextInput
        label={t('addresses.street')}
        placeholder={t('addresses.streetPlaceholder')}
        withAsterisk
        {...form.getInputProps("street")}
        error={form.errors.street}
      />

      <TextInput
        label={t('addresses.street2')}
        placeholder={t('addresses.street2Placeholder')}
        {...form.getInputProps("street2")}
        error={form.errors.street2}
      />

      <TextInput
        label={t('addresses.city')}
        placeholder={t('addresses.cityPlaceholder')}
        withAsterisk
        {...form.getInputProps("city")}
        error={form.errors.city}
      />
      
      <Select
        label={t('addresses.country')}
        placeholder={t('addresses.selectCountry')}
        data={countries}
        withAsterisk
        {...form.getInputProps("country")}
        defaultValue={form.values.country}
        error={form.errors.country}
        searchable
        onChange={(value) => {
          if (value) {
            form.setFieldValue("country", value);
          }
          form.setFieldValue("state", undefined);
          onCountryChange(value);
        }}
      />

      <Select
        label={t('addresses.stateProvinceRegion')}
        placeholder={t('addresses.selectState')}
        data={states}
        {...form.getInputProps("state")}
        defaultValue={form.values.state}
        disabled={stateDisabled}
        error={form.errors.state}
        searchable
      />

      <TextInput
        label={t('addresses.zip')}
        placeholder={t('addresses.zipPlaceholder')}
        withAsterisk
        {...form.getInputProps("zip")}
        error={form.errors.zip}
      />

      <TextInput
        label={t('addresses.phone')}
        placeholder={t('addresses.phonePlaceholder')}
        {...form.getInputProps("phone")}
        error={form.errors.phone}
      />

      <TextInput
        label={t('addresses.vatNumber')}
        placeholder={t('addresses.vatNumberPlaceholder')}
        {...form.getInputProps("vat_number")}
        error={form.errors.vat_number}
      />

      <TextInput
        label={t('addresses.companyName')}
        placeholder={t('addresses.companyNamePlaceholder')}
        {...form.getInputProps("company_name")}
        error={form.errors.company_name}
      />

      <Switch
        label={t('addresses.isDefault')}
        {...form.getInputProps("is_default")}
        defaultChecked={form.values.is_default}
      />
    </Stack>
  );
}