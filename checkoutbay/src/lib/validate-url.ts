export function validateUrl(value: string, allowEmpty: boolean = false) {
  if (allowEmpty && value === '') {
    console.log('URL is empty');
    return null;
  } else {
    console.log('URL is not empty');
    return /^(http|https):\/\/[^ "]+$/.test(value) ? null : 'Invalid URL';
  }
}
