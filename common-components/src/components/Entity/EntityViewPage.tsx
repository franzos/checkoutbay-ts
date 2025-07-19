import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export enum ViewPageMode {
  View = "view",
  Edit = "edit",
  AltView = "altView",
  AltView2 = "altView2",
  AltView3 = "altView3",
}

interface GeneralizedViewPageProps<Entity, Update> {
  DetailComponent: React.ComponentType<{
    item: Entity;
    submitCb: (id: string, item: Update) => Promise<void>;
    deleteCb: (id: string) => Promise<void>;
    reload?: () => Promise<void>;
  }>;
  getFunction: (id: string) => Promise<Entity | undefined>;
  submitCb?: (id: string, item: Update) => Promise<void>;
  deleteCb?: (id: string) => Promise<void>;
  initialViewMode?: ViewPageMode;
}

export function GeneralizedViewPage<Entity, Update>({
  DetailComponent,
  getFunction,
  submitCb,
  deleteCb,
}: GeneralizedViewPageProps<Entity, Update>) {
  const { uuid } = useParams<{ uuid: string }>();
  const [item, setItem] = useState<Entity | undefined>(undefined);

  useEffect(() => {
    const getItem = async () => {
      if (!uuid) {
        return;
      }
      const res = await getFunction(uuid);
      if (res) {
        setItem(res);
      }
    };
    getItem();
  }, [uuid, getFunction]);

  const reload = async () => {
    if (!uuid) {
      return;
    }
    const res = await getFunction(uuid);
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
