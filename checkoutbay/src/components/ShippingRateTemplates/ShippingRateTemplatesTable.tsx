import { useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { Box, NavLink, ActionIcon, Group, Text, Badge, Stack } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import {
  ShippingRateTemplate,
  ShippingSpeed,
  ShippingRateCalculationMethod,
  formatPrice,
} from '@gofranz/checkoutbay-common';
import { CommonTableProps } from '../../lib/table';
import Decimal from 'decimal.js';

export function ShippingRateTemplatesTable(
  props: CommonTableProps<ShippingRateTemplate, Partial<ShippingRateTemplate>>
) {
  const [isBusy, setIsBusy] = useState(false);
  const [records, setRecords] = useState<ShippingRateTemplate[] | []>([]);
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

  const formatMethodLabel = (method: ShippingRateCalculationMethod) => {
    return method
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatSpeedLabel = (speed: ShippingSpeed) => {
    return speed.charAt(0).toUpperCase() + speed.slice(1);
  };

  const columns = [
    {
      accessor: 'title',
      title: 'Title',
      render: (row: ShippingRateTemplate) => (
        <NavLink
          label={
            <Group>
              <Text>{row.title || 'Untitled'}</Text>
            </Group>
          }
          onClick={() => props.openRowPage(row)}
        />
      ),
    },
    {
      accessor: 'method',
      title: 'Calculation Method',
      render: (row: ShippingRateTemplate) => (
        <Badge color="primary">{formatMethodLabel(row.method)}</Badge>
      ),
    },
    {
      accessor: 'service_level',
      title: 'Service Level',
      render: (row: ShippingRateTemplate) => (
        <Badge color={row.service_level === ShippingSpeed.Express ? 'green' : 'gray'}>
          {formatSpeedLabel(row.service_level)}
        </Badge>
      ),
    },
    {
      accessor: 'rates',
      title: 'Rates',
      render: (row: ShippingRateTemplate) => (
        <Stack gap={0}>
          {row.rates.map((rate) => (
            <Group key={rate.id} gap="xs">
              <Text size="sm">{rate.countries.length} countries,</Text>
              <Text size="sm" c="dimmed">
                {formatPrice(rate.amount, row.currency)}
                {rate.free_above_value &&
                  new Decimal(rate.free_above_value || 0).greaterThan(0) &&
                  `, free above ${rate.free_above_value} ${row.currency}`}
              </Text>
            </Group>
          ))}
        </Stack>
      ),
    },
    {
      accessor: 'updated_at',
      title: 'Last Updated',
      render: (row: ShippingRateTemplate) => new Date(row.updated_at).toLocaleDateString(),
    },
    {
      accessor: 'actions',
      title: '',
      render: (row: ShippingRateTemplate) => (
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
        noRecordsText="No shipping rate templates found"
      />
    </Box>
  );
}
