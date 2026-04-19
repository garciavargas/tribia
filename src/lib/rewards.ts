import { REWARDS, formatWGoal } from "./wgoal";
import { showToast } from "@/components/Toast";
import { triggerConfetti } from "@/components/Confetti";

// Toggle this to enable real blockchain transactions
const MOCK_MODE = true;

interface RewardResult {
  success: boolean;
  amount: number;
  txHash?: string;
  message: string;
}

/**
 * Reward user for daily login
 */
export async function rewardDailyLogin(
  walletAddress: string
): Promise<RewardResult> {
  const amount = REWARDS.DAILY_LOGIN;

  if (MOCK_MODE) {
    showToast(`¡Recompensa diaria! +${formatWGoal(amount)}`, "success");
    return {
      success: true,
      amount,
      message: "Recompensa diaria recibida (mock)",
    };
  }

  // TODO: Real blockchain transaction
  // return await sendWGoal(walletAddress, amount);
  return { success: false, amount: 0, message: "Not implemented" };
}

/**
 * Reward user for correct prediction
 */
export async function rewardPrediction(
  walletAddress: string,
  phase: "group" | "knockout"
): Promise<RewardResult> {
  const amount =
    phase === "group" ? REWARDS.GROUP_STAGE : REWARDS.KNOCKOUT_STAGE;

  if (MOCK_MODE) {
    showToast(`⚽ ¡Predicción correcta! +${formatWGoal(amount)}`, "success");
    triggerConfetti();
    return {
      success: true,
      amount,
      message: "Recompensa por predicción (mock)",
    };
  }

  // TODO: Real blockchain transaction
  return { success: false, amount: 0, message: "Not implemented" };
}

/**
 * Reward user for final prediction (top 50)
 */
export async function rewardFinalTop50(
  walletAddress: string
): Promise<RewardResult> {
  const amount = REWARDS.FINAL_TOP_50;

  if (MOCK_MODE) {
    showToast(`🏆 ¡Acertaste el campeón! +${formatWGoal(amount)}`, "success");
    triggerConfetti();
    return {
      success: true,
      amount,
      message: "Recompensa final top 50 (mock)",
    };
  }

  // TODO: Real blockchain transaction
  return { success: false, amount: 0, message: "Not implemented" };
}

/**
 * Reward user for jackpot (exact final result)
 */
export async function rewardJackpot(
  walletAddress: string,
  winners: number = 1
): Promise<RewardResult> {
  const amount = REWARDS.JACKPOT / winners;

  if (MOCK_MODE) {
    showToast(
      `🎰 ¡¡¡PREMIO GORDO!!! +${formatWGoal(amount)}`,
      "success"
    );
    triggerConfetti();
    return {
      success: true,
      amount,
      message: "Premio gordo (mock)",
    };
  }

  // TODO: Real blockchain transaction
  return { success: false, amount: 0, message: "Not implemented" };
}

/**
 * Get user WGoal balance
 */
export async function getBalance(walletAddress: string): Promise<number> {
  if (MOCK_MODE) {
    // Return mock balance for testing
    return 42;
  }

  // TODO: Query blockchain for real balance
  return 0;
}
