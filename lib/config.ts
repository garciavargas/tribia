// Configuración de Tribia
export const TRIBIA_CONFIG = {
  // Wallet del creador (tesorería de tokens)
  treasuryWallet: "0x7D02A94f30a6494bF003357639e8509b44Ff4a82",
  
  // Token WGOAL
  token: {
    address: "0x1A1E80A27093665a2E6e7f3Af3B69BB64fE79cD7",
    symbol: "WGOAL",
    decimals: 18,
    name: "WorldGoal2026"
  },
  
  // World Chain
  network: {
    chainId: 480,
    name: "World Chain",
    rpcUrl: "https://worldchain-mainnet.g.alchemy.com/public"
  }
} as const;