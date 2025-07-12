# Shop Test Alt (Vue 3)

Vue 3 e-commerce frontend for testing CheckoutBay integration. Built with Vue 3, TypeScript, Vite, and Naive UI.

## Features

- Product browsing and selection
- Shopping cart functionality
- Address management
- Stripe payment integration
- Country/warehouse selection
- Responsive design with Naive UI

## Configuration

### Payment Redirect URLs

By default, users are redirected back to this Vue app after payment. You can override this by setting global configuration:

```html
<script>
window.CheckoutBayConfig = {
  successUrl: 'https://yoursite.com/payment-success',  // Custom success page
  cancelUrl: 'https://yoursite.com/payment-cancel'     // Custom cancel page
};
</script>
```

**Default behavior** (if not configured):
- Success: `{origin}/#/payment?purchase=success&shop_id={shop_id}&order={order_id}`
- Cancel: `{origin}/#/?purchase=cancel&shop_id={shop_id}&order={order_id}`

### Shop Configuration

Set the shop ID via URL parameter:
```
https://yoursite.com/#/?shop_id=your-shop-uuid
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Vite
- Naive UI
- Pinia (state management)
- Vue Router
