"use client";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
      {/* Anuncio */}
      <div className="overflow-hidden">
        <div className="animate-marquee whitespace-nowrap py-2 px-4">
          <span className="text-sm font-bold">
            🏆 ¡Premio gordo de 100,000 WGoal en la final del Mundial 2026!
          </span>
        </div>
      </div>

      {/* Navegación */}
      <nav className="bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <a href="/dashboard" className="text-xl font-bold text-blue-600">
            ⚽ Tribia
          </a>

          <div className="flex gap-2">
            <a
              href="/groups"
              className="
                min-h-[44px]
                px-4
                py-2
                bg-gray-100
                text-gray-700
                rounded-lg
                font-medium
                active:scale-95
                transition-transform
                text-sm
              "
            >
              Grupos
            </a>
            <a
              href="/knockout"
              className="
                min-h-[44px]
                px-4
                py-2
                bg-gray-100
                text-gray-700
                rounded-lg
                font-medium
                active:scale-95
                transition-transform
                text-sm
              "
            >
              Eliminatorias
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
