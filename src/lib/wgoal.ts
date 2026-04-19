// WGoal Token Configuration
export const WGOAL_CONFIG = {
  name: "WorldGoal2026", // Internal only
  symbol: "WGoal", // Display in UI
  address: "0x1a1e80a27093665a2e6e7f3af3b69bb64fe79cd7",
  decimals: 18,
  maxSupply: 100_000_000,
  chain: "World Chain",
} as const;

// Reward amounts
export const REWARDS = {
  DAILY_LOGIN: 1,
  GROUP_STAGE: 5,
  KNOCKOUT_STAGE: 5,
  FINAL_TOP_50: 10_000,
  JACKPOT: 100_000,
} as const;

// Convert WGoal to wei (18 decimals)
export function toWei(amount: number): bigint {
  return BigInt(amount) * BigInt(10 ** WGOAL_CONFIG.decimals);
}

// Convert wei to WGoal
export function fromWei(wei: bigint): number {
  return Number(wei) / 10 ** WGOAL_CONFIG.decimals;
}

// Format WGoal for display
export function formatWGoal(amount: number): string {
  return `${amount.toLocaleString()} WGoal`;
}
