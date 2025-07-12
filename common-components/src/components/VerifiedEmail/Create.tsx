import { Button, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { HttpNewVerifiedEmail } from '@gofranz/common';
import { useState } from 'react';

export interface CreateVerifiedEmailProps {
  submitFormCb: (newEmail: HttpNewVerifiedEmail) => Promise<void>;
}

export function CreateVerifiedEmail(props: CreateVerifiedEmailProps) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');

  const form = useForm({
    initialValues: {
      email: '',
    },
    validate: {
      email: (value) =>
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value) ? null : 'Invalid Email',
    },
  });

  const submitForm = async () => {
    const newEmail = {
      email: form.values.email,
    };
    setIsBusy(true);
    try {
      await props.submitFormCb(newEmail);
      form.reset();
    } catch (e) {
      setError(`Error: ${e}`);
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <>
      <form onSubmit={form.onSubmit(submitForm)}>
        <TextInput
          label="Email"
          placeholder="Email"
          value={form.values.email}
          onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
          error={form.errors.email && 'Invalid Email'}
          mb="md"
        />
        <Button type="submit" loading={isBusy}>
          Verify
        </Button>
      </form>
      {error && <Text color="red">{error}</Text>}
    </>
  );
}
