import { Session } from '@gofranz/common';
import {
  Alert,
  Button,
  Card,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';

import { IconCheck } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SupportFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SupportPageProps {
  session: Session | undefined;
  formSubmissionEndpoint?: string;
  serviceName?: string;
}

// This will be populated in the component since we need access to t()
let SUBJECT_OPTIONS: { value: string; label: string }[] = [];

export function SupportPage({
  session,
  formSubmissionEndpoint = 'https://api.formshive.com/v1/digest/2ce22659-397b-412c-abe8-a64ce53dc4a0',
  serviceName = 'Formshive'
}: SupportPageProps) {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  // Initialize subject options with translations
  SUBJECT_OPTIONS = [
    { value: 'general', label: t('support.types.general') },
    { value: 'technical', label: t('support.types.technical') },
    { value: 'feature', label: t('support.types.feature') },
    { value: 'bug', label: t('support.types.bug') },
  ];

  const loginMethod = session?.method;
  const publicKey = session?.publicKey;

  // Check if user is logged in with email method
  const isEmailLogin = loginMethod === 'EMAIL_MAGIC_LINK';
  const userEmail = isEmailLogin ? (session as any)?.email || '' : '';

  const form = useForm<SupportFormData>({
    initialValues: {
      name: '',
      email: userEmail,
      subject: '',
      message: '',
    },
    validate: {
      email: (value) => (!isEmailLogin && !/^\S+@\S+$/.test(value) ? t('forms.invalidUrl') : null),
      subject: (value) => (value.trim().length > 0 ? null : 'Subject is required'),
      message: (value) => (value.trim().length > 0 ? null : 'Message is required'),
    },
  });

  // Update email when userEmail changes
  useEffect(() => {
    if (isEmailLogin && userEmail) {
      form.setFieldValue('email', userEmail);
    }
  }, [userEmail, isEmailLogin]);

  const handleSubmit = async (values: SupportFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', isEmailLogin ? userEmail : values.email);
      formData.append('subject', values.subject);
      formData.append('message', values.message);
      formData.append('login_method', loginMethod || 'unknown');
      formData.append('user_identifier', publicKey || 'unknown');

      const response = await fetch(
        formSubmissionEndpoint,
        {
          method: 'POST',
          body: formData,
          redirect: 'manual',
        }
      );

      if (response.ok) {
        form.reset();
        setShowSuccessAlert(true);
        // Hide alert and show success page after 3 seconds
        setTimeout(() => {
          setShowSuccessAlert(false);
          setIsSubmitted(true);
        }, 3000);
      } else {
        throw new Error('Failed to submit form');
      }
    } catch (error) {
      // Keep error notification for now, or you can replace this with an error alert state too
      console.error('Failed to submit support request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Title order={2} mb="md">
          {t('support.title')}
        </Title>
        <Stack>
          <Card shadow="xs" padding="lg" radius="md" withBorder>
            <Stack align="center" gap="md">
              <IconCheck size={48} color="green" />
              <Title order={2} ta="center">
                {t('support.thankYou')}
              </Title>
              <Text ta="center" size="lg">
                {t('support.successMessage')}
              </Text>
              <Button onClick={() => setIsSubmitted(false)} variant="light">
                {t('support.submitAnother')}
              </Button>
            </Stack>
          </Card>
        </Stack>
      </>
    );
  }

  return (
    <>
      <Title order={2} mb="md">
        {t('support.title')}
      </Title>
      <Stack>

        <Card shadow="xs" padding="lg" radius="md" withBorder>
          <Title order={2} mb="md">
            {t('support.getHelp', { serviceName })}
          </Title>
          <Text mb="lg" c="dimmed">
            {t('support.description')}
          </Text>

          {showSuccessAlert && (
            <Alert color="green" variant="light" icon={<IconCheck size={16} />} mb="md">
              <Text fw={500}>{t('support.successAlert')}</Text>
              <Text size="sm">{t('support.successAlertMessage')}</Text>
            </Alert>
          )}

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <Group grow>
                <TextInput
                  label={t('support.nameLabel')}
                  placeholder={t('support.namePlaceholder')}
                  {...form.getInputProps('name')}
                />
                {!isEmailLogin && (
                  <TextInput
                    label={t('support.emailLabel')}
                    placeholder={t('support.emailPlaceholder')}
                    type="email"
                    required
                    {...form.getInputProps('email')}
                  />
                )}
                {isEmailLogin && (
                  <TextInput
                    label={t('support.emailLabel')}
                    value={userEmail}
                    readOnly
                    description={t('support.loggedInEmail')}
                  />
                )}
              </Group>

              <Select
                label={t('support.subjectLabel')}
                placeholder={t('support.subjectPlaceholder')}
                data={SUBJECT_OPTIONS}
                required
                {...form.getInputProps('subject')}
              />

              <Textarea
                label={t('support.messageLabel')}
                placeholder={t('support.messagePlaceholder')}
                minRows={4}
                required
                {...form.getInputProps('message')}
              />

              <Alert color="blue" variant="light">
                <Text size="sm">
                  {t('support.formInfo')}
                  {loginMethod || 'unknown'}
                  {t('support.formInfoEnd')}
                </Text>
              </Alert>

              <Group justify="flex-end">
                <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
                  {isSubmitting ? t('support.submitting') : t('support.submitButton')}
                </Button>
              </Group>
            </Stack>
          </form>
        </Card>
      </Stack>
    </>
  );
}
