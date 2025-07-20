import { Currency } from "@gofranz/common";
import { useLanguageAwareRouting } from "@gofranz/common-components";
import {
  AppShell,
  Button,
  NavLink,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import {
  IconAddressBook,
  IconBrowser,
  IconBuildingWarehouse,
  IconDiscount,
  IconForms,
  IconHelp,
  IconHome2,
  IconInputCheck,
  IconLogout,
  IconPackage,
  IconPaywall,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from "react-router-dom";
import { useRustyState } from "../../state";

export function AccountNavigation() {
  const { t } = useTranslation();
  const navigation = useNavigate();
  const { createLanguageURL } = useLanguageAwareRouting();
  const shops = useRustyState((s) => s.shops);
  const [selectedShop, setSelectedShop] = useState<string | undefined | null>(undefined);
  const [newShopName, setNewShopName] = useState<string | undefined>(undefined);
  const [newShopCurrency, setNewShopCurrency] = useState<Currency | undefined>(
    undefined
  );

  const currencyOptions = Object.values(Currency).map((currency) => ({
    value: currency,
    label: currency,
  }));

  useEffect(() => {
    const loadShops = async () => {
      await useRustyState.getState().loadShops();
      setSelectedShop(useRustyState.getState().shopId);
    };
    loadShops();
  }, []);

  const createShop = async () => {
    if (!newShopName) {
      throw new Error("Shop name is required");
    }
    await useRustyState.getState().api.createShop({
      name: newShopName,
      default_currency: newShopCurrency || Currency.EUR,
    });
    await useRustyState.getState().loadShops();
    setNewShopName(undefined);
  };

  const selectShop = async (shopId?: string | null) => {
    setSelectedShop(shopId);
    useRustyState.getState().setShopId(shopId);
    navigation(createLanguageURL('/account'));
  };

  const logout = async () => {
    await useRustyState.getState().logout();
    navigation(createLanguageURL("/"));
  };

  const createShopForm = () => {
    return (
      <>
        <TextInput
          placeholder={t('navigation.enterShopName')}
          value={newShopName || ""}
          onChange={(e) => setNewShopName(e.target.value)}
        />
        <Select
          placeholder={t('navigation.selectDefaultCurrency')}
          value={newShopCurrency}
          onChange={(value) => {
            if (value) setNewShopCurrency(value as Currency);
          }}
          data={currencyOptions}
          searchable
        />
        <Text size="xs" c="dimmed">
          {t('navigation.currencyWarning')}
        </Text>
        <Button
          onClick={createShop}
          disabled={!newShopName || !newShopCurrency}
        >
          {t('navigation.createShop')}
        </Button>
      </>
    );
  };

  if (!selectedShop) {
    if (!shops || shops.length === 0) {
      return (
        <AppShell.Navbar p="md">
          <Stack>
            <Text size="lg" fw={500}>
              {t('navigation.welcomeNewShop')}
            </Text>
            <Text size="sm" c="dimmed">
              {t('navigation.createFirstShop')}
            </Text>
            <>{createShopForm()}</>
          </Stack>
          <NavLink
            onClick={logout}
            href="#"
            label={t('glob_navigation.logout')}
            leftSection={<IconLogout size="18" stroke={1.5} />}
          />
        </AppShell.Navbar>
      );
    }

    return (
      <AppShell.Navbar p="md">
        <Text size="lg" fw={500} mb="md">
          {t('navigation.selectShop')}
        </Text>
        <Stack>
          {shops.map((shop) => (
            <Button
              key={shop.id}
              variant="light"
              onClick={() => selectShop(shop.id)}
            >
              {shop.name}
            </Button>
          ))}
          <Text size="md" fw={500}>
            {t('navigation.createNewShop')}
          </Text>
          {createShopForm()}
        </Stack>
        <NavLink
          onClick={logout}
          href="#"
          label={t('glob_navigation.logout')}
          leftSection={<IconLogout size="18" stroke={1.5} />}
        />
      </AppShell.Navbar>
    );
  }

  return (
    <AppShell.Navbar p="md">
      <Stack mb="md">
        <Select
          label={t('navigation.currentShop')}
          value={selectedShop}
          onChange={(value) => {
            console.debug("Selected shop", value);
            selectShop(value)
          }}
          data={
            shops?.map((shop) => ({ value: shop.id, label: shop.name })) || []
          }
          clearable
        />
        <Button variant="subtle" size="xs" onClick={() => selectShop("")}>
          {t('navigation.createNewShopButton')}
        </Button>
      </Stack>
      <NavLink
        component={Link}
        to={createLanguageURL('/account')}
        label={t('glob_navigation.home')}
        leftSection={<IconHome2 size="18" stroke={1.5} />}
      />

      <NavLink
        component={Link}
        to={createLanguageURL(`/account/${selectedShop}/orders`)}
        label={t('navigation.orders')}
        leftSection={<IconInputCheck size="18" stroke={1.5} />}
      />

      <NavLink
        href="#required-for-focus"
        label={t('navigation.settings')}
        leftSection={<IconSettings size={16} stroke={1.5} />}
        childrenOffset={28}
        defaultOpened
      >
        <NavLink
          component={Link}
          to={createLanguageURL(`/account/${selectedShop}/products`)}
          label={t('navigation.products')}
          leftSection={<IconForms size="18" stroke={1.5} />}
        />
        <NavLink
          component={Link}
          to={createLanguageURL(`/account/${selectedShop}/addresses`)}
          label={t('navigation.addresses')}
          leftSection={<IconAddressBook size="18" stroke={1.5} />}
        />
        <NavLink
          component={Link}
          to={createLanguageURL(`/account/${selectedShop}/warehouses`)}
          label={t('navigation.warehouses')}
          leftSection={<IconBuildingWarehouse size="18" stroke={1.5} />}
        />
        <NavLink
          component={Link}
          to={createLanguageURL(`/account/${selectedShop}/stock-movements`)}
          label={t('navigation.stockMovements')}
          leftSection={<IconPackage size="18" stroke={1.5} />}
        />
        <NavLink
          component={Link}
          to={createLanguageURL(`/account/${selectedShop}/payment-methods`)}
          label={t('navigation.paymentMethods')}
          leftSection={<IconPaywall size="18" stroke={1.5} />}
        />
        <NavLink
          component={Link}
          to={createLanguageURL(`/account/${selectedShop}/shipping-rate-templates`)}
          label={t('navigation.shippingRates')}
          leftSection={<IconPaywall size="18" stroke={1.5} />}
        />
        <NavLink
          component={Link}
          to={createLanguageURL(`/account/${selectedShop}/discounts`)}
          label={t('navigation.discounts')}
          leftSection={<IconDiscount size="18" stroke={1.5} />}
        />
      </NavLink>

      <NavLink
        component={Link}
        to={createLanguageURL(`/account/profile`)}
        label={t('glob_navigation.profile')}
        leftSection={<IconUser size="18" stroke={1.5} />}
      />

      {/* <NavLink
        component={Link}
        to={createLanguageURL('/account/shop')}
        label="Shop"
        leftSection={<IconHome2 size="18" stroke={1.5} />}
      /> */}

      <NavLink
        component={Link}
        to={createLanguageURL(`/account/${selectedShop}/integration`)}
        label={t('navigation.integration')}
        leftSection={<IconBrowser size="18" stroke={1.5} />}
      />

      <NavLink
        component={Link}
        to={createLanguageURL(`/account/${selectedShop}/support`)}
        label={t('glob_navigation.support')}
        leftSection={<IconHelp size="18" stroke={1.5} />}
      />

      <NavLink
        onClick={logout}
        href="#"
        label={t('glob_navigation.logout')}
        leftSection={<IconLogout size="18" stroke={1.5} />}
      />
    </AppShell.Navbar>
  );
}
