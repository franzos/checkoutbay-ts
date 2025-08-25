import {
  LOGIN_METHOD,
  LoginChallenge,
  LoginChallengeUserResponse,
  LoginRequest,
  LoginSuccess,
  decodeNostrPublicKey,
} from "@gofranz/common";
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
import { IconBrandGithub, IconBrandGoogle, IconBrandWindows, IconBrowser, IconRecordMail } from '@tabler/icons-react';
import { TFunction } from 'i18next';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface StepOneProps {
  googleLogin: () => void;
  githubLogin: () => void;
  microsoftLogin: () => void;
  nostrLogin: () => void;
  magicLinkLoginChallenge: (email: string) => void;
  loginMethods?: LOGIN_METHOD[]
  isBusy: boolean;
  t: TFunction<"translation", undefined>
}

const StepOne = ({
  googleLogin,
  githubLogin,
  microsoftLogin,
  nostrLogin,
  magicLinkLoginChallenge,
  loginMethods,
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

  const hasGoogleLogin = loginMethods?.includes(LOGIN_METHOD.GOOGLE);
  const hasGithubLogin = loginMethods?.includes(LOGIN_METHOD.GITHUB);
  const hasMicrosoftLogin = loginMethods?.includes(LOGIN_METHOD.MICROSOFT);
  const hasNostrLogin = loginMethods?.includes(LOGIN_METHOD.NOSTR);
  const hasEmailMagicLinkLogin = loginMethods?.includes(LOGIN_METHOD.EMAIL_MAGIC_LINK);

  return (
    <Stack>
      {hasGoogleLogin && 
      <Button type="submit" loading={isBusy} onClick={googleLogin} leftSection={<IconBrandGoogle />} variant='outline'>
        {t("login.googleTab")}
      </Button>
      }
      {hasGithubLogin &&
      <Button type="submit" loading={isBusy} onClick={githubLogin} leftSection={<IconBrandGithub />} variant='outline'>
        {t("login.githubTab")}
      </Button>
      }
      {hasMicrosoftLogin &&
      <Button type="submit" loading={isBusy} onClick={microsoftLogin} leftSection={<IconBrandWindows />} variant='outline'>
        {t("login.microsoftTab")}
      </Button>
      }
      {hasNostrLogin && 
      <Button type="submit" loading={isBusy} onClick={nostrLogin} leftSection={<IconBrowser />} variant='outline'>
        {t("login.nostrTab")}
      </Button>
      }
      {hasEmailMagicLinkLogin &&
        <>
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
        </>
      }
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
      {loginMethod === LOGIN_METHOD.GITHUB && (
        <>
          <Text mb="md">{t("login.redirectingGithub")}</Text>
          <Center>
            <Loader size="xl" />
          </Center>
        </>
      )}
      {loginMethod === LOGIN_METHOD.MICROSOFT && (
        <>
          <Text mb="md">{t("login.redirectingMicrosoft")}</Text>
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
  loginMethods?: LOGIN_METHOD[]
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
        type: LOGIN_METHOD.GOOGLE,
        content: {}
      });
      if (!googleChallenge || googleChallenge.type !== LOGIN_METHOD.GOOGLE) {
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

  const githubLogin = async () => {
    setIsBusy(true);
    setLoginMethod(LOGIN_METHOD.GITHUB);
    setHasError(null);
    setActiveStep(1);
    try {
      const githubChallenge = await props.login({
        type: LOGIN_METHOD.GITHUB,
        content: {}
      });
      if (!githubChallenge || githubChallenge.type !== LOGIN_METHOD.GITHUB) {
        setHasError(t("login.githubNoChallenge"));
        return;
      }
      window.location.href = (githubChallenge.content as any).auth_url;
    } catch (e) {
      setHasError(`Error: ${e}`);
      setActiveStep(0);
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  };

  const microsoftLogin = async () => {
    setIsBusy(true);
    setLoginMethod(LOGIN_METHOD.MICROSOFT);
    setHasError(null);
    setActiveStep(1);
    try {
      const microsoftChallenge = await props.login({
        type: LOGIN_METHOD.MICROSOFT,
        content: {}
      });
      if (!microsoftChallenge || microsoftChallenge.type !== LOGIN_METHOD.MICROSOFT) {
        setHasError(t("login.microsoftNoChallenge"));
        return;
      }
      window.location.href = (microsoftChallenge.content as any).auth_url;
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
        type: LOGIN_METHOD.EMAIL_MAGIC_LINK,
        content: {
          email: email
        }
      });
      if (!emailMagicLinkChallenge || emailMagicLinkChallenge.type !== LOGIN_METHOD.EMAIL_MAGIC_LINK) {
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
      if (!loginResponse || loginResponse.type !== LOGIN_METHOD.EMAIL_MAGIC_LINK) {
        setHasError(t("login.emailNoChallenge"));
        return;
      }
      
      const challengeResponse = await props.loginChallenge({
        type: LOGIN_METHOD.EMAIL_MAGIC_LINK,
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
          githubLogin={githubLogin}
          microsoftLogin={microsoftLogin}
          nostrLogin={nostrLogin}
          magicLinkLoginChallenge={magicLinkLoginChallenge}
          loginMethods={props.loginMethods}
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