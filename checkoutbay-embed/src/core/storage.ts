/**
 * Simple in-memory storage for session data (no persistence)
 */

interface CartItem {
  productId: string;
  quantity: number;
}

interface StorageData {
  cartItems: CartItem[];
  selectedCountry: string | null;
  selectedWarehouse: string | null;
}

export class Storage {
  static data: StorageData = {
    cartItems: [],
    selectedCountry: null,
    selectedWarehouse: null
  };

  // Cart-specific methods
  static getCartItems(): CartItem[] {
    return this.data.cartItems || [];
  }

  static setCartItems(items: CartItem[]): void {
    this.data.cartItems = items || [];
  }

  static getSelectedCountry(): string | null {
    return this.data.selectedCountry;
  }

  static setSelectedCountry(country: string | null): void {
    this.data.selectedCountry = country;
  }

  static getSelectedWarehouse(): string | null {
    return this.data.selectedWarehouse;
  }

  static setSelectedWarehouse(warehouseId: string | null): void {
    this.data.selectedWarehouse = warehouseId;
  }

  static clear(): void {
    this.data = {
      cartItems: [],
      selectedCountry: null,
      selectedWarehouse: null
    };
  }
}