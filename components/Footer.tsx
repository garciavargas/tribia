"use client";

interface FooterProps {
  userId?: string;
  isGuest?: boolean;
}

export default function Footer({ userId, isGuest = false }: FooterProps) {
  return (
    <footer className="bg-white border-t">
      <div className="p-4">
        <p className="text-center text-xs text-gray-500">
          © 2026 Tribia
        </p>
      </div>
    </footer>
  );
}
