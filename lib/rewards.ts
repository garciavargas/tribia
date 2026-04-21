import { MiniKit } from "@/lib/minikit";
import { TRIBIA_CONFIG } from "./config";
import { WGOAL_ABI } from "./token";

/**
 * Envía tokens WGOAL a un usuario
 */
export async function sendWGoal(
  recipientAddress: string,
  amount: number
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    // Validar inputs
    if (!recipientAddress || !amount || amount <= 0) {
      return {
        success: false,
        error: "Invalid recipient address or amount"
      };
    }

    // Convertir amount a wei (18 decimales)
    const amountInWei = BigInt(Math.floor(amount)) * BigInt(10 ** 18);

    const result: any = await MiniKit.sendTransaction({
      chainId: 480,
      transactions: [
        {
          to: TRIBIA_CONFIG.token.address,
          abi: WGOAL_ABI,
          functionName: "transfer",
          args: [recipientAddress, amountInWei.toString()]
        } as any
      ]
    });

    if (result.finalPayload?.status === "success") {
      return {
        success: true,
        txHash: result.finalPayload.transaction_hash
      };
    }

    return {
      success: false,
      error: "Transaction failed"
    };
  } catch (error) {
    console.error("Error sending WGOAL:", error);
    return {
      success: false,
      error: String(error)
    };
  }
}

/**
 * Obtiene el balance de WGOAL de un usuario
 */
export async function getWGoalBalance(
  walletAddress: string
): Promise<number> {
  try {
    // Validar input
    if (!walletAddress) {
      return 0;
    }

    const result: any = await MiniKit.sendTransaction({
      chainId: 480,
      transactions: [
        {
          to: TRIBIA_CONFIG.token.address,
          abi: WGOAL_ABI,
          functionName: "balanceOf",
          args: [walletAddress]
        } as any
      ]
    });

    if (result.finalPayload?.status === "success") {
      // Convertir de wei a tokens (18 decimales)
      const balanceInWei = BigInt(result.finalPayload.return_value || "0");
      const balance = Number(balanceInWei / BigInt(10 ** 18));
      return balance;
    }

    return 0;
  } catch (error) {
    console.error("Error getting balance:", error);
    return 0;
  }
}

/**
 * Distribuye recompensa diaria (1 WGOAL)
 */
export async function distributeDailyReward(
  userAddress: string
): Promise<boolean> {
  const result = await sendWGoal(userAddress, 1);
  return result.success;
}

/**
 * Distribuye recompensa por predicción correcta (5 WGOAL)
 */
export async function distributePredictionReward(
  userAddress: string
): Promise<boolean> {
  const result = await sendWGoal(userAddress, 5);
  return result.success;
}

/**
 * Distribuye recompensa por referido (5 WGOAL a cada uno)
 */
export async function distributeReferralReward(
  referrerAddress: string,
  referredAddress: string
): Promise<{ referrer: boolean; referred: boolean }> {
  const referrerResult = await sendWGoal(referrerAddress, 5);
  const referredResult = await sendWGoal(referredAddress, 5);

  return {
    referrer: referrerResult.success,
    referred: referredResult.success
  };
}

/**
 * Distribuye premio final (10,000 WGOAL)
 */
export async function distributeFinalPrize(
  userAddress: string
): Promise<boolean> {
  const result = await sendWGoal(userAddress, 10000);
  return result.success;
}

/**
 * Distribuye premio gordo (100,000 WGOAL)
 */
export async function distributeJackpot(
  userAddress: string
): Promise<boolean> {
  const result = await sendWGoal(userAddress, 100000);
  return result.success;
}