"use client";

import { useEffect, useState } from "react";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  icon: string;
}

let toastId = 0;
const listeners: ((toast: Toast) => void)[] = [];

export function showToast(
  message: string,
  type: "success" | "error" | "info" = "success"
) {
  const icons = {
    success: "🎉",
    error: "❌",
    info: "ℹ️",
  };

  const toast: Toast = {
    id: `toast-${toastId++}`,
    message,
    type,
    icon: icons[type],
  };

  listeners.forEach((listener) => listener(toast));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    };

    listeners.push(listener);

    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`
            min-w-[300px] p-4 rounded-xl shadow-lg
            animate-slide-in-right
            ${
              toast.type === "success"
                ? "bg-green-500"
                : toast.type === "error"
                  ? "bg-red-500"
                  : "bg-blue-500"
            }
            text-white font-semibold
            flex items-center gap-3
          `}
        >
          <span className="text-2xl">{toast.icon}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
