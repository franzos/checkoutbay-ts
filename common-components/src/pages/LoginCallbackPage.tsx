import { Session } from "@gofranz/common";
import {
  BackgroundImage,
  Card,
  Center,
  Stack,
  Text,
  Title,
  alpha,
  useMantineColorScheme,
} from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { LoginCallback } from "../components/Login/LoginCallback";
import { useLanguageAwareRouting } from "../hooks/useLanguageAwareRouting";

export interface LoginCallbackPageProps {
  setSession: (session: Session) => void;
  onLoginSuccess?: () => void; // If not provided, will navigate to '/account'
  backgroundImage?: string; // Default: '/and-machines-vqTWfa4DjEk.jpg'
  titleGradient?: { from: string; to: string }; // Default: { from: 'pink', to: 'yellow' }
  titleClassName?: string; // CSS class for the title styling
}

export function LoginCallbackPage(props: LoginCallbackPageProps) {
  const { t } = useTranslation();
  const isDark = useMantineColorScheme().colorScheme === "dark";
  const nav = useNavigate();
  const { createLanguageURL } = useLanguageAwareRouting();

  const {
    setSession,
    onLoginSuccess,
    backgroundImage = "/and-machines-vqTWfa4DjEk.jpg",
    titleGradient = { from: "pink", to: "yellow" },
    titleClassName
  } = props;

  const loginDoneCb = () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    } else {
      nav(createLanguageURL("/account"));
    }
  };

  return (
    <BackgroundImage
      src={backgroundImage}
      radius={10}
      bgp="cover"
    >
      <Center h="100vh">
        <Stack>
          <Title order={1} className={titleClassName} ta="center">
            <Text
              inherit
              variant="gradient"
              component="span"
              gradient={titleGradient}
            >
              {t('login.loggingIn')}
            </Text>
          </Title>
          <Card
            maw={400}
            p="md"
            bg={
              isDark
                ? alpha("var(--mantine-color-gray-8)", 0.6)
                : alpha("var(--mantine-color-gray-0)", 0.6)
            }
          >
            <LoginCallback 
              setSession={setSession} 
              loginDoneCb={loginDoneCb} 
            />
          </Card>
        </Stack>
      </Center>
    </BackgroundImage>
  );
}