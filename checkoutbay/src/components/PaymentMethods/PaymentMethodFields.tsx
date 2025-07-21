import {
  AustraliaBankDetails,
  BankAccount,
  BankAccountDetails,
  BankAccountList,
  CanadaBankDetails,
  EUBankDetails,
  IndiaBankDetails,
  InvoiceConfig,
  NewPaymentGateway,
  StripeConfig,
  UKBankDetails,
  UpdatePaymentGateway,
  USAccountType,
  USBankDetails
} from '@gofranz/checkoutbay-common';
import { Currency } from '@gofranz/common';
import { RenderFieldsCreateProps, RenderFieldsEditProps } from '@gofranz/common-components';
import { Anchor, Button, Group, PasswordInput, Select, Stack, Switch, Text, Textarea, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

type FormMarkup = UseFormReturnType<NewPaymentGateway, (values: NewPaymentGateway) => NewPaymentGateway>;

export function RenderPaymentMethodFields(props: RenderFieldsCreateProps<NewPaymentGateway>): JSX.Element;
export function RenderPaymentMethodFields(props: RenderFieldsEditProps<UpdatePaymentGateway>): JSX.Element;
export function RenderPaymentMethodFields({
  form,
  isEditing
}: RenderFieldsCreateProps<NewPaymentGateway> | RenderFieldsEditProps<UpdatePaymentGateway>): JSX.Element {
  const { t } = useTranslation();

  const paymentMethodProviderOptions = [
    { value: 'STRIPE', label: 'Stripe' },
    { value: 'INVOICE', label: 'Invoice' },
  ];

  const selectedProvider = form.values.provider_config?.type;

  const handleProviderChange = (providerType: string) => {
    if (providerType === 'STRIPE') {
      const stripeConfig: StripeConfig = {
        public_key: '',
        secret_key: '',
        product_id: '',
        webhook_url: '',
        webhook_secret: '',
      };
      const newConfig = {
        type: 'STRIPE' as const,
        content: stripeConfig,
      };
      (form as FormMarkup).setFieldValue('provider_config', newConfig);
    } else if (providerType === 'INVOICE') {
      const invoiceConfig: InvoiceConfig = {
        bank_accounts: [] as BankAccountList,
        default_currency: Currency.USD,
        invoice_template: undefined,
        payment_terms: undefined,
        payment_instructions: undefined,
      };
      const newConfig = {
        type: 'INVOICE' as const,
        content: invoiceConfig,
      };
      (form as FormMarkup).setFieldValue('provider_config', newConfig);
    }
  };

  return (
    <Stack gap={4}>
      <TextInput
        label={t('paymentMethods.title')}
        placeholder={t('paymentMethods.titleDefault')}
        withAsterisk
        {...(form as FormMarkup).getInputProps('title')}
        error={form.errors.title}
      />

      <Select
        label={t('paymentMethods.provider')}
        placeholder={t('paymentMethods.selectProvider')}
        withAsterisk
        data={paymentMethodProviderOptions}
        value={selectedProvider}
        onChange={(value) => value && handleProviderChange(value)}
        error={form.errors.provider_config}
      />

      {form.values.provider_config?.type === 'STRIPE' && (
        <>
          <Text size="xs">
            {t('paymentMethods.currencySupport')}{' '}
            <Anchor
              href="https://docs.stripe.com/currencies?presentment-currency=DE"
              target="_blank"
              rel="noreferrer"
            >
              {t('paymentMethods.here')}
            </Anchor>
            .
          </Text>

          <TextInput
            label={t('paymentMethods.publicKey')}
            placeholder={t('paymentMethods.publicKeyPlaceholder')}
            withAsterisk
            value={form.values.provider_config?.content?.public_key || ''}
            onChange={(e) =>
              (form as FormMarkup).setFieldValue('provider_config.content.public_key', e.target.value)
            }
            error={form.errors['provider_config.content.public_key']}
          />

          <Text size="xs">{t('paymentMethods.publicKeyDescription')}</Text>

          <PasswordInput
            label={t('paymentMethods.secretKey')}
            placeholder={t('paymentMethods.secretKeyPlaceholder')}
            withAsterisk
            value={form.values.provider_config?.content?.secret_key || ''}
            onChange={(e) =>
              (form as FormMarkup).setFieldValue('provider_config.content.secret_key', e.target.value)
            }
            error={form.errors['provider_config.content.secret_key']}
            disabled={isEditing}
          />

          <Text size="xs">
            {t('paymentMethods.secretKeyNote')}
          </Text>

          <TextInput
            label={t('paymentMethods.productId')}
            placeholder={t('paymentMethods.productIdPlaceholder')}
            withAsterisk
            value={form.values.provider_config?.content?.product_id || ''}
            onChange={(e) =>
              (form as FormMarkup).setFieldValue('provider_config.content.product_id', e.target.value)
            }
            error={form.errors['provider_config.content.product_id']}
          />

          <Text size="xs">{t('paymentMethods.productIdDescription')}</Text>

          <TextInput
            label={t('paymentMethods.webhookUrl')}
            placeholder={t('paymentMethods.webhookUrlPlaceholder')}
            withAsterisk
            value={form.values.provider_config?.content?.webhook_url || ''}
            onChange={(e) =>
              (form as FormMarkup).setFieldValue('provider_config.content.webhook_url', e.target.value)
            }
            error={form.errors['provider_config.content.webhook_url']}
          />

          <Text size="xs">{t('paymentMethods.webhookUrlDescription')}</Text>

          <PasswordInput
            label={t('paymentMethods.webhookSecret')}
            placeholder={t('paymentMethods.webhookSecretPlaceholder')}
            withAsterisk
            value={form.values.provider_config?.content?.webhook_secret || ''}
            onChange={(e) =>
              (form as FormMarkup).setFieldValue('provider_config.content.webhook_secret', e.target.value)
            }
            error={form.errors['provider_config.content.webhook_secret']}
            disabled={isEditing}
          />

          <Text size="xs">
            {t('paymentMethods.webhookSecretNote')}
          </Text>
        </>
      )}

      {form.values.provider_config?.type === 'INVOICE' && (
        <>
          <Text size="xs">
            {t('paymentMethods.invoiceDescription')}
          </Text>

          <BankingDetailsSection form={form} />
        </>
      )}

      <Switch
        label={t('paymentMethods.testMode')}
        checked={form.values.is_test_mode || false}
        {...(form as FormMarkup).getInputProps('is_test_mode')}
        error={form.errors.is_test_mode}
      />
    </Stack>
  );
}

// Helper function to render bank account details based on region
function renderBankAccountDetails(account: BankAccount) {
  const details = account.details.details;

  switch (account.details.region) {
    case 'UK':
      {
        const ukDetails = details as UKBankDetails;
        return (
          <Text size="xs" c="dimmed" mt={2}>
            Sort Code: {ukDetails.sort_code} • Account: {ukDetails.account_number}
            {ukDetails.iban && ` • IBAN: ${ukDetails.iban}`}
          </Text>
        );
      }

    case 'US':
      {
        const usDetails = details as USBankDetails;
        return (
          <Text size="xs" c="dimmed" mt={2}>
            Routing: {usDetails.routing_number} • Account: {usDetails.account_number} • Type: {usDetails.account_type}
          </Text>
        );
      }

    case 'EU':
      {
        const euDetails = details as EUBankDetails;
        return (
          <Text size="xs" c="dimmed" mt={2}>
            IBAN: {euDetails.iban} • BIC/SWIFT: {euDetails.bic_swift}
          </Text>
        );
      }

    case 'AUSTRALIA':
      {
        const auDetails = details as AustraliaBankDetails;
        return (
          <Text size="xs" c="dimmed" mt={2}>
            BSB: {auDetails.bsb_number} • Account: {auDetails.account_number}
          </Text>
        );
      }

    case 'CANADA':
      {
        const caDetails = details as CanadaBankDetails;
        return (
          <Text size="xs" c="dimmed" mt={2}>
            Institution: {caDetails.institution_number} • Transit: {caDetails.transit_number} • Account: {caDetails.account_number}
          </Text>
        );
      }

    case 'INDIA':
      {
        const inDetails = details as IndiaBankDetails;
        return (
          <Text size="xs" c="dimmed" mt={2}>
            IFSC: {inDetails.ifsc_code} • Account: {inDetails.account_number}
          </Text>
        );
      }

    default:
      return <Text size="xs" c="dimmed" mt={2}>Details available</Text>;
  }
}

// Banking Details Section Component
function BankingDetailsSection({ form }: { form: UseFormReturnType<NewPaymentGateway, (values: NewPaymentGateway) => NewPaymentGateway> | UseFormReturnType<UpdatePaymentGateway, (values: UpdatePaymentGateway) => UpdatePaymentGateway> }) {
  const [currentBankAccount, setCurrentBankAccount] = useState<Partial<BankAccount> | null>(null);

  const invoiceConfig = form.values.provider_config?.content as InvoiceConfig;
  const bankAccounts = invoiceConfig?.bank_accounts || [];

  const regionOptions = [
    { value: 'UK', label: 'United Kingdom' },
    { value: 'US', label: 'United States' },
    { value: 'EU', label: 'European Union' },
    { value: 'AUSTRALIA', label: 'Australia' },
    { value: 'CANADA', label: 'Canada' },
    { value: 'INDIA', label: 'India' },
  ];

  // const transferScopeOptions = [
  //   { value: TransferScope.DOMESTIC, label: 'Domestic' },
  //   { value: TransferScope.SEPA, label: 'SEPA' },
  //   { value: TransferScope.INTERNATIONAL, label: 'International' },
  //   { value: TransferScope.SWIFT, label: 'SWIFT' },
  //   { value: TransferScope.CORRESPONDENT, label: 'Correspondent Banking' },
  // ];

  const currencyOptions = [
    { value: Currency.USD, label: 'USD' },
    { value: Currency.EUR, label: 'EUR' },
    { value: Currency.GBP, label: 'GBP' },
    { value: Currency.AUD, label: 'AUD' },
    { value: Currency.CAD, label: 'CAD' },
    { value: Currency.INR, label: 'INR' },
  ];

  const addNewBankAccount = () => {
    setCurrentBankAccount({
      id: uuidv4(),
      account_name: '',
      currency: Currency.USD,
      details: { region: 'UK', details: {} } as BankAccountDetails,
      supported_transfer_types: [],
      special_instructions: undefined,
    });
  };

  const saveBankAccount = () => {
    if (!currentBankAccount) return;

    const newBankAccounts = [...bankAccounts, currentBankAccount as BankAccount];
    (form as FormMarkup).setFieldValue('provider_config.content.bank_accounts', newBankAccounts);
    setCurrentBankAccount(null);
  };

  const deleteBankAccount = (index: number) => {
    const newBankAccounts = bankAccounts.filter((_, i) => i !== index);
    (form as FormMarkup).setFieldValue('provider_config.content.bank_accounts', newBankAccounts);
  };

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text size="sm" fw={500}>Banking Details</Text>
        <Button size="xs" onClick={addNewBankAccount}>
          Add Bank Account
        </Button>
      </Group>

      {/* List existing bank accounts */}
      {bankAccounts.map((account: BankAccount, index: number) => (
        <Group key={account.id} justify="space-between" p="sm" style={{ border: '1px solid #e0e0e0', borderRadius: '4px' }}>
          <div>
            <Text size="sm" fw={500}>{account.account_name}</Text>
            <Text size="xs" c="dimmed">{account.details.region} • {account.currency}</Text>
            {renderBankAccountDetails(account)}
          </div>
          <Button size="xs" color="red" onClick={() => deleteBankAccount(index)}>
            Delete
          </Button>
        </Group>
      ))}

      {/* Bank account form */}
      {currentBankAccount && (
        <Stack gap="sm" p="md" style={{ border: '1px solid #e0e0e0', borderRadius: '4px', background: '#f9f9f9' }}>
          <Text size="sm" fw={500}>Add New Bank Account</Text>

          <TextInput
            label="Account Name"
            placeholder="My Business Account"
            value={currentBankAccount.account_name || ''}
            onChange={(e) => setCurrentBankAccount({
              ...currentBankAccount,
              account_name: e.target.value
            })}
            withAsterisk
          />

          <Select
            label="Currency"
            data={currencyOptions}
            value={currentBankAccount.currency}
            onChange={(value) => setCurrentBankAccount({
              ...currentBankAccount,
              currency: value as Currency
            })}
            withAsterisk
          />

          <Select
            label="Banking Region"
            data={regionOptions}
            value={currentBankAccount.details?.region}
            onChange={(value) => {
              if (!value) return;
              setCurrentBankAccount({
                ...currentBankAccount,
                details: createBankDetailsForRegion(value as string)
              });
            }}
            withAsterisk
          />

          {/* Region-specific banking fields */}
          {currentBankAccount.details && (
            <RegionBankingFields
              bankAccount={currentBankAccount}
              setBankAccount={setCurrentBankAccount}
            />
          )}

          <Textarea
            label="Special Instructions (Optional)"
            placeholder="Additional payment instructions for customers..."
            value={currentBankAccount.special_instructions || ''}
            onChange={(e) => setCurrentBankAccount({
              ...currentBankAccount,
              special_instructions: e.target.value || undefined
            })}
            rows={3}
          />

          <Group justify="flex-end" gap="sm">
            <Button variant="outline" onClick={() => setCurrentBankAccount(null)}>
              Cancel
            </Button>
            <Button onClick={saveBankAccount}>
              Save Account
            </Button>
          </Group>
        </Stack>
      )}
    </Stack>
  );
}

