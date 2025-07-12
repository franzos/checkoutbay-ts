import { ActionIcon, Button, Grid, Group, Text } from '@mantine/core';
import { VerifiedEmail } from '@gofranz/common';
import { IconTrash, IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import { IsVerified } from '../Common/Verified';

export interface VerifiedEmailProps {
  verifiedEmail: VerifiedEmail;
  isBusy: boolean;
  verifyCb: (id: string) => Promise<void>;
  deleteCb: (id: string) => Promise<void>;
}

export function VerifiedEmailComponent(props: VerifiedEmailProps) {
  const [message, setMessage] = useState<string>('');
  const { verifiedEmail } = props;

  const verifyCb = async (id: string) => {
    await props.verifyCb(id);
    setMessage('Verification email sent. Check your inbox.');
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
              {verifiedEmail.is_account_email && <IconUser size={10} />} {verifiedEmail.email}
            </Text>
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
                Resend verification
              </Button>
            )}
          </Group>
        </Grid.Col>
      </Grid>
      {message !== '' && <Text>{message}</Text>}
    </>
  );
}
