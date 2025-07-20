import { Button, Text, Title } from '@mantine/core';
import { FormValidateInput, useForm, UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { showWarningNotification } from '../../index';
import { RenderFieldsGeneralProps } from './EntityFormGeneral';
import { ShopEntityAccessParams } from '@gofranz/common';

export interface RenderFieldsEditProps<Edit> extends RenderFieldsGeneralProps {
  form: UseFormReturnType<Edit>;
  submittedValues?: Edit | null;
  entityId: string; // Required for Edit
  isEditing: true;
}

export interface EntityFormEditProps<Edit> {
  id: string;
  title: string;
  description?: string;
  initialValues: Edit;
  validation: FormValidateInput<Edit> | ((values: Edit) => FormValidateInput<Edit>);
  submitFormCb: (params: ShopEntityAccessParams, data: Edit) => Promise<void>;
  renderFields: (props: RenderFieldsEditProps<Edit>) => React.ReactNode;
  primaryEntityId: string;
}

export function EntityFormEdit<Edit>({
  title,
  description,
  initialValues,
  validation,
  submitFormCb,
  id,
  renderFields,
  primaryEntityId
}: EntityFormEditProps<Edit>) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');

  const setLoading = (loading: boolean) => {
    setIsBusy(loading);
  }

  // Convert Entity to Edit by extracting only the editable fields
  const convertEntityToEdit = (entity: Edit): Edit => {
    // Since Edit is a subset of Entity, we can safely extract the Edit fields
    return entity as unknown as Edit;
  };

  // Get initial validation or undefined to avoid type issues
  const getInitialValidation = (): FormValidateInput<Record<string, unknown>> | undefined => {
    if (typeof validation === 'function') {
      const editValues = convertEntityToEdit(initialValues);
      const result = validation(editValues);
      // Type guard to ensure we return the correct type
      return result as FormValidateInput<Record<string, unknown>>;
    }
    return validation as FormValidateInput<Record<string, unknown>>;
  };

  const form = useForm({
    mode: 'controlled',
    initialValues: convertEntityToEdit(initialValues) as Record<string, unknown>,
    validate: getInitialValidation(),
  });

  const handleFormSubmit = (values: typeof form.values) => {
    // For dynamic validation functions, manually validate with current values
    if (typeof validation === 'function') {
      const validationRules = validation(values as Edit);
      
      const errors: Record<string, string> = {};
      // Manually validate each field
      if (validationRules) {
        Object.entries(validationRules).forEach(([fieldName, validator]) => {
          if (validator && typeof validator === 'function') {
            const fieldValue = (values as Record<string, unknown>)[fieldName];
            const error = validator(fieldValue);
            if (error) {
              errors[fieldName] = error;
            }
          }
        });
      }
      
      if (Object.keys(errors).length > 0) {
        // Set errors on form
        form.setErrors(errors);
        
        // Show notification to guide user
        showWarningNotification(
          'Validation Error',
          'Please fix the highlighted fields and try again.',
          notifications
        );
        return; // Don't proceed with submission
      }
    } else {
      // For static validation, use form's built-in validation
      const validationResult = form.validate();
      
      if (validationResult.hasErrors) {
        // Show notification to guide user
        showWarningNotification(
          'Validation Error',
          'Please fix the highlighted fields and try again.',
          notifications
        );
        return; // Don't proceed with submission
      }
    }

    // Proceed with actual submission
    submitForm(values);
  };

  const submitForm = async (data: typeof form.values) => {
    setIsBusy(true);
    try {
      setSubmittedValues(data);
      await submitFormCb({
        primaryEntityId,
        entityId: id
      }, data as Edit);
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
      
      <form onSubmit={form.onSubmit(handleFormSubmit)}>
        {renderFields({
          form: form as UseFormReturnType<Edit>,
          submittedValues: submittedValues as Edit | null,
          setParentLoading: setLoading,
          primaryEntityId,
          entityId: id,
          isEditing: true
        })}
        <Button type="submit" loading={isBusy} disabled={isBusy} mt="xs">
          Update
        </Button>
      </form>
      {error && <Text c="red">{error}</Text>}
    </>
  );
}