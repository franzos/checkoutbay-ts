import { Text, Title } from '@mantine/core';

export interface RenderEntityProps<T> {
  data: T;
  reload?: () => Promise<void>;
  setParentLoading: (loading: boolean) => void;
}

export interface EntityProps<T> {
  title: string;
  description?: string;
  data: T;
  id?: string;
  render: (props: RenderEntityProps<T>) => React.ReactNode;
  reload?: () => Promise<void>;
}

export function Entity<T>({
  title,
  description,
  data,
  render,
  reload,
}: EntityProps<T>) {
  return (
    <>
      <Title order={3}>{title}</Title>
      {description && <Text>{description}</Text>}

      {render({data, setParentLoading: () => {}, reload})}
    </>
  );
}