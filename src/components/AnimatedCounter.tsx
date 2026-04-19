"use client";

import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

export default function AnimatedCounter({
  value,
  duration = 1000,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const startValue = displayValue;
    const diff = value - startValue;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(Math.floor(startValue + diff * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    if (diff !== 0) {
      requestAnimationFrame(animate);
    }
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
}
