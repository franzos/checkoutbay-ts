import {
  Button,
  Center,
  Group,
  Loader,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  LOGIN_METHOD,
  LoginRequest,
  LoginChallenge,
  LoginChallengeUserResponse,
  LoginSuccess,
  decodeNostrPublicKey,
} from "@gofranz/common";
import { IconBrandGoogle, IconBrowser, IconRecordMail } from '@tabler/icons-react';
import { TFunction } from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface StepOneProps {
  googleLogin: () => void;
  nostrLogin: () => void;
  magicLinkLoginChallenge: (email: string) => void;
  isBusy: boolean;
  t: TFunction<"translation", undefined>
}

const StepOne = ({
  googleLogin,
  nostrLogin,
  magicLinkLoginChallenge,
  isBusy,
  t
}: StepOneProps) => {
  const formRequestEmailMagicLink = useForm({
    initialValues: {
      email: "",
    },

    validate: {
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : t("login.invalidEmail"),
    },
  });

  return (
    <Stack>
      <Button type="submit" loading={isBusy} onClick={googleLogin} leftSection={<IconBrandGoogle />} variant='outline'>
        {t("login.googleTab")}
      </Button>
      <Button type="submit" loading={isBusy} onClick={nostrLogin} leftSection={<IconBrowser />} variant='outline'>
        {t("login.nostrTab")}
      </Button>
      <Text c="dimmed" size="sm" mt="md">
        {t("auth.signupLoginEmail")}:
      </Text>
      <form
        onSubmit={formRequestEmailMagicLink.onSubmit(() => magicLinkLoginChallenge(formRequestEmailMagicLink.values.email))}
      >
        <TextInput
          withAsterisk
          label={t("login.emailLabel")}
          placeholder={t("login.emailPlaceholder")}
          {...formRequestEmailMagicLink.getInputProps("email")}
        />
        <Button type="submit" loading={isBusy} mt='xs' w='100%' leftSection={<IconRecordMail />}>
          {t("glob_buttons.login")}
        </Button>
      </form>
    </Stack>
  )
};

interface StepTwoProps {
  loginMethod: LOGIN_METHOD;
  magicLinkLoginChallengeResponse: (response: string) => void;
  setActiveStep: (step: number) => void;
  isBusy: boolean;
  t: TFunction<"translation", undefined>
}

const StepTwo = ({
  loginMethod,
  magicLinkLoginChallengeResponse,
  setActiveStep,
  isBusy,
  t
}: StepTwoProps) => {
  const formResponse = useForm({
    initialValues: {
      challengeResponse: "",
    },

    validate: {
      challengeResponse: (value) => (value ? null : t("login.codeRequired")),
    },
  });

  return (
    <>
      {loginMethod === LOGIN_METHOD.EMAIL_MAGIC_LINK && (
        <form
          onSubmit={formResponse.onSubmit(() => magicLinkLoginChallengeResponse(
            formResponse.values.challengeResponse
          ))}
        >
          <>
            <TextInput
              withAsterisk
              label={t("login.enterCode")}
              placeholder={t("login.codePlaceholder")}
              mb="md"
              {...formResponse.getInputProps("challengeResponse")}
            />
            <Text></Text>
            <Group mb="md">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveStep(0)}
              >
                {t("login.back")}
              </Button>
              <Button
                type="submit"
                loading={isBusy}
              >
                {t("glob_buttons.login")}
              </Button>
            </Group>
            <Text>{t("login.emailInstructions")}</Text>
          </>
        </form>
      )}
      {loginMethod === LOGIN_METHOD.NOSTR && (
        <>
          <Text mb="md">{t("login.nostrInstructions")}</Text>
          <Center>
            <Loader size="xl" />
          </Center>
        </>
      )}
      {loginMethod === LOGIN_METHOD.GOOGLE && (
        <>
          <Text mb="md">{t("login.redirectingGoogle")}</Text>
          <Center>
            <Loader size="xl" />
          </Center>
        </>
      )}
    </>
  )
}


export interface LoginProps {
  login: (loginRequest: LoginRequest) => Promise<LoginChallenge>;
  loginChallenge: (props: LoginChallengeUserResponse) => Promise<LoginSuccess>;
  loginDoneCb: () => void;
}

