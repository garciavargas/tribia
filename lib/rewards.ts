/**
 * Envía tokens WGOAL a un usuario desde la tesorería
 */
export async function sendWGoal(
  recipientAddress: string,
  amount: number
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    const response = await fetch("/api/send-reward", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipientAddress, amount })
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Failed to send reward"
      };
    }

    return {
      success: true,
      txHash: data.txHash
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