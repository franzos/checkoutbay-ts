import {
  NewShippingRateTemplate,
  ShippingRateCalculationMethod,
  ShippingSpeed,
  UpdateShippingRateTemplate,
} from '@gofranz/checkoutbay-common';
import { Currency } from '@gofranz/common';
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Loader,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { IconTrash } from '@tabler/icons-react';
import Decimal from 'decimal.js';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RenderFieldsCreateProps } from '../Entity/EntityFormCreate';
import { RenderFieldsEditProps } from '../Entity/EntityFormEdit';

type FormMarkup = UseFormReturnType<NewShippingRateTemplate, (values: NewShippingRateTemplate) => NewShippingRateTemplate>;

const EU_COUNTRIES = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
];

const USMCA_COUNTRIES = ['US', 'CA', 'MX'];

const SEA_COUNTRIES = ['BN', 'KH', 'ID', 'LA', 'MY', 'MM', 'PH', 'SG', 'TH', 'VN'];

export function RenderShippingRateTemplateFields(props: RenderFieldsCreateProps<NewShippingRateTemplate>): JSX.Element;
export function RenderShippingRateTemplateFields(props: RenderFieldsEditProps<UpdateShippingRateTemplate>): JSX.Element;
export function RenderShippingRateTemplateFields({
  form,
  setParentLoading,
  isEditing
}: RenderFieldsCreateProps<NewShippingRateTemplate> | RenderFieldsEditProps<UpdateShippingRateTemplate>): JSX.Element {
  const { t } = useTranslation();
  const [countries, setCountries] = useState<Array<{ value: string; label: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settingCountries, setSettingCountries] = useState(false);

  const loading = (loading: boolean) => {
    setIsLoading(loading);
    setParentLoading(loading);
  };

  useEffect(() => {
    const loadIsoData = async () => {
      loading(true);
      try {
        const { countries } = await import('rust_iso3166-ts');
        const iso31661 = countries();
        const formattedCountries = iso31661
          .map((country) => ({
            value: country.alpha2,
            label: country.name,
          }))
          .sort((a, b) => a.label.localeCompare(b.label));

        setCountries(formattedCountries);
      } catch (error) {
        console.error('Failed to load ISO data:', error);
      } finally {
        loading(false);
      }
    };

    loadIsoData();
  }, []);

  const addRate = () => {
    const currentRates = form.values.rates || [];
    (form as FormMarkup).setFieldValue('rates', [
      ...currentRates,
      {
        id: crypto.randomUUID(),
        countries: [],
        amount: Decimal(0),
        free_above_value: Decimal(0),
      },
    ]);
  };

  const removeRate = (index: number) => {
    const currentRates = [...(form.values.rates || [])];
    currentRates.splice(index, 1);
    (form as FormMarkup).setFieldValue('rates', currentRates);
  };

  const calculationMethodOptions = Object.values(ShippingRateCalculationMethod).map((method) => ({
    value: method,
    label: method
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
  }));

  const shippingSpeedOptions = Object.values(ShippingSpeed).map((speed) => ({
    value: speed,
    label: speed.charAt(0).toUpperCase() + speed.slice(1),
  }));

  const clearCountriesTimeout = useCallback(() => {
    setSettingCountries(false);
  }, []);

  useEffect(() => {
    let timeoutId: number;

    if (settingCountries) {
      timeoutId = window.setTimeout(clearCountriesTimeout, 100);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [settingCountries, clearCountriesTimeout]);

  const setPresetCountries = (index: number, preset: string) => {
    setSettingCountries(true);
    switch (preset) {
      case 'eu':
        (form as FormMarkup).setFieldValue(`rates.${index}.countries`, EU_COUNTRIES);
        break;
      case 'usmca':
        (form as FormMarkup).setFieldValue(`rates.${index}.countries`, USMCA_COUNTRIES);
        break;
      case 'sea':
        (form as FormMarkup).setFieldValue(`rates.${index}.countries`, SEA_COUNTRIES);
        break;
      case 'clear':
        (form as FormMarkup).setFieldValue(`rates.${index}.countries`, []);
        break;
    }
  };

  if (isLoading) {
    return (
      <Box>
        <Loader m="lg" />
      </Box>
    );
  }

  return (
    <Stack gap={3}>
      {isEditing ? (
        <>
          <TextInput
            label={t('shippingRates.title')}
            placeholder={t('shippingRates.titlePlaceholder')}
            {...form.getInputProps('title')}
          />

          <TextInput
            label={t('shippingRates.description')}
            placeholder={t('shippingRates.descriptionPlaceholder')}
            {...form.getInputProps('description')}
          />

          <TextInput
            label={t('shippingRates.provider')}
            placeholder={t('shippingRates.providerPlaceholder')}
            {...form.getInputProps('provider')}
          />

          <Select
            label={t('shippingRates.calculationMethod')}
            placeholder={t('shippingRates.selectCalculationMethod')}
            data={calculationMethodOptions}
            withAsterisk
            {...form.getInputProps('method')}
            defaultValue={form.values.method}
          />

          <Text size="xs">{t('shippingRates.calculationMethodDescription')}</Text>

          <Select
            label={t('shippingRates.serviceLevel')}
            placeholder={t('shippingRates.selectServiceLevel')}
            data={shippingSpeedOptions}
            withAsterisk
            {...form.getInputProps('service_level')}
            defaultValue={form.values.service_level}
          />

          <TextInput
            label={t('shippingRates.currency')}
            placeholder={Currency.EUR}
            withAsterisk
            {...form.getInputProps('currency')}
            disabled
          />

          <Box my="md">
            <Group justify="space-between" mb="xs">
              <Text fw={500}>{t('shippingRates.shippingRates')}</Text>
              <Button onClick={addRate} size="xs">
                {t('shippingRates.addRate')}
              </Button>
            </Group>

            <Stack gap="md">
              {form.values.rates?.map((rate, index) => (
                <Paper key={rate.id} withBorder p="md">
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Text size="sm" fw={500}>
                        {t('shippingRates.rateNumber', { number: index + 1 })}
                      </Text>
                      <ActionIcon
                        color="red"
                        onClick={() => removeRate(index)}
                        disabled={form.values.rates?.length === 1}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>

                    <Text size="sm">{t('shippingRates.presetCountryGroups')}</Text>
                    <Group>
                      <Button size="xs" variant="light" onClick={() => setPresetCountries(index, 'eu')}>
                        {t('shippingRates.eu')}
                      </Button>
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => setPresetCountries(index, 'usmca')}
                      >
                        {t('shippingRates.usmca')}
                      </Button>
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => setPresetCountries(index, 'sea')}
                      >
                        {t('shippingRates.sea')}
                      </Button>
                      <Button
                        size="xs"
                        variant="subtle"
                        color="gray"
                        onClick={() => setPresetCountries(index, 'clear')}
                      >
                        {t('shippingRates.clear')}
                      </Button>
                    </Group>

                    {!settingCountries && (
                      <MultiSelect
                        label="Countries"
                        placeholder="Select countries"
                        data={countries}
                        searchable
                        {...form.getInputProps(`rates.${index}.countries`)}
                      />
                    )}

                    <NumberInput
                      label="Amount"
                      placeholder="10.00"
                      min={0}
                      {...form.getInputProps(`rates.${index}.amount`)}
                      value={new Decimal(rate.amount).toNumber()}
                    />

                    <NumberInput
                      label="Free Shipping Above"
                      placeholder="100.00"
                      min={0}
                      {...form.getInputProps(`rates.${index}.free_above_value`)}
                      value={
                        rate.free_above_value
                          ? new Decimal(rate.free_above_value).toNumber()
                          : undefined
                      }
                    />

                    <Text size="xs">Set to 0 to disable free shipping</Text>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        </>
      ) : (
        <>
          <TextInput
            label={t('shippingRates.title')}
            placeholder={t('shippingRates.titlePlaceholder')}
            {...form.getInputProps('title')}
          />

          <TextInput
            label={t('shippingRates.description')}
            placeholder={t('shippingRates.descriptionPlaceholder')}
            {...form.getInputProps('description')}
          />

          <TextInput
            label={t('shippingRates.provider')}
            placeholder={t('shippingRates.providerPlaceholder')}
            {...form.getInputProps('provider')}
          />

          <Select
            label={t('shippingRates.calculationMethod')}
            placeholder={t('shippingRates.selectCalculationMethod')}
            data={calculationMethodOptions}
            withAsterisk
            {...form.getInputProps('method')}
            defaultValue={form.values.method}
          />

          <Text size="xs">{t('shippingRates.calculationMethodDescription')}</Text>

          <Select
            label={t('shippingRates.serviceLevel')}
            placeholder={t('shippingRates.selectServiceLevel')}
            data={shippingSpeedOptions}
            withAsterisk
            {...form.getInputProps('service_level')}
            defaultValue={form.values.service_level}
          />

          <TextInput
            label={t('shippingRates.currency')}
            placeholder={Currency.EUR}
            withAsterisk
            {...form.getInputProps('currency')}
            disabled
          />

          <Box my="md">
            <Group justify="space-between" mb="xs">
              <Text fw={500}>{t('shippingRates.shippingRates')}</Text>
              <Button onClick={addRate} size="xs">
                {t('shippingRates.addRate')}
              </Button>
            </Group>

            <Stack gap="md">
              {form.values.rates?.map((rate, index) => (
                <Paper key={rate.id} withBorder p="md">
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Text size="sm" fw={500}>
                        {t('shippingRates.rateNumber', { number: index + 1 })}
                      </Text>
                      <ActionIcon
                        color="red"
                        onClick={() => removeRate(index)}
                        disabled={form.values.rates?.length === 1}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>

                    <Text size="sm">{t('shippingRates.presetCountryGroups')}</Text>
                    <Group>
                      <Button size="xs" variant="light" onClick={() => setPresetCountries(index, 'eu')}>
                        {t('shippingRates.eu')}
                      </Button>
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => setPresetCountries(index, 'usmca')}
                      >
                        {t('shippingRates.usmca')}
                      </Button>
                      <Button
                        size="xs"
                        variant="light"
                        onClick={() => setPresetCountries(index, 'sea')}
                      >
                        {t('shippingRates.sea')}
                      </Button>
                      <Button
                        size="xs"
                        variant="subtle"
                        color="gray"
                        onClick={() => setPresetCountries(index, 'clear')}
                      >
                        {t('shippingRates.clear')}
                      </Button>
                    </Group>

                    {!settingCountries && (
                      <MultiSelect
                        label="Countries"
                        placeholder="Select countries"
                        data={countries}
                        searchable
                        {...form.getInputProps(`rates.${index}.countries`)}
                      />
                    )}

                    <NumberInput
                      label="Amount"
                      placeholder="10.00"
                      min={0}
                      {...form.getInputProps(`rates.${index}.amount`)}
                      value={new Decimal(rate.amount).toNumber()}
                    />

                    <NumberInput
                      label="Free Shipping Above"
                      placeholder="100.00"
                      min={0}
                      {...form.getInputProps(`rates.${index}.free_above_value`)}
                      value={
                        rate.free_above_value
                          ? new Decimal(rate.free_above_value).toNumber()
                          : undefined
                      }
                    />

                    <Text size="xs">Set to 0 to disable free shipping</Text>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>
        </>
      )}
    </Stack>
  );
}
