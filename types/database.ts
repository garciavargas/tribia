// Tipos para la base de datos de Tribia

export interface User {
  walletAddress: string;        // Primary key
  worldId: string;               // World ID verificado
  nullifierHash: string;         // Hash único de World ID
  username?: string;
  totalWGoal: number;            // Balance total
  dailyLoginStreak: number;      // Racha de logins
  lastLoginDate: string;         // Fecha del último login (ISO string)
  welcomeReceived: boolean;      // Si ya recibió el pago de bienvenida
  createdAt: string;             // Fecha de registro (ISO string)
  referralCode?: string;         // Código de referido único
  referredBy?: string;           // Wallet address de quien lo refirió
}

export interface Match {
  matchId: string;               // Primary key (ej: "group-a-1")
  phase: "group" | "round32" | "round16" | "quarter" | "semi" | "final";
  group?: string;                // A-L (solo fase de grupos)
  homeTeam: string;
  awayTeam: string;
  matchDate: string;             // ISO string
  venue: string;
  result?: {
    homeScore: number;
    awayScore: number;
    winner: "home" | "away" | "draw";
    decidedBy: "normal" | "extra" | "penalties";
  };
  status: "scheduled" | "live" | "finished";
}

export interface Prediction {
  predictionId: string;          // Primary key
  userId: string;                // Foreign key → Users (walletAddress)
  matchId: string;               // Foreign key → Matches
  prediction: "home" | "draw" | "away";
  timestamp: string;             // ISO string - Para orden de llegada
  isCorrect?: boolean;           // null hasta que termine el partido
  rewardClaimed: boolean;
  rewardAmount?: number;         // WGoal ganados
  txHash?: string;               // Hash de la transacción de recompensa
}

export interface FinalPrediction {
  predictionId: string;          // Primary key
  userId: string;                // Foreign key → Users (walletAddress)
  teamA: string;                 // Equipo A en la final
  teamB: string;                 // Equipo B en la final
  champion: string;              // Equipo ganador predicho
  decidedBy: "normal" | "extra" | "penalties";
  scoreA: number;                // Marcador equipo A (90 min)
  scoreB: number;                // Marcador equipo B (90 min)
  timestamp: string;             // ISO string - Para orden de llegada
  isCorrect?: boolean;
  rewardAmount?: number;         // Parte del 1,000,000 WGoal
  rewardClaimed: boolean;
  txHash?: string;               // Hash de la transacción de recompensa
}

export interface DailyReward {
  rewardId: string;              // Primary key
  userId: string;                // Foreign key → Users (walletAddress)
  date: string;                  // Fecha del reward (YYYY-MM-DD)
  amount: number;                // Siempre 1 WGoal
  claimed: boolean;
  claimedAt?: string;            // ISO string
  txHash?: string;               // Hash de la transacción
}

export interface Referral {
  referralId: string;            // Primary key
  referrerId: string;            // Wallet del que refiere
  referredId: string;            // Wallet del referido
  referralCode: string;          // Código usado
  createdAt: string;             // ISO string
  rewardClaimed: boolean;
  rewardAmount: number;          // 2 WGoal para referrer, 1 para referred
  txHash?: string;               // Hash de la transacción
}
