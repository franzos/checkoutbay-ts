import {
  BackgroundImage,
  Box,
  Button,
  Card,
  Center,
  Group,
  Stack,
  Text,
  Title,
  alpha,
  useMantineColorScheme,
} from '@mantine/core';
import { LoginRequest, LoginChallenge, LoginChallengeUserResponse, LoginSuccess } from '@gofranz/common';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Login } from "../components/Login/Login";
import { useLanguageAwareRouting } from '../hooks/useLanguageAwareRouting';

export interface LoginPageProps {
  // Required props for login functionality
  login: (loginRequest: LoginRequest) => Promise<LoginChallenge>;
  loginChallenge: (props: LoginChallengeUserResponse) => Promise<LoginSuccess>;

  // Navigation and routing
  onLoginSuccess?: () => void; // If not provided, will navigate to '/account'
  signupRoute?: string; // Default: '/signup'

  // Customization options
  backgroundImage?: string; // Default: '/and-machines-vqTWfa4DjEk.jpg'
  showSignupButton?: boolean; // Default: true
  titleGradient?: { from: string; to: string }; // Default: { from: 'pink', to: 'yellow' }
  titleClassName?: string; // CSS class for the title styling
}

export function LoginPage(props: LoginPageProps) {
  const { t } = useTranslation();
  const isDark = useMantineColorScheme().colorScheme === 'dark';
  const [hasNewAccountButton, setHasNewAccountButton] = useState(props.showSignupButton !== false);
  const nav = useNavigate();
  const { createLanguageURL } = useLanguageAwareRouting();

  const {
    login,
    loginChallenge,
    onLoginSuccess,
    signupRoute = "/signup",
    backgroundImage = "/and-machines-vqTWfa4DjEk.jpg",
    titleGradient = { from: "pink", to: "yellow" },
    titleClassName,
  } = props;

  const loginCb = async (loginRequest: LoginRequest) => {
    setHasNewAccountButton(false);
    return login(loginRequest);
  };

  const loginDoneCb = () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    } else {
      nav(createLanguageURL('/account'));
    }
  };

  return (
    <BackgroundImage src={backgroundImage} radius={10} bgp="cover">
      <Center h="100vh">
        <Stack align="center">
          <Title order={1} className={titleClassName} ta="center">
            <Text
              inherit
              variant="gradient"
              component="span"
              gradient={titleGradient}
            >
              {t("auth.login")}
            </Text>
          </Title>
          <Card
            miw={300}
            maw={400}
            p="md"
            bg={
              isDark
                ? alpha("var(--mantine-color-gray-8)", 0.6)
                : alpha("var(--mantine-color-gray-0)", 0.6)
            }
          >
            <Login
              login={loginCb}
              loginChallenge={loginChallenge}
              loginDoneCb={loginDoneCb}
            />
          </Card>
          {hasNewAccountButton && (
            <Box p="md">
              <Group justify="center">
                <Text>{t("auth.newHere")}</Text>
                <Button
                  component={Link}
                  to={signupRoute}
                  variant="light"
                  size="compact-md"
                  color="dark"
                >
                  {t("auth.howToSignup")}
                </Button>
              </Group>
            </Box>
          )}
        </Stack>
      </Center>
    </BackgroundImage>
  );
}