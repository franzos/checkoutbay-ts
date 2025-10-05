import { decodeSessionTokens, Session } from "@gofranz/common";
import { Box, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export interface LoginCallbackProps {
  loginDoneCb: () => void;
  setSession: (session: Session) => void;
}

export function LoginCallback(props: LoginCallbackProps) {
  const { t } = useTranslation();
  const [hasError, setHasError] = useState<string[]>([]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.split("?")[1]);

    // Check for error parameters first
    const error = hashParams.get("error");
    const errorMessage = hashParams.get("error_message");

    if (error) {
      // Parse structured error from OAuth callback
      const errors: string[] = [];

      switch (error) {
        case "GOOGLE_EMAIL_NOT_VERIFIED":
          errors.push(t('login.errorGoogleEmailNotVerified'), errorMessage || '');
          break;
        case "INVALID_AUTH_METHOD_GOOGLE":
          errors.push(t('login.errorInvalidAuthMethodGoogle'), errorMessage || '');
          break;
        case "INVALID_AUTH_METHOD_GITHUB":
          errors.push(t('login.errorInvalidAuthMethodGithub'), errorMessage || '');
          break;
        case "INVALID_AUTH_METHOD_MICROSOFT":
          errors.push(t('login.errorInvalidAuthMethodMicrosoft'), errorMessage || '');
          break;
        case "INVALID_AUTH_METHOD_NOSTR":
          errors.push(t('login.errorInvalidAuthMethodNostr'), errorMessage || '');
          break;
        default:
          errors.push(t('login.errorOAuthFailed'), errorMessage || error);
      }

      setHasError(errors.filter(e => e)); // Remove empty strings
      return;
    }

    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    const expiresAt = hashParams.get("expires_at");
    const userId = hashParams.get("user_id");
    const loginMethod = hashParams.get("login_method");

    if (!accessToken || !refreshToken || !expiresAt || !userId) {
      setHasError([t('login.invalidLoginResponse')]);
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
      method: loginMethod,
    } as Session);

    props.loginDoneCb();
  }, [props, t]);

  const ErrorMessage = () => (
    <>
      {hasError.map((error, index) => (
        <Text key={index} c={index === 0 ? "red" : "dimmed"} mb="xs">
          {error}
        </Text>
      ))}
    </>
  );

  return (
    <Box maw={340} mx="auto">
      <Text size="lg" mb="md">
        {t('login.loggingIn')}
      </Text>
      {hasError.length > 0 && <ErrorMessage />}
    </Box>
  );
}