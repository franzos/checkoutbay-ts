import { Order, formatPrice } from '@gofranz/checkoutbay-common';
import { CommonTableProps } from '@gofranz/common-components';
import { ActionIcon, Box, Group, NavLink, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';


export function OrdersTable(props: CommonTableProps<Order, undefined>) {
  const [isBusy, setIsBusy] = useState(false);
  const [records, setRecords] = useState<Order[] | []>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const doIt = async () => {
      setIsBusy(true);
      try {
        const records = await props.onChange({
          nextPage: page,
        });
        setRecords(records);
      } catch (e) {
        alert(e);
        console.error(e);
      } finally {
        setIsBusy(false);
      }
    };
    doIt();
  }, [page]);

  const deleteCb = async (entityId: string) => {
    if (!props.deleteCb) {
      alert('Delete callback is not defined');
      return;
    }
    setIsBusy(true);
    await props.deleteCb({
      primaryEntityId: props.primaryEntityId,
      entityId,
    });
    setRecords((prev) => {
      return prev.filter((m) => m.id !== entityId);
    });
    setIsBusy(false);
  };

  const columns = [
    {
      accessor: 'status',
      title: 'Status',
      render: (row: Order) => (
        <NavLink
          label={
            <Group>
              <Text>{row.status.toUpperCase()}</Text>
            </Group>
          }
          onClick={() => props.openRowPage(row)}
        />
      ),
    },
    {
      accessor: 'total',
      title: 'Total',
      render: (row: Order) => <Text>{formatPrice(row.total, row.currency)}</Text>,
    },
    {
      accessor: 'updated_at',
      title: 'Last Updated',
      render: (row: Order) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      accessor: 'actions',
      title: '',
      render: (row: Order) => (
        <ActionIcon
          color="red"
          onClick={() => deleteCb(row.id)}
          loading={isBusy}
          variant="filled"
          aria-label="Delete"
        >
          <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
        </ActionIcon>
      ),
    },
  ];

  return (
    <Box>
      <DataTable
        borderRadius="md"
        shadow="xs"
        withTableBorder
        records={records}
        columns={columns}
        totalRecords={props.pagination.total}
        recordsPerPage={props.pagination.perPage}
        page={page}
        onPageChange={(p) => setPage(p)}
        fetching={isBusy}
        loadingText="Loading..."
        noRecordsText="No orders found"
      />
    </Box>
  );
}
