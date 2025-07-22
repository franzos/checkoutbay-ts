import { Text, Stack, Accordion, Group, ThemeIcon, Alert, Card, Grid, Code } from '@mantine/core';
import {
  IconApi,
  IconCode,
  IconInfoCircle,
} from "@tabler/icons-react";
import { useTranslation } from 'react-i18next';
import { useRustyState } from "../state";

export function Docs() {
  const { t } = useTranslation();
  const selectedShop = useRustyState((s) => s.shopId);

  return (
    <Stack gap="xl">
      {/* What is Checkoutbay */}
      <Accordion variant="contained" chevronPosition="right">
        <Accordion.Item value="what-is-checkoutbay">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="blue">
                <IconInfoCircle size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>What is Checkoutbay?</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  Learn the basics of Checkoutbay e-commerce platform
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="md">
              <Text>
                Checkoutbay is a complete e-commerce platform that helps you manage your online store.
                Think of it as your digital storefront manager - it handles inventory, processes orders,
                manages payments, and provides everything you need to sell products online.
              </Text>

              <Alert icon={<IconInfoCircle size={16} />} title="Key Features" color="blue">
                <Text size="sm">
                  • Inventory management with multiple warehouses
                  <br />
                  • Flexible payment options (Stripe for instant payments, Invoice for manual payments)
                  <br />
                  • Advanced discount system with volume pricing and promotional codes
                  <br />
                  • Multi-language support with automatic translation
                  <br />
                  • Shipping rate calculation and management
                  <br />
                  • Easy integration with JavaScript library or REST API
                </Text>
              </Alert>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="md" radius="sm">
                    <Stack gap="xs">
                      <Text fw={500} size="sm">
                        Payment Methods
                      </Text>
                      <Text size="xs" c="dimmed">
                        <strong>Stripe:</strong> Instant credit card payments with automatic processing
                      </Text>
                      <Text size="xs" c="dimmed">
                        <strong>Invoice:</strong> Manual payments via bank transfer with detailed banking instructions
                      </Text>
                    </Stack>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="md" radius="sm">
                    <Stack gap="xs">
                      <Text fw={500} size="sm">
                        Discount System
                      </Text>
                      <Text size="xs" c="dimmed">
                        <strong>Volume Discounts:</strong> Automatic pricing tiers based on quantity
                      </Text>
                      <Text size="xs" c="dimmed">
                        <strong>Promotional Codes:</strong> Voucher codes for marketing campaigns
                      </Text>
                      <Text size="xs" c="dimmed">
                        <strong>Temporary Sales:</strong> Time-limited promotional pricing
                      </Text>
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="features-overview">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="green">
                <IconCode size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>Platform Features</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  Explore advanced features for global commerce
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="lg">
              <Grid>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Card withBorder padding="md" radius="sm" h="100%">
                    <Stack gap="xs">
                      <Text fw={500} size="sm">
                        🌍 Multi-Language Support
                      </Text>
                      <Text size="xs" c="dimmed">
                        Product descriptions automatically adapt to customer's language.
                        Currently supports English, German, Spanish, French, Portuguese, Chinese, Thai, and Arabic.
                      </Text>
                    </Stack>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Card withBorder padding="md" radius="sm" h="100%">
                    <Stack gap="xs">
                      <Text fw={500} size="sm">
                        🏦 Global Banking
                      </Text>
                      <Text size="xs" c="dimmed">
                        Support for banking systems worldwide including SWIFT international transfers,
                        IBAN for Europe+, and country-specific formats (UK, US, Australia, Canada, India).
                      </Text>
                    </Stack>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 4 }}>
                  <Card withBorder padding="md" radius="sm" h="100%">
                    <Stack gap="xs">
                      <Text fw={500} size="sm">
                        💰 Smart Discounts
                      </Text>
                      <Text size="xs" c="dimmed">
                        Volume discounts automatically apply based on quantity. Promotional codes for marketing.
                        Minimum spend requirements. Time-limited sales campaigns.
                      </Text>
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>

              <Alert icon={<IconInfoCircle size={16} />} title="Payment Processing" color="green">
                <Text size="sm">
                  <strong>Stripe Integration:</strong> Instant credit card processing with automatic order fulfillment.
                  Perfect for digital products and fast shipping.
                  <br /><br />
                  <strong>Invoice Payments:</strong> Manual payment processing with detailed banking instructions.
                  Ideal for B2B sales, high-value items, or customers preferring bank transfers.
                  The system automatically sends different success messages and next steps based on the payment method chosen.
                </Text>
              </Alert>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        {/* Integration Methods */}
        <Accordion.Item value="js-library">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="violet">
                <IconCode size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>{t('docs.jsLibrary')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('docs.jsLibraryDescription')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="lg">
              <Alert icon={<IconInfoCircle size={16} />} title={t('docs.quickTip')} color="violet">
                {t('docs.jsLibraryQuickTip')}
              </Alert>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="md" radius="sm">
                    <Stack gap="sm">
                      <Text fw={500} size="sm">
                        {t('docs.quickStart')}
                      </Text>
                      <Code block>
{`<script>
window.CheckoutBayConfig = {
    shopId: '${selectedShop}'
};
</script>
<script src="https://checkoutbay.com/checkoutbay-embed.min.js"></script>
<div id="cb-products"></div>
<div id="cb-cart"></div>`}
                      </Code>
                      <Text size="xs" c="dimmed">
                        {t('docs.quickStartDesc')}
                      </Text>
                    </Stack>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="md" radius="sm">
                    <Stack gap="sm">
                      <Text fw={500} size="sm">
                        {t('docs.customButtons')}
                      </Text>
                      <Code block>
{`<!-- Your existing product markup -->
<div class="my-product">
    <h3>Amazing T-Shirt</h3>
    <p>Super comfortable cotton tee</p>
    <span class="price">$29.99</span>
    <button product-id="product-uuid-here" quantity="1">
        Add to Cart
    </button>
</div>

<!-- Cart widget -->
<div id="cb-cart"></div>`}
                      </Code>
                      <Text size="xs" c="dimmed">
                        {t('docs.customButtonsDesc')}
                      </Text>
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>

              <Accordion variant="separated">
                <Accordion.Item value="installation">
                  <Accordion.Control>{t('docs.installationMethods')}</Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="md">
                      <div>
                        <Text fw={500} size="sm" mb="xs">
                          {t('docs.cdnRecommended')}
                        </Text>
                        <Code block>
{`<script src="https://checkoutbay.com/checkoutbay-embed.min.js"></script>`}
                        </Code>
                      </div>
                      <div>
                        <Text fw={500} size="sm" mb="xs">
                          {t('docs.selfHosted')}
                        </Text>
                        <Code block>
{`1. Download checkoutbay-embed.min.js from releases
2. Upload to your website
3. Include with <script src="path/to/checkoutbay-embed.min.js"></script>`}
                        </Code>
                      </div>
                      <div>
                        <Text fw={500} size="sm" mb="xs">
                          NPM
                        </Text>
                        <Code block>
                          {`npm install @gofranz/checkoutbay-embed`}
                        </Code>
                      </div>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="configuration">
                  <Accordion.Control>{t('docs.globalConfiguration')}</Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="sm">
                      <Code block>
{`<script>
window.CheckoutBayConfig = {
    shopId: '${selectedShop}',  // REQUIRED
    // Payment redirect URLs (optional)
    successUrl: 'https://yoursite.com/payment-success',
    errorUrl: 'https://yoursite.com/payment-error',
    theme: 'minimal', // or 'dark', 'colorful'
    defaultCountry: 'US',
    onReady: function(api) {
        console.log('CheckoutBay is ready!');
    }
};
</script>`}
                      </Code>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="javascript-api">
                  <Accordion.Control>{t('docs.javascriptApi')}</Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="sm">
                      <Code block>
{`// Add items
CheckoutBay.addToCart('product-id', 2);
CheckoutBay.removeFromCart('product-id');
CheckoutBay.updateQuantity('product-id', 5);
CheckoutBay.clearCart();

// Get cart data
const cart = CheckoutBay.getCart();
console.log(cart.totalItems, cart.items);

// Event listeners
CheckoutBay.on('cart:updated', function(cartData) {
    console.log('Items in cart:', cartData.totalItems);
});

CheckoutBay.on('cart:error', function(error) {
    console.error('Cart error:', error);
});`}
                      </Code>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="styling">
                  <Accordion.Control>{t('docs.stylingThemes')}</Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="sm">
                      <div>
                        <Text fw={500} size="sm" mb="xs">
                          {t('docs.cssCustomProperties')}
                        </Text>
                        <Code block>
{`:root {
    --cb-primary-color: #your-brand-color;
    --cb-button-radius: 4px;
    --cb-font-family: 'Your Font', sans-serif;
}`}
                        </Code>
                      </div>
                      <div>
                        <Text fw={500} size="sm" mb="xs">
                          {t('docs.cssClasses')}
                        </Text>
                        <Code block>
{`.cb-card { /* Product cards */ }
.cb-button { /* Buttons */ }
.cb-cart-icon { /* Floating cart icon */ }
.cb-cart-sidebar { /* Cart sidebar */ }
.cb-product-grid { /* Product grid container */ }`}
                        </Code>
                      </div>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="api-integration">
          <Accordion.Control>
            <Group wrap="nowrap">
              <ThemeIcon size="lg" radius="xl" color="blue">
                <IconApi size={20} />
              </ThemeIcon>
              <div>
                <Text fw={500}>{t('docs.customApiTitle')}</Text>
                <Text size="sm" c="dimmed" fw={400}>
                  {t('docs.customApiDescription')}
                </Text>
              </div>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap="lg">
              <Alert icon={<IconInfoCircle size={16} />} title={t('docs.apiOverview')} color="blue">
                {t('docs.apiOverviewDescription')}
              </Alert>

              <Grid>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="md" radius="sm">
                    <Stack gap="xs">
                      <Text fw={500} size="sm">
                        {t('docs.apiFeatures')}
                      </Text>
                      <Text size="xs" c="dimmed">
                        • {t('docs.feature1')}
                      </Text>
                      <Text size="xs" c="dimmed">
                        • {t('docs.feature2')}
                      </Text>
                      <Text size="xs" c="dimmed">
                        • {t('docs.feature3')}
                      </Text>
                      <Text size="xs" c="dimmed">
                        • {t('docs.feature4')}
                      </Text>
                    </Stack>
                  </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6 }}>
                  <Card withBorder padding="md" radius="sm">
                    <Stack gap="xs">
                      <Text fw={500} size="sm">
                        {t('docs.commonMethods')}
                      </Text>
                      <Text size="xs" c="dimmed">
                        • Get shop details and products
                      </Text>
                      <Text size="xs" c="dimmed">
                        • Calculate shipping rates
                      </Text>
                      <Text size="xs" c="dimmed">
                        • Create and manage orders
                      </Text>
                      <Text size="xs" c="dimmed">
                        • Process payments
                      </Text>
                    </Stack>
                  </Card>
                </Grid.Col>
              </Grid>

              <Accordion variant="separated">
                <Accordion.Item value="shop">
                  <Accordion.Control>{t('docs.getShopDetails')}</Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="xs">
                      <Code block>
                        {`getPublicShop(shopId: string): Promise<PublicShop>

// PublicShop
interface PublicShop {
  id: string;
  name: string;
  default_currency: Currency;
}`}
                      </Code>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="products">
                  <Accordion.Control>{t('docs.getProducts')}</Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="xs">
                      <Code block>
                        {`getPublicProducts(shopId: string, warehouseId?: string | null): Promise<PublicProductsResponseComplete>

// PublicProductsResponseComplete
interface PublicProductsResponseComplete {
  data: PublicProduct[];
  files?: PublicFile[];
  stock?: PublicStock[];
  warehouses?: PublicWarehouse[];
  total: number;
}`}
                      </Code>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="calculate">
                  <Accordion.Control>{t('docs.calculateOrder')}</Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="xs">
                      <Code block>
                        {`calculateOrder(orderData: NewOrderCalculation): Promise<ProcessedOrder>

// NewOrderCalculation
interface NewOrderCalculation {
  id: string;
  shop_id: string;
  warehouse_id?: string;
  currency: Currency;
  shipping_method?: string;
  items: NewOrderSubmissionItem[];
  destination_country: string;
  ignore_threshold: boolean;
}

// ProcessedOrder
interface ProcessedOrder {
  id: string;
  shop_id: string;
  warehouse_id: string;
  currency: Currency;
  status: OrderStatus;
  shipping_method: string;
  shipping_total: Decimal;
  subtotal_before_discount: Decimal;
  discount_total: Decimal;
  subtotal: Decimal;
  tax_total: Decimal;
  total: Decimal;
  items: ProcessedOrderItem[];
}`}
                      </Code>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="create">
                  <Accordion.Control>{t('docs.createOrder')}</Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="xs">
                      <Code block>
                        {`createOrder(orderData: NewPublicUserOrder): Promise<void>

// NewPublicUserOrder
interface NewPublicUserOrder {
  id: string;
  shop_id: string;
  customer_user_email: string;
  shipping_address: InlineAddress;
  billing_address: InlineAddress;
  warehouse_id?: string;
  shipping_method?: string;
  currency: Currency;
  items: NewOrderSubmissionItem[];
}`}
                      </Code>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="payment">
                  <Accordion.Control>{t('docs.createPayment')}</Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="xs">
                      <Code block>
                        {`createOrderPayment(paymentData: NewOrderPaymentSubmission): Promise<OrderPayment>

// NewOrderPaymentSubmission
interface NewOrderPaymentSubmission {
  order_id: string;
  payment_gateway_id?: string;
  success_url?: string;
  cancel_url?: string;
}

// OrderPayment
interface OrderPayment {
  id: string;
  order_id: string;
  payment_gateway_id: string;
  amount: Decimal;
  currency: Currency;
  status: PaymentStatus;
  transaction_id: string;
  data?: {
    redirect_url: string;
  };
  error_message?: string;
  created_at: Date;
  updated_at: Date;
}`}
                      </Code>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>

                <Accordion.Item value="status">
                  <Accordion.Control>{t('docs.getOrderStatus')}</Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="xs">
                      <Code block>
                        {`getOrderStatus(orderId: string): Promise<ProcessedOrderPreview>

// ProcessedOrderPreview
interface ProcessedOrderPreview {
  id: string;
  shop_id: string;
  warehouse_id: string;
  currency: Currency;
  status: OrderStatus;
  shipping_total: Decimal;
  subtotal_before_discount: Decimal;
  discount_total: Decimal;
  subtotal: Decimal;
  tax_total: Decimal;
  total: Decimal;
}`}
                      </Code>
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Stack>
  );
}