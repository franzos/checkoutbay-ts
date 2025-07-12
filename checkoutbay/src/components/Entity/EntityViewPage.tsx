import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface GeneralizedViewPageProps<T> {
  DetailComponent: React.ComponentType<{
    item: T;
    submitCb: (id: string, item: Partial<T>) => Promise<void>;
    deleteCb: (id: string) => Promise<void>;
    reload?: () => Promise<void>;
  }>;
  getFunction: (id: string) => Promise<T | undefined>;
  submitCb?: (id: string, item: Partial<T>) => Promise<void>;
  deleteCb?: (id: string) => Promise<void>;
}

export function GeneralizedViewPage<T>({
  DetailComponent,
  getFunction,
  submitCb,
  deleteCb,
}: GeneralizedViewPageProps<T>) {
  const { uuid } = useParams<{ uuid: string }>();
  const [item, setItem] = useState<T | undefined>(undefined);

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
