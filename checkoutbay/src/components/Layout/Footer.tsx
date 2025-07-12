import { Anchor, Container, Divider, Grid, Group, Image, Stack, Text } from '@mantine/core';
import { useLanguageAwareRouting } from '@gofranz/common-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export function Footer() {
  const { t } = useTranslation();
  const { createLanguageURL } = useLanguageAwareRouting();

  return (
    <>
      <Divider mt="xl" mb="xl" />
      <Container mt="xl" mb="xl">
        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="sm">
              <Group>
                <Link to={createLanguageURL('/')}>
                  <Image src="/logo.svg" alt={t('brand.logoAlt')} width={32} height={32} style={{ cursor: 'pointer' }} />
                </Link>
                <Text fw={500}>
                  {t('brand.name')}{t('brand.nameSecond')}
                </Text>
              </Group>
              <Text size="sm" c="dimmed">
                {/* {t('welcome.tagline')} */}
                Your Store. Your Way.
              </Text>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="xs">
              <Text fw={500} size="sm">{t('glob_footer.product')}</Text>
              <Anchor component={Link} to={createLanguageURL('/pricing')} size="sm" c="dimmed">
                {t('glob_navigation.pricing')}
              </Anchor>
              <Anchor component={Link} to={createLanguageURL('/docs')} size="sm" c="dimmed">
                {t('glob_navigation.docs')}
              </Anchor>
              <Anchor component={Link} to={createLanguageURL('/news')} size="sm" c="dimmed">
                {t('glob_navigation.news')}
              </Anchor>
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack gap="xs">
              <Text fw={500} size="sm">{t('glob_footer.account')}</Text>
              <Anchor component={Link} to={createLanguageURL('/login')} size="sm" c="dimmed">
                {t('glob_navigation.login')}
              </Anchor>
              <Anchor component={Link} to={createLanguageURL('/signup')} size="sm" c="dimmed">
                {t('glob_navigation.signup')}
              </Anchor>
              <Anchor href={`#${createLanguageURL('/privacy')}`} size="sm" c="dimmed">
                {t('privacy.title')}
              </Anchor>
              <Anchor href={`#${createLanguageURL('/terms')}`} size="sm" c="dimmed">
                {t('glob_navigation.terms')}
              </Anchor>
            </Stack>
          </Grid.Col>
        </Grid>

        <Divider my="md" />

        <Stack align="center" gap="xs">
          <Text ta="center" size="sm" c="dimmed">
            {t('privacy.gdprCompliant')}
          </Text>
          <Group gap={4} justify="center" align="center">
            <Text size="sm" c="dimmed">By</Text>
            <Anchor 
              href="https://gofranz.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Image
                src="/gofranz.svg"
                alt="GoFranz - German Cloud Infrastructure"
                height={16}
                width="auto"
                style={{ opacity: 0.7, transition: 'opacity 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '0.7'}
              />
            </Anchor>
          </Group>
        </Stack>
      </Container>
    </>
  );
}