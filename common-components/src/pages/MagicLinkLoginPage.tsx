import {
  BackgroundImage,
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
    backgroundImage = '/and-machines-vqTWfa4DjEk.jpg',
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
    } catch (e) {
      alert(e);
      console.error(e);
    }
    setIsBusy(false);
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
    <BackgroundImage src={backgroundImage} radius={10} bgp="cover">
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
              <Title order={3}>{t('login.processing')}</Title>
            ) : (
              <Text>{t('login.somethingWrong')}</Text>
            )}
            {errors.length > 0 && (
              <>
                <Title order={4}>{t('login.invalidMagicLink')}</Title>
                {errors.map((error) => (
                  <Text key={error}>{error}</Text>
                ))}
              </>
            )}
          </Card>
        </Stack>
      </Center>
    </BackgroundImage>
  );
}