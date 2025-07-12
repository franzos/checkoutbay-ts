import { Text, Grid, ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { Product } from '@gofranz/checkoutbay-common';

export interface ProductProps {
  product: Product;
  isBusy: boolean;
  deleteCb: (productId: string) => Promise<void>;
}

export function ProductComponent(props: ProductProps) {
  const { product } = props;

  return (
    <Grid>
      <Grid.Col span={3}>
        <Text>{product.title}</Text>
      </Grid.Col>
      <Grid.Col span={3}>
        <Text>{product.data}</Text>
      </Grid.Col>
      <Grid.Col span={3}>
        <ActionIcon
          color="red"
          onClick={() => props.deleteCb(product.id)}
          loading={props.isBusy}
          variant="filled"
          aria-label="Delete"
        >
          <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      </Grid.Col>
    </Grid>
  );
}
