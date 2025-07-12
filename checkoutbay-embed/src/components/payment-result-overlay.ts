/**
 * Payment Result Overlay
 * Shows order confirmation or payment error with order details
 */

import { createElement, escapeHtml } from '../utils/dom.js';

interface PaymentResultData {
  type: 'success' | 'error' | 'cancelled';
  orderId: string;
  shopId?: string;
  message: string;
}

interface PaymentResultOverlayCallbacks {
  onClose?: () => void;
}

export class PaymentResultOverlay {
  private overlay: HTMLElement | null;
  private resultData: PaymentResultData;
  private callbacks: PaymentResultOverlayCallbacks;

  constructor(resultData: PaymentResultData, callbacks: PaymentResultOverlayCallbacks = {}) {
    this.resultData = resultData;
    this.callbacks = {
      onClose: callbacks.onClose || (() => {})
    };
    this.overlay = null;
  }

  show(): void {
    this.createOverlay();
    this.renderContent();
    
    // Show overlay
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      if (this.overlay) {
        this.overlay.classList.add('cb-payment-result-show');
      }
    });
  }

  private createOverlay(): void {
    // Create full-screen overlay
    this.overlay = createElement('div', `cb-payment-result-overlay cb-payment-result-${this.resultData.type}`);
    
    // Create container
    const container = createElement('div', 'cb-payment-result-container');
    
    // Header
    const header = createElement('div', 'cb-payment-result-header');
    
    // Status icon
    const statusIcon = createElement('div', 'cb-payment-result-icon');
    if (this.resultData.type === 'success') {
      statusIcon.innerHTML = '✓';
    } else if (this.resultData.type === 'error') {
      statusIcon.innerHTML = '✗';
    } else {
      statusIcon.innerHTML = '⚠';
    }
    
    // Title
    const title = createElement('h1', 'cb-payment-result-title');
    if (this.resultData.type === 'success') {
      title.innerHTML = 'Order Confirmed!';
    } else if (this.resultData.type === 'error') {
      title.innerHTML = 'Payment Failed';
    } else {
      title.innerHTML = 'Payment Cancelled';
    }
    
    // Close button
    const closeButton = createElement('button', 'cb-payment-result-close', {
      innerHTML: '×',
      'aria-label': 'Close'
    });
    closeButton.addEventListener('click', () => this.handleClose());
    
    header.appendChild(statusIcon);
    header.appendChild(title);
    header.appendChild(closeButton);
    
    // Content area
    const content = createElement('div', 'cb-payment-result-content');
    
    container.appendChild(header);
    container.appendChild(content);
    
    this.overlay.appendChild(container);
    document.body.appendChild(this.overlay);
  }

  private renderContent(): void {
    if (!this.overlay) return;
    
    const content = this.overlay.querySelector('.cb-payment-result-content') as HTMLElement;
    
    // Main message
    const messageElement = createElement('div', 'cb-payment-result-message', {
      innerHTML: escapeHtml(this.resultData.message)
    });
    content.appendChild(messageElement);
    
    // Order details section
    const detailsSection = createElement('div', 'cb-payment-result-details');
    
    const detailsTitle = createElement('h3', 'cb-payment-result-details-title', {
      innerHTML: 'Order Details'
    });
    detailsSection.appendChild(detailsTitle);
    
    // Order ID
    const orderIdRow = createElement('div', 'cb-payment-result-detail-row');
    const orderIdLabel = createElement('span', 'cb-payment-result-detail-label', {
      innerHTML: 'Order Number:'
    });
    const orderIdValue = createElement('span', 'cb-payment-result-detail-value', {
      innerHTML: escapeHtml(this.resultData.orderId)
    });
    orderIdRow.appendChild(orderIdLabel);
    orderIdRow.appendChild(orderIdValue);
    detailsSection.appendChild(orderIdRow);
    
    // Status
    const statusRow = createElement('div', 'cb-payment-result-detail-row');
    const statusLabel = createElement('span', 'cb-payment-result-detail-label', {
      innerHTML: 'Status:'
    });
    const statusValue = createElement('span', 'cb-payment-result-detail-value');
    if (this.resultData.type === 'success') {
      statusValue.innerHTML = 'Payment Successful';
      statusValue.className += ' cb-status-success';
    } else if (this.resultData.type === 'error') {
      statusValue.innerHTML = 'Payment Failed';
      statusValue.className += ' cb-status-error';
    } else {
      statusValue.innerHTML = 'Payment Cancelled';
      statusValue.className += ' cb-status-cancelled';
    }
    statusRow.appendChild(statusLabel);
    statusRow.appendChild(statusValue);
    detailsSection.appendChild(statusRow);
    
    // Date/Time
    const dateRow = createElement('div', 'cb-payment-result-detail-row');
    const dateLabel = createElement('span', 'cb-payment-result-detail-label', {
      innerHTML: 'Date:'
    });
    const dateValue = createElement('span', 'cb-payment-result-detail-value', {
      innerHTML: new Date().toLocaleString()
    });
    dateRow.appendChild(dateLabel);
    dateRow.appendChild(dateValue);
    detailsSection.appendChild(dateRow);
    
    content.appendChild(detailsSection);
    
    // Action buttons section
    const actionsSection = createElement('div', 'cb-payment-result-actions');
    
    if (this.resultData.type === 'success') {
      // Success actions
      const continueShoppingBtn = createElement('button', 'cb-button cb-button-secondary', {
        innerHTML: 'Continue Shopping'
      });
      continueShoppingBtn.addEventListener('click', () => this.handleClose());
      
      const printReceiptBtn = createElement('button', 'cb-button cb-button-primary', {
        innerHTML: 'Print Receipt'
      });
      printReceiptBtn.addEventListener('click', () => {
        window.print();
      });
      
      actionsSection.appendChild(continueShoppingBtn);
      actionsSection.appendChild(printReceiptBtn);
    } else {
      // Error/cancelled actions
      const tryAgainBtn = createElement('button', 'cb-button cb-button-primary', {
        innerHTML: this.resultData.type === 'error' ? 'Try Again' : 'Return to Cart'
      });
      tryAgainBtn.addEventListener('click', () => this.handleClose());
      
      const contactSupportBtn = createElement('button', 'cb-button cb-button-secondary', {
        innerHTML: 'Contact Support'
      });
      contactSupportBtn.addEventListener('click', () => {
        // Could open a support modal or redirect to support page
        alert('Please contact support for assistance with your order.');
      });
      
      actionsSection.appendChild(tryAgainBtn);
      if (this.resultData.type === 'error') {
        actionsSection.appendChild(contactSupportBtn);
      }
    }
    
    content.appendChild(actionsSection);
    
    // Add copy order ID functionality
    const copyBtn = createElement('button', 'cb-button cb-button-ghost cb-copy-order-id', {
      innerHTML: '📋 Copy Order ID'
    });
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(this.resultData.orderId).then(() => {
        copyBtn.innerHTML = '✓ Copied!';
        setTimeout(() => {
          copyBtn.innerHTML = '📋 Copy Order ID';
        }, 2000);
      }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = this.resultData.orderId;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        copyBtn.innerHTML = '✓ Copied!';
        setTimeout(() => {
          copyBtn.innerHTML = '📋 Copy Order ID';
        }, 2000);
      });
    });
    
    content.appendChild(copyBtn);
  }

  private handleClose(): void {
    this.callbacks.onClose?.();
    this.destroy();
  }

  destroy(): void {
    if (this.overlay && this.overlay.parentNode) {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Remove overlay
      this.overlay.parentNode.removeChild(this.overlay);
    }
    
    this.overlay = null;
  }
}