/**
 * Script para poblar Firebase con datos iniciales del Mundial 2026
 * 
 * Ejecutar con: npx tsx scripts/seed-firebase.ts
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbdosgXJhWVI_XDS6PifH6RkpdNZijkoQ",
  authDomain: "tribia-fb08c.firebaseapp.com",
  projectId: "tribia-fb08c",
  storageBucket: "tribia-fb08c.firebasestorage.app",
  messagingSenderId: "1095585601912",
  appId: "1:1095585601912:web:094b11fc85b13dcc1fd08d",
  measurementId: "G-ZC03DCMZKD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Partidos de la fase de grupos
const groupMatches = [
  // GRUPO A
  { matchId: "group-a-1", phase: "group", group: "A", homeTeam: "México", awayTeam: "Sudáfrica", matchDate: "2026-06-11T18:00:00Z", venue: "Estadio Azteca, Ciudad de México" },
  { matchId: "group-a-2", phase: "group", group: "A", homeTeam: "Corea del Sur", awayTeam: "UEFA Playoff D", matchDate: "2026-06-11T21:00:00Z", venue: "SoFi Stadium, Los Ángeles" },
  { matchId: "group-a-3", phase: "group", group: "A", homeTeam: "México", awayTeam: "Corea del Sur", matchDate: "2026-06-16T18:00:00Z", venue: "Estadio Azteca, Ciudad de México" },
  { matchId: "group-a-4", phase: "group", group: "A", homeTeam: "Sudáfrica", awayTeam: "UEFA Playoff D", matchDate: "2026-06-16T21:00:00Z", venue: "AT&T Stadium, Dallas" },
  { matchId: "group-a-5", phase: "group", group: "A", homeTeam: "México", awayTeam: "UEFA Playoff D", matchDate: "2026-06-21T20:00:00Z", venue: "Estadio Azteca, Ciudad de México" },
  { matchId: "group-a-6", phase: "group", group: "A", homeTeam: "Sudáfrica", awayTeam: "Corea del Sur", matchDate: "2026-06-21T20:00:00Z", venue: "MetLife Stadium, Nueva York" },

  // GRUPO B
  { matchId: "group-b-1", phase: "group", group: "B", homeTeam: "Canadá", awayTeam: "Qatar", matchDate: "2026-06-12T15:00:00Z", venue: "BMO Field, Toronto" },
  { matchId: "group-b-2", phase: "group", group: "B", homeTeam: "Suiza", awayTeam: "UEFA Playoff A", matchDate: "2026-06-12T18:00:00Z", venue: "Levi's Stadium, San Francisco" },
  { matchId: "group-b-3", phase: "group", group: "B", homeTeam: "Canadá", awayTeam: "Suiza", matchDate: "2026-06-17T15:00:00Z", venue: "BMO Field, Toronto" },
  { matchId: "group-b-4", phase: "group", group: "B", homeTeam: "Qatar", awayTeam: "UEFA Playoff A", matchDate: "2026-06-17T18:00:00Z", venue: "Mercedes-Benz Stadium, Atlanta" },
  { matchId: "group-b-5", phase: "group", group: "B", homeTeam: "Canadá", awayTeam: "UEFA Playoff A", matchDate: "2026-06-22T20:00:00Z", venue: "BC Place, Vancouver" },
  { matchId: "group-b-6", phase: "group", group: "B", homeTeam: "Qatar", awayTeam: "Suiza", matchDate: "2026-06-22T20:00:00Z", venue: "Arrowhead Stadium, Kansas City" },

  // GRUPO C
  { matchId: "group-c-1", phase: "group", group: "C", homeTeam: "Brasil", awayTeam: "Marruecos", matchDate: "2026-06-11T21:00:00Z", venue: "Hard Rock Stadium, Miami" },
  { matchId: "group-c-2", phase: "group", group: "C", homeTeam: "Haití", awayTeam: "Escocia", matchDate: "2026-06-12T00:00:00Z", venue: "Gillette Stadium, Boston" },
  { matchId: "group-c-3", phase: "group", group: "C", homeTeam: "Brasil", awayTeam: "Haití", matchDate: "2026-06-16T21:00:00Z", venue: "Hard Rock Stadium, Miami" },
  { matchId: "group-c-4", phase: "group", group: "C", homeTeam: "Marruecos", awayTeam: "Escocia", matchDate: "2026-06-17T00:00:00Z", venue: "Lincoln Financial Field, Filadelfia" },
  { matchId: "group-c-5", phase: "group", group: "C", homeTeam: "Brasil", awayTeam: "Escocia", matchDate: "2026-06-21T20:00:00Z", venue: "MetLife Stadium, Nueva York" },
  { matchId: "group-c-6", phase: "group", group: "C", homeTeam: "Marruecos", awayTeam: "Haití", matchDate: "2026-06-21T20:00:00Z", venue: "Hard Rock Stadium, Miami" },

  // GRUPO D
  { matchId: "group-d-1", phase: "group", group: "D", homeTeam: "Estados Unidos", awayTeam: "Paraguay", matchDate: "2026-06-12T21:00:00Z", venue: "SoFi Stadium, Los Ángeles" },
  { matchId: "group-d-2", phase: "group", group: "D", homeTeam: "Australia", awayTeam: "UEFA Playoff C", matchDate: "2026-06-13T00:00:00Z", venue: "Lumen Field, Seattle" },
  { matchId: "group-d-3", phase: "group", group: "D", homeTeam: "Estados Unidos", awayTeam: "Australia", matchDate: "2026-06-17T21:00:00Z", venue: "AT&T Stadium, Dallas" },
  { matchId: "group-d-4", phase: "group", group: "D", homeTeam: "Paraguay", awayTeam: "UEFA Playoff C", matchDate: "2026-06-18T00:00:00Z", venue: "Arrowhead Stadium, Kansas City" },
  { matchId: "group-d-5", phase: "group", group: "D", homeTeam: "Estados Unidos", awayTeam: "UEFA Playoff C", matchDate: "2026-06-22T20:00:00Z", venue: "SoFi Stadium, Los Ángeles" },
  { matchId: "group-d-6", phase: "group", group: "D", homeTeam: "Paraguay", awayTeam: "Australia", matchDate: "2026-06-22T20:00:00Z", venue: "Levi's Stadium, San Francisco" },

  // GRUPO E
  { matchId: "group-e-1", phase: "group", group: "E", homeTeam: "Alemania", awayTeam: "Costa de Marfil", matchDate: "2026-06-13T15:00:00Z", venue: "MetLife Stadium, Nueva York" },
  { matchId: "group-e-2", phase: "group", group: "E", homeTeam: "Ecuador", awayTeam: "Curazao", matchDate: "2026-06-13T18:00:00Z", venue: "NRG Stadium, Houston" },
  { matchId: "group-e-3", phase: "group", group: "E", homeTeam: "Alemania", awayTeam: "Ecuador", matchDate: "2026-06-18T15:00:00Z", venue: "Lincoln Financial Field, Filadelfia" },
  { matchId: "group-e-4", phase: "group", group: "E", homeTeam: "Costa de Marfil", awayTeam: "Curazao", matchDate: "2026-06-18T18:00:00Z", venue: "Hard Rock Stadium, Miami" },
  { matchId: "group-e-5", phase: "group", group: "E", homeTeam: "Alemania", awayTeam: "Curazao", matchDate: "2026-06-23T20:00:00Z", venue: "MetLife Stadium, Nueva York" },
  { matchId: "group-e-6", phase: "group", group: "E", homeTeam: "Costa de Marfil", awayTeam: "Ecuador", matchDate: "2026-06-23T20:00:00Z", venue: "NRG Stadium, Houston" },

  // GRUPO F
  { matchId: "group-f-1", phase: "group", group: "F", homeTeam: "Países Bajos", awayTeam: "Japón", matchDate: "2026-06-13T21:00:00Z", venue: "Levi's Stadium, San Francisco" },
  { matchId: "group-f-2", phase: "group", group: "F", homeTeam: "Túnez", awayTeam: "UEFA Playoff B", matchDate: "2026-06-14T00:00:00Z", venue: "Mercedes-Benz Stadium, Atlanta" },
  { matchId: "group-f-3", phase: "group", group: "F", homeTeam: "Países Bajos", awayTeam: "Túnez", matchDate: "2026-06-18T21:00:00Z", venue: "Levi's Stadium, San Francisco" },
  { matchId: "group-f-4", phase: "group", group: "F", homeTeam: "Japón", awayTeam: "UEFA Playoff B", matchDate: "2026-06-19T00:00:00Z", venue: "SoFi Stadium, Los Ángeles" },
  { matchId: "group-f-5", phase: "group", group: "F", homeTeam: "Países Bajos", awayTeam: "UEFA Playoff B", matchDate: "2026-06-23T20:00:00Z", venue: "Levi's Stadium, San Francisco" },
  { matchId: "group-f-6", phase: "group", group: "F", homeTeam: "Japón", awayTeam: "Túnez", matchDate: "2026-06-23T20:00:00Z", venue: "AT&T Stadium, Dallas" },

  // GRUPO G
  { matchId: "group-g-1", phase: "group", group: "G", homeTeam: "Bélgica", awayTeam: "Egipto", matchDate: "2026-06-14T15:00:00Z", venue: "AT&T Stadium, Dallas" },
  { matchId: "group-g-2", phase: "group", group: "G", homeTeam: "Irán", awayTeam: "Nueva Zelanda", matchDate: "2026-06-14T18:00:00Z", venue: "Lumen Field, Seattle" },
  { matchId: "group-g-3", phase: "group", group: "G", homeTeam: "Bélgica", awayTeam: "Irán", matchDate: "2026-06-19T15:00:00Z", venue: "AT&T Stadium, Dallas" },
  { matchId: "group-g-4", phase: "group", group: "G", homeTeam: "Egipto", awayTeam: "Nueva Zelanda", matchDate: "2026-06-19T18:00:00Z", venue: "Arrowhead Stadium, Kansas City" },
  { matchId: "group-g-5", phase: "group", group: "G", homeTeam: "Bélgica", awayTeam: "Nueva Zelanda", matchDate: "2026-06-24T20:00:00Z", venue: "Mercedes-Benz Stadium, Atlanta" },
  { matchId: "group-g-6", phase: "group", group: "G", homeTeam: "Egipto", awayTeam: "Irán", matchDate: "2026-06-24T20:00:00Z", venue: "NRG Stadium, Houston" },

  // GRUPO H
  { matchId: "group-h-1", phase: "group", group: "H", homeTeam: "España", awayTeam: "Uruguay", matchDate: "2026-06-14T21:00:00Z", venue: "Hard Rock Stadium, Miami" },
  { matchId: "group-h-2", phase: "group", group: "H", homeTeam: "Arabia Saudita", awayTeam: "Cabo Verde", matchDate: "2026-06-15T00:00:00Z", venue: "NRG Stadium, Houston" },
  { matchId: "group-h-3", phase: "group", group: "H", homeTeam: "España", awayTeam: "Arabia Saudita", matchDate: "2026-06-19T21:00:00Z", venue: "Hard Rock Stadium, Miami" },
  { matchId: "group-h-4", phase: "group", group: "H", homeTeam: "Uruguay", awayTeam: "Cabo Verde", matchDate: "2026-06-20T00:00:00Z", venue: "MetLife Stadium, Nueva York" },
  { matchId: "group-h-5", phase: "group", group: "H", homeTeam: "España", awayTeam: "Cabo Verde", matchDate: "2026-06-24T20:00:00Z", venue: "Hard Rock Stadium, Miami" },
  { matchId: "group-h-6", phase: "group", group: "H", homeTeam: "Uruguay", awayTeam: "Arabia Saudita", matchDate: "2026-06-24T20:00:00Z", venue: "Lincoln Financial Field, Filadelfia" },

  // GRUPO I
  { matchId: "group-i-1", phase: "group", group: "I", homeTeam: "Francia", awayTeam: "Senegal", matchDate: "2026-06-15T15:00:00Z", venue: "MetLife Stadium, Nueva York" },
  { matchId: "group-i-2", phase: "group", group: "I", homeTeam: "Noruega", awayTeam: "FIFA Playoff 2", matchDate: "2026-06-15T18:00:00Z", venue: "BMO Field, Toronto" },
  { matchId: "group-i-3", phase: "group", group: "I", homeTeam: "Francia", awayTeam: "Noruega", matchDate: "2026-06-20T15:00:00Z", venue: "Lincoln Financial Field, Filadelfia" },
  { matchId: "group-i-4", phase: "group", group: "I", homeTeam: "Senegal", awayTeam: "FIFA Playoff 2", matchDate: "2026-06-20T18:00:00Z", venue: "Mercedes-Benz Stadium, Atlanta" },
  { matchId: "group-i-5", phase: "group", group: "I", homeTeam: "Francia", awayTeam: "FIFA Playoff 2", matchDate: "2026-06-25T20:00:00Z", venue: "MetLife Stadium, Nueva York" },
  { matchId: "group-i-6", phase: "group", group: "I", homeTeam: "Senegal", awayTeam: "Noruega", matchDate: "2026-06-25T20:00:00Z", venue: "BMO Field, Toronto" },

  // GRUPO J
  { matchId: "group-j-1", phase: "group", group: "J", homeTeam: "Argentina", awayTeam: "Argelia", matchDate: "2026-06-15T21:00:00Z", venue: "SoFi Stadium, Los Ángeles" },
  { matchId: "group-j-2", phase: "group", group: "J", homeTeam: "Austria", awayTeam: "Jordania", matchDate: "2026-06-16T00:00:00Z", venue: "Lumen Field, Seattle" },
  { matchId: "group-j-3", phase: "group", group: "J", homeTeam: "Argentina", awayTeam: "Austria", matchDate: "2026-06-20T21:00:00Z", venue: "SoFi Stadium, Los Ángeles" },
  { matchId: "group-j-4", phase: "group", group: "J", homeTeam: "Argelia", awayTeam: "Jordania", matchDate: "2026-06-21T00:00:00Z", venue: "AT&T Stadium, Dallas" },
  { matchId: "group-j-5", phase: "group", group: "J", homeTeam: "Argentina", awayTeam: "Jordania", matchDate: "2026-06-25T20:00:00Z", venue: "SoFi Stadium, Los Ángeles" },
  { matchId: "group-j-6", phase: "group", group: "J", homeTeam: "Argelia", awayTeam: "Austria", matchDate: "2026-06-25T20:00:00Z", venue: "Levi's Stadium, San Francisco" },

  // GRUPO K
  { matchId: "group-k-1", phase: "group", group: "K", homeTeam: "Portugal", awayTeam: "Colombia", matchDate: "2026-06-16T15:00:00Z", venue: "Lincoln Financial Field, Filadelfia" },
  { matchId: "group-k-2", phase: "group", group: "K", homeTeam: "Uzbekistán", awayTeam: "FIFA Playoff 1", matchDate: "2026-06-16T18:00:00Z", venue: "Mercedes-Benz Stadium, Atlanta" },
  { matchId: "group-k-3", phase: "group", group: "K", homeTeam: "Portugal", awayTeam: "Uzbekistán", matchDate: "2026-06-21T15:00:00Z", venue: "Lincoln Financial Field, Filadelfia" },
  { matchId: "group-k-4", phase: "group", group: "K", homeTeam: "Colombia", awayTeam: "FIFA Playoff 1", matchDate: "2026-06-21T18:00:00Z", venue: "Hard Rock Stadium, Miami" },
  { matchId: "group-k-5", phase: "group", group: "K", homeTeam: "Portugal", awayTeam: "FIFA Playoff 1", matchDate: "2026-06-26T20:00:00Z", venue: "MetLife Stadium, Nueva York" },
  { matchId: "group-k-6", phase: "group", group: "K", homeTeam: "Colombia", awayTeam: "Uzbekistán", matchDate: "2026-06-26T20:00:00Z", venue: "NRG Stadium, Houston" },

  // GRUPO L
  { matchId: "group-l-1", phase: "group", group: "L", homeTeam: "Inglaterra", awayTeam: "Croacia", matchDate: "2026-06-16T21:00:00Z", venue: "MetLife Stadium, Nueva York" },
  { matchId: "group-l-2", phase: "group", group: "L", homeTeam: "Ghana", awayTeam: "Panamá", matchDate: "2026-06-17T00:00:00Z", venue: "NRG Stadium, Houston" },
  { matchId: "group-l-3", phase: "group", group: "L", homeTeam: "Inglaterra", awayTeam: "Ghana", matchDate: "2026-06-21T21:00:00Z", venue: "MetLife Stadium, Nueva York" },
  { matchId: "group-l-4", phase: "group", group: "L", homeTeam: "Croacia", awayTeam: "Panamá", matchDate: "2026-06-22T00:00:00Z", venue: "AT&T Stadium, Dallas" },
  { matchId: "group-l-5", phase: "group", group: "L", homeTeam: "Inglaterra", awayTeam: "Panamá", matchDate: "2026-06-26T20:00:00Z", venue: "MetLife Stadium, Nueva York" },
  { matchId: "group-l-6", phase: "group", group: "L", homeTeam: "Croacia", awayTeam: "Ghana", matchDate: "2026-06-26T20:00:00Z", venue: "Hard Rock Stadium, Miami" },
];

async function seedMatches() {
  console.log("🌱 Iniciando seed de partidos...\n");

  for (const match of groupMatches) {
    try {
      const matchRef = doc(db, "matches", match.matchId);
      await setDoc(matchRef, {
        ...match,
        status: "scheduled",
        result: null
      });
      console.log(`✅ ${match.matchId}: ${match.homeTeam} vs ${match.awayTeam}`);
    } catch (error) {
      console.error(`❌ Error en ${match.matchId}:`, error);
    }
  }

  console.log(`\n✅ Seed completado: ${groupMatches.length} partidos agregados`);
  process.exit(0);
}

seedMatches();
