import { Box, Text } from "@mantine/core";
import { decodeSessionTokens, LOGIN_METHOD, Session } from "@gofranz/common";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export interface LoginCallbackProps {
  loginDoneCb: () => void;
  setSession: (session: Session) => void;
}

export function LoginCallback(props: LoginCallbackProps) {
  const { t } = useTranslation();
  const [hasError, setHasError] = useState<string | null>(null);

  useEffect(() => {
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.split("?")[1]);
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    const expiresAt = hashParams.get("expires_at");
    const userId = hashParams.get("user_id");

    if (!accessToken || !refreshToken || !expiresAt || !userId) {
      setHasError(t('login.invalidLoginResponse'));
      return;
    }

    props.setSession({
      isLoggedIn: true,
      userId,
      accessToken,
      refreshToken: refreshToken,
      expiresAt: parseInt(expiresAt),
      ...decodeSessionTokens({
        access_token: accessToken,
        refresh_token: refreshToken,
      }),
      method: LOGIN_METHOD.GOOGLE,
    } as Session);

    props.loginDoneCb();
  }, [props, t]);

  const ErrorMessage = () => (
    <Text color="red" mb="md">
      {hasError}
    </Text>
  );

  return (
    <Box maw={340} mx="auto">
      <Text size="lg" mb="md">
        {t('login.loggingIn')}
      </Text>
      {hasError && <ErrorMessage />}
    </Box>
  );
}