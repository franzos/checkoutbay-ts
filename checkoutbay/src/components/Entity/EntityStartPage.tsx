import { CommonQueryParams } from '@gofranz/common';
import { Currency, ShopEntitiesAccessParams, ShopEntityAccessParams } from '@gofranz/common';
import { CommonTableProps, useLanguageAwareRouting, usePagination } from '@gofranz/common-components';
import { Button, Flex, Group, Pagination, Text } from '@mantine/core';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface GeneralizedStartPageProps<Entity, Query, Update> {
  TableComponent: React.ComponentType<CommonTableProps<Entity, Update>>;
  getFunction: (params: ShopEntitiesAccessParams, queryParams?: Query) => Promise<{ total: number; data: Entity[] }>;
  createPath?: string;
  openPath: (item: Entity) => string;
  updateCb?: (params: ShopEntityAccessParams, item: Update) => Promise<void>;
  deleteCb?: (params: ShopEntityAccessParams) => Promise<void>;
  buttonText: string;
  headerText: string;
  primaryEntityId?: string;
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
  primaryEntityId,
  shopCurrency,
}: GeneralizedStartPageProps<Entity, Query, Update>) {
  const nav = useNavigate();
  const { createLanguageURL } = useLanguageAwareRouting();

  // Unified pagination using the common hook
  const fetchData = useCallback(async (queryParams: { nextPage: number;[key: string]: unknown }) => {
    if (!primaryEntityId) {
      return { data: [], total: 0 };
    }
    
    const { nextPage, ...otherParams } = queryParams;
    const combQueryParams = {
      offset: nextPage === 1 ? 0 : 10 * (nextPage - 1),
      limit: 10,
      ...otherParams
    } as CommonQueryParams & Query;
    
    const res = await getFunction(
      { primaryEntityId }, // entityId is not used in this context, so we pass an empty string
      combQueryParams
    );
    return {
      data: res.data,
      total: res.total,
    };
  }, [getFunction, primaryEntityId]);

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

  if (!primaryEntityId) {
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
    primaryEntityId,
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
