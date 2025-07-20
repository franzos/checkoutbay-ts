import { ShopEntityAccessParams } from "@gofranz/common";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export enum ViewPageMode {
  View = "view",
  Edit = "edit",
  AltView = "altView",
  AltView2 = "altView2",
  AltView3 = "altView3",
}

export interface GeneralizedViewPageDetailComponentProps<Entity, Update> {
  item: Entity;
  submitCb: (params: ShopEntityAccessParams, item: Update) => Promise<void>;
  deleteCb?: (params: ShopEntityAccessParams) => Promise<void>;
  reload?: () => Promise<void>;
}

interface GeneralizedViewPageProps<Entity, Update> {
  DetailComponent: React.ComponentType<GeneralizedViewPageDetailComponentProps<Entity, Update>>;
  getFunction: (params: ShopEntityAccessParams) => Promise<Entity | undefined>;
  submitCb?: (params: ShopEntityAccessParams, item: Update) => Promise<void>;
  deleteCb?: (params: ShopEntityAccessParams) => Promise<void>;
  initialViewMode?: ViewPageMode;
}

export function GeneralizedViewPage<Entity, Update>({
  DetailComponent,
  getFunction,
  submitCb,
  deleteCb,
}: GeneralizedViewPageProps<Entity, Update>) {
  const { primary_entity_id, entity_id } = useParams<{ primary_entity_id: string, entity_id: string }>();
  const [item, setItem] = useState<Entity | undefined>(undefined);

  useEffect(() => {
    const getItem = async () => {
      if (!primary_entity_id || !entity_id) {
        return;
      }
      const res = await getFunction({
        primaryEntityId: primary_entity_id,
        entityId: entity_id,
      });
      if (res) {
        setItem(res);
      }
    };
    getItem();
  }, [primary_entity_id, entity_id, getFunction]);

  const reload = async () => {
    if (!primary_entity_id || !entity_id) {
      return;
    }
    const res = await getFunction({
      primaryEntityId: primary_entity_id,
      entityId: entity_id,
    });
    if (res) {
      setItem(res);
    }
  }

  return (
    <>
      {item && (
        <DetailComponent
          item={item}
          submitCb={
            submitCb ||
            (async () => {
              console.log("submitCb not implemented");
            })
          }
          deleteCb={
            deleteCb ||
            (async () => {
              console.log("deleteCb not implemented");
            })
          }
          reload={
            reload ||
            (async () => {
              console.log("reload not implemented");
            })
          }
        />
      )}
    </>
  );
}
