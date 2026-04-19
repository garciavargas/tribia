"use client";

import { useEffect, useRef } from "react";

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  size: number;
}

export function triggerConfetti() {
  const event = new CustomEvent("triggerConfetti");
  window.dispatchEvent(event);
}

export function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];
    let pieces: ConfettiPiece[] = [];
    let animationId: number;

    const createConfetti = () => {
      pieces = [];
      for (let i = 0; i < 100; i++) {
        pieces.push({
          x: Math.random() * canvas.width,
          y: -20,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 3 + 2,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      pieces = pieces.filter((piece) => piece.y < canvas.height);

      pieces.forEach((piece) => {
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.rotation += piece.rotationSpeed;
        piece.vy += 0.1; // gravity

        ctx.save();
        ctx.translate(piece.x, piece.y);
        ctx.rotate((piece.rotation * Math.PI) / 180);
        ctx.fillStyle = piece.color;
        ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
        ctx.restore();
      });

      if (pieces.length > 0) {
        animationId = requestAnimationFrame(animate);
      }
    };

    const handleTrigger = () => {
      createConfetti();
      animate();
    };

    window.addEventListener("triggerConfetti", handleTrigger);

    return () => {
      window.removeEventListener("triggerConfetti", handleTrigger);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}
