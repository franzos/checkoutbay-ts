import { AxiosError } from "axios";

export const getErrorTitle = (error: AxiosError): string => {
  if (error.response) {
    const status = error.response.status;
    switch (status) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Authentication Required';
      case 403:
        return 'Access Denied';
      case 404:
        return 'Not Found';
      case 409:
        return 'Conflict';
      case 422:
        return 'Validation Error';
      case 500:
        return 'Server Error';
      default:
        return `Error ${status}`;
    }
  } else if (error.request) {
    return 'Network Error';
  }
  return 'API Error';
};