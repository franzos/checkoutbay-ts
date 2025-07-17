import { useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { Box, NavLink, ActionIcon, Group, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { PaymentGateway } from '@gofranz/checkoutbay-common';
import { CommonTableProps } from '../../lib/table';

export function PaymentMethodsTable(
  props: CommonTableProps<PaymentGateway, Partial<PaymentGateway>>
) {
  const [isBusy, setIsBusy] = useState(false);
  const [records, setRecords] = useState<PaymentGateway[] | []>([]);
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
      title: 'Payment Method',
      render: (row: PaymentGateway) => (
        <NavLink
          label={
            <Group>
              <Text>{row.title}</Text>
            </Group>
          }
          onClick={() => props.openRowPage(row)}
        />
      ),
    },
    {
      accessor: 'provider_config',
      title: 'Provider',
      render: (row: PaymentGateway) => row.provider_config.type,
    },
    {
      accessor: 'updated_at',
      title: 'Last Updated',
      render: (row: PaymentGateway) =>
        row.created_at ? new Date(row.created_at).toLocaleDateString() : 'N/A',
    },
    {
      accessor: 'actions',
      title: '',
      render: (row: PaymentGateway) => (
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
        noRecordsText="No payment methods found"
      />
    </Box>
  );
}
