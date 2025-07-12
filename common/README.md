
```ts
// Example usage
const auth = new NostrAuthConfig(); // You'll need to implement this
const api = new RustyShopAPI(auth);

// Login
await api.login();

// Get addresses
try {
  const addresses = await api.getAddresses();
  console.log(addresses.data);
} catch (error) {
  console.error('Error fetching addresses:', error);
}

// Create order
const orderData: NewRegisteredUserOrder = {
  warehouse_id: 'warehouse123',
  shipping_address_id: 'address123',
  billing_address_id: 'address123',
  items: [
    { product_id: 'product123', quantity: 1 }
  ],
  currency: 'USD'
};

try {
  const order = await api.createOrder(orderData);
  console.log('Order created:', order);
} catch (error) {
  console.error('Error creating order:', error);
}
```