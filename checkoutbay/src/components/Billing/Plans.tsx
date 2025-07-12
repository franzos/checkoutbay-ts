import { Table } from '@mantine/core';

const data = [
  {
    kind: 'Cost',
    rusty: '1%',
    shopify: '$324++ / Year',
  },
  {
    kind: 'Card rates',
    rusty: '0% (Stripe)',
    shopify: '2% ++',
  },
  {
    kind: 'Inventory locations',
    rusty: 'Unlimited',
    shopify: 10,
  },
  {
    kind: 'Global selling',
    rusty: 'Unlimited markets',
    shopify: '3 markets',
  },
  {
    kind: 'Users',
    rusty: 'Unlimited',
    shopify: 1,
  },
  {
    kind: 'Shops',
    rusty: 'Unlimited',
    shopify: 1,
  },
  {
    kind: 'Reports',
    rusty: 'Unlimited',
    shopify: 'Unlimited',
  },
  {
    kind: 'API access',
    rusty: 'Unlimited',
    shopify: 'Limited',
  },
  {
    kind: 'B2B',
    rusty: 'Yes',
    shopify: 'No',
  },
  {
    kind: 'Sales forms',
    rusty: 'Rusty Forms',
    shopify: 'Included',
  },
  {
    kind: 'Has FREE plan',
    rusty: 'No; First €500 sales free',
    shopify: 'No',
  },
];

export function Plans() {
  const rows = data.map((element) => (
    <Table.Tr key={`plan-${element.kind}`}>
      <Table.Td>
        <strong>{element.kind}</strong>
      </Table.Td>
      <Table.Td>{element.rusty}</Table.Td>
      <Table.Td>{element.shopify}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th></Table.Th>
            <Table.Th>Checkoutbay</Table.Th>
            <Table.Th>Shopify</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </>
  );
}
