# Checkoutbay Embedded

Add e-commerce to any website with one script tag.

## Quick Start

```html
<script>
window.CheckoutBayConfig = {
    shopId: 'your-shop-uuid'
};
</script>
<script src="https://cdn.checkoutbay.com/embed/v1/checkoutbay-embed.min.js"></script>
<div id="cb-products"></div>
<div id="cb-cart"></div>
```

## Features

- Zero dependencies - Pure vanilla JavaScript
- Under 50KB minified
- Mobile responsive
- Persistent cart with localStorage
- Multi-country shipping

## Installation

### CDN (Recommended)
```html
<script src="https://checkoutbay.com/embed.min.js"></script>
```

### NPM
```bash
npm install @gofranz/checkoutbay-embed
```

## Usage

### Product Grid
```html
<div id="cb-products"></div>
```

### Custom Add to Cart Buttons
```html
<button product-id="product-uuid" quantity="1">Add to Cart</button>
```

### Cart Widget
```html
<div id="cb-cart"></div>
```

## Configuration

```javascript
window.CheckoutBayConfig = {
    shopId: 'your-shop-uuid',          // Required
    successUrl: '/payment-success',    // Optional
    errorUrl: '/payment-error',        // Optional
    defaultCountry: 'US',              // Optional
    theme: 'minimal'                   // Optional
};
```

## JavaScript API

```javascript
// Cart operations
CheckoutBay.addToCart('product-id', 2);
CheckoutBay.removeFromCart('product-id');
CheckoutBay.clearCart();

// Get cart data
const cart = CheckoutBay.getCart();

// Events
CheckoutBay.on('cart:updated', function(cart) {
    console.log('Cart updated:', cart);
});
```

## Styling

Override CSS custom properties:
```css
:root {
    --cb-primary-color: #your-color;
    --cb-button-radius: 4px;
}
```

Available CSS classes: `.cb-card`, `.cb-button`, `.cb-cart-icon`, `.cb-cart-sidebar`

## Support

- Email: support@checkoutbay.com
- Documentation: https://checkoutbay.com/#/docs

## License

MIT