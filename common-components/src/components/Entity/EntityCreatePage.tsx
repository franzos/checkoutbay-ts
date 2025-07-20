import { useNavigate } from 'react-router-dom';
import { useLanguageAwareRouting } from '../../hooks';
import { ShopEntitiesAccessParams } from '@gofranz/common';

export interface GeneralizedCreatePageProps<Entity, Create> {
  CreateComponent: React.ComponentType<{ submitFormCb: (params: ShopEntitiesAccessParams, item: Create) => Promise<void> }>;
  createFunction: (params: ShopEntitiesAccessParams, item: Create) => Promise<Entity>;
  redirectPath: (item: Entity) => string;
}

export function GeneralizedCreatePage<Entity, Create>({
  CreateComponent,
  createFunction,
  redirectPath,
}: GeneralizedCreatePageProps<Entity, Create>) {
  const nav = useNavigate();
  const { createLanguageURL } = useLanguageAwareRouting();

  const submit = async (params: ShopEntitiesAccessParams, newItem: Create) => {
    const item = await createFunction(params, newItem);
    nav(createLanguageURL(redirectPath(item)));
  };

  return <CreateComponent submitFormCb={submit} />;
}