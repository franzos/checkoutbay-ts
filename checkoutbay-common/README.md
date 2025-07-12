# @gofranz/checkoutbay-common

E-commerce API client and types for https://checkoutbay.com/ services by https://gofranz.com/.

## Features

- Complete e-commerce API client with authentication
- Auto-generated types from Rust backend
- Decimal precision for financial calculations
- Multi-warehouse and multi-shop support
- Payment gateway integrations
- Shipping rate management

## Installation

```bash
pnpm add @gofranz/checkoutbay-common
```

## Key Exports

### API Client
- `RustyShopAPI` - Complete e-commerce API client

### Core Types
- `Product` - Product catalog with stock management
- `Order` - Order processing and status tracking
- `Warehouse` - Multi-warehouse inventory
- `ShippingRateTemplate` - Shipping calculations
- `PaymentGateway` - Payment provider configurations
- `Shop` - Multi-tenant shop management

### Extended Types (Decimal Support)
- `ProductWithDecimal` - Product with precise pricing
- `OrderWithDecimal` - Order with decimal calculations
- `CalculatedOrderWithDecimal` - Order with tax/shipping

### Utilities
- `formatPrice()` - Internationalized price formatting
- `getLsShop()`, `setLsShop()` - Local storage management

## Notes

Types are auto-generated from the Rust backend. Financial calculations use Decimal.js for precision.