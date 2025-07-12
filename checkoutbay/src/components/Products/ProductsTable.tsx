import { useEffect, useState } from 'react';
import { DataTable } from 'mantine-datatable';
import { Box, NavLink, ActionIcon, Badge, Group, Text, HoverCard, Image } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { formatPrice, Product, WarehouseStockLevel } from '@gofranz/checkoutbay-common';
import { CommonTableProps } from '../../lib/table';
import { useRustyState } from '../../state';

interface StockByProduct {
  [productId: string]: WarehouseStockLevel[];
}

export function ProductsTable(props: CommonTableProps<Product, Partial<Product>>) {
  const [isBusy, setIsBusy] = useState(false);
  const [records, setRecords] = useState<Product[] | []>([]);
  const [page, setPage] = useState(1);
  const [stockLevels, setStockLevels] = useState<StockByProduct>({});

  useEffect(() => {
    const doIt = async () => {
      setIsBusy(true);
      try {
        const records = await props.onChange({
          nextPage: page,
        });
        setRecords(records);

        // Fetch stock levels for loaded products
        const api = useRustyState.getState().api;
        const productIds = records.map((product) => product.id);
        const stockData = await api.getStockMovementsByProducts(productIds, props.shopId);

        // Group stock levels by product ID
        const groupedStock = stockData.reduce<StockByProduct>((acc, [productId, stockLevel]) => {
          if (!acc[productId]) {
            acc[productId] = [];
          }
          acc[productId].push(stockLevel);
          return acc;
        }, {});

        setStockLevels(groupedStock);
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
      accessor: 'cover_url',
      title: 'Cover',
      render: (row: Product) => <Image src={row.cover_url} h={50} w="auto" fit="contain" />,
    },
    {
      accessor: 'title',
      title: 'Product',
      render: (row: Product) => (
        <NavLink
          label={
            <Group>
              <Text>{row.title}</Text>
              {row.is_live && <Badge color="gray">Active</Badge>}
            </Group>
          }
          onClick={() => props.openRowPage(row)}
        />
      ),
    },
    {
      accessor: 'sku',
      title: 'SKU',
    },
    {
      accessor: 'price',
      title: 'Price',
      render: (row: Product) => <Text>{formatPrice(row.price, props.shopCurrency)}</Text>,
    },
    {
      accessor: 'stock',
      title: 'Stock',
      render: (row: Product) => {
        const productStocks = stockLevels[row.id];
        if (!productStocks?.length) return 'N/A';

        const totalStock = productStocks.reduce((sum, stock) => sum + stock.stock_level, 0);

        return (
          <Group gap="xs">
            <HoverCard width={280} shadow="md" withArrow>
              <HoverCard.Target>
                <Text style={{ cursor: 'help' }}>{totalStock}</Text>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                <Box>
                  <Text size="sm" fw={500} mb={8}>
                    Stock by Warehouse
                  </Text>
                  {productStocks.map((stock) => (
                    <Group key={stock.warehouse_id} justify="space-between" mb={4}>
                      <Text size="sm" c="dimmed">
                        {stock.warehouse_title || 'Unnamed Warehouse'}
                      </Text>
                      <Badge color={stock.stock_level <= 0 ? 'red' : 'green'}>
                        {stock.stock_level}
                      </Badge>
                    </Group>
                  ))}
                </Box>
              </HoverCard.Dropdown>
            </HoverCard>
            {totalStock <= 0 && <Badge color="red">Out of Stock</Badge>}
          </Group>
        );
      },
    },
    {
      accessor: 'status',
      title: 'Properties',
      render: (row: Product) => (
        <Group gap="xs">
          {row.requires_shipping ? (
            <Badge color="blue">Shipping</Badge>
          ) : (
            <Badge color="gray">No Shipping</Badge>
          )}
          {row.allow_negative_stock ? (
            <Badge color="yellow">Negative Stock</Badge>
          ) : (
            <Badge color="gray">No Negative Stock</Badge>
          )}
        </Group>
      ),
    },
    {
      accessor: 'updated_at',
      title: 'Last Updated',
      render: (row: Product) =>
        row.updated_at ? new Date(row.updated_at).toLocaleDateString() : 'N/A',
    },
    {
      accessor: 'actions',
      title: '',
      render: (row: Product) => (
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
        noRecordsText="No products found"
      />
    </Box>
  );
}
