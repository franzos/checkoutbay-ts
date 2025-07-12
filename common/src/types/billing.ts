// Enhanced billing display combining subscriptions and credits
export interface CombinedUsageDisplay {
  resource_type: string;
  subscription_allowance?: {
    allowed: number;
    used: number;
    remaining: number;
  };
  credit_balance: number;
  estimated_cost_per_unit: number;
}

// Enhanced account balance including subscription context
export interface EnhancedAccountBalance {
  balance: number;
  currency: string;
  last_updated: string;
}