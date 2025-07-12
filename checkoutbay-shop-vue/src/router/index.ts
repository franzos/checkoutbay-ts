import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { showMessage, showLoadingBar, showNotification } from '../utils/ui'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'country-selection',
    component: () => import('../views/CountrySelection.vue'),
    meta: {
      title: 'Select Country'
    }
  },
  {
    path: '/products',
    name: 'product-selection',
    component: () => import('../views/ProductSelection.vue'),
    meta: {
      title: 'Products',
      requiresCountry: true
    }
  },
  {
    path: '/cart',
    name: 'cart-checkout',
    component: () => import('../views/CartCheckout.vue'),
    meta: {
      title: 'Cart & Checkout',
      requiresCountry: true
    }
  },
  {
    path: '/payment',
    name: 'payment-confirmation',
    component: () => import('../views/PaymentConfirmation.vue'),
    meta: {
      title: 'Payment Confirmation'
    }
  },
  {
    path: '/order/thank-you',
    name: 'order-thank-you',
    component: () => import('../views/OrderThankYou.vue'),
    meta: {
      title: 'Order Confirmation'
    }
  },
  {
    path: '/order/error',
    name: 'order-error',
    component: () => import('../views/OrderError.vue'),
    meta: {
      title: 'Payment Error'
    }
  }
]

export const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  // Start loading bar
  showLoadingBar.start()
  // Update document title
  document.title = `${to.meta.title ? to.meta.title + ' - ' : ''}Rusty Shop`

  // Allow payment confirmation and order completion routes without checks
  if (to.name === 'payment-confirmation' || to.name === 'order-thank-you' || to.name === 'order-error') {
    next()
    return
  }

  // Get current state from localStorage
  const selectedCountry = localStorage.getItem('selectedCountry')
  const selectedWarehouse = localStorage.getItem('selectedWarehouse')

  // If no country is selected and trying to access protected pages, redirect to country selection
  if (to.meta.requiresCountry && (!selectedCountry || !selectedWarehouse)) {
    showMessage.warning('Please select your country first')
    
    next({ 
      name: 'country-selection',
      query: { redirect: to.fullPath }
    })
    return
  }

  next()
})

// After navigation
router.afterEach((to, from) => {
  // Finish loading bar
  if (to.name === from.name) {
    showLoadingBar.error()
  } else {
    showLoadingBar.finish()
  }

  // Scroll to top after navigation
  window.scrollTo(0, 0)
})

// Handle navigation errors
router.onError((error) => {
  console.error('Navigation error:', error)
  showLoadingBar.error()
  showNotification.error({
    title: 'Navigation Error',
    content: 'Failed to navigate to the requested page. Please try again.',
    duration: 0 // Stay until manually closed
  })
})
