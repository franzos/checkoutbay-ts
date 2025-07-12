import {
  TextInput,
  Textarea,
  Switch,
  TagsInput,
  Stack,
  Text,
  JsonInput,
  NumberInput,
  Image,
  Group,
  Select,
  Accordion,
} from '@mantine/core';
import { DimensionUnit, Product, WeightUnit } from '@gofranz/checkoutbay-common';
import { RenderFieldsProps } from '../Entity/EntityForm';
import React, { useEffect } from 'react';
import { initialPhysicalPropertiesValues } from '../CreatingAll';
import { useTranslation } from 'react-i18next';

function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

export function RenderProductFields({ form }: RenderFieldsProps<Product>) {
  const { t } = useTranslation();
  const [coverImage, setCoverImage] = React.useState<string | undefined>(undefined);
  const [hasPhysicalproperties, setHasPhysicalProperties] = React.useState<boolean>(false);

  useEffect(() => {
    if (form.values.physical_properties) {
      setHasPhysicalProperties(true);
    }
  }, [form.values.physical_properties]);

  useEffect(() => {
    if (form.values.cover_url) {
      setCoverImage(form.values.cover_url);
    }
  }, [form.values.cover_url]);

  const conditionallySetInitialPhysicalProperties = () => {
    if (!hasPhysicalproperties) {
      console.debug('Setting initial physical properties');
      form.setFieldValue('physical_properties', initialPhysicalPropertiesValues);
      setHasPhysicalProperties(true);
    } else {
      console.debug('Physical properties already set');
    }
  };

  const weightUnitOptions = Object.values(WeightUnit).map((key) => {
    return { value: key, label: key };
  });

  const dimensionUnitOptions = Object.values(DimensionUnit).map((key) => {
    return { value: key, label: key };
  });

  return (
    <Stack gap={4}>
      <TextInput
        label={t('products.title')}
        placeholder={t('products.titlePlaceholder')}
        withAsterisk
        {...form.getInputProps('title')}
        onChange={(event) => {
          form.getInputProps('title').onChange(event);
          const newSlug = createSlugFromTitle(event.currentTarget.value);
          form.setFieldValue('slug', newSlug);
        }}
        error={form.errors.title}
      />

      <Image src={coverImage} w={200} h="auto" fit="contain" />

      <TextInput
        label={t('products.coverUrl')}
        placeholder={t('products.coverUrlPlaceholder')}
        {...form.getInputProps('cover_url')}
        onChange={(event) => {
          form.getInputProps('cover_url').onChange(event);
          setCoverImage(event.currentTarget.value);
        }}
        error={form.errors.cover_url}
      />

      <Text size="xs">{t('products.coverUrlDescription')}</Text>

      <TextInput
        label={t('products.slug')}
        placeholder={t('products.slugPlaceholder')}
        withAsterisk
        {...form.getInputProps('slug')}
        error={form.errors.slug}
      />

      <Text size="xs">{t('products.slugDescription')}</Text>

      <Textarea
        label={t('products.description')}
        placeholder={t('products.descriptionPlaceholder')}
        {...form.getInputProps('description')}
        error={form.errors.description}
        minRows={3}
      />

      <TextInput
        label={t('products.sku')}
        placeholder={t('products.skuPlaceholder')}
        {...form.getInputProps('sku')}
        error={form.errors.sku}
      />

      <Text size="xs">{t('products.skuDescription')}</Text>

      <NumberInput
        label={t('products.price')}
        placeholder={t('products.pricePlaceholder')}
        withAsterisk
        {...form.getInputProps('price')}
        value={form.values.price?.toNumber()}
        error={form.errors.price}
        thousandSeparator=" "
        allowDecimal={true}
      />

      <Switch
        label={t('products.allowNegativeStock')}
        {...form.getInputProps('allow_negative_stock')}
        defaultChecked={form.values.allow_negative_stock}
      />

      <Text size="xs">{t('products.allowNegativeStockDescription')}</Text>

      <Switch
        label={t('products.isLive')}
        {...form.getInputProps('is_live')}
        defaultChecked={form.values.is_live}
      />

      <Text size="xs">{t('products.isLiveDescription')}</Text>

      <Switch
        label={t('products.requiresShipping')}
        {...form.getInputProps('requires_shipping')}
        defaultChecked={form.values.requires_shipping}
      />

      <Text size="xs">{t('products.requiresShippingDescription')}</Text>

      <TagsInput
        label={t('products.categories')}
        placeholder={t('products.categoriesPlaceholder')}
        {...form.getInputProps('categories')}
        error={form.errors.categories}
      />

      <TagsInput
        label={t('products.tags')}
        placeholder={t('products.tagsPlaceholder')}
        {...form.getInputProps('tags')}
        error={form.errors.tags}
      />

      <Accordion variant="contained">
        <Accordion.Item value="json">
          <Accordion.Control>
            <Text fw={500}>{t('products.additionalProperties')}</Text>
            <Text size="sm" c="dimmed">
              {t('products.additionalPropertiesDescription')}
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap={4}>
              <JsonInput
                label={t('products.privateData')}
                placeholder={t('products.privateDataPlaceholder')}
                {...form.getInputProps('data')}
                error={form.errors.data}
              />

              <Text size="xs">{t('products.privateDataNote')}</Text>

              <JsonInput
                label={t('products.publicData')}
                placeholder={t('products.publicDataPlaceholder')}
                {...form.getInputProps('data_public')}
                error={form.errors.data_public}
              />

              <Text size="xs">{t('products.publicDataNote')}</Text>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      <Accordion variant="contained">
        <Accordion.Item value="physical">
          <Accordion.Control>
            <Text fw={500}>{t('products.physicalProperties')}</Text>
            <Text size="sm" c="dimmed">
              {t('products.physicalPropertiesDescription')}
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap={4}>
              <Group grow>
                <NumberInput
                  label={t('products.width')}
                  placeholder={t('products.pricePlaceholder')}
                  allowDecimal
                  key={form.key('physical_properties.width')}
                  {...form.getInputProps('physical_properties.width')}
                  onKeyUp={() => {
                    conditionallySetInitialPhysicalProperties();
                  }}
                  error={form.errors?.['physical_properties.width']}
                />
                <NumberInput
                  label={t('products.height')}
                  placeholder={t('products.pricePlaceholder')}
                  allowDecimal
                  key={form.key('physical_properties.height')}
                  {...form.getInputProps('physical_properties.height')}
                  onKeyUp={() => {
                    conditionallySetInitialPhysicalProperties();
                  }}
                  error={form.errors?.['physical_properties.height']}
                />
                <NumberInput
                  label={t('products.length')}
                  placeholder={t('products.pricePlaceholder')}
                  allowDecimal
                  key={form.key('physical_properties.length')}
                  {...form.getInputProps('physical_properties.length')}
                  onKeyUp={() => {
                    conditionallySetInitialPhysicalProperties();
                  }}
                  error={form.errors?.['physical_properties.length']}
                />
              </Group>

              <Select
                label={t('products.dimensionUnit')}
                data={dimensionUnitOptions}
                key={form.key('physical_properties.dimension_unit')}
                {...form.getInputProps('physical_properties.dimension_unit')}
                onKeyUp={() => {
                  conditionallySetInitialPhysicalProperties();
                }}
                error={form.errors?.['physical_properties.dimension_unit']}
              />

              <NumberInput
                label={t('products.weight')}
                placeholder={t('products.pricePlaceholder')}
                allowDecimal
                key={form.key('physical_properties.weight')}
                {...form.getInputProps('physical_properties.weight')}
                onKeyUp={() => {
                  conditionallySetInitialPhysicalProperties();
                }}
                error={form.errors?.['physical_properties.weight']}
              />

              <Select
                label={t('products.weightUnit')}
                data={weightUnitOptions}
                key={form.key('physical_properties.weight_unit')}
                {...form.getInputProps('physical_properties.weight_unit')}
                onKeyUp={() => {
                  conditionallySetInitialPhysicalProperties();
                }}
                error={form.errors?.['physical_properties.weight_unit']}
              />
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
      <Text size="xs">{t('products.physicalPropertiesNote')}</Text>
    </Stack>
  );
}
