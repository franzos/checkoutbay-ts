import { Address, UpdateAddres } from '@gofranz/checkoutbay-common';
import { CommonTableProps } from '@gofranz/common-components';
import { ActionIcon, Badge, Box, Group, NavLink, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { DataTable } from 'mantine-datatable';
import { useEffect, useState } from 'react';

export function AddressesTable(props: CommonTableProps<Address, UpdateAddres>) {
  const [isBusy, setIsBusy] = useState(false);
  const [records, setRecords] = useState<Address[] | []>([]);
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
      accessor: 'recipient_name',
      title: 'Recipient Name',
      render: (row: Address) => (
        <NavLink
          label={
            <Group>
              <Text>{row.recipient_name}</Text>
              {row.is_default && <Badge color="gray">Default</Badge>}
            </Group>
          }
          onClick={() => props.openRowPage(row)}
        />
      ),
    },
    {
      accessor: 'zip',
      title: 'ZIP',
    },
    {
      accessor: 'country',
      title: 'Country',
    },
    {
      accessor: 'updated_at',
      title: 'Last Updated',
      render: (row: Address) =>
        row.updated_at ? new Date(row.updated_at).toLocaleDateString() : 'N/A',
    },
    {
      accessor: 'actions',
      title: '',
      render: (row: Address) => (
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
        noRecordsText="No addresses found"
      />
    </Box>
  );
}
