"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "/pagina1.png",
  "/pagina2.png",
  "/pagina3.png"
];

export default function Spinner() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2000); // Cambiar cada 2 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative w-64 h-64 rounded-lg overflow-hidden shadow-lg">
        <Image
          src={images[currentImage]}
          alt={`Tribia página ${currentImage + 1}`}
          fill
          className="object-cover transition-opacity duration-500"
          priority
        />
      </div>
      
      {/* Dots indicator */}
      <div className="flex gap-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentImage ? "bg-blue-600" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
      
      {/* Loading spinner */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 font-medium">Cargando...</p>
      </div>
    </div>
  );
}
