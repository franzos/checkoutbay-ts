import { axiosFieldValidationErrorToFormErrors, hasFieldValidationError, ShopEntitiesAccessParams } from '@gofranz/common';
import { Button, Text, Title } from '@mantine/core';
import { FormValidateInput, useForm, UseFormReturnType } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { showWarningNotification } from '../../index';
import { RenderFieldsGeneralProps } from './EntityFormGeneral';

export interface RenderFieldsCreateProps<Create> extends RenderFieldsGeneralProps {
  form: UseFormReturnType<Create>;
  submittedValues?: Create | null;
  isEditing: false; // Not needed for Create
}

export interface EntityFormCreateProps<Create> {
  title: string;
  description?: string;
  initialValues: Create;
  validation: FormValidateInput<Create> | ((values: Create) => FormValidateInput<Create>);
  submitFormCb: (params: ShopEntitiesAccessParams, data: Create) => Promise<void>;
  renderFields: (props: RenderFieldsCreateProps<Create>) => React.ReactNode;
  // For ex. Shop ID, Business ID, Site ID, etc.
  primaryEntityId: string;
}

export function EntityFormCreate<Create>({
  title,
  description,
  initialValues,
  validation,
  submitFormCb,
  renderFields,
  primaryEntityId,
}: EntityFormCreateProps<Create>) {
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState('');

  const setLoading = (loading: boolean) => {
    setIsBusy(loading);
  }

  // Get initial validation or undefined to avoid type issues
  const getInitialValidation = (): FormValidateInput<Create> | undefined => {
    if (typeof validation === 'function') {
      const result = validation(initialValues);
      // Type guard to ensure we return the correct type
      return result as FormValidateInput<Create>;
    }
    return validation;
  };

  const form = useForm({
    mode: 'controlled',
    initialValues: initialValues as Record<string, unknown>,
    validate: getInitialValidation() as FormValidateInput<Record<string, unknown>>,
  });

  const handleFormSubmit = async (values: typeof form.values) => {
    // For dynamic validation functions, manually validate with current values
    if (typeof validation === 'function') {
      const validationRules = validation(values as Create) as FormValidateInput<Create>;

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
    await submitForm({
      primaryEntityId,
    }, values);
  };

  const submitForm = async (params: ShopEntitiesAccessParams, data: typeof form.values) => {
    setIsBusy(true);
    try {
      setSubmittedValues(data);
      await submitFormCb(params, data as Create);
      setError('');
    } catch (e) {
      setError(`${e}`);
      if (hasFieldValidationError(e)) {
        console.log(axiosFieldValidationErrorToFormErrors(e));
        form.setErrors(axiosFieldValidationErrorToFormErrors(e));
      }
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
          form: form as UseFormReturnType<Create>,
          submittedValues: submittedValues as Create | null,
          setParentLoading: setLoading,
          primaryEntityId,
          entityId: undefined, // Not needed for creation
          isEditing: false
        })}
        <Button type="submit" loading={isBusy} disabled={isBusy} mt="xs">
          Create
        </Button>
      </form>
      {error && <Text c="red">{error}</Text>}
    </>
  );
}