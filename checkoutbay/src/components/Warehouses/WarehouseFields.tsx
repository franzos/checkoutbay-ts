import { useRustyState } from "../../state";
import { Select, Switch, TextInput, Loader, Stack, Box, Text, MultiSelect, Group, Badge } from "@mantine/core";
import { Address, Warehouse, ShippingRateTemplate } from "@gofranz/checkoutbay-common";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { RenderFieldsProps } from "../Entity/EntityForm";

function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-');     // Replace multiple hyphens with single hyphen
}

export function RenderWarehouseFields({ 
    form,
    setParentLoading,
    shopId
  }: RenderFieldsProps<Warehouse>) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [shippingTemplates, setShippingTemplates] = useState<ShippingRateTemplate[]>([]);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const api = useRustyState.getState().api;

  const loading = (loading: boolean) => {
    setIsLoading(loading);
    setParentLoading(loading);
  }

  // Load initial data including warehouse's shipping templates if editing
  useEffect(() => {
    const loadData = async () => {
      loading(true);
      try {
        const [addressesResponse, templatesResponse] = await Promise.all([
          api.getAddresses({
            shop_id: shopId,
          }),
          api.getShippingRateTemplates({
            shop_id: shopId,
          })
        ]);
        console.log(`Addresses:`, addressesResponse.data);
        setAddresses(addressesResponse.data);
        setShippingTemplates(templatesResponse.data);

        // If editing existing warehouse, fetch its shipping templates
        if (form.values.id) {
          const publicRates = await api.getShippingRateTemplates({
            shop_id: shopId,
          });
          const warehouseTemplateIds = publicRates.data
            .filter(rate => rate.warehouse_ids.includes(form.values.id as string))
            .map(rate => rate.id);
          setSelectedTemplates(warehouseTemplateIds);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        loading(false);
      }
    };
    loadData();
  }, [api, shopId, form.values.id]);

  const handleTemplateChange = async (values: string[]) => {
    if (!form.values.id) {
      // For new warehouses, just track the selection - relationships will be created after warehouse creation
      setSelectedTemplates(values);
      return;
    }

    try {
      loading(true);
      const currentTemplates = new Set(selectedTemplates);
      const newTemplates = new Set(values);

      // Handle removals
      for (const templateId of currentTemplates) {
        if (!newTemplates.has(templateId)) {
          await api.removeTemplateFromWarehouse(templateId, form.values.id);
        }
      }

      // Handle additions
      for (const templateId of newTemplates) {
        if (!currentTemplates.has(templateId)) {
          await api.relateTemplateToWarehouse(templateId, form.values.id);
        }
      }

      setSelectedTemplates(values);
    } catch (error) {
      console.error("Failed to update shipping templates:", error);
    } finally {
      loading(false);
    }
  };

  const addressOptions = addresses.map((address) => ({
    value: address.id as string,
    label: `${address.street}, ${address.city}, ${address.country}`,
  }));

  const shippingTemplateOptions = shippingTemplates.reduce<{ group: string; items: { value: string; label: string; }[]; }[]>((acc, template) => {
    const group = template.method || 'Other';
    const existingGroup = acc.find(g => g.group === group);
    
    const item = {
      value: template.id as string,
      label: template.title || `${template.provider} - ${template.service_level}`,
    };

    if (existingGroup) {
      existingGroup.items.push(item);
    } else {
      acc.push({
        group,
        items: [item],
      });
    }

    return acc;
  }, []);

  if (isLoading) {
    return <Box><Loader m="lg"/></Box>;
  }

  return (
    <Stack gap={4} pos="relative">
      <TextInput
        label={t('warehouses.title')}
        placeholder={t('warehouses.titlePlaceholder')}
        withAsterisk
        {...form.getInputProps("title")}
        onChange={(event) => {
          form.getInputProps("title").onChange(event);
          const newSlug = createSlugFromTitle(event.currentTarget.value);
          form.setFieldValue("code", newSlug);
        }}
        error={form.errors.title}
      />

      <TextInput
        label={t('warehouses.code')}
        placeholder={t('warehouses.codeDefault')}
        {...form.getInputProps("code")}
        error={form.errors.code}
      />

      <Text size="xs">{t('warehouses.codeDescription')}</Text>

      <Select
        label={t('warehouses.address')}
        placeholder={t('warehouses.selectAddress')}
        withAsterisk
        data={addressOptions}
        {...form.getInputProps("address_id")}
        defaultValue={form.values.address_id}
        error={form.errors.address_id}
      />

      <MultiSelect
        label={t('warehouses.shippingRateTemplates')}
        placeholder={t('warehouses.selectShippingRateTemplates')}
        data={shippingTemplateOptions}
        value={selectedTemplates}
        onChange={handleTemplateChange}
        searchable
        clearable
      />

      <Text size="xs">{t('warehouses.shippingRateTemplatesDescription')}</Text>

      {selectedTemplates.length > 0 && (
        <Group gap="xs">
          {selectedTemplates.map((templateId) => {
            const template = shippingTemplates.find(t => t.id === templateId);
            return template && (
              <Badge 
                key={templateId}
                color={template.service_level === 'express' ? 'green' : 'blue'}
              >
                {template.title || `${template.provider} - ${template.service_level}`}
              </Badge>
            );
          })}
        </Group>
      )}

      <Switch
        label={t('warehouses.isActive')}
        {...form.getInputProps("is_active")}
        defaultChecked={form.values.is_active}
      />

      <Text size="xs">{t('warehouses.isActiveDescription')}</Text>
    </Stack>
  );
}