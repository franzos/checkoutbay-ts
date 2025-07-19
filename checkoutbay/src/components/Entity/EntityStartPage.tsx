import { ShopQueryParams } from '@gofranz/checkoutbay-common';
import { Currency } from '@gofranz/common';
import { CommonTableProps, useLanguageAwareRouting, usePagination } from '@gofranz/common-components';
import { Button, Flex, Group, Pagination, Text } from '@mantine/core';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface GeneralizedStartPageProps<Entity, Query, Update> {
  TableComponent: React.ComponentType<CommonTableProps<Entity, Update>>;
  getFunction: (params: Query) => Promise<{ total: number; data: Entity[] }>;
  createPath?: string;
  openPath: (item: Entity) => string;
  updateCb?: (id: string, item: Update) => Promise<void>;
  deleteCb?: (id: string) => Promise<void>;
  buttonText: string;
  headerText: string;
  shopId?: string;
  shopCurrency: Currency;
}

export function GeneralizedStartPage<Entity, Query, Update>({
  TableComponent,
  getFunction,
  createPath,
  openPath,
  updateCb,
  deleteCb,
  buttonText,
  headerText,
  shopId,
  shopCurrency,
}: GeneralizedStartPageProps<Entity, Query, Update>) {
  const nav = useNavigate();
  const { createLanguageURL } = useLanguageAwareRouting();

  // Unified pagination using the common hook
  const fetchData = useCallback(async (params: { nextPage: number;[key: string]: unknown }) => {
    if (!shopId) {
      return { data: [], total: 0 };
    }
    
    const { nextPage, ...otherParams } = params;
    const apiParams = {
      offset: nextPage === 1 ? 0 : 10 * (nextPage - 1),
      limit: 10,
      shop_id: shopId,
      ...otherParams
    } as ShopQueryParams & Query;
    
    const res = await getFunction(apiParams);
    return {
      data: res.data,
      total: res.total,
    };
  }, [getFunction, shopId]);

  const pagination = usePagination({
    perPage: 10,
    fetchData,
  });

  const openCreate = useCallback(() => {
    nav(createLanguageURL(createPath || ''));
  }, [nav, createPath, createLanguageURL]);

  const openItem = useCallback(
    (item: Entity) => {
      nav(createLanguageURL(openPath(item)));
    },
    [nav, openPath, createLanguageURL]
  );

  const handlePageChange = useCallback(
    async (newPage: number) => {
      await pagination.setPage(newPage);
    },
    [pagination]
  );

  // Wrapper function for table components that maintains compatibility
  const getItems = useCallback(
    async (params: { nextPage: number; is_spam?: boolean }) => {
      return await pagination.loadPage(params.nextPage, params);
    },
    [pagination]
  );

  if (!shopId) {
    return <Text>You need to select a shop from the sidebar to view this page.</Text>;
  }

  const totalPages = Math.ceil(pagination.total / pagination.perPage);

  const tableProps: CommonTableProps<Entity, Update> = {
    pagination: {
      total: pagination.total,
      initial: 1,
      perPage: pagination.perPage,
    },
    onChange: getItems,
    openRowPage: openItem,
    updateCb,
    deleteCb,
    shopId,
    shopCurrency,
  };

  return (
    <>
      <Flex>
        <Group mt="lg" mb="lg">
          {createPath && (
            <Button onClick={openCreate} mb="md">
              {buttonText}
            </Button>
          )}
          <Text mb="sm">{headerText}</Text>
        </Group>
      </Flex>
      <TableComponent {...tableProps} />
      {totalPages > 1 && (
        <Flex justify="center" mt="md">
          <Pagination total={totalPages} value={pagination.page} onChange={handlePageChange} />
        </Flex>
      )}
    </>
  );
}
