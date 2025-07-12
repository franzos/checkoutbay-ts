import { FormValidateInput, useForm, UseFormReturnType } from '@mantine/form';
import { useState } from 'react';
import { Button, Text, Title } from '@mantine/core';

export interface RenderFieldsProps<T> {
  form: UseFormReturnType<Partial<T>>;
  submittedValues?: any;
  setParentLoading: (loading: boolean) => void;
  shopId: string,
  isEdit?: boolean;
}

export interface EntityFormProps<T> {
  id?: string;
  title: string;
  description?: string;
  initialValues: Partial<T>;
  validation: FormValidateInput<Partial<T>> | undefined;
  submitFormCb: (data: Partial<T>, id?: string) => Promise<void>;
  renderFields: (props: RenderFieldsProps<T>) => React.ReactNode;
  shopId: string;
  isEdit?: boolean;
}

export function EntityForm<T>({
  title,
  description,
  initialValues,
  validation,
  submitFormCb,
  id,
  renderFields,
  shopId,
  isEdit = false,
}: EntityFormProps<T>) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');

  const setLoading = (loading: boolean) => {
    setIsBusy(loading);
  }

  const form = useForm({
    mode: 'uncontrolled',
    initialValues,
    validate: validation,
  });

  const submitForm = async (data: typeof form.values) => {
    setIsBusy(true);
    try {
      setSubmittedValues(data);
      await submitFormCb(data, id);
      setError('');
    } catch (e) {
      setError(`${e}`);
      console.error(e);
    } finally {
      setIsBusy(false);
    }
  };

  const [submittedValues, setSubmittedValues] = useState<typeof form.values | null>(null);

  return (
    <>
      <Title order={3}>{title}</Title>
      {description && <Text>{description}</Text>}
      
      <form onSubmit={form.onSubmit(submitForm)}>
        {renderFields({
          form, 
          submittedValues,
          setParentLoading: setLoading,
          shopId,
          isEdit
        })}
        <Button type="submit" loading={isBusy} disabled={isBusy} mt="xs">
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </form>
      {error && <Text c="red">{error}</Text>}
    </>
  );
}