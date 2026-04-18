"use client";

interface FooterProps {
  userId: string;
}

export default function Footer({ userId }: FooterProps) {
  return (
    <footer className="bg-white border-t">
      <div className="p-4">
        {/* Usuario */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm text-gray-600">
            Usuario: <span className="font-mono">{userId.slice(0, 12)}...</span>
          </div>
        </div>

        {/* Botón de referidos */}
        <a
          href="/referrals"
          className="
            block
            w-full
            min-h-[44px]
            px-4
            py-2
            bg-gradient-to-r
            from-purple-600
            to-pink-600
            text-white
            text-center
            font-bold
            rounded-lg
            active:scale-95
            transition-transform
          "
        >
          🎁 Invita amigos y gana 10 WGoal
        </a>
      </div>

      {/* Links */}
      <div className="border-t p-4">
        <p className="text-center text-xs text-gray-500">
          © 2026 Tribia. Mundial 2026
        </p>
      </div>
    </footer>
  );
}
