import { SubscriptionPlanConfig, SubscriptionResponse } from "./types";

/**
 * Check if a given plan ID matches the current active subscription
 */
export function isCurrentPlan(
  planId: string,
  currentSubscription: SubscriptionResponse | null
): boolean {
  return (
    currentSubscription?.plan_id === planId &&
    currentSubscription?.status?.toLowerCase() === 'active'
  );
}

/**
 * Check if a given plan ID is scheduled as the next plan
 */
export function isNextPlan(
  planId: string,
  currentSubscription: SubscriptionResponse | null
): boolean {
  return (
    currentSubscription?.next_plan_id === planId &&
    currentSubscription?.next_plan_id !== currentSubscription?.plan_id
  );
}

/**
 * Check if there's a different plan scheduled for next billing cycle
 */
export function hasNextPlan(currentSubscription: SubscriptionResponse | null): boolean {
  return Boolean(
    currentSubscription?.next_plan_id &&
    currentSubscription.next_plan_id !== currentSubscription.plan_id
  );
}

/**
 * Get the next plan object when there's a scheduled plan change
 */
export function getNextPlan(
  currentSubscription: SubscriptionResponse | null,
  subscriptionPlans: SubscriptionPlanConfig[] | null
): SubscriptionPlanConfig | null {
  if (!currentSubscription?.next_plan_id || !subscriptionPlans) {
    return null;
  }
  return subscriptionPlans.find(p => p.id === currentSubscription.next_plan_id) || null;
}

/**
 * Get the current plan object
 */
export function getCurrentPlan(
  currentSubscription: SubscriptionResponse | null,
  subscriptionPlans: SubscriptionPlanConfig[] | null
): SubscriptionPlanConfig | null {
  if (!currentSubscription?.plan_id || !subscriptionPlans) {
    return null;
  }
  const planId = currentSubscription.plan_id || currentSubscription.plan_name;
  return subscriptionPlans.find(p => p.id === planId || p.name === planId) || null;
}

/**
 * Determine if the current subscription is a paid plan
 */
export function isPaidPlan(
  currentSubscription: SubscriptionResponse | null,
  subscriptionPlans: SubscriptionPlanConfig[] | null
): boolean {
  if (!currentSubscription?.plan_id && !currentSubscription?.plan_name) {
    return false;
  }
  
  const plan = getCurrentPlan(currentSubscription, subscriptionPlans);
  return Boolean(plan && !plan.is_free_plan);
}

/**
 * Get display name for the current plan
 */
export function getPlanDisplayName(currentSubscription: SubscriptionResponse | null): string {
  return currentSubscription?.plan_name || currentSubscription?.plan_id || 'Unknown Plan';
}

/**
 * Get status color for subscription status badge
 */
export function getStatusColor(status: string): string {
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'active':
      return 'green';
    case 'canceled':
      return 'red';
    case 'past_due':
      return 'orange';
    case 'incomplete':
      return 'yellow';
    default:
      return 'gray';
  }
}