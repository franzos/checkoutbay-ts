import { Text, Grid, ActionIcon } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { Discount } from '@gofranz/checkoutbay-common';

export interface DiscountProps {
  discount: Discount;
  isBusy: boolean;
  deleteCb: (discountId: string) => Promise<void>;
}

export function DiscountComponent(props: DiscountProps) {
  const { discount } = props;

  return (
    <Grid>
      <Grid.Col span={3}>
        <Text>{discount.title}</Text>
      </Grid.Col>
      <Grid.Col span={3}>
        <Text>{discount.discount_type}</Text>
      </Grid.Col>
      <Grid.Col span={3}>
        <ActionIcon
          color="red"
          onClick={() => props.deleteCb(discount.id)}
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