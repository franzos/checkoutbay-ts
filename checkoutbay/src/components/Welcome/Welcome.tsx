import {
  Anchor,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Image,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useLanguageAwareRouting } from '@gofranz/common-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function Welcome() {
  const theme = useMantineTheme();
  const { t } = useTranslation();
  const { createLanguageURL } = useLanguageAwareRouting();

  return (
    <>
      <Container>
        <Image
          src="/logo.svg"
          fit="contain"
          alt={t('brand.logoAlt')}
          mt={100}
          width={200}
          height={200}
        />
        <Title size={50} ta="center">
          <>
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

        <Text ta="center" size="xl" maw={580} mx="auto" mt="xl" lh="xs">
          <b>
            {/* {t('welcome.tagline')}{' '} */}
            Your Store. Your Way.{' '}
            <Text component="span" c="primary" inherit>
              {t('brand.name')}{t('brand.nameSecond')}.
            </Text>
          </b>
          <br />
          {t('welcome.description')}
        </Text>
        <Text c="dimmed" ta="center" size="lg" maw={580} mx="auto" mt="sm">
          {t('welcome.subDescription')}
        </Text>
      </Container>

      <Divider mt="md" mb="md" />

      <Container mt="xl">
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
          <Box>
            <Title order={3}>{t('welcome.features.superEasy.title')}</Title>
            <Text>
              {t('welcome.features.superEasy.description')}
            </Text>
          </Box>

          <Box>
            <Title order={3}>{t('welcome.features.selfService.title')}</Title>
            <Text>
              {t('welcome.features.selfService.description')}
            </Text>
          </Box>

          <Box>
            <Title order={3}>{t('welcome.features.atCost.title')}</Title>
            <Text>
              {t('welcome.features.atCost.description')}
            </Text>
          </Box>

          <Box>
            <Title order={3}>{t('welcome.features.inventory.title')}</Title>
            <Text>
              {t('welcome.features.inventory.description')}
            </Text>
          </Box>

          <Box>
            <Title order={3}>{t('welcome.features.developerFriendly.title')}</Title>
            <Text>
              {t('welcome.features.developerFriendly.description')}
            </Text>
          </Box>

          <Box>
            <Title order={3}>{t('welcome.features.privacy.title')}</Title>
            <Text>
              {t('welcome.features.privacy.description')}
            </Text>
          </Box>
        </SimpleGrid>
      </Container>

      <Container ta="center" mt="4rem" mb="4rem" maw={600} mx="auto">
        <Title order={3} mb="sm" fw={600} ta="center">
          {t('welcome.cta.title')}
        </Title>
        <Button
          size="lg"
          variant="gradient"
          gradient={{ from: 'brand-color-primary', to: 'brand-color-accent' }}
          component={Link}
          to={createLanguageURL("/signup")}
          radius="md"
          px={40}
          mx="auto"
          style={{ display: 'block' }}
        >
          {t('welcome.cta.button')}
        </Button>
        <Text c="dimmed" mt="sm" size="sm" fw={500} ta="center">
          <Text component="span" c="#FFB800" fw={700}>
            {t('welcome.cta.credit')}{' '}
            <Anchor href="https://blog.checkoutbay.com/posts/preview-release/">
              preview phase
            </Anchor>
          </Text>
          <br />
          {t('welcome.cta.description')}
        </Text>

        <Divider my="xl" />

        <Card shadow="xs" padding="lg" radius="md" withBorder maw={360} w="100%" mx="auto">
          <Stack align="center">
            <Title order={4} ta="center" mb={0} fw={500}>
              {t('welcome.cta.loginTitle')}
            </Title>
            <Text c="dimmed" ta="center" size="sm" maw={280} mx="auto">
              {t('welcome.cta.loginDescription')}
            </Text>
            <Button component={Link} to={createLanguageURL("/login")} variant="outline" size="md" radius="md" px={30}>
              {t('welcome.cta.loginButton')}
            </Button>
          </Stack>
        </Card>
      </Container>
    </>
  );
}
