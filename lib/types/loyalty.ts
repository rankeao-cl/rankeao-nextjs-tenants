export interface LoyaltyProgram {
  is_active: boolean;
  name: string;
  description: string;
  earn_rate: number;
  redemption_rate: number;
  [key: string]: unknown;
}

export interface LoyaltyAdjustment {
  user_id: string;
  points: number;
  reason: string;
}
