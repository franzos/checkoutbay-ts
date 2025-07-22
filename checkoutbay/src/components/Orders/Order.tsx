import {
  formatPrice,
  InlineAddress,
  Order,
  OrderItem,
  OrderSource,
  OrderStatus,
  Product,
  Warehouse
} from "@gofranz/checkoutbay-common";
import { RenderEntityProps } from "@gofranz/common-components";
import {
  Alert,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Loader,
  Stack,
  Text,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconReceipt,
  IconTruck,
  IconUser,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useRustyState } from "../../state";

export function RenderOrder({
  data,
  setParentLoading,
  reload
}: RenderEntityProps<Order>) {
  // const [addresses, setAddresses] = useState<Address[]>([]);
  const [shippingAddress, setShippingAddress] = useState<InlineAddress | null>(null);
  const [billingAddress, setBillingAddress] = useState<InlineAddress | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useRustyState.getState().api;

  const loading = (loading: boolean) => {
    setIsLoading(loading);
    setParentLoading(loading);
  };

  const payable = data.status === OrderStatus.Draft || data.status === OrderStatus.New;
  const shippable = data.status === OrderStatus.Paid || data.status === OrderStatus.Processing || data.status === OrderStatus.OnHold;
  const deliverable = data.status === OrderStatus.Shipped;
  const invoicable = data.status === OrderStatus.Paid || data.status === OrderStatus.Shipped || data.status === OrderStatus.Delivered;

  const loadData = async () => {
    loading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [itemsResponse, warehouseResponse] = await Promise.all([
        api.getOrderItems({
          primaryEntityId: data.shop_id,
          entityId: data.id,
        }),
        api.getWarehouse({
          primaryEntityId: data.shop_id,
          entityId: data.warehouse_id,
        }),
      ]);

      setOrderItems(itemsResponse || []);
      setWarehouse(warehouseResponse);

      // Only fetch addresses for registered user orders
      if (data.source === OrderSource.RegisteredUser && data.shipping_address_id && data.billing_address_id) {
        const [shippingAddressResponse, billingAddressResponse] = await Promise.all([
          api.getAddress({
            primaryEntityId: data.shop_id,
            entityId: data.shipping_address_id,
          }),
          api.getAddress({
            primaryEntityId: data.shop_id,
            entityId: data.billing_address_id,
          }),
        ]);
        
        setShippingAddress(shippingAddressResponse);
        setBillingAddress(billingAddressResponse);
      } else {
        setShippingAddress(data.shipping_address);
        setBillingAddress(data.billing_address);
      }

      // Fetch product details for all order items
      const uniqueProductIds = [
        ...new Set(itemsResponse.map((item) => item.product_id)),
      ];
      const productDetails = await Promise.all(
        uniqueProductIds.map((productId) => api.getProduct({
          primaryEntityId: data.shop_id,
          entityId: productId,
        }))
      );

      // Create a map of product ID to product details
      const productMap = productDetails.reduce((acc, product) => {
        acc[product.id] = product;
        return acc;
      }, {} as Record<string, Product>);

      setProducts(productMap);
    } catch (error) {
      console.error("Failed to load data:", error);
      setError("Failed to load order data. Please try again later.");
    } finally {
      loading(false);
    }
  };

  const safeReload = async () => {
    try {
      setIsLoading(true);
      if (reload) await reload();
    } finally {
      setIsLoading(false);
    }
  }

  const markAsPaid = async () => {
    try {
      setIsLoading(true);
      await api.markOrderAsPaid({
        entityId: data.id,
        primaryEntityId: data.shop_id,
      });
      if (reload) await safeReload();
    } catch (error) {
      console.error("Failed to mark order as paid:", error);
      setError("Failed to mark order as paid. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  const markAsShipped = async () => {
    try {
      setIsLoading(true);
      await api.markOrderAsShipped({
        entityId: data.id,
        primaryEntityId: data.shop_id,
      });
      if (reload) await safeReload();
    } catch (error) {
      console.error("Failed to mark order as shipped:", error);
      setError("Failed to mark order as shipped. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  const markOrderAsDelivered = async () => {
    try {
      setIsLoading(true);
      await api.markOrderAsDelivered({
        entityId: data.id,
        primaryEntityId: data.shop_id,
      });
      if (reload) await safeReload();
    } catch (error) {
      console.error("Failed to mark order as delivered:", error);
      setError("Failed to mark order as delivered. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  const getOrderInvoice = async () => {
    try {
      setIsLoading(true)
      const response = await api.getOrderInvoice({
        entityId: data.id,
        primaryEntityId: data.shop_id,
      });
      const blob = new Blob([response], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${data.id}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to get order invoice:", error);
      setError("Failed to get order invoice. Please try again later.");
    } finally {
      setIsLoading(false);
    }

  }

  useEffect(() => {
    loadData();
  }, [api, data.id, data.source, data.warehouse_id]);

  if (isLoading) {
    return (
      <Box>
        <Loader m="lg" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size="1rem" />} title="Error" color="red">
        {error}
      </Alert>
    );
  }

  const renderAddress = (address?: InlineAddress | null) => {
    if (!address) return "N/A";
    return `${address.street}, ${address.city}, ${address.country}`;
  };

  return (
    <Stack gap="md">
      <Card shadow="sm" padding="md" radius="md" withBorder>
        <Group justify="space-between" mb="md">
          <Group>
            <IconReceipt size={24} />
            <Text size="lg" fw={500}>
              Order Details
            </Text>
          </Group>
          <Group>
            <Button variant="outline" onClick={safeReload} loading={isLoading}>Reload</Button>
            {invoicable && <Button onClick={getOrderInvoice} loading={isLoading}>Download Invoice</Button>}
            {payable && <Button onClick={markAsPaid} loading={isLoading}>Mark as Paid</Button>}
            {shippable && <Button onClick={markAsShipped} loading={isLoading}>Mark as Shipped</Button>}
            {deliverable && <Button onClick={markOrderAsDelivered} loading={isLoading}>Mark as Delivered</Button>}
            <Badge size="lg" variant="light">
              {data.status}
            </Badge>
          </Group>
        </Group>

        <Grid>
          <Grid.Col span={12}>
            <Card withBorder>
              <Group mb="xs">
                <IconUser size={20} />
                <Text fw={500}>Customer Information</Text>
              </Group>
              {data.source === OrderSource.PublicUser ? (
                <Text size="sm">Email: {data.customer_user_email}</Text>
              ) : (
                <Text size="sm">User ID: {data.customer_user_id}</Text>
              )}
              <Text size="sm" c="dimmed">
                Source: {data.source}
              </Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={6}>
            <Card withBorder>
              <Group mb="xs">
                <IconTruck size={20} />
                <Text fw={500}>Shipping Details</Text>
              </Group>
              {warehouse ? (
                <>
                  <Text size="sm">Warehouse: {warehouse.title}</Text>
                  <Text size="sm" c="dimmed">
                    {warehouse.id}
                  </Text>
                </>
              ) : (
                <Text size="sm">Warehouse ID: {data.warehouse_id}</Text>
              )}

              <Divider my="xs" />

              <Text size="sm" fw={500}>
                Shipping Address:
              </Text>
              <Text size="sm" mb="xs">
                {renderAddress(shippingAddress)}
              </Text>
              <Text size="sm" fw={500}>
                Billing Address:
              </Text>
              <Text size="sm">{renderAddress(billingAddress)}</Text>
              <Divider my="xs" />
              <Text size="sm">Method: {data.shipping_method}</Text>
            </Card>
          </Grid.Col>

          <Grid.Col span={6}>
            <Card withBorder>
              <Text fw={500} mb="xs">
                Order Summary
              </Text>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Text size="sm">Subtotal Before Discount:</Text>
                  <Text size="sm">
                    {formatPrice(data.subtotal_before_discount, data.currency)}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Discount:</Text>
                  <Text size="sm" c="red">
                    -{formatPrice(data.discount_total, data.currency)}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Shipping:</Text>
                  <Text size="sm">
                    {formatPrice(data.shipping_total, data.currency)}
                  </Text>
                </Group>
                <Group justify="space-between">
                  <Text size="sm">Tax:</Text>
                  <Text size="sm">
                    {formatPrice(data.tax_total, data.currency)}
                  </Text>
                </Group>
                <Divider />
                <Group justify="space-between">
                  <Text fw={500}>Total:</Text>
                  <Text fw={500}>{formatPrice(data.total, data.currency)}</Text>
                </Group>
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>

        <Box mt="md">
          <Text fw={500} mb="sm">
            Order Items
          </Text>
          {orderItems.length === 0 ? (
            <Text c="dimmed" size="sm">
              No items found for this order.
            </Text>
          ) : (
            <Stack gap="sm">
              {orderItems.map((item, index) => (
                <Card key={index} withBorder padding="sm">
                  <Grid>
                    <Grid.Col span={6}>
                      <Text size="sm" fw={500}>
                        {products[item.product_id]?.title ||
                          `Product ID: ${item.product_id}`}
                      </Text>
                      {products[item.product_id] && (
                        <Text size="sm" c="dimmed">
                          {products[item.product_id].description.en}
                        </Text>
                      )}
                      <Text size="sm">Quantity: {item.quantity}</Text>
                      <Text size="sm">
                        Unit Price:{" "}
                        {formatPrice(item.unit_price, data.currency)}
                      </Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Group justify="space-between">
                        <Text size="sm">Subtotal:</Text>
                        <Text size="sm">
                          {formatPrice(item.subtotal, data.currency)}
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Discount:</Text>
                        <Text size="sm" c="red">
                          -{formatPrice(item.discount_total, data.currency)}
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Tax:</Text>
                        <Text size="sm">
                          {formatPrice(item.tax_total, data.currency)}
                        </Text>
                      </Group>
                      <Divider my="xs" />
                      <Group justify="space-between">
                        <Text size="sm" fw={500}>
                          Total:
                        </Text>
                        <Text size="sm" fw={500}>
                          {formatPrice(item.total, data.currency)}
                        </Text>
                      </Group>
                    </Grid.Col>
                  </Grid>
                </Card>
              ))}
            </Stack>
          )}
        </Box>

        <Text size="sm" c="dimmed" mt="md">
          Created At: {new Date(data.created_at).toISOString()}
        </Text>
        {data.notes && (
          <Text size="sm" mt="xs">
            Notes: {data.notes}
          </Text>
        )}
      </Card>
    </Stack>
  );
}
