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
import { IconBrandGoogle, IconBrandGithub, IconBrowser, IconRecordMail, IconBrandWindows } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useLanguageAwareRouting } from '../hooks/useLanguageAwareRouting';
import { LOGIN_METHOD } from '@gofranz/common';

export interface SignupPageProps {
  backgroundImage?: string; // Default: '/and-machines-vqTWfa4DjEk.jpg'
  titleGradient?: { from: string; to: string }; // Default: { from: 'pink', to: 'yellow' }
  titleClassName?: string; // CSS class for the title styling
  loginMethods?: LOGIN_METHOD[]
}

export function SignupPage(props: SignupPageProps) {
  const { t } = useTranslation();
  const { createLanguageURL } = useLanguageAwareRouting();
  const isDark = useMantineColorScheme().colorScheme === 'dark';

  const {
    backgroundImage = "/and-machines-vqTWfa4DjEk.jpg",
    titleGradient = { from: 'pink', to: 'yellow' },
    titleClassName,
    loginMethods = [LOGIN_METHOD.NOSTR, LOGIN_METHOD.GITHUB, LOGIN_METHOD.GOOGLE, LOGIN_METHOD.EMAIL_MAGIC_LINK, LOGIN_METHOD.MICROSOFT],
  } = props;

  const hasGoogleLogin = loginMethods?.includes(LOGIN_METHOD.GOOGLE);
  const hasGithubLogin = loginMethods?.includes(LOGIN_METHOD.GITHUB);
  const hasMicrosoftLogin = loginMethods?.includes(LOGIN_METHOD.MICROSOFT);
  const hasNostrLogin = loginMethods?.includes(LOGIN_METHOD.NOSTR);
  const hasEmailMagicLinkLogin = loginMethods?.includes(LOGIN_METHOD.EMAIL_MAGIC_LINK);

  return (
    <BackgroundImage src={backgroundImage} radius={10} bgp="cover">
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
            {hasEmailMagicLinkLogin && (
              <>
                <Title order={3} mt="md">
                  <IconRecordMail size="1.1rem" /> {t('auth.emailSection')}
                </Title>
                <Text mb="xs">
                  {t('auth.signupDescription')}
                </Text>
                <Button
                  component={Link}
                  to={createLanguageURL("/login?kind=EMAIL_MAGIC_LINK")}
                  variant="light"
                >
                  {t('auth.signupLoginEmail')}
                </Button>
              </>
            )}
            {hasGoogleLogin && (
              <>
                <Title order={3} mt="md">
                  <IconBrandGoogle size="1.1rem" /> {t('auth.googleSection')}
                </Title>
                <Text mb="xs">
                  {t('auth.googleDescription')}
                </Text>
                <Button
                  component={Link}
                  to={createLanguageURL("/login?kind=GOOGLE")}
                  variant="light"
                >
                  {t('auth.signupLoginGoogle')}
                </Button>
              </>
            )}
            {hasGithubLogin && (
              <>
                <Title order={3} mt="md">
                  <IconBrandGithub size="1.1rem" /> {t('auth.githubSection')}
                </Title>
                <Text mb="xs">
                  {t('auth.githubDescription')}
                </Text>
                <Button
                  component={Link}
                  to={createLanguageURL("/login?kind=GITHUB")}
                  variant="light"
                >
                  {t('auth.signupLoginGithub')}
                </Button>
              </>
            )}
            {hasMicrosoftLogin && (
              <>
                <Title order={3} mt="md">
                  <IconBrandWindows size="1.1rem" /> {t('auth.microsoftSection')}
                </Title>
                <Text mb="xs">
                  {t('auth.microsoftDescription')}
                </Text>
                <Button
                  component={Link}
                  to={createLanguageURL("/login?kind=MICROSOFT")}
                  variant="light"
                >
                  {t('auth.signupLoginMicrosoft')}
                </Button>
              </>
            )}
            {hasNostrLogin && (
              <>
                <Title order={3} mt="md">
                  <IconBrowser size="1.1rem" /> {t('auth.nostrSection')}
                </Title>
                <Text mb="xs">
                  {t('auth.nostrDescription')}
                  <Anchor href="https://blog.formshive.com/posts/get-started/">
                    {t('auth.browserPlugin')}
                  </Anchor>
                  .
                </Text>
                <Button
                  component={Link}
                  to={createLanguageURL("/login?kind=NOSTR")}
                  variant="light"
                >
                  {t('auth.signupLoginNostr')}
                </Button>
              </>)}
          </Card>
        </Stack>
      </Center>
    </BackgroundImage>
  );
}
