import {
  Anchor,
  Button,
  Notification,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { Balance, formatCurrency, LOGIN_METHOD } from '@gofranz/common';
import { VerifiedEmailDetail } from '@gofranz/common-components';
import { useEffect, useState } from 'react';
import { NewDepositForm } from '../../components/Billing/Deposit';
import { useRustyState } from '../../state';

export interface AccountProfilePageProps {
  serviceDomain: string;
  serviceEmail: string;
}

export function AccountProfilePage({ serviceEmail }: AccountProfilePageProps) {
  const api = useRustyState.getState().api;
  const session = useRustyState((state) => state.api?.auth?.getSession());
  const loginMethod = session?.method;
  const publicKey = session?.publicKey;
  // const [privateKey, setPrivateKey] = useState('');
  const [balance, setBalance] = useState<Balance[]>([]);
  const [addMoney, setAddMoney] = useState(false);

  const [depositStatus, setDepositStatus] = useState<'success' | 'cancel' | ''>('');

  useEffect(() => {
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.split('?')[1]);
    const deposit = hashParams.get('deposit');

    if (deposit && (deposit === 'success' || deposit === 'cancel')) {
      setDepositStatus(deposit);
    }

    const getBalance = async () => {
      const res = await api.getAccountBalance();
      setBalance(res);
    };
    getBalance();
  }, []);

  const Balance = (props: { bal: Balance }) => {
    return <Text>{formatCurrency(props.bal)}</Text>;
  };

  const Balances = (props: { balances?: Balance[] }) => {
    if (!props.balances || props.balances.length === 0) {
      return <Text>No balance found.</Text>;
    }
    return (
      <>
        {props.balances.map((bal, index) => (
          <Balance bal={bal} key={`balance-${index}`} />
        ))}
      </>
    );
  };

  const LoginMethodInfo = () => {
    switch (loginMethod) {
      case LOGIN_METHOD.NOSTR:
        return (
          <>
            <TextInput
              label="Public Key"
              type="text"
              id="publicKey"
              name="publicKey"
              value={publicKey}
              readOnly
            />
            <Text size="sm" mb="xs" color="gray">
              Your public key is what identifies you; We store it on our server.
            </Text>
          </>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      {depositStatus === 'success' && (
        <Notification color="green" title="Deposit success" mb="md">
          Your deposit was successful. Card payments should be applied within seconds.
        </Notification>
      )}
      <Title order={2} mb="xs">
        Balance
      </Title>
      {balance && <Balances balances={balance} />}
      {addMoney ? (
        <>
          <Title order={4} mb="xs" mt="md">
            Add Money
          </Title>
          <NewDepositForm onCancelCb={() => setAddMoney(false)} />
          <Text size="sm" mt="xs">
            Want to pay by wire or Bitcoin? (€100+):{' '}
            <Anchor href={`mailto:${serviceEmail}`}>{serviceEmail}</Anchor>
          </Text>
        </>
      ) : (
        <Button onClick={() => setAddMoney(true)} mt="md">
          Add Money
        </Button>
      )}
      <Title order={2} mb="xs" mt="md">
        Personal Information
      </Title>
      <Text>
        We don't really know all that much about you.
        <br /> Send an email to <Anchor href={`mailto:${serviceEmail}`}>{serviceEmail}</Anchor> to
        say hi.
      </Text>
      <Title order={2} mb="xs" mt="md">
        Emails
      </Title>
      <VerifiedEmailDetail
        submitFormCb={api.newVerifiedEmail}
        deleteCb={api.deleteVerifiedEmail}
        verifyCb={api.verifyVerifiedEmail}
        setAccountEmailCb={api.setAccountEmail}
        getVerifiedEmails={api.getVerifiedEmails}
      />
      <Title order={2} mb="xs" mt="md">
        Login Information
      </Title>
      <Text mb="md">
        You are currently logged in with <b>{loginMethod}</b>.
      </Text>
      {LoginMethodInfo()}
    </>
  );
}
