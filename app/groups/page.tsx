"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export default function GroupsPage() {
  const [selectedGroup, setSelectedGroup] = useState("A");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Tabs */}
        <div className="sticky top-0 bg-white shadow-sm z-10">
          <div className="flex overflow-x-auto p-2 gap-2">
            {GROUPS.map(group => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`
                  min-w-[44px]
                  min-h-[44px]
                  px-4
                  py-2
                  rounded-lg
                  font-bold
                  transition-all
                  ${selectedGroup === group
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                  }
                `}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">
            Grupo {selectedGroup}
          </h2>

          <div className="bg-white rounded-lg p-6 shadow text-center text-gray-500">
            <p>Los partidos del Grupo {selectedGroup}</p>
            <p className="text-sm mt-2">se cargarán próximamente</p>
          </div>
        </div>
      </main>

      <Footer userId="user-demo-123" />
    </div>
  );
}
