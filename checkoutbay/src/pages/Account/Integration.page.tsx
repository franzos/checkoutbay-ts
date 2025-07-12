import { Button, Card, Container, Grid, Group, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { useLanguageAwareRouting } from '@gofranz/common-components';
import { IconApi, IconBrowser, IconCode, IconSeo, IconTools } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { API_BASE_URL, SHOP_PREVIEW_BASE_URL_ALT } from '../../constants';
import { useRustyState } from '../../state';

export function AccountIntegrationPage() {
  const { t } = useTranslation();
  const selectedShop = useRustyState((s) => s.shopId);
  const { createLanguageURL } = useLanguageAwareRouting();

  const shopPreviewUrlAlt = `${SHOP_PREVIEW_BASE_URL_ALT}/#/?shop_id=${selectedShop}`;
  
  // Construct static shop preview URL from API_BASE_URL
  const staticShopPreviewUrl = API_BASE_URL?.replace('/v1', `/shop/${selectedShop}/`) || '';

  const integrationOptions = [
    {
      id: 'preview-shop',
      title: t('docs.previewShop'),
      description: t('docs.previewShopDescription'),
      icon: IconBrowser,
      color: 'green',
      action: () => window.open(shopPreviewUrlAlt, '_blank'),
      buttonText: t('docs.openPreviewShop'),
    },
    {
      id: 'preview-shop-static',
      title: t('docs.previewShopStatic'),
      description: t('docs.previewShopStaticDescription'),
      icon: IconSeo,
      color: 'blue',
      action: () => window.open(staticShopPreviewUrl, '_blank'),
      buttonText: t('docs.openStaticPreview'),
    },
    {
      id: 'js-library',
      title: t('docs.jsLibrary'),
      description: t('docs.jsLibraryDescription'),
      icon: IconCode,
      color: 'violet',
      to: () => createLanguageURL('/docs'),
      buttonText: t('docs.getInstructions'),
    },
    {
      id: 'api-integration',
      title: t('docs.customApiTitle'),
      description: t('docs.customApiDescription'),
      icon: IconApi,
      color: 'blue',
      to: () => createLanguageURL('/docs'),
      buttonText: t('docs.getInstructions'),
    },
  ];

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="xs">
            {t('docs.title')}
          </Title>
          <Text c="dimmed" size="lg">
            {t('docs.subtitle')}
          </Text>
        </div>

        <Grid>
          {integrationOptions.map((option) => (
            <Grid.Col key={option.id} span={{ base: 12, md: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                <Stack gap="md" h="100%">
                  <Group gap="sm">
                    <ThemeIcon size={40} radius="md" color={option.color}>
                      <option.icon size={20} />
                    </ThemeIcon>
                    <div>
                      <Text fw={500} size="lg">
                        {option.title}
                      </Text>
                    </div>
                  </Group>

                  <Text size="sm" c="dimmed" style={{ flex: 1 }}>
                    {option.description}
                  </Text>

                  {option.action ? (
                    <Button variant="filled" color={option.color} fullWidth onClick={option.action}>
                      {option.buttonText}
                    </Button>
                  ) : (
                    <Button
                      variant="filled"
                      color={option.color}
                      fullWidth
                      component={Link}
                      to={option.to()}
                    >
                      {option.buttonText}
                    </Button>
                  )}
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>

        <Card withBorder padding="lg" radius="md" bg="gray.0">
          <Stack gap="sm">
            <Group gap="sm">
              <ThemeIcon size={32} radius="md" color="orange">
                <IconTools size={16} />
              </ThemeIcon>
              <Text fw={500} size="md">
                {t('docs.needHelp')}
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              {t('docs.helpDescription')}
            </Text>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}