import { Select, Stack, Switch, TextInput, Text, PasswordInput, Anchor } from '@mantine/core';
import { PaymentGateway, PaymentGatewayProvider } from '@gofranz/checkoutbay-common';
import { useTranslation } from 'react-i18next';
import { RenderFieldsProps } from '../Entity/EntityForm';

export function RenderPaymentGatewayFields({ form, isEdit }: RenderFieldsProps<PaymentGateway>) {
  const { t } = useTranslation();
  
  const paymentGatewatProviderOptions = Object.values(PaymentGatewayProvider).map((provider) => ({
    value: provider,
    label: provider,
  }));

  return (
    <Stack gap={4}>
      {!isEdit && (
        <Text size="xs">
          {t('paymentGateways.tip')}
        </Text>
      )}

      <TextInput
        label={t('paymentGateways.title')}
        placeholder={t('paymentGateways.titleDefault')}
        withAsterisk
        {...form.getInputProps('title')}
        error={form.errors.title}
      />

      <Select
        label={t('paymentGateways.provider')}
        placeholder={t('paymentGateways.selectProvider')}
        withAsterisk
        data={paymentGatewatProviderOptions}
        {...form.getInputProps('provider')}
        error={form.errors.provider}
      />

      <Text size="xs">
        {t('paymentGateways.currencySupport')}{' '}
        <Anchor
          href="https://docs.stripe.com/currencies?presentment-currency=DE"
          target="_blank"
          rel="noreferrer"
        >
          {t('paymentGateways.here')}
        </Anchor>
        .
      </Text>

      <TextInput
        label={t('paymentGateways.publicKey')}
        placeholder={t('paymentGateways.publicKeyPlaceholder')}
        withAsterisk
        {...form.getInputProps('public_key')}
        error={form.errors.public_key}
      />

      <Text size="xs">{t('paymentGateways.publicKeyDescription')}</Text>

      <PasswordInput
        label={t('paymentGateways.secretKey')}
        placeholder={t('paymentGateways.secretKeyPlaceholder')}
        withAsterisk
        {...form.getInputProps('secret_key')}
        error={form.errors.secret_key}
        disabled={isEdit}
      />

      {isEdit ? (
        <Text size="xs">
          {t('paymentGateways.secretKeyNote')}
        </Text>
      ) : (
        <Text size="xs">{t('paymentGateways.secretKeyDescription')}</Text>
      )}

      <TextInput
        label={t('paymentGateways.productId')}
        placeholder={t('paymentGateways.productIdPlaceholder')}
        withAsterisk
        {...form.getInputProps('product_id')}
        error={form.errors.product_id}
      />

      <Text size="xs">{t('paymentGateways.productIdDescription')}</Text>

      <Switch
        label={t('paymentGateways.testMode')}
        checked={form.values.is_test_mode || false}
        {...form.getInputProps('is_test_mode')}
        error={form.errors.is_test_mode}
      />

      <TextInput
        label={t('paymentGateways.webhookUrl')}
        placeholder={t('paymentGateways.webhookUrlPlaceholder')}
        withAsterisk
        {...form.getInputProps('webhook_url')}
        error={form.errors.webhook_url}
      />

      <Text size="xs">{t('paymentGateways.webhookUrlDescription')}</Text>

      <PasswordInput
        label={t('paymentGateways.webhookSecret')}
        placeholder={t('paymentGateways.webhookSecretPlaceholder')}
        withAsterisk
        {...form.getInputProps('webhook_secret')}
        error={form.errors.webhook_secret}
        disabled={isEdit}
      />

      {isEdit ? (
        <Text size="xs">
          {t('paymentGateways.webhookSecretNote')}
        </Text>
      ) : (
        <Text size="xs">{t('paymentGateways.webhookSecretDescription')}</Text>
      )}
    </Stack>
  );
}
