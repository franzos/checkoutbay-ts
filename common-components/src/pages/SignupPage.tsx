import {
  Anchor,
  BackgroundImage,
  Button,
  Card,
  Center,
  Stack,
  Text,
  Title,
  alpha,
  useMantineColorScheme,
} from '@mantine/core';
import { IconBrandGoogle, IconBrowser, IconRecordMail } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLanguageAwareRouting } from '../hooks/useLanguageAwareRouting';

export interface SignupPageProps {
  titleGradient?: { from: string; to: string }; // Default: { from: 'pink', to: 'yellow' }
  titleClassName?: string; // CSS class for the title styling
}

export function SignupPage(props: SignupPageProps) {
  const { t } = useTranslation();
  const { createLanguageURL } = useLanguageAwareRouting();
  const isDark = useMantineColorScheme().colorScheme === 'dark';

  const { titleGradient = { from: 'pink', to: 'yellow' }, titleClassName } = props;

  return (
    <BackgroundImage src="/and-machines-vqTWfa4DjEk.jpg" radius={10} bgp="cover">
      <Center h="100vh">
        <Stack align="center">
          <Title order={1} className={titleClassName} ta="center">
            <Text inherit variant="gradient" component="span" gradient={titleGradient}>
              {t('auth.signup')}
            </Text>
          </Title>
          <Card
            maw={400}
            p="md"
            bg={
              isDark
                ? alpha('var(--mantine-color-gray-8)', 0.6)
                : alpha('var(--mantine-color-gray-0)', 0.6)
            }
          >
            <Text>{t('auth.alreadyAccount')}</Text>
            <Title order={3} mt="md">
              <IconRecordMail size="1.1rem" /> {t('auth.emailSection')}
            </Title>
            <Text>
              {t('auth.signupDescription')}
              <Button
                component={Link}
                to={createLanguageURL("/login?kind=EMAIL_MAGIC_LINK")}
                variant="light"
                size="compact-xs"
                color="dark"
              >
                {t('auth.signupLoginEmail')}
              </Button>
            </Text>
            <Title order={3} mt="md">
              <IconBrandGoogle size="1.1rem" /> {t('auth.googleSection')}
            </Title>
            <Text>
              {t('auth.googleDescription')}
              <Button
                component={Link}
                to={createLanguageURL("/login?kind=GOOGLE")}
                variant="light"
                size="compact-xs"
                color="dark"
              >
                {t('auth.signupLoginGoogle')}
              </Button>
            </Text>
            <Title order={3} mt="md">
              <IconBrowser size="1.1rem" /> {t('auth.nostrSection')}
            </Title>
            <Text>
              {t('auth.nostrDescription')}
              <Anchor href="https://blog.formshive.com/posts/get-started/">
                {t('auth.browserPlugin')}
              </Anchor>
              .{' '}
              <Button
                component={Link}
                to={createLanguageURL("/login?kind=NOSTR")}
                variant="light"
                size="compact-xs"
                color="dark"
              >
                {t('auth.signupLoginNostr')}
              </Button>
            </Text>
          </Card>
        </Stack>
      </Center>
    </BackgroundImage>
  );
}
