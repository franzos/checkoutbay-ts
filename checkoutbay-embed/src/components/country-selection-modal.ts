/**
 * Country Selection Modal Component
 */

import type { ShopAPI } from '../core/api.js';

interface CountrySelectionModalOptions {
  onSelect: (country: string, warehouse?: string) => void;
  onCancel: () => void;
}

export class CountrySelectionModal {
  private api: ShopAPI;
  private shopId: string;
  private options: CountrySelectionModalOptions;

  constructor(api: ShopAPI, shopId: string, options: CountrySelectionModalOptions) {
    this.api = api;
    this.shopId = shopId;
    this.options = options;
  }

  async show(): Promise<void> {
    // Stub implementation - opens a simple prompt for now
    const country = prompt('Enter country code (e.g., US, CA, GB):');
    if (country) {
      this.options.onSelect(country.toUpperCase());
    } else {
      this.options.onCancel();
    }
  }

  destroy(): void {
    // Cleanup logic would go here
  }
}