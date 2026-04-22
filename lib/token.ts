// Token WGOAL - WorldGoal2026
export const WGOAL_TOKEN = {
  name: "WorldGoal2026",
  symbol: "WGOAL",
  decimals: 18,
  totalSupply: "100000000", // 100 millones
  
  // Contract address del token en World Chain
  contractAddress: "0x1A1E80A27093665a2E6e7f3Af3B69BB64fE79cD7",
  
  // Factory contract (creador del token)
  factoryAddress: "0xc301bace6e9409b1876347a3dc94ec24d18c1fe4",
  
  // Network
  chain: "World Chain",
  chainId: 480, // World Chain Mainnet
  
  // Recompensas
  rewards: {
    dailyLogin: 1,
    correctPrediction: 5,
    referralBonus: 5,
    finalWinner: 10000,
    jackpot: 100000
  }
} as const;

// ABI mínimo para interactuar con el token
export const WGOAL_ABI = [
  // Leer balance
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function"
  },
  // Transferir tokens
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  },
  // Aprobar gasto
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  }
] as const;