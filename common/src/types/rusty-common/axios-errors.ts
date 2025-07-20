import { AxiosError, AxiosResponse } from "axios"
import { FieldValidationErrorResponse, FieldValidationError } from "./generated"

/**
 * Extended Axios error interface that includes validation error response data.
 * This interface ensures that the response contains a FieldValidationErrorResponse with validation errors.
 */
export interface AxiosFieldValidationErrorResponse extends AxiosError {
    response: AxiosResponse<FieldValidationErrorResponse, any>
}

/**
 * Type guard to determine if an error contains validation errors.
 * 
 * @param error - The error object to check
 * @returns true if the error is an Axios error with validation errors, false otherwise
 */
export function hasFieldValidationError(error: any): error is AxiosFieldValidationErrorResponse {
    return Boolean(
        error?.isAxiosError &&
        error?.response?.data?.error === "validation_error"
    );
}

/**
 * Converts an Axios validation error response into a form-friendly error object.
 * Maps field validation errors to a key-value object where the key is the field name
 * and the value is the error message.
 * 
 * @param validationError - The Axios validation error to convert
 * @returns A record mapping field names to their error messages
 */
export function axiosFieldValidationErrorToFormErrors(
    validationError: AxiosFieldValidationErrorResponse
): Record<string, string> {
    const responseData = validationError.response?.data;

    if (responseData.error !== "validation_error") {
        return {};
    }

    const formErrors: Record<string, string> = {};

    responseData.errors.forEach((fieldError: FieldValidationError) => {
        if (fieldError.field && fieldError.message) {
            formErrors[fieldError.field] = fieldError.message;
        }
    });

    return formErrors;
}
