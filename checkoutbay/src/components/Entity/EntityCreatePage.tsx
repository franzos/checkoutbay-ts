import { useNavigate } from 'react-router-dom';
import { useLanguageAwareRouting } from '@gofranz/common-components';

interface GeneralizedCreatePageProps<T> {
  CreateComponent: React.ComponentType<{ submitFormCb: (item: Partial<T>) => Promise<void> }>;
  createFunction: (item: Partial<T>) => Promise<T>;
  redirectPath: (item: T) => string;
}

export function GeneralizedCreatePage<T>({
  CreateComponent,
  createFunction,
  redirectPath,
}: GeneralizedCreatePageProps<T>) {
  const nav = useNavigate();
  const { createLanguageURL } = useLanguageAwareRouting();

  const submit = async (newItem: Partial<T>) => {
    const item = await createFunction(newItem);
    nav(createLanguageURL(redirectPath(item)));
  };

  return <CreateComponent submitFormCb={submit} />;
}