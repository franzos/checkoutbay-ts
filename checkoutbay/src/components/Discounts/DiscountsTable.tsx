import { useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { Box, NavLink, ActionIcon, Badge, Group, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { formatPrice, Discount, DiscountValueType, UpdateDiscount } from '@gofranz/checkoutbay-common';
import { CommonTableProps } from '../../lib/table';

export function DiscountsTable(props: CommonTableProps<Discount, UpdateDiscount>) {
  const [isBusy, setIsBusy] = useState(false);
  const [records, setRecords] = useState<Discount[] | []>([]);
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

  const formatDiscountValue = (discount: Discount) => {
    if (discount.value_type === DiscountValueType.Percentage) {
      return `${discount.value}%`;
    } else {
      return formatPrice(discount.value, props.shopCurrency);
    }
  };

  const formatDiscountType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return `${start} - ${end}`;
  };

  const isDiscountActive = (discount: Discount) => {
    const now = new Date();
    const startDate = new Date(discount.start_date);
    const endDate = new Date(discount.end_date);
    
    return discount.is_active && now >= startDate && now <= endDate;
  };

  const columns = [
    {
      accessor: 'title',
      title: 'Discount',
      render: (row: Discount) => (
        <NavLink
          label={
            <Group>
              <Text>{row.title}</Text>
              {isDiscountActive(row) && <Badge color="green">Active</Badge>}
              {row.is_active === false && <Badge color="gray">Inactive</Badge>}
              {!isDiscountActive(row) && row.is_active && <Badge color="orange">Scheduled</Badge>}
            </Group>
          }
          onClick={() => props.openRowPage(row)}
        />
      ),
    },
    {
      accessor: 'discount_type',
      title: 'Type',
      render: (row: Discount) => (
        <Badge variant="light" color="blue">
          {formatDiscountType(row.discount_type)}
        </Badge>
      ),
    },
    {
      accessor: 'value',
      title: 'Value',
      render: (row: Discount) => <Text fw={500}>{formatDiscountValue(row)}</Text>,
    },
    {
      accessor: 'minimum_spend',
      title: 'Min. Spend',
      render: (row: Discount) => 
        row.minimum_spend_amount 
          ? formatPrice(row.minimum_spend_amount, props.shopCurrency)
          : 'None',
    },
    {
      accessor: 'date_range',
      title: 'Valid Period',
      render: (row: Discount) => (
        <Text size="sm" c="dimmed">
          {formatDateRange(row.start_date, row.end_date)}
        </Text>
      ),
    },
    {
      accessor: 'config',
      title: 'Configuration',
      render: (row: Discount) => {
        if (row.config?.type === 'VoucherCode') {
          const usageLimit = row.config.content.usage_limit;
          return (
            <Group gap="xs">
              <Badge color="purple" size="sm">
                Code: {row.config.content.code}
              </Badge>
              {usageLimit && (
                <Badge color="cyan" size="sm">
                  Limit: {usageLimit}
                </Badge>
              )}
            </Group>
          );
        } else if (row.config?.type === 'VolumeDiscount') {
          const tierCount = row.config.content.tiers?.length || 0;
          return (
            <Badge color="orange" size="sm">
              {tierCount} Tier{tierCount !== 1 ? 's' : ''}
            </Badge>
          );
        }
        return <Text size="sm" c="dimmed">Standard</Text>;
      },
    },
    {
      accessor: 'updated_at',
      title: 'Last Updated',
      render: (row: Discount) =>
        row.updated_at ? new Date(row.updated_at).toLocaleDateString() : 'N/A',
    },
    {
      accessor: 'actions',
      title: '',
      render: (row: Discount) => (
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
        noRecordsText="No discounts found"
      />
    </Box>
  );
}