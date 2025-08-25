import { Discount, DiscountType, DiscountValueType, NewDiscount, Product, UpdateDiscount } from '@gofranz/checkoutbay-common';
import { RenderFieldsCreateProps, RenderFieldsEditProps } from '@gofranz/common-components';
import {
  Accordion,
  ActionIcon,
  Alert,
  Button,
  Grid,
  Group,
  NumberInput,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { UseFormReturnType } from '@mantine/form';
import { IconInfoCircle, IconPlus, IconTrash } from '@tabler/icons-react';
import Decimal from 'decimal.js';
import { useEffect, useState } from 'react';
import { useRustyState } from '../../state';

type FormMarkup = UseFormReturnType<NewDiscount, (values: NewDiscount) => NewDiscount>;

export function RenderDiscountFields(props: RenderFieldsCreateProps<NewDiscount>): JSX.Element;
export function RenderDiscountFields(props: RenderFieldsEditProps<UpdateDiscount>): JSX.Element;
export function RenderDiscountFields({
  form,
  primaryEntityId,
  entityId,
  isEditing
}: RenderFieldsCreateProps<NewDiscount> | RenderFieldsEditProps<UpdateDiscount>): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [productActionLoading, setProductActionLoading] = useState<string>('');

  // Load products for selection
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const api = useRustyState.getState().api;
        const response = await api.getProducts({ primaryEntityId }, { limit: 1000, offset: 0 });
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [primaryEntityId]);

  // Load existing discount products in edit mode
  useEffect(() => {
    const loadDiscountProducts = async () => {
      if (isEditing && entityId) {
        try {
          const api = useRustyState.getState().api;
          const response = await api.getDiscountProducts({ primaryEntityId, entityId }, { limit: 1000, offset: 0 });
          setSelectedProducts(response.data);
        } catch (error) {
          console.error('Failed to load discount products:', error);
        }
      }
    };
    loadDiscountProducts();
  }, [isEditing, entityId]);

  // Initialize selected products from form in create mode only
  useEffect(() => {
    if (!isEditing && 'product_ids' in form.values && form.values.product_ids) {
      const selectedIds = form.values.product_ids;
      const selectedProds = products.filter(p => selectedIds.includes(p.id));
      setSelectedProducts(selectedProds);
    }
  }, [isEditing, products]);

  const discountTypeOptions = Object.values(DiscountType)

  const discountValueTypeOptions = Object.values(DiscountValueType)

  const productOptions = products.map((product) => ({
    value: product.id,
    label: product.title,
  }));

  // Filter out already selected products from dropdown
  const availableProductOptions = productOptions.filter(
    (option) => !selectedProducts.some((selected) => selected.id === option.value)
  );

  // Handle product selection
  const handleProductSelect = async (productId: string | null) => {
    if (!productId) return;
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (isEditing && entityId) {
      // Editing mode - immediate API call
      setProductActionLoading(productId);
      try {
        const api = useRustyState.getState().api;
        await api.addProductToDiscount({ primaryEntityId, entityId }, productId);
        setSelectedProducts(prev => [...prev, product]);
      } catch (error) {
        console.error('Failed to add product to discount:', error);
      } finally {
        setProductActionLoading('');
      }
    } else {
      // Creation mode - update local state and form
      const newProducts = [...selectedProducts, product];
      setSelectedProducts(newProducts);
      (form as FormMarkup).setFieldValue('product_ids', newProducts.map(p => p.id));
    }
    
    setSelectedProductId('');
  };

  // Handle product removal
  const handleProductRemove = async (productId: string) => {
    if (isEditing && entityId) {
      // Editing mode - immediate API call
      setProductActionLoading(productId);
      try {
        const api = useRustyState.getState().api;
        await api.removeProductFromDiscount({ primaryEntityId, entityId }, productId);
        setSelectedProducts(prev => prev.filter(p => p.id !== productId));
      } catch (error) {
        console.error('Failed to remove product from discount:', error);
      } finally {
        setProductActionLoading('');
      }
    } else {
      // Creation mode - update local state and form
      const newProducts = selectedProducts.filter(p => p.id !== productId);
      setSelectedProducts(newProducts);
      (form as FormMarkup).setFieldValue('product_ids', newProducts.map(p => p.id));
    }
  };

  const addVolumeTier = () => {
    const currentTiers = form.values.config?.type === 'VolumeDiscount'
      ? form.values.config.content.tiers || []
      : [];

    const newTier = {
      min_quantity: 1,
      max_quantity: 10,
      tier_value: 0,
    };

    (form as FormMarkup).setFieldValue('config', {
      type: 'VolumeDiscount',
      content: {
        tiers: [...currentTiers, newTier],
      },
    });
  };

  const removeVolumeTier = (index: number) => {
    if (form.values.config?.type === 'VolumeDiscount') {
      const currentTiers = form.values.config.content.tiers || [];
      const newTiers = currentTiers.filter((_, i) => i !== index);

      (form as FormMarkup).setFieldValue('config', {
        type: 'VolumeDiscount',
        content: {
          tiers: newTiers,
        },
      });
    }
  };

  // Handle discount type change to set up config
  const handleDiscountTypeChange = (value: string | null) => {
    (form as FormMarkup).setFieldValue('discount_type', value as DiscountType);

    // Set up default config based on type
    if (value === DiscountType.VoucherCode) {
      (form as FormMarkup).setFieldValue('config', {
        type: 'VoucherCode',
        content: {
          code: '',
          usage_limit: 1,
          auto_generated: false,
          campaign_id: undefined,
          metadata: undefined,
        },
      });
    } else if (value === DiscountType.VolumeDiscount) {
      (form as FormMarkup).setFieldValue('config', {
        type: 'VolumeDiscount',
        content: {
          tiers: [],
        },
      });
      // Set automatic defaults for volume discounts (backend ignores these)
      (form as FormMarkup).setFieldValue('value', 0);
      (form as FormMarkup).setFieldValue('value_type', DiscountValueType.Percentage);
    } else if (value === DiscountType.TemporaryDiscount) {
      (form as FormMarkup).setFieldValue('config', {
        type: 'TemporaryDiscount',
        content: {
          metadata: undefined,
        },
      });
    } else if (value === DiscountType.OrderMinimumSpend) {
      (form as FormMarkup).setFieldValue('config', {
        type: 'OrderMinimumSpend',
        content: {
          metadata: undefined,
        },
      });
    }
  };

  return (
    <Stack gap={4}>
      <TextInput
        label="Title"
        placeholder="Enter discount title"
        withAsterisk
        {...(form as FormMarkup).getInputProps('title')}
        error={form.errors.title}
      />

      <Textarea
        label="Description"
        placeholder="Enter discount description"
        {...(form as FormMarkup).getInputProps('description')}
        error={form.errors.description}
        minRows={2}
      />

      <Select
        label="Discount Type"
        placeholder="Select discount type"
        withAsterisk
        data={discountTypeOptions}
        {...(form as FormMarkup).getInputProps('discount_type')}
        onChange={handleDiscountTypeChange}
        error={form.errors.discount_type}
      />

      {(form.values as Discount).discount_type !== DiscountType.VolumeDiscount && (
        <Group grow>
          <NumberInput
            label="Discount Value"
            placeholder="Enter discount value"
            withAsterisk={!isEditing}
            value={typeof form.values.value === 'number' ? form.values.value : new Decimal(form.values.value || 0)?.toNumber()}
            onChange={(value) => (form as FormMarkup).setFieldValue('value', Number(value) || 0)}
            error={form.errors.value}
            allowDecimal={true}
            min={0}
            disabled={isEditing}
          />

          <Select
            label="Value Type"
            placeholder="Select value type"
            withAsterisk={!isEditing}
            data={discountValueTypeOptions}
            {...(form as FormMarkup).getInputProps('value_type')}
            error={form.errors.value_type}
            disabled={isEditing}
          />
        </Group>
      )}

      {(form.values as Discount).discount_type === DiscountType.VolumeDiscount && (
        <Alert color="blue" icon={<IconInfoCircle size={16} />}>
          <Text size="sm">
            <strong>Volume Discount:</strong> Discount percentages are configured in the volume tiers below.
            Each tier can have its own discount percentage based on quantity purchased.
            {isEditing && <span> (View only - cannot be edited)</span>}
          </Text>
        </Alert>
      )}

      <NumberInput
        label="Minimum Spend Amount"
        placeholder="Enter minimum spend (optional)"
        value={form.values.minimum_spend_amount ?
          (typeof form.values.minimum_spend_amount === 'number' ?
            form.values.minimum_spend_amount :
            new Decimal(form.values.minimum_spend_amount)?.toNumber()) :
          undefined}
        onChange={(value) => (form as FormMarkup).setFieldValue('minimum_spend_amount', value !== undefined ? Number(value) : undefined)}
        error={form.errors.minimum_spend_amount}
        allowDecimal={true}
        min={0}
      />

      <Group grow>
        <DateInput
          label="Start Date"
          placeholder="Select start date"
          withAsterisk
          value={form.values.start_date ? new Date(form.values.start_date) : null}
          onChange={(date) => (form as FormMarkup).setFieldValue('start_date', date ? (date as unknown as Date).toISOString() : '')}
          error={form.errors.start_date}
        />

        <DateInput
          label="End Date"
          placeholder="Select end date"
          withAsterisk
          value={form.values.end_date ? new Date(form.values.end_date) : null}
          onChange={(date) => (form as FormMarkup).setFieldValue('end_date', date ? (date as unknown as Date).toISOString() : '')}
          error={form.errors.end_date}
        />
      </Group>

      <Select
        label="Add Products"
        placeholder="Select a product to add"
        data={availableProductOptions}
        value={selectedProductId}
        onChange={handleProductSelect}
        disabled={loading || productActionLoading !== ''}
        searchable
        clearable
      />

      {selectedProducts.length > 0 && (
        <Stack gap={2}>
          <Text size="sm" fw={500}>Selected Products:</Text>
          {selectedProducts.map((product) => (
            <Grid key={product.id} align="center">
              <Grid.Col span={9}>
                <Group>
                  <ActionIcon
                    color="red"
                    onClick={() => handleProductRemove(product.id)}
                    loading={productActionLoading === product.id}
                    variant="filled"
                    aria-label="Delete"
                  >
                    <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
                  </ActionIcon>
                  <Text>{product.title}</Text>
                </Group>
              </Grid.Col>
            </Grid>
          ))}
        </Stack>
      )}

      {/* Conditional Configuration Fields */}
      {(!isEditing && form.values.discount_type === DiscountType.VoucherCode) && (
        <Accordion variant="contained">
          <Accordion.Item value="voucher-config">
            <Accordion.Control>
              <Text fw={500}>Voucher Code Configuration</Text>
              <Text size="sm" c="dimmed">
                Set up voucher code specific settings
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap={4}>
                <TextInput
                  label="Voucher Code"
                  placeholder="Enter voucher code"
                  withAsterisk
                  value={form.values.config?.type === 'VoucherCode' ? form.values.config.content.code : ''}
                  onChange={(event) => {
                    if (form.values.config?.type === 'VoucherCode') {
                      (form as FormMarkup).setFieldValue('config', {
                        ...form.values.config,
                        content: {
                          ...form.values.config.content,
                          code: event.currentTarget.value,
                        },
                      });
                    }
                  }}
                />

                <NumberInput
                  label="Usage Limit"
                  placeholder="Enter usage limit (optional)"
                  min={1}
                  value={form.values.config?.type === 'VoucherCode' ? Number(form.values.config.content.usage_limit) : undefined}
                  onChange={(value) => {
                    if (form.values.config?.type === 'VoucherCode') {
                      (form as FormMarkup).setFieldValue('config', {
                        ...form.values.config,
                        content: {
                          ...form.values.config.content,
                          usage_limit: Number(value) || undefined,
                        },
                      });
                    }
                  }}
                />

                <TextInput
                  label="Campaign ID"
                  placeholder="Enter campaign ID (optional)"
                  value={form.values.config?.type === 'VoucherCode' ? form.values.config.content.campaign_id || '' : ''}
                  onChange={(event) => {
                    if (form.values.config?.type === 'VoucherCode') {
                      (form as FormMarkup).setFieldValue('config', {
                        ...form.values.config,
                        content: {
                          ...form.values.config.content,
                          campaign_id: event.currentTarget.value || undefined,
                        },
                      });
                    }
                  }}
                />
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      )}

      {(form.values as Discount).discount_type === DiscountType.VolumeDiscount && (
        <Accordion variant="contained">
          <Accordion.Item value="volume-config">
            <Accordion.Control>
              <Text fw={500}>Volume Discount Tiers</Text>
              <Text size="sm" c="dimmed">
                {isEditing 
                  ? "View existing discount tiers. These cannot be modified in edit mode."
                  : "Set different discount percentages based on quantity purchased. Customers get higher discounts for buying more items."
                }
              </Text>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack gap={4}>
                {form.values.config?.type === 'VolumeDiscount' &&
                  form.values.config.content.tiers?.map((tier, index) => (
                    <Grid key={index}>
                      <Grid.Col span={3}>
                        <NumberInput
                          label="Min Quantity"
                          description="Set minimum quantity for this tier"
                          min={1}
                          value={tier.min_quantity}
                          onChange={(value) => {
                            if (form.values.config?.type === 'VolumeDiscount') {
                              const newTiers = [...form.values.config.content.tiers];
                              newTiers[index] = { ...tier, min_quantity: Number(value) || 1 };
                              (form as FormMarkup).setFieldValue('config', {
                                ...form.values.config,
                                content: { tiers: newTiers },
                              });
                            }
                          }}
                          disabled={isEditing}
                        />
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <NumberInput
                          label="Max Quantity"
                          description="Set maximum quantity for this tier"
                          min={tier.min_quantity}
                          value={tier.max_quantity}
                          onChange={(value) => {
                            if (form.values.config?.type === 'VolumeDiscount') {
                              const newTiers = [...form.values.config.content.tiers];
                              newTiers[index] = { ...tier, max_quantity: Number(value) || tier.min_quantity };
                              (form as FormMarkup).setFieldValue('config', {
                                ...form.values.config,
                                content: { tiers: newTiers },
                              });
                            }
                          }}
                          disabled={isEditing}
                        />
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <NumberInput
                          label="Discount Percentage"
                          description="% off for this quantity range"
                          allowDecimal
                          min={0}
                          max={100}
                          suffix="%"
                          value={typeof tier.tier_value === 'number' ? tier.tier_value : new Decimal(tier.tier_value).toNumber()}
                          onChange={(value) => {
                            if (form.values.config?.type === 'VolumeDiscount') {
                              const newTiers = [...form.values.config.content.tiers];
                              newTiers[index] = { ...tier, tier_value: Number(value) || 0 };
                              (form as FormMarkup).setFieldValue('config', {
                                ...form.values.config,
                                content: { tiers: newTiers },
                              });
                            }
                          }}
                          disabled={isEditing}
                        />
                      </Grid.Col>
                      <Grid.Col span={3}>
                        {!isEditing && (
                          <ActionIcon
                            color="red"
                            onClick={() => removeVolumeTier(index)}
                            variant="light"
                            style={{ marginTop: 25 }}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        )}
                      </Grid.Col>
                    </Grid>
                  ))}

                {form.values.config?.type === 'VolumeDiscount' &&
                  form.values.config.content.tiers &&
                  form.values.config.content.tiers.length > 0 && (
                    <Text size="xs" c="dimmed" style={{ fontStyle: 'italic' }}>
                      Example: Buy 5-9 items → 10% off, Buy 10-19 items → 15% off, Buy 20+ items → 25% off
                    </Text>
                  )}

                {!isEditing && (
                  <Button
                    leftSection={<IconPlus size={16} />}
                    variant="light"
                    onClick={addVolumeTier}
                  >
                    Add Tier
                  </Button>
                )}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      )}
    </Stack>
  );
}