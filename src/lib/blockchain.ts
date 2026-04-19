import { WGOAL_CONFIG, toWei } from "./wgoal";

/**
 * Send WGoal tokens to a user
 * This will be implemented with MiniKit when UI is ready
 */
export async function sendWGoal(
  to: string,
  amount: number
): Promise<{ success: boolean; txHash?: string; error?: string }> {
  try {
    // TODO: Implement with MiniKit Pay command
    // const { finalPayload } = await MiniKit.commandsAsync.pay({
    //   reference: generateReference(),
    //   to: to,
    //   tokens: [{
    //     symbol: WGOAL_CONFIG.symbol,
    //     token_amount: amount.toString()
    //   }],
    //   description: "Tribia reward"
    // });

    console.log(`[MOCK] Sending ${amount} WGoal to ${to}`);

    return {
      success: true,
      txHash: "0xmock...",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get WGoal balance for an address
 */
export async function getWGoalBalance(address: string): Promise<number> {
  try {
    // TODO: Query World Chain for balance
    // Use ethers.js or viem to call balanceOf on the token contract

    console.log(`[MOCK] Getting balance for ${address}`);

    return 0;
  } catch (error) {
    console.error("Error getting balance:", error);
    return 0;
  }
}

/**
 * Check if user has claimed daily reward today
 */
export async function hasClaimedToday(address: string): Promise<boolean> {
  // TODO: Query database or smart contract
  return false;
}

/**
 * Record daily login claim
 */
export async function recordDailyClaim(address: string): Promise<void> {
  // TODO: Save to database
  console.log(`[MOCK] Recording daily claim for ${address}`);
}
