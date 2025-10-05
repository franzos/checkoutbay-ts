import { Card, Text } from '@mantine/core';
import { HttpNewVerifiedEmail, VerifiedEmail, ListResponse } from '@gofranz/common';
import { useEffect, useState } from 'react';
import { CreateVerifiedEmail } from './Create';
import { VerifiedEmailComponent } from './Email';

export interface VerifiedEmailDetailProps {
  submitFormCb: (newForm: HttpNewVerifiedEmail) => Promise<void>;
  deleteCb: (id: string) => Promise<void>;
  verifyCb: (id: string) => Promise<void>;
  setAccountEmailCb: (id: string) => Promise<void>;
  getVerifiedEmails: () => Promise<ListResponse<VerifiedEmail>>;
}

export function VerifiedEmailDetail(props: VerifiedEmailDetailProps) {
  const [isBusy, setIsBusy] = useState(false);
  const [verifiedEmails, setVerifiedEmails] = useState<VerifiedEmail[]>([]);

  useEffect(() => {
    const getVerifiedEmails = async () => {
      setIsBusy(true);
      try {
        const data = await props.getVerifiedEmails();
        setVerifiedEmails(data.data);
      } catch (e) {
        alert(e);
        console.error(e);
      } finally {
        setIsBusy(false);
      }
    };

    getVerifiedEmails();
  }, []);

  const submitCb = async (newEmail: HttpNewVerifiedEmail) => {
    try {
      setIsBusy(true);
      await props.submitFormCb(newEmail);
      const data = await props.getVerifiedEmails();
      setVerifiedEmails(data.data);
    } catch (e) {
      alert(e);
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  };

  const verifyCb = async (id: string) => {
    try {
      setIsBusy(true);
      await props.verifyCb(id);
      const data = await props.getVerifiedEmails();
      setVerifiedEmails(data.data);
    } catch (e) {
      alert(e);
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  };

  const deleteCb = async (id: string) => {
    try {
      setIsBusy(true);
      await props.deleteCb(id);
      const data = await props.getVerifiedEmails();
      setVerifiedEmails(data.data);
    } catch (e) {
      alert(e);
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  };

  const setAccountEmailCb = async (id: string) => {
    try {
      setIsBusy(true);
      await props.setAccountEmailCb(id);
      const data = await props.getVerifiedEmails();
      setVerifiedEmails(data.data);
    } catch (e) {
      alert(e);
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  };

  const Emails = () =>
    verifiedEmails.map((email) => (
      <Card key={email.id} shadow="xs" radius="md" mb="md" withBorder>
        <VerifiedEmailComponent
          key={`verified-email-${email.id}`}
          verifiedEmail={email}
          isBusy={isBusy}
          verifyCb={verifyCb}
          deleteCb={deleteCb}
          setAccountEmailCb={setAccountEmailCb}
        />
      </Card>
    ));

  const EmailsNotFount = () => <Text>No verified emails found.</Text>;

  return (
    <>
      {verifiedEmails.length > 0 ? <Emails /> : <EmailsNotFount />}
      <CreateVerifiedEmail submitFormCb={submitCb} />
    </>
  );
}