export function Login(props: LoginProps) {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [loginMethod, setLoginMethod] = useState<LOGIN_METHOD>(
    LOGIN_METHOD.EMAIL_MAGIC_LINK
  );
  const [isBusy, setIsBusy] = useState(false);
  const [hasError, setHasError] = useState<string | null>(null);

  // challenge from API
  const [loginResponse, setLoginResponse] =
    useState<LoginChallenge | null>(null);

  const nostrLogin = async () => {
    setIsBusy(true);
    setLoginMethod(LOGIN_METHOD.NOSTR);
    setHasError(null);
    setActiveStep(1);
    try {
      const publicKey = await (window as any).nostr.getPublicKey();
      if (!publicKey) {
        setHasError(t("login.nostrNoPublicKey"));
        return;
      }
      const challenge = await props.login({
        type: "NOSTR",
        content: {
          public_key: decodeNostrPublicKey(publicKey),
        }
      });
      if (!challenge || challenge.type !== "NOSTR") {
        setHasError(t("login.nostrNoChallenge"));
        return;
      }
      const challengeResponse = await props.loginChallenge({
        type: "NOSTR",
        content: {
          id: (challenge.content as any).id,
          response: await (window as any).nostr.signEvent({
            kind: 22242,
            created_at: Math.floor(Date.now() / 1000),
            tags: [["challenge", (challenge.content as any).challenge]],
            content: "",
          }),
        }
      });
      if (!challengeResponse) {
        setHasError(t("login.nostrNoChallengeResponse"));
        return;
      }
      props.loginDoneCb();
    } catch (e) {
      setHasError(`Error: ${e}`);
      setActiveStep(0);
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  }

  const googleLogin = async () => {
    setIsBusy(true);
    setLoginMethod(LOGIN_METHOD.GOOGLE);
    setHasError(null);
    setActiveStep(1);
    try {
      const googleChallenge = await props.login({
        type: "Google",
        content: {}
      });
      if (!googleChallenge || googleChallenge.type !== "Google") {
        setHasError(t("login.googleNoChallenge"));
        return;
      }
      window.location.href = (googleChallenge.content as any).auth_url;
    } catch (e) {
      setHasError(`Error: ${e}`);
      setActiveStep(0);
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  };

  const magicLinkLoginChallenge = async (email: string) => {
    setIsBusy(true);
    setLoginMethod(LOGIN_METHOD.EMAIL_MAGIC_LINK);
    setHasError(null);
    setActiveStep(1);
    try {
      const emailMagicLinkChallenge = await props.login({
        type: "EmailMagicLink",
        content: {
          email: email
        }
      });
      if (!emailMagicLinkChallenge || emailMagicLinkChallenge.type !== "EmailMagicLink") {
        setHasError(t("login.emailNoChallenge"));
        return;
      }
      setLoginResponse(emailMagicLinkChallenge);
    } catch (e) {
      setHasError(`Error: ${e}`);
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  };

  const magicLinkChallengeResponse = async (response: string) => {
    setIsBusy(true);
    setHasError(null);
    try {
      if (!loginResponse || loginResponse.type !== "EmailMagicLink") {
        setHasError(t("login.emailNoChallenge"));
        return;
      }
      
      const challengeResponse = await props.loginChallenge({
        type: "EmailMagicLink",
        content: {
          id: (loginResponse.content as any).id,
          challenge: response.trim(),
        }
      });
      if (!challengeResponse) {
        setHasError(t("login.emailNoChallengeResponse"));
        return;
      }
      props.loginDoneCb();
    } catch (e) {
      setHasError(`Error: ${e}`);
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  }

  const ErrorMessage = () => (
    <Text c="red" mb="md">
      {hasError}
    </Text>
  );

  return (
    <>
      {activeStep === 0 && (
        <StepOne
          googleLogin={googleLogin}
          nostrLogin={nostrLogin}
          magicLinkLoginChallenge={magicLinkLoginChallenge}
          isBusy={isBusy}
          t={t}
        />
      )}
      {activeStep === 1 && (
        <StepTwo
          loginMethod={loginMethod}
          magicLinkLoginChallengeResponse={magicLinkChallengeResponse}
          setActiveStep={setActiveStep}
          isBusy={isBusy}
          t={t}
        />
      )}
      <ErrorMessage />
    </>
  );
}