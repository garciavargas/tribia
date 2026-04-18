"use client";

import { useState, useEffect } from "react";

const SLIDES = [
  {
    image: "/pagina1.png",
    title: "Predice el Mundial 2026",
    subtitle: "Gana hasta 100,000 WGoal"
  },
  {
    image: "/pagina2.png",
    title: "Solo Usuarios Verificados",
    subtitle: "Conecta con World ID"
  },
  {
    image: "/paginatoken.png",
    title: "1 WGoal Gratis Diario",
    subtitle: "Inicia sesión cada día"
  }
];

export default function LoadingScreen({ 
  onComplete 
}: { 
  onComplete: () => void 
}) {
  const [progress, setProgress] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Duración total: 6 segundos (2 segundos por slide × 3 slides)
    const totalDuration = 6000;
    const interval = 50;
    const increment = (100 / totalDuration) * interval;

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, interval);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  useEffect(() => {
    // Cambiar slide cada 2 segundos
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => {
        const next = prev + 1;
        if (next >= SLIDES.length) return prev; // Mantener en el último slide
        return next;
      });
    }, 2000);

    return () => clearInterval(slideInterval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-blue-600 to-blue-900">
      {/* Carrusel de imágenes */}
      <div className="relative w-full h-full">
        {SLIDES.map((slide, index) => (
          <div
            key={index}
            className={`
              absolute inset-0 transition-opacity duration-500
              ${index === currentSlide ? "opacity-100" : "opacity-0"}
            `}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          />
        ))}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-end p-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            ⚽ Tribia
          </h1>
          <p className="text-xl text-white/90">
            {SLIDES[currentSlide].subtitle}
          </p>
        </div>

        {/* Barra de progreso */}
        <div className="w-full max-w-sm">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white text-center mt-2 text-sm">
            {Math.floor(progress)}%
          </p>
        </div>

        {/* Indicadores */}
        <div className="flex gap-2 mt-4">
          {SLIDES.map((_, index) => (
            <div
              key={index}
              className={`
                w-2 h-2 rounded-full transition-all
                ${index === currentSlide 
                  ? "bg-white w-6" 
                  : "bg-white/50"
                }
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
