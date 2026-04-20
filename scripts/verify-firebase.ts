/**
 * Script para verificar datos en Firebase
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";

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

async function verifyData() {
  console.log("🔍 Verificando datos en Firebase...\n");

  // Verificar partidos
  const matchesRef = collection(db, "matches");
  const matchesSnapshot = await getDocs(matchesRef);
  
  console.log(`📊 Total de partidos: ${matchesSnapshot.size}`);
  
  // Contar por grupo
  const groups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
  
  for (const group of groups) {
    const q = query(matchesRef, where("group", "==", group));
    const snapshot = await getDocs(q);
    console.log(`   Grupo ${group}: ${snapshot.size} partidos`);
  }

  console.log("\n✅ Verificación completada");
  process.exit(0);
}

verifyData();
