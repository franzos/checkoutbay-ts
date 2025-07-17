import {
  Anchor,
  Button,
  Card,
  Center,
  HoverCard,
  List,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { News, useLanguageAwareRouting } from '@gofranz/common-components';
import { ShopQueryParams } from '@gofranz/checkoutbay-common';
import {
  IconAddressBook,
  IconBoxSeam,
  IconBuildingWarehouse,
  IconCheck,
  IconCreditCard,
  IconForms,
  IconInputCheck,
  IconMapPin,
  IconPackage,
  IconPaywall,
  IconShirt,
  IconShoppingBag,
  IconTruck,
  IconTruckDelivery,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useRustyState } from '../../state';

export function AccountHomePage() {
  const theme = useMantineTheme();
  const { t } = useTranslation();
  const { createLanguageURL } = useLanguageAwareRouting();
  const shopId = useRustyState((s) => s.shopId);
  const shops = useRustyState((s) => s.shops);
  const api = useRustyState((s) => s.api);
  const isShopSelected = !!shopId;

  // State for tracking completion of each step
  const [completionStatus, setCompletionStatus] = useState({
    createShop: false,
    addStripeDetails: false,
    addWarehouseAddress: false,
    addWarehouse: false,
    addShippingRates: false,
    addProducts: false,
    addStock: false,
  });

  // Function to check completion status of all steps
  const checkCompletionStatus = async () => {
    const newStatus = {
      createShop: shops.length > 0,
      addStripeDetails: false,
      addWarehouseAddress: false,
      addWarehouse: false,
      addShippingRates: false,
      addProducts: false,
      addStock: false,
    };

    // Only check other steps if a shop is selected
    if (shopId) {
      try {
        // Make parallel API calls
        const queryParams: ShopQueryParams = { shop_id: shopId };
        const [paymentGateways, addresses, warehouses, shippingRates, products, stockMovements] =
          await Promise.allSettled([
            api.getPaymentGateways(queryParams),
            api.getAddresses(queryParams),
            api.getWarehouses(queryParams),
            api.getShippingRateTemplates(queryParams),
            api.getProducts(queryParams),
            api.getStockMovements(queryParams),
          ]);

        // Check each API response
        if (paymentGateways.status === 'fulfilled') {
          newStatus.addStripeDetails = paymentGateways.value.data.length > 0;
        }
        if (addresses.status === 'fulfilled') {
          newStatus.addWarehouseAddress = addresses.value.data.length > 0;
        }
        if (warehouses.status === 'fulfilled') {
          newStatus.addWarehouse = warehouses.value.data.length > 0;
        }
        if (shippingRates.status === 'fulfilled') {
          newStatus.addShippingRates = shippingRates.value.data.length > 0;
        }
        if (products.status === 'fulfilled') {
          newStatus.addProducts = products.value.data.length > 0;
        }
        if (stockMovements.status === 'fulfilled') {
          newStatus.addStock = stockMovements.value.data.length > 0;
        }
      } catch (error) {
        console.error('Error checking completion status:', error);
      }
    }

    setCompletionStatus(newStatus);
  };

  // Check completion status when shopId or shops change
  useEffect(() => {
    checkCompletionStatus();
  }, [shopId, shops]);

  const GetStarted = () => (
    <Card shadow="xs" padding="lg" radius="md" mb="md" withBorder>
      <Title order={2} mb="md">
        {t('account.newHereTitle')}
      </Title>
      <List spacing="xs" size="sm">
        <List.Item
          icon={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  border: `1px solid ${
                    completionStatus.createShop ? theme.colors.green[6] : theme.colors.gray[4]
                  }`,
                  borderRadius: '3px',
                  backgroundColor: completionStatus.createShop
                    ? theme.colors.green[6]
                    : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {completionStatus.createShop && <IconCheck size={10} color="white" />}
              </div>
              <IconShoppingBag size={16} color={theme.colors.primary[6]} />
            </div>
          }
        >
          <HoverCard width={280} shadow="md" withArrow openDelay={200} position="right">
            <HoverCard.Target>
              <Text size="sm" style={{ cursor: 'help', textDecoration: 'underline' }}>
                {t('account.createShop')}
              </Text>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="sm" mb="sm">
                First, you need to create your online shop by giving it a name and assigning a
                default currency. This sets up your store's basic identity and financial settings.
              </Text>
              <Button
                size="xs"
                variant="light"
                fullWidth
                disabled={completionStatus.createShop}
                onClick={() => (window.location.href = `#${createLanguageURL('/account')}`)}
              >
                {completionStatus.createShop ? 'Shop Created ✓' : 'Create Shop'}
              </Button>
            </HoverCard.Dropdown>
          </HoverCard>
        </List.Item>
        <List.Item
          icon={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  border: `1px solid ${
                    completionStatus.addStripeDetails ? theme.colors.green[6] : theme.colors.gray[4]
                  }`,
                  borderRadius: '3px',
                  backgroundColor: completionStatus.addStripeDetails
                    ? theme.colors.green[6]
                    : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {completionStatus.addStripeDetails && (
                  <IconCheck size={10} color="white" />
                )}
              </div>
              <IconCreditCard size={16} color={theme.colors.primary[6]} />
            </div>
          }
        >
          <HoverCard width={280} shadow="md" withArrow openDelay={200} position="right">
            <HoverCard.Target>
              <Text size="sm" style={{ cursor: 'help', textDecoration: 'underline' }}>
                {t('account.addStripeDetails')}
              </Text>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="sm" mb="sm">
                Configure Stripe payment processing to accept payments from Visa, Mastercard, and
                other major payment methods. This enables your customers to securely pay for their
                orders.
              </Text>
              <Button
                component={Link}
                to={createLanguageURL("/account/payment-gateways")}
                size="xs"
                variant="light"
                fullWidth
                disabled={!isShopSelected}
              >
                {completionStatus.addStripeDetails ? t('account.viewPaymentMethods') : t('account.setUpPayments')}
              </Button>
            </HoverCard.Dropdown>
          </HoverCard>
        </List.Item>
        <List.Item
          icon={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  border: `1px solid ${
                    completionStatus.addWarehouseAddress
                      ? theme.colors.green[6]
                      : theme.colors.gray[4]
                  }`,
                  borderRadius: '3px',
                  backgroundColor: completionStatus.addWarehouseAddress
                    ? theme.colors.green[6]
                    : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {completionStatus.addWarehouseAddress && (
                  <IconCheck size={10} color="white" />
                )}
              </div>
              <IconMapPin size={16} color={theme.colors.primary[6]} />
            </div>
          }
        >
          <HoverCard width={280} shadow="md" withArrow openDelay={200} position="right">
            <HoverCard.Target>
              <Text size="sm" style={{ cursor: 'help', textDecoration: 'underline' }}>
                {t('account.addWarehouseAddress')}
              </Text>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="sm" mb="sm">
                Add the physical address where your warehouse is located. This address will be used
                when creating your warehouse and is essential for shipping calculations and
                logistics.
              </Text>
              <Button
                component={Link}
                to={createLanguageURL("/account/addresses")}
                size="xs"
                variant="light"
                fullWidth
                disabled={!isShopSelected}
              >
                {completionStatus.addWarehouseAddress ? 'View Addresses' : 'Add Address'}
              </Button>
            </HoverCard.Dropdown>
          </HoverCard>
        </List.Item>
        <List.Item
          icon={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  border: `1px solid ${
                    completionStatus.addWarehouse ? theme.colors.green[6] : theme.colors.gray[4]
                  }`,
                  borderRadius: '3px',
                  backgroundColor: completionStatus.addWarehouse
                    ? theme.colors.green[6]
                    : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {completionStatus.addWarehouse && (
                  <IconCheck size={10} color="white" />
                )}
              </div>
              <IconBuildingWarehouse size={16} color={theme.colors.primary[6]} />
            </div>
          }
        >
          <HoverCard width={280} shadow="md" withArrow openDelay={200} position="right">
            <HoverCard.Target>
              <Text size="sm" style={{ cursor: 'help', textDecoration: 'underline' }}>
                {t('account.addWarehouse')}
              </Text>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="sm" mb="sm">
                Create a warehouse by assigning it to the address you previously added. Warehouses
                are how you track and manage products you have in stock for fulfillment.
              </Text>
              <Button
                component={Link}
                to={createLanguageURL("/account/warehouses")}
                size="xs"
                variant="light"
                fullWidth
                disabled={!isShopSelected}
              >
                {completionStatus.addWarehouse ? 'View Warehouses' : 'Add Warehouse'}
              </Button>
            </HoverCard.Dropdown>
          </HoverCard>
        </List.Item>
        <List.Item
          icon={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  border: `1px solid ${
                    completionStatus.addShippingRates ? theme.colors.green[6] : theme.colors.gray[4]
                  }`,
                  borderRadius: '3px',
                  backgroundColor: completionStatus.addShippingRates
                    ? theme.colors.green[6]
                    : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {completionStatus.addShippingRates && (
                  <IconCheck size={10} color="white" />
                )}
              </div>
              <IconTruckDelivery size={16} color={theme.colors.primary[6]} />
            </div>
          }
        >
          <HoverCard width={280} shadow="md" withArrow openDelay={200} position="right">
            <HoverCard.Target>
              <Text size="sm" style={{ cursor: 'help', textDecoration: 'underline' }}>
                {t('account.addShippingRates')}
              </Text>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="sm" mb="sm">
                Configure shipping rates and delivery pricing that will be assigned to your
                warehouse. These rates determine how much customers pay for shipping based on
                location and delivery options.
              </Text>
              <Button
                component={Link}
                to={createLanguageURL("/account/shipping-rate-templates")}
                size="xs"
                variant="light"
                fullWidth
                disabled={!isShopSelected}
              >
                {completionStatus.addShippingRates ? 'View Shipping Rates' : 'Set Up Shipping'}
              </Button>
            </HoverCard.Dropdown>
          </HoverCard>
        </List.Item>
        <List.Item
          icon={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  border: `1px solid ${
                    completionStatus.addProducts ? theme.colors.green[6] : theme.colors.gray[4]
                  }`,
                  borderRadius: '3px',
                  backgroundColor: completionStatus.addProducts
                    ? theme.colors.green[6]
                    : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {completionStatus.addProducts && <IconCheck size={10} color="white" />}
              </div>
              <IconShirt size={16} color={theme.colors.primary[6]} />
            </div>
          }
        >
          <HoverCard width={280} shadow="md" withArrow openDelay={200} position="right">
            <HoverCard.Target>
              <Text size="sm" style={{ cursor: 'help', textDecoration: 'underline' }}>
                {t('account.addProducts')}
              </Text>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="sm" mb="sm">
                Add your products to the catalog with descriptions, prices, and images. These are
                the items that customers will be able to browse and purchase from your online store.
              </Text>
              <Button
                component={Link}
                to={createLanguageURL("/account/products")}
                size="xs"
                variant="light"
                fullWidth
                disabled={!isShopSelected}
              >
                {completionStatus.addProducts ? 'View Products' : 'Add Products'}
              </Button>
            </HoverCard.Dropdown>
          </HoverCard>
        </List.Item>
        <List.Item
          icon={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: 16,
                  height: 16,
                  border: `1px solid ${
                    completionStatus.addStock ? theme.colors.green[6] : theme.colors.gray[4]
                  }`,
                  borderRadius: '3px',
                  backgroundColor: completionStatus.addStock
                    ? theme.colors.green[6]
                    : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {completionStatus.addStock && <IconCheck size={10} color="white" />}
              </div>
              <IconBoxSeam size={16} color={theme.colors.primary[6]} />
            </div>
          }
        >
          <HoverCard width={280} shadow="md" withArrow openDelay={200} position="right">
            <HoverCard.Target>
              <Text size="sm" style={{ cursor: 'help', textDecoration: 'underline' }}>
                {t('account.addStock')}
              </Text>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Text size="sm" mb="sm">
                Finally, add stock quantities for your products in the warehouse. This tracks how
                many units you have available and enables inventory management for order
                fulfillment.
              </Text>
              <Button
                component={Link}
                to={createLanguageURL("/account/stock-movements")}
                size="xs"
                variant="light"
                fullWidth
                disabled={!isShopSelected}
              >
                {completionStatus.addStock ? 'View Stock' : 'Add Stock'}
              </Button>
            </HoverCard.Dropdown>
          </HoverCard>
        </List.Item>
      </List>
      <Text mt="sm">
        {t('account.questions')}{' '}
        <Anchor href="mailto:support@checkoutbay.com">support@checkoutbay.com</Anchor>
      </Text>
    </Card>
  );

  const FormshivePromo = () => (
    <Card shadow="xs" padding="lg" radius="md" mb="md" withBorder>
      <Text ta="center">
        {t('account.formshivePromo')} <Anchor href="https://formshive.com/">Formshive</Anchor>
      </Text>
    </Card>
  );

  const QuickActions = () => (
    <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, lg: 4 }} spacing="md" mb="md">
      <Card shadow="xs" padding="lg" radius="md" withBorder>
        <Stack align="center" gap="sm">
          <Center>
            <IconInputCheck size={32} color={theme.colors.primary[6]} />
          </Center>
          <Title order={4} ta="center">
            {t('account.ordersTitle')}
          </Title>
          <Text size="sm" ta="center" c="dimmed">
            {t('account.ordersDescription')}
          </Text>
          <Button
            component="a"
            href={`#${createLanguageURL("/account/orders")}`}
            variant="light"
            size="sm"
            fullWidth
            disabled={!isShopSelected}
          >
            {t('account.goToOrders')}
          </Button>
        </Stack>
      </Card>

      <Card shadow="xs" padding="lg" radius="md" withBorder>
        <Stack align="center" gap="sm">
          <Center>
            <IconForms size={32} color={theme.colors.primary[6]} />
          </Center>
          <Title order={4} ta="center">
            {t('account.productsTitle')}
          </Title>
          <Text size="sm" ta="center" c="dimmed">
            {t('account.productsDescription')}
          </Text>
          <Button
            component="a"
            href={`#${createLanguageURL("/account/products")}`}
            variant="light"
            size="sm"
            fullWidth
            disabled={!isShopSelected}
          >
            {t('account.goToProducts')}
          </Button>
        </Stack>
      </Card>

      <Card shadow="xs" padding="lg" radius="md" withBorder>
        <Stack align="center" gap="sm">
          <Center>
            <IconAddressBook size={32} color={theme.colors.primary[6]} />
          </Center>
          <Title order={4} ta="center">
            {t('account.addressesTitle')}
          </Title>
          <Text size="sm" ta="center" c="dimmed">
            {t('account.addressesDescription')}
          </Text>
          <Button
            component="a"
            href={`#${createLanguageURL("/account/addresses")}`}
            variant="light"
            size="sm"
            fullWidth
            disabled={!isShopSelected}
          >
            {t('account.goToAddresses')}
          </Button>
        </Stack>
      </Card>

      <Card shadow="xs" padding="lg" radius="md" withBorder>
        <Stack align="center" gap="sm">
          <Center>
            <IconBuildingWarehouse size={32} color={theme.colors.primary[6]} />
          </Center>
          <Title order={4} ta="center">
            {t('account.warehousesTitle')}
          </Title>
          <Text size="sm" ta="center" c="dimmed">
            {t('account.warehousesDescription')}
          </Text>
          <Button
            component="a"
            href={`#${createLanguageURL("/account/warehouses")}`}
            variant="light"
            size="sm"
            fullWidth
            disabled={!isShopSelected}
          >
            {t('account.goToWarehouses')}
          </Button>
        </Stack>
      </Card>

      <Card shadow="xs" padding="lg" radius="md" withBorder>
        <Stack align="center" gap="sm">
          <Center>
            <IconPackage size={32} color={theme.colors.primary[6]} />
          </Center>
          <Title order={4} ta="center">
            {t('account.stockMovementsTitle')}
          </Title>
          <Text size="sm" ta="center" c="dimmed">
            {t('account.stockMovementsDescription')}
          </Text>
          <Button
            component="a"
            href={`#${createLanguageURL("/account/stock-movements")}`}
            variant="light"
            size="sm"
            fullWidth
            disabled={!isShopSelected}
          >
            {t('account.goToStockMovements')}
          </Button>
        </Stack>
      </Card>

      <Card shadow="xs" padding="lg" radius="md" withBorder>
        <Stack align="center" gap="sm">
          <Center>
            <IconPaywall size={32} color={theme.colors.primary[6]} />
          </Center>
          <Title order={4} ta="center">
            {t('account.paymentMethodsTitle')}
          </Title>
          <Text size="sm" ta="center" c="dimmed">
            {t('account.paymentMethodsDescription')}
          </Text>
          <Button
            component="a"
            href={`#${createLanguageURL("/account/payment-gateways")}`}
            variant="light"
            size="sm"
            fullWidth
            disabled={!isShopSelected}
          >
            {t('account.goToPaymentMethods')}
          </Button>
        </Stack>
      </Card>

      <Card shadow="xs" padding="lg" radius="md" withBorder>
        <Stack align="center" gap="sm">
          <Center>
            <IconTruck size={32} color={theme.colors.primary[6]} />
          </Center>
          <Title order={4} ta="center">
            {t('account.shippingRatesTitle')}
          </Title>
          <Text size="sm" ta="center" c="dimmed">
            {t('account.shippingRatesDescription')}
          </Text>
          <Button
            component="a"
            href={`#${createLanguageURL("/account/shipping-rate-templates")}`}
            variant="light"
            size="sm"
            fullWidth
            disabled={!isShopSelected}
          >
            {t('account.goToShippingRates')}
          </Button>
        </Stack>
      </Card>
    </SimpleGrid>
  );

  return (
    <>
      <Title order={1} mb="lg">
        <>
          <Text inherit component="span">
            {t('account.welcome')}
          </Text>
          <Text
            inherit
            variant="gradient"
            component="span"
            gradient={{
              from: theme.colors['brand-color-primary'][6],
              to: theme.colors['brand-color-primary'][6],
            }}
          >
            {t('brand.name')}
          </Text>
          <Text
            inherit
            variant="gradient"
            component="span"
            gradient={{
              from: theme.colors['brand-color-accent'][6],
              to: theme.colors['brand-color-accent'][6],
            }}
          >
            {t('brand.nameSecond')}
          </Text>
        </>
      </Title>
      <GetStarted />
      <QuickActions />
      <FormshivePromo />
      <Card shadow="xs" padding="lg" radius="md" withBorder>
        <News blogBaseUrl="https://blog.checkoutbay.com" />
      </Card>
    </>
  );
}