// Helper function to create bank details for a region
function createBankDetailsForRegion(region: string): BankAccountDetails {
  switch (region) {
    case 'UK':
      return {
        region: 'UK',
        details: {
          bank_name: '',
          sort_code: '',
          account_number: '',
          account_holder_name: '',
          iban: undefined,
          bic_swift: undefined,
        } as UKBankDetails
      };
    case 'US':
      return {
        region: 'US',
        details: {
          bank_name: '',
          routing_number: '',
          account_number: '',
          account_holder_name: '',
          account_type: USAccountType.CHECKING,
          swift_code: undefined,
        } as USBankDetails
      };
    case 'EU':
      return {
        region: 'EU',
        details: {
          bank_name: '',
          iban: '',
          bic_swift: '',
          account_holder_name: '',
        } as EUBankDetails
      };
    case 'AUSTRALIA':
      return {
        region: 'AUSTRALIA',
        details: {
          bank_name: '',
          bsb_number: '',
          account_number: '',
          account_holder_name: '',
          swift_code: undefined,
        } as AustraliaBankDetails
      };
    case 'CANADA':
      return {
        region: 'CANADA',
        details: {
          bank_name: '',
          institution_number: '',
          transit_number: '',
          account_number: '',
          account_holder_name: '',
          swift_code: undefined,
        } as CanadaBankDetails
      };
    case 'INDIA':
      return {
        region: 'INDIA',
        details: {
          bank_name: '',
          ifsc_code: '',
          account_number: '',
          account_holder_name: '',
          swift_code: undefined,
        } as IndiaBankDetails
      };
    default:
      return {
        region: 'UK',
        details: {} as UKBankDetails
      };
  }
}

// Region-specific banking fields component
function RegionBankingFields({
  bankAccount,
  setBankAccount
}: {
  bankAccount: Partial<BankAccount>,
  setBankAccount: (account: Partial<BankAccount>) => void
}) {
  const updateBankDetails = (field: string, value: unknown) => {
    setBankAccount({
      ...bankAccount,
      details: {
        ...bankAccount.details!,
        details: {
          ...bankAccount.details!.details,
          [field]: value
        } as any
      }
    });
  };

  if (!bankAccount.details) return null;

  const region = bankAccount.details.region;
  const details = bankAccount.details.details as any;

  switch (region) {
    case 'UK':
      return (
        <Stack gap="sm">
          <Text size="sm" fw={500} c="blue">UK Banking Details</Text>
          <TextInput
            label="Bank Name"
            placeholder="Barclays Bank"
            value={details.bank_name || ''}
            onChange={(e) => updateBankDetails('bank_name', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="Sort Code"
            placeholder="12-34-56"
            value={details.sort_code || ''}
            onChange={(e) => updateBankDetails('sort_code', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="Account Number"
            placeholder="12345678"
            value={details.account_number || ''}
            onChange={(e) => updateBankDetails('account_number', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="Account Holder Name"
            placeholder="John Smith"
            value={details.account_holder_name || ''}
            onChange={(e) => updateBankDetails('account_holder_name', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="IBAN (Optional - for international transfers)"
            placeholder="GB29 NWBK 6016 1331 9268 19"
            value={details.iban || ''}
            onChange={(e) => updateBankDetails('iban', e.target.value || undefined)}
          />
          <TextInput
            label="BIC/SWIFT (Optional - for international transfers)"
            placeholder="NWBKGB2L"
            value={details.bic_swift || ''}
            onChange={(e) => updateBankDetails('bic_swift', e.target.value || undefined)}
          />
        </Stack>
      );

    case 'US':
      return (
        <Stack gap="sm">
          <Text size="sm" fw={500} c="blue">US Banking Details</Text>
          <TextInput
            label="Bank Name"
            placeholder="Bank of America"
            value={details.bank_name || ''}
            onChange={(e) => updateBankDetails('bank_name', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="Routing Number (ABA)"
            placeholder="021000322"
            value={details.routing_number || ''}
            onChange={(e) => updateBankDetails('routing_number', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="Account Number"
            placeholder="1234567890"
            value={details.account_number || ''}
            onChange={(e) => updateBankDetails('account_number', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="Account Holder Name"
            placeholder="John Smith"
            value={details.account_holder_name || ''}
            onChange={(e) => updateBankDetails('account_holder_name', e.target.value)}
            withAsterisk
          />
          <Select
            label="Account Type"
            data={[
              { value: USAccountType.CHECKING, label: 'Checking' },
              { value: USAccountType.SAVINGS, label: 'Savings' }
            ]}
            value={details.account_type}
            onChange={(value) => updateBankDetails('account_type', value)}
            withAsterisk
          />
          <TextInput
            label="SWIFT Code (Optional - for international transfers)"
            placeholder="BOFAUS3N"
            value={details.swift_code || ''}
            onChange={(e) => updateBankDetails('swift_code', e.target.value || undefined)}
          />
        </Stack>
      );

    case 'EU':
      return (
        <Stack gap="sm">
          <Text size="sm" fw={500} c="blue">EU Banking Details</Text>
          <TextInput
            label="Bank Name"
            placeholder="Deutsche Bank"
            value={details.bank_name || ''}
            onChange={(e) => updateBankDetails('bank_name', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="IBAN"
            placeholder="DE89 3704 0044 0532 0130 00"
            value={details.iban || ''}
            onChange={(e) => updateBankDetails('iban', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="BIC/SWIFT"
            placeholder="COBADEFFXXX"
            value={details.bic_swift || ''}
            onChange={(e) => updateBankDetails('bic_swift', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="Account Holder Name"
            placeholder="John Smith"
            value={details.account_holder_name || ''}
            onChange={(e) => updateBankDetails('account_holder_name', e.target.value)}
            withAsterisk
          />
        </Stack>
      );

    case 'AUSTRALIA':
      return (
        <Stack gap="sm">
          <Text size="sm" fw={500} c="blue">Australian Banking Details</Text>
          <TextInput
            label="Bank Name"
            placeholder="Commonwealth Bank"
            value={details.bank_name || ''}
            onChange={(e) => updateBankDetails('bank_name', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="BSB Number"
            placeholder="062-001"
            value={details.bsb_number || ''}
            onChange={(e) => updateBankDetails('bsb_number', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="Account Number"
            placeholder="12345678"
            value={details.account_number || ''}
            onChange={(e) => updateBankDetails('account_number', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="Account Holder Name"
            placeholder="John Smith"
            value={details.account_holder_name || ''}
            onChange={(e) => updateBankDetails('account_holder_name', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="SWIFT Code (Optional - for international transfers)"
            placeholder="CTBAAU2S"
            value={details.swift_code || ''}
            onChange={(e) => updateBankDetails('swift_code', e.target.value || undefined)}
          />
        </Stack>
      );

    case 'CANADA':
      return (
        <Stack gap="sm">
          <Text size="sm" fw={500} c="blue">Canadian Banking Details</Text>
          <TextInput
            label="Bank Name"
            placeholder="Royal Bank of Canada"
            value={details.bank_name || ''}
            onChange={(e) => updateBankDetails('bank_name', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="Institution Number"
            placeholder="003"
            value={details.institution_number || ''}
            onChange={(e) => updateBankDetails('institution_number', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="Transit Number"
            placeholder="12345"
            value={details.transit_number || ''}
            onChange={(e) => updateBankDetails('transit_number', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="Account Number"
            placeholder="1234567"
            value={details.account_number || ''}
            onChange={(e) => updateBankDetails('account_number', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="Account Holder Name"
            placeholder="John Smith"
            value={details.account_holder_name || ''}
            onChange={(e) => updateBankDetails('account_holder_name', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="SWIFT Code (Optional - for international transfers)"
            placeholder="ROYCCAT2"
            value={details.swift_code || ''}
            onChange={(e) => updateBankDetails('swift_code', e.target.value || undefined)}
          />
        </Stack>
      );

    case 'INDIA':
      return (
        <Stack gap="sm">
          <Text size="sm" fw={500} c="blue">Indian Banking Details</Text>
          <TextInput
            label="Bank Name"
            placeholder="State Bank of India"
            value={details.bank_name || ''}
            onChange={(e) => updateBankDetails('bank_name', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="IFSC Code"
            placeholder="SBIN0001234"
            value={details.ifsc_code || ''}
            onChange={(e) => updateBankDetails('ifsc_code', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="Account Number"
            placeholder="12345678901"
            value={details.account_number || ''}
            onChange={(e) => updateBankDetails('account_number', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="Account Holder Name"
            placeholder="John Smith"
            value={details.account_holder_name || ''}
            onChange={(e) => updateBankDetails('account_holder_name', e.target.value)}
            withAsterisk
          />
          <TextInput
            label="SWIFT Code (Optional - for international transfers)"
            placeholder="SBININBB123"
            value={details.swift_code || ''}
            onChange={(e) => updateBankDetails('swift_code', e.target.value || undefined)}
          />
        </Stack>
      );

    default:
      return null;
  }
}
