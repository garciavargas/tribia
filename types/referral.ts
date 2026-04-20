export interface Referral {
  referralId: string;
  referrerId: string;        // Wallet del que refiere
  referredId: string;        // Wallet del referido
  referralCode: string;      // Código usado
  timestamp: Date;
  rewardClaimed: boolean;
  rewardAmount: number;      // 5 WGoal para cada uno
}

export interface UserReferralStats {
  userId: string;
  referralCode: string;      // Código único del usuario
  totalReferrals: number;    // Cuántos ha referido
  totalEarned: number;       // WGoal ganados por referidos
  referredBy?: string;       // Código de quien lo refirió
  hasUsedReferral: boolean;  // Si ya usó un código
}