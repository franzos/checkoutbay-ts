import { ActionIcon, Badge, Button, Grid, Group, Text } from '@mantine/core';
import { VerifiedEmail } from '@gofranz/common';
import { IconTrash, IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import { IsVerified } from '../Common/Verified';
import { useTranslation } from 'react-i18next';

export interface VerifiedEmailProps {
  verifiedEmail: VerifiedEmail;
  isBusy: boolean;
  verifyCb: (id: string) => Promise<void>;
  deleteCb: (id: string) => Promise<void>;
  setAccountEmailCb: (id: string) => Promise<void>;
}

export function VerifiedEmailComponent(props: VerifiedEmailProps) {
  const { t } = useTranslation();
  const [message, setMessage] = useState<string>('');
  const { verifiedEmail } = props;

  const verifyCb = async (id: string) => {
    await props.verifyCb(id);
    setMessage(t('emails.verificationSent'));
  };

  const setAccountEmailCb = async (id: string) => {
    await props.setAccountEmailCb(id);
    setMessage(t('emails.accountEmailUpdated'));
  };

  return (
    <>
      <Grid>
        <Grid.Col span={5}>
          <Group>
            <ActionIcon
              color="red"
              onClick={() => props.deleteCb(verifiedEmail.id)}
              loading={props.isBusy}
              variant="filled"
              aria-label="Delete"
            >
              <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
            </ActionIcon>
            <Text>
              {verifiedEmail.email}
            </Text>
            {verifiedEmail.is_account_email && (
              <Badge color="blue" variant="light" leftSection={<IconUser size={12} />}>
                {t('emails.accountEmail')}
              </Badge>
            )}
          </Group>
        </Grid.Col>
        <Grid.Col span="auto">
          <Group>
            <IsVerified isVerified={verifiedEmail.is_verified} />
            {verifiedEmail.is_verified === false && (
              <Button
                onClick={() => verifyCb(verifiedEmail.id)}
                loading={props.isBusy}
                variant="outline"
              >
                {t('emails.resendVerification')}
              </Button>
            )}
            {verifiedEmail.is_verified && !verifiedEmail.is_account_email && (
              <Button
                onClick={() => setAccountEmailCb(verifiedEmail.id)}
                loading={props.isBusy}
                variant="outline"
                size="xs"
              >
                {t('emails.makePrimary')}
              </Button>
            )}
          </Group>
        </Grid.Col>
      </Grid>
      {verifiedEmail.is_account_email && (
        <Text size="xs" c="dimmed" mt="xs">
          {t('emails.accountEmailDescription')}
        </Text>
      )}
      {message !== '' && <Text size="sm" c="green" mt="xs">{message}</Text>}
    </>
  );
}
