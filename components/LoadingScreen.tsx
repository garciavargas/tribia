"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  "/pagina1.png",
  "/pagina2.png", 
  "/pagina3.png"
];

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    // Carrusel automático cada 2 segundos
    const imageInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 2000);

    // Barra de progreso de 0 a 100% en 6 segundos
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(imageInterval);
          setTimeout(onComplete, 500); // Pequeña pausa antes de completar
          return 100;
        }
        return prev + 2; // Incrementa 2% cada 120ms = 6 segundos total
      });
    }, 120);

    return () => {
      clearInterval(imageInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex flex-col items-center justify-center z-50">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          Tribia Futb⚽lera
        </h1>
        <p className="text-white/80 text-center">Mundial 2026</p>
      </div>

      {/* Carrusel de imágenes */}
      <div className="relative w-80 h-80 mb-8 rounded-2xl overflow-hidden shadow-2xl">
        <Image
          src={images[currentImage]}
          alt={`Tribia página ${currentImage + 1}`}
          fill
          className="object-cover transition-opacity duration-500"
          priority
        />
        
        {/* Overlay con dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentImage ? "bg-white" : "bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="w-80 mb-4">
        <div className="flex justify-between text-white/80 text-sm mb-2">
          <span>Cargando...</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-3">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Texto de carga */}
      <p className="text-white/60 text-center text-sm">
        Preparando tu experiencia futbolera...
      </p>
    </div>
  );
}