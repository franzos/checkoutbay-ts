/**
 * Minimal and robust styles for CheckoutBay
 */

export const baseStyles = `
/* Base reset for all CheckoutBay components */
[class^="cb-"], [class*=" cb-"] {
  box-sizing: border-box !important;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important;
  font-size: 14px !important;
  line-height: 1.4 !important;
}

/* Buttons */
.cb-button {
  display: inline-block !important;
  padding: 12px 24px !important;
  background: #6A4C93 !important;
  color: white !important;
  border: none !important;
  border-radius: 6px !important;
  cursor: pointer !important;
  font-weight: 500 !important;
  text-align: center !important;
  text-decoration: none !important;
  transition: background-color 0.2s !important;
}

.cb-button:hover {
  background: #5a3f7a !important;
}

.cb-button:disabled {
  background: #9ca3af !important;
  cursor: not-allowed !important;
}

.cb-button-large {
  padding: 16px 32px !important;
  font-size: 16px !important;
}

.cb-button-secondary {
  background: #3EB489 !important;
}

.cb-button-secondary:hover {
  background: #359470 !important;
}

/* Product grid */
.cb-product-grid {
  margin: 20px 0 !important;
}

.cb-products-grid {
  display: grid !important;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
  gap: 20px !important;
}

.cb-product-card {
  border: 1px solid #e5e7eb !important;
  border-radius: 8px !important;
  overflow: hidden !important;
  background: #F9F6F2 !important;
}

.cb-product-image {
  width: 100% !important;
  height: 200px !important;
  object-fit: cover !important;
}

.cb-product-info {
  padding: 16px !important;
}

.cb-product-name {
  font-size: 18px !important;
  font-weight: 600 !important;
  margin-bottom: 8px !important;
  color: #343A40 !important;
}

.cb-product-description {
  color: #6b7280 !important;
  margin-bottom: 12px !important;
}

.cb-product-price {
  font-size: 20px !important;
  font-weight: 700 !important;
  color: #3EB489 !important;
  margin-bottom: 16px !important;
}

/* Cart icon */
.cb-cart-icon {
  position: fixed !important;
  z-index: 9999 !important;
}

.cb-cart-position-top-right {
  top: 20px !important;
  right: 20px !important;
}

.cb-cart-position-top-left {
  top: 20px !important;
  left: 20px !important;
}

.cb-cart-position-bottom-right {
  bottom: 20px !important;
  right: 20px !important;
}

.cb-cart-position-bottom-left {
  bottom: 20px !important;
  left: 20px !important;
}

.cb-cart-icon-button {
  position: relative !important;
  width: 56px !important;
  height: 56px !important;
  background: #6A4C93 !important;
  color: white !important;
  border: none !important;
  border-radius: 50% !important;
  cursor: pointer !important;
  box-shadow: 0 4px 12px rgba(106, 76, 147, 0.3) !important;
  transition: all 0.2s !important;
}

.cb-cart-icon-button:hover {
  background: #5a3f7a !important;
  transform: scale(1.05) !important;
}

.cb-cart-badge {
  position: absolute !important;
  top: -4px !important;
  right: -4px !important;
  background: #FF6F59 !important;
  color: white !important;
  border-radius: 10px !important;
  padding: 2px 6px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  min-width: 20px !important;
  text-align: center !important;
}

/* Country selection modal */
.cb-modal-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: rgba(0, 0, 0, 0.5) !important;
  z-index: 10000 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  opacity: 0 !important;
  transition: opacity 0.3s !important;
}

.cb-modal-show {
  opacity: 1 !important;
}

.cb-modal {
  background: #F9F6F2 !important;
  border-radius: 12px !important;
  max-width: 500px !important;
  width: 90% !important;
  max-height: 80vh !important;
  overflow: hidden !important;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1) !important;
}

.cb-modal-header {
  padding: 24px !important;
  border-bottom: 1px solid #e5e7eb !important;
}

.cb-modal-title {
  font-size: 24px !important;
  font-weight: 600 !important;
  color: #343A40 !important;
}

.cb-modal-body {
  padding: 24px !important;
}

.cb-modal-footer {
  padding: 24px !important;
  border-top: 1px solid #e5e7eb !important;
}

/* Form elements */
.cb-form-label {
  display: block !important;
  font-weight: 500 !important;
  color: #374151 !important;
  margin-bottom: 8px !important;
}

.cb-select {
  width: 100% !important;
  padding: 12px !important;
  border: 1px solid #d1d5db !important;
  border-radius: 6px !important;
  font-size: 16px !important;
  background: #F9F6F2 !important;
  margin-bottom: 16px !important;
}

.cb-select:focus {
  border-color: #6A4C93 !important;
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(106, 76, 147, 0.1) !important;
}

/* Checkout overlay */
.cb-checkout-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  background: #F9F6F2 !important;
  z-index: 10001 !important;
  opacity: 0 !important;
  transition: opacity 0.3s !important;
  overflow-y: auto !important;
}

.cb-checkout-show {
  opacity: 1 !important;
}

.cb-checkout-container {
  max-width: 1200px !important;
  margin: 0 auto !important;
  min-height: 100vh !important;
}

.cb-checkout-header {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  padding: 24px !important;
  border-bottom: 1px solid #e5e7eb !important;
}

.cb-checkout-title {
  font-size: 32px !important;
  font-weight: 700 !important;
  color: #343A40 !important;
}

.cb-checkout-close {
  width: 40px !important;
  height: 40px !important;
  background: none !important;
  border: none !important;
  font-size: 24px !important;
  cursor: pointer !important;
  color: #6b7280 !important;
}

.cb-checkout-content {
  display: grid !important;
  grid-template-columns: 1fr 400px !important;
  gap: 40px !important;
  padding: 24px !important;
}

@media (max-width: 768px) {
  .cb-checkout-content {
    grid-template-columns: 1fr !important;
  }
  
  .cb-summary-item {
    grid-template-columns: 1fr auto !important;
    grid-template-rows: auto auto !important;
    gap: 8px !important;
  }
  
  .cb-summary-item-info {
    grid-column: 1 / -1 !important;
  }
  
  .cb-quantity-controls {
    grid-column: 1 !important;
    justify-self: start !important;
  }
  
  .cb-remove-item {
    grid-column: 2 !important;
    grid-row: 1 !important;
    justify-self: end !important;
  }
  
  .cb-summary-item-price {
    grid-column: 2 !important;
    grid-row: 2 !important;
    justify-self: end !important;
  }
}

.cb-form-section {
  margin-bottom: 32px !important;
}

.cb-form-section-title {
  font-size: 20px !important;
  font-weight: 600 !important;
  color: #343A40 !important;
  margin-bottom: 16px !important;
}

.cb-form-input {
  width: 100% !important;
  padding: 12px !important;
  border: 1px solid #d1d5db !important;
  border-radius: 6px !important;
  font-size: 16px !important;
  margin-bottom: 16px !important;
  background: white !important;
}

.cb-form-input:focus {
  border-color: #6A4C93 !important;
  outline: none !important;
  box-shadow: 0 0 0 3px rgba(106, 76, 147, 0.1) !important;
}

/* Order summary */
.cb-checkout-summary {
  background: #f9fafb !important;
  border-radius: 12px !important;
  padding: 24px !important;
  height: fit-content !important;
}

.cb-summary-title {
  font-size: 20px !important;
  font-weight: 600 !important;
  color: #343A40 !important;
  margin-bottom: 16px !important;
}

.cb-summary-item {
  display: grid !important;
  grid-template-columns: 1fr auto auto auto !important;
  gap: 12px !important;
  align-items: center !important;
  padding: 16px 0 !important;
  border-bottom: 1px solid #e5e7eb !important;
}

.cb-summary-item:last-child {
  border-bottom: none !important;
}

.cb-summary-item-info {
  display: flex !important;
  flex-direction: column !important;
  gap: 4px !important;
}

.cb-summary-item-name {
  font-weight: 500 !important;
  color: #343A40 !important;
  font-size: 14px !important;
}

.cb-summary-item-unit-price {
  font-size: 12px !important;
  color: #6b7280 !important;
}

.cb-summary-item-price {
  font-weight: 600 !important;
  color: #343A40 !important;
  text-align: right !important;
}

/* Quantity controls */
.cb-quantity-controls {
  display: flex !important;
  align-items: center !important;
  border: 1px solid #d1d5db !important;
  border-radius: 6px !important;
  overflow: hidden !important;
}

.cb-quantity-btn {
  width: 28px !important;
  height: 28px !important;
  background: #f9fafb !important;
  border: none !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-weight: 500 !important;
  font-size: 14px !important;
  color: #374151 !important;
  transition: background-color 0.2s !important;
}

.cb-quantity-btn:hover {
  background: #e5e7eb !important;
}

.cb-quantity-btn:disabled {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
}

.cb-quantity-display {
  min-width: 32px !important;
  text-align: center !important;
  padding: 0 8px !important;
  font-weight: 500 !important;
  background: white !important;
  border-left: 1px solid #d1d5db !important;
  border-right: 1px solid #d1d5db !important;
  font-size: 14px !important;
}

/* Remove button */
.cb-remove-item {
  width: 24px !important;
  height: 24px !important;
  background: #fef2f2 !important;
  color: #D72631 !important;
  border: 1px solid #fecaca !important;
  border-radius: 50% !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  transition: all 0.2s !important;
}

.cb-remove-item:hover {
  background: #fee2e2 !important;
  border-color: #fca5a5 !important;
}

.cb-summary-line {
  display: flex !important;
  justify-content: space-between !important;
  padding: 8px 0 !important;
}

.cb-summary-total {
  font-weight: 600 !important;
  font-size: 18px !important;
  border-top: 1px solid #d1d5db !important;
  margin-top: 16px !important;
  padding-top: 16px !important;
}

/* Messages and states */
.cb-loading {
  text-align: center !important;
  padding: 40px !important;
  color: #6b7280 !important;
}

.cb-error {
  background: #fef2f2 !important;
  color: #D72631 !important;
  padding: 16px !important;
  border-radius: 6px !important;
  border: 1px solid #fecaca !important;
}

.cb-payment-message {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 10002 !important;
  padding: 16px !important;
  text-align: center !important;
  font-weight: 500 !important;
}

.cb-payment-success {
  background: #dcfce7 !important;
  color: #3EB489 !important;
  border-bottom: 1px solid #bbf7d0 !important;
}

.cb-payment-error {
  background: #fef2f2 !important;
  color: #D72631 !important;
  border-bottom: 1px solid #fecaca !important;
}

.cb-payment-message-close {
  margin-left: 16px !important;
  background: none !important;
  border: none !important;
  font-size: 18px !important;
  cursor: pointer !important;
}

.cb-toast {
  position: fixed !important;
  bottom: 20px !important;
  left: 50% !important;
  transform: translateX(-50%) translateY(100px) !important;
  background: #343A40 !important;
  color: white !important;
  padding: 12px 24px !important;
  border-radius: 6px !important;
  z-index: 10000 !important;
  transition: transform 0.3s !important;
}

.cb-toast-show {
  transform: translateX(-50%) translateY(0) !important;
}

/* Product button states */
.cb-product-button.cb-loading {
  opacity: 0.7 !important;
}

.cb-product-button.cb-success {
  background: #3EB489 !important;
}

.cb-product-button.cb-error {
  background: #D72631 !important;
}

/* Payment Result Overlay */
.cb-payment-result-overlay {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  background: rgba(0, 0, 0, 0.8) !important;
  z-index: 10000 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  opacity: 0 !important;
  visibility: hidden !important;
  transition: all 0.3s ease !important;
}

.cb-payment-result-overlay.cb-payment-result-show {
  opacity: 1 !important;
  visibility: visible !important;
}

.cb-payment-result-container {
  background: white !important;
  border-radius: 12px !important;
  max-width: 500px !important;
  width: 90% !important;
  max-height: 90vh !important;
  overflow-y: auto !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
  position: relative !important;
  animation: cb-payment-result-slide-up 0.3s ease !important;
}

@keyframes cb-payment-result-slide-up {
  from {
    transform: translateY(20px) !important;
    opacity: 0 !important;
  }
  to {
    transform: translateY(0) !important;
    opacity: 1 !important;
  }
}

.cb-payment-result-header {
  display: flex !important;
  align-items: center !important;
  padding: 24px 24px 16px 24px !important;
  border-bottom: 1px solid #e5e7eb !important;
  position: relative !important;
}

.cb-payment-result-icon {
  width: 48px !important;
  height: 48px !important;
  border-radius: 50% !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 24px !important;
  font-weight: bold !important;
  margin-right: 16px !important;
  flex-shrink: 0 !important;
}

.cb-payment-result-success .cb-payment-result-icon {
  background: #10b981 !important;
  color: white !important;
}

.cb-payment-result-error .cb-payment-result-icon {
  background: #ef4444 !important;
  color: white !important;
}

.cb-payment-result-cancelled .cb-payment-result-icon {
  background: #f59e0b !important;
  color: white !important;
}

.cb-payment-result-title {
  font-size: 24px !important;
  font-weight: 700 !important;
  margin: 0 !important;
  flex: 1 !important;
}

.cb-payment-result-success .cb-payment-result-title {
  color: #10b981 !important;
}

.cb-payment-result-error .cb-payment-result-title {
  color: #ef4444 !important;
}

.cb-payment-result-cancelled .cb-payment-result-title {
  color: #f59e0b !important;
}

.cb-payment-result-close {
  position: absolute !important;
  top: 16px !important;
  right: 16px !important;
  width: 32px !important;
  height: 32px !important;
  border: none !important;
  background: #f3f4f6 !important;
  border-radius: 50% !important;
  cursor: pointer !important;
  font-size: 18px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: #6b7280 !important;
  transition: all 0.2s !important;
}

.cb-payment-result-close:hover {
  background: #e5e7eb !important;
  color: #374151 !important;
}

.cb-payment-result-content {
  padding: 24px !important;
}

.cb-payment-result-message {
  font-size: 16px !important;
  color: #374151 !important;
  margin-bottom: 24px !important;
  line-height: 1.6 !important;
}

.cb-payment-result-details {
  background: #f9fafb !important;
  border-radius: 8px !important;
  padding: 20px !important;
  margin-bottom: 24px !important;
}

.cb-payment-result-details-title {
  font-size: 18px !important;
  font-weight: 600 !important;
  margin: 0 0 16px 0 !important;
  color: #374151 !important;
}

.cb-payment-result-detail-row {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  margin-bottom: 12px !important;
}

.cb-payment-result-detail-row:last-child {
  margin-bottom: 0 !important;
}

.cb-payment-result-detail-label {
  font-weight: 500 !important;
  color: #6b7280 !important;
}

.cb-payment-result-detail-value {
  font-weight: 600 !important;
  color: #374151 !important;
}

.cb-status-success {
  color: #10b981 !important;
}

.cb-status-error {
  color: #ef4444 !important;
}

.cb-status-cancelled {
  color: #f59e0b !important;
}

.cb-payment-result-actions {
  display: flex !important;
  gap: 12px !important;
  margin-bottom: 20px !important;
  flex-wrap: wrap !important;
}

.cb-payment-result-actions .cb-button {
  flex: 1 !important;
  min-width: 120px !important;
}

.cb-button-ghost {
  background: transparent !important;
  color: #6b7280 !important;
  border: 1px solid #d1d5db !important;
  padding: 8px 16px !important;
  font-size: 14px !important;
  width: 100% !important;
  margin-top: 8px !important;
}

.cb-button-ghost:hover {
  background: #f9fafb !important;
  color: #374151 !important;
  border-color: #9ca3af !important;
}

.cb-copy-order-id {
  text-align: center !important;
}

/* Mobile responsiveness for payment result overlay */
@media (max-width: 640px) {
  .cb-payment-result-container {
    width: 95% !important;
    margin: 10px !important;
  }
  
  .cb-payment-result-header {
    padding: 20px 20px 12px 20px !important;
  }
  
  .cb-payment-result-content {
    padding: 20px !important;
  }
  
  .cb-payment-result-icon {
    width: 40px !important;
    height: 40px !important;
    font-size: 20px !important;
    margin-right: 12px !important;
  }
  
  .cb-payment-result-title {
    font-size: 20px !important;
  }
  
  .cb-payment-result-actions {
    flex-direction: column !important;
  }
  
  .cb-payment-result-actions .cb-button {
    flex: none !important;
    width: 100% !important;
  }
}
`;

export const cartStyles = '';
export const productStyles = '';