import {
  Card,
  Center,
  Stack,
  Text,
  Title,
  alpha,
  useComputedColorScheme,
} from '@mantine/core';
import { LOGIN_METHOD, LoginChallengeUserResponse, LoginSuccess } from '@gofranz/common';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useLanguageAwareRouting } from '../hooks/useLanguageAwareRouting';

export interface MagicLinkLoginPageProps {
  loginChallenge: (props: LoginChallengeUserResponse) => Promise<LoginSuccess>;
  onLoginSuccess?: () => void; // If not provided, will navigate to '/account'
  backgroundImage?: string; // Default: '/and-machines-vqTWfa4DjEk.jpg'
  titleGradient?: { from: string; to: string }; // Default: { from: 'pink', to: 'yellow' }
  titleClassName?: string; // CSS class for the title styling
}

export function MagicLinkLoginPage(props: MagicLinkLoginPageProps) {
  const { t } = useTranslation();
  const isDark = useComputedColorScheme('light') === 'dark';
  const [errors, setErrors] = useState<string[]>([]);
  const [isBusy, setIsBusy] = useState(false);
  const nav = useNavigate();
  const { createLanguageURL } = useLanguageAwareRouting();

  const {
    loginChallenge,
    onLoginSuccess,
    titleGradient = { from: 'pink', to: 'yellow' },
    titleClassName
  } = props;

  const submitChallenge = async (id: string, challenge: string) => {
    setIsBusy(true);
    try {
      await loginChallenge({
        type: LOGIN_METHOD.EMAIL_MAGIC_LINK,
        content: {
          id,
          challenge,
        }
      });
      setIsBusy(false);
      if (onLoginSuccess) {
        onLoginSuccess();
      } else {
        nav(createLanguageURL('/account'));
      }
    } catch (e: any) {
      console.error(e);
      setIsBusy(false);

      // Parse structured error response from backend
      const errorData = e?.response?.data;

      if (errorData && typeof errorData === 'object' && errorData.error && errorData.message) {
        // Backend returned structured error
        switch (errorData.error) {
          case 'INVALID_AUTH_METHOD':
            setErrors([t('login.errorDifferentAuthMethod'), errorData.message]);
            break;
          case 'EMAIL_NOT_PRIMARY':
            setErrors([t('login.errorNotPrimaryEmail'), errorData.message]);
            break;
          case 'INVALID_CHALLENGE':
          case 'CHALLENGE_MISMATCH':
            setErrors([t('login.invalidMagicLink'), errorData.message]);
            break;
          default:
            setErrors([t('login.somethingWrong'), errorData.message]);
        }
      } else {
        // Fallback to parsing error message
        const errorMessage = e?.message || e?.toString() || '';
        setErrors([t('login.somethingWrong'), errorMessage]);
      }
    }
  };

  useEffect(() => {
    const login = async () => {
      const url = new URL(window.location.href);
      const hashParams = new URLSearchParams(url.hash.split('?')[1]);
      const urlParamChallenge = hashParams.get('challenge');
      const urlParamId = hashParams.get('id');

      const loginErrors = [];
      if (urlParamId && urlParamChallenge) {
        await submitChallenge(urlParamId, urlParamChallenge);
      } else {
        if (!urlParamId) {
          loginErrors.push(t('login.noIdProvided'));
        }
        if (!urlParamChallenge) {
          loginErrors.push(t('login.noChallengeProvided'));
        }
        setErrors(loginErrors);
      }
    };
    login();
  }, []);

  return (
    <Center h="100vh">
      <Stack>
        <Title order={1} className={titleClassName} ta="center">
          <Text
            inherit
            variant="gradient"
            component="span"
            gradient={titleGradient}
          >
            {t('auth.login')}
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
          {isBusy ? (
            <Stack gap="md">
              <Title order={3}>{t('login.processing')}</Title>
            </Stack>
          ) : errors.length > 0 ? (
            <Stack gap="md">
              <Title order={4}>{t('login.somethingWrong')}</Title>
              {errors.map((error, index) => (
                <Text key={index} c={index === 0 ? 'red' : 'dimmed'}>{error}</Text>
              ))}
            </Stack>
          ) : (
            <Text>{t('login.somethingWrong')}</Text>
          )}
        </Card>
      </Stack>
    </Center>
  );
}