import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

const WGOAL_ABI = [
  'function transfer(address to, uint256 amount) external returns (bool)',
  'function balanceOf(address account) external view returns (uint256)',
];

export async function POST(request: Request) {
  try {
    const { userAddress, amount } = await request.json();

    if (!userAddress || !ethers.isAddress(userAddress)) {
      return NextResponse.json(
        { error: 'Dirección de wallet inválida' },
        { status: 400 }
      );
    }

    const provider = new ethers.JsonRpcProvider('https://worldchain-mainnet.g.alchemy.com/public');
    const treasuryWallet = new ethers.Wallet(
      process.env.TREASURY_PRIVATE_KEY!,
      provider
    );

    const wgoalContract = new ethers.Contract(
      process.env.WGOAL_CONTRACT_ADDRESS!,
      WGOAL_ABI,
      treasuryWallet
    );

    const tx = await wgoalContract.transfer(userAddress, ethers.parseEther(amount));
    const receipt = await tx.wait();

    return NextResponse.json({
      success: true,
      txHash: receipt.hash,
    });

  } catch (error: any) {
    console.error('Error en claim-wgoal:', error);
    
    return NextResponse.json(
      { error: error.message || 'Error al procesar el reclamo' },
      { status: 500 }
    );
  }
}
