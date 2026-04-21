"use client";

interface HeaderProps {
  isGuest?: boolean;
}

export default function Header({ isGuest = false }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex items-center justify-between p-4">
        <a href={isGuest ? "/" : "/dashboard"} className="text-xl font-bold text-blue-600">
          ⚽ Tribia
        </a>
      </div>
    </header>
  );
}
