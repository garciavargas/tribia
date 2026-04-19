/**
 * Environment variables configuration
 * Safely access environment variables with validation
 */

export const env = {
  // Worldcoin Configuration
  worldcoin: {
    signingKey: process.env.WORLDCOIN_SIGNING_KEY,
    appId: process.env.NEXT_PUBLIC_APP_ID,
    appName: process.env.NEXT_PUBLIC_APP_NAME || "Tribia",
  },

  // WGoal Token
  wgoal: {
    contractAddress: process.env.WGOAL_CONTRACT_ADDRESS || "0x1a1e80a27093665a2e6e7f3af3b69bb64fe79cd7",
  },

  // Validation
  isProduction: process.env.NODE_ENV === "production",
  isDevelopment: process.env.NODE_ENV === "development",
} as const;

/**
 * Validate required environment variables
 */
export function validateEnv() {
  const required = [
    "WORLDCOIN_SIGNING_KEY",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}\n` +
      `Please check your .env.local file.`
    );
  }
}
