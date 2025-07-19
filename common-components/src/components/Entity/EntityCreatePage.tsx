import { useNavigate } from 'react-router-dom';
import { useLanguageAwareRouting } from '../../hooks';

interface GeneralizedCreatePageProps<Entity, Create> {
  CreateComponent: React.ComponentType<{ submitFormCb: (item: Create) => Promise<void> }>;
  createFunction: (item: Create) => Promise<Entity>;
  redirectPath: (item: Entity) => string;
}

export function GeneralizedCreatePage<Entity, Create>({
  CreateComponent,
  createFunction,
  redirectPath,
}: GeneralizedCreatePageProps<Entity, Create>) {
  const nav = useNavigate();
  const { createLanguageURL } = useLanguageAwareRouting();

  const submit = async (newItem: Create) => {
    const item = await createFunction(newItem);
    nav(createLanguageURL(redirectPath(item)));
  };

  return <CreateComponent submitFormCb={submit} />;
}