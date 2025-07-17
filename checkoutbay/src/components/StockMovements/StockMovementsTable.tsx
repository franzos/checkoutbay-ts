import { StockMovement, UpdateStockMovement } from '@gofranz/checkoutbay-common';
import { ActionIcon, Badge, Box, Group, NavLink, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { CommonTableProps } from '../../lib/table';

export function StockMovementsTable(
  props: CommonTableProps<StockMovement, UpdateStockMovement>
) {
  const [isBusy, setIsBusy] = useState(false);
  const [records, setRecords] = useState<StockMovement[] | []>([]);
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

  const deleteCb = async (id: string) => {
    if (!props.deleteCb) {
      alert('Delete callback is not defined');
      return;
    }
    setIsBusy(true);
    await props.deleteCb(id);
    setRecords((prev) => {
      return prev.filter((m) => m.id !== id);
    });
    setIsBusy(false);
  };

  const columns = [
    {
      accessor: 'title',
      title: 'Reason',
      render: (row: StockMovement) => (
        <NavLink
          label={
            <Group>
              <Text>{row.reason}</Text>
            </Group>
          }
          onClick={() => props.openRowPage(row)}
        />
      ),
    },
    {
      accessor: 'quantity',
      title: 'Quantity',
      render: (row: StockMovement) => (
        <Group>
          {row.quantity > 0 ? (
            <Badge color="green">+{row.quantity}</Badge>
          ) : (
            <Badge color="red">{row.quantity}</Badge>
          )}
        </Group>
      ),
    },
    {
      accessor: 'reference',
      title: 'Reference',
    },
    {
      accessor: 'updated_at',
      title: 'Last Updated',
      render: (row: StockMovement) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A',
    },
    {
      accessor: 'actions',
      title: '',
      render: (row: StockMovement) => (
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
        noRecordsText="No stock movements found"
      />
    </Box>
  );
}
