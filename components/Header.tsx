'use client';

interface HeaderProps {
  walletAddress: string;
}

export default function Header({ walletAddress }: HeaderProps) {
  return (
    <header className="w-full p-4 bg-gray-100 border-b">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Trivia Futbolera</h1>
        
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="text-gray-600">Wallet: </span>
            <span className="font-mono">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          </div>
          
          <div className="text-sm">
            <span className="text-gray-600">WGOAL: </span>
            <span className="font-bold text-green-600">0.00</span>
          </div>
        </div>
      </div>
    </header>
  );
}
