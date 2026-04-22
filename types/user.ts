export interface User {
  walletAddress: string;        // Primary key
  worldId: string;               // World ID verificado
  username?: string;
  totalWGoal: number;            // Balance total
  dailyLoginStreak: number;      // Racha de logins
  lastLoginDate: Date;
  
  // Sistema de referidos
  referralCode: string;          // Código único (8 chars)
  referredBy?: string;           // Código de quien lo refirió
  totalReferrals: number;        // Cuántos ha referido
  referralEarnings: number;      // WGoal ganados por referidos
  
  createdAt: Date;
}