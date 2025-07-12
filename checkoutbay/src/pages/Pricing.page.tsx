import { Container, Title } from '@mantine/core';
import { LargeTitleWithText } from '@gofranz/common-components';
import { useTranslation } from 'react-i18next';
import { FeeCalculator } from '../components/Billing/FeeCalculator';
import { Plans } from '../components/Billing/Plans';
import { Footer } from '../components/Layout/Footer';

export function PricingPage() {
  const { t } = useTranslation();

  return (
    <>
      <Container size="lg" py="xl">
        <LargeTitleWithText
          title={t('glob_navigation.pricing')}
          text="Pricing that scales with your needs. Whether you're a hobbyist or a business, we have plans to fit your requirements."
          mb="xl"
        />

        <Title order={2} fw={600} mb="md">
          Pay as you go
        </Title>
        <FeeCalculator />
        <Title order={2} mt="md" mb={0}>{t('billing.comparison')}</Title>
        <Plans />
      </Container>

      <Footer />
    </>
  );
}
