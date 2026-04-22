import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { defineChain } from "viem";

// World Chain definition
const worldChain = defineChain({
  id: 480,
  name: "World Chain",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://worldchain-mainnet.g.alchemy.com/public"] }
  },
  blockExplorers: {
    default: { name: "WorldScan", url: "https://worldscan.org" }
  }
});

const WGOAL_ABI = [
  {
    constant: false,
    inputs: [
      { name: "_to", type: "address" },
      { name: "_value", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  }
] as const;

export async function POST(request: NextRequest) {
  try {
    const { recipientAddress, amount } = await request.json();

    // Validaciones
    if (!recipientAddress || !amount) {
      return NextResponse.json(
        { error: "Missing recipientAddress or amount" },
        { status: 400 }
      );
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Obtener configuración del servidor
    const privateKey = process.env.TREASURY_PRIVATE_KEY;
    const contractAddress = process.env.WGOAL_CONTRACT_ADDRESS;

    if (!privateKey || !contractAddress) {
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Crear cuenta desde private key
    const account = privateKeyToAccount(`0x${privateKey}` as `0x${string}`);

    // Crear wallet client
    const walletClient = createWalletClient({
      account,
      chain: worldChain,
      transport: http()
    });

    // Convertir amount a wei (18 decimales)
    const amountInWei = parseEther(amount.toString());

    // Enviar transacción
    const hash = await walletClient.writeContract({
      address: contractAddress as `0x${string}`,
      abi: WGOAL_ABI,
      functionName: "transfer",
      args: [recipientAddress as `0x${string}`, amountInWei]
    });

    return NextResponse.json({
      success: true,
      txHash: hash,
      amount,
      recipient: recipientAddress
    });

  } catch (error: any) {
    console.error("Error sending reward:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send reward" },
      { status: 500 }
    );
  }
}
