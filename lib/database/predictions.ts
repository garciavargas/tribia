import { db } from "../firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  query,
  where,
  getDocs,
  updateDoc
} from "firebase/firestore";
import { Prediction, FinalPrediction } from "@/types/database";

const PREDICTIONS_COLLECTION = "predictions";
const FINAL_PREDICTIONS_COLLECTION = "finalPredictions";

/**
 * Guardar predicción de partido
 */
export async function savePrediction(
  userId: string,
  matchId: string,
  prediction: "home" | "draw" | "away"
): Promise<void> {
  const predictionId = `${userId}-${matchId}`;
  const predictionRef = doc(db, PREDICTIONS_COLLECTION, predictionId);
  
  // Verificar si ya existe
  const existing = await getDoc(predictionRef);
  if (existing.exists()) {
    throw new Error("Ya hiciste una predicción para este partido");
  }

  const predictionData: Prediction = {
    predictionId,
    userId,
    matchId,
    prediction,
    timestamp: new Date().toISOString(),
    rewardClaimed: false
  };

  await setDoc(predictionRef, predictionData);
}

/**
 * Obtener predicción de un usuario para un partido
 */
export async function getPrediction(
  userId: string,
  matchId: string
): Promise<Prediction | null> {
  const predictionId = `${userId}-${matchId}`;
  const predictionRef = doc(db, PREDICTIONS_COLLECTION, predictionId);
  const predictionSnap = await getDoc(predictionRef);
  
  if (predictionSnap.exists()) {
    return predictionSnap.data() as Prediction;
  }
  
  return null;
}

/**
 * Obtener todas las predicciones de un usuario
 */
export async function getUserPredictions(userId: string): Promise<Prediction[]> {
  const q = query(
    collection(db, PREDICTIONS_COLLECTION),
    where("userId", "==", userId)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Prediction);
}

/**
 * Obtener predicciones de un partido específico
 */
export async function getMatchPredictions(matchId: string): Promise<Prediction[]> {
  const q = query(
    collection(db, PREDICTIONS_COLLECTION),
    where("matchId", "==", matchId)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => doc.data() as Prediction);
}

/**
 * Actualizar resultado de predicción
 */
export async function updatePredictionResult(
  predictionId: string,
  isCorrect: boolean,
  rewardAmount?: number
): Promise<void> {
  const predictionRef = doc(db, PREDICTIONS_COLLECTION, predictionId);
  await updateDoc(predictionRef, {
    isCorrect,
    rewardAmount: rewardAmount || 0
  });
}

/**
 * Marcar recompensa como reclamada
 */
export async function markRewardClaimed(
  predictionId: string,
  txHash: string
): Promise<void> {
  const predictionRef = doc(db, PREDICTIONS_COLLECTION, predictionId);
  await updateDoc(predictionRef, {
    rewardClaimed: true,
    txHash
  });
}

// ============================================
// PREDICCIONES DE LA FINAL (PREMIO GORDO)
// ============================================

/**
 * Guardar predicción de la final
 */
export async function saveFinalPrediction(data: {
  userId: string;
  teamA: string;
  teamB: string;
  champion: string;
  decidedBy: "normal" | "extra" | "penalties";
  scoreA: number;
  scoreB: number;
}): Promise<void> {
  const predictionId = `final-${data.userId}`;
  const predictionRef = doc(db, FINAL_PREDICTIONS_COLLECTION, predictionId);
  
  // Verificar si ya existe
  const existing = await getDoc(predictionRef);
  if (existing.exists()) {
    throw new Error("Ya hiciste tu predicción del Premio Gordo");
  }

  const predictionData: FinalPrediction = {
    predictionId,
    userId: data.userId,
    teamA: data.teamA,
    teamB: data.teamB,
    champion: data.champion,
    decidedBy: data.decidedBy,
    scoreA: data.scoreA,
    scoreB: data.scoreB,
    timestamp: new Date().toISOString(),
    rewardClaimed: false
  };

  await setDoc(predictionRef, predictionData);
}

/**
 * Obtener predicción de la final de un usuario
 */
export async function getFinalPrediction(userId: string): Promise<FinalPrediction | null> {
  const predictionId = `final-${userId}`;
  const predictionRef = doc(db, FINAL_PREDICTIONS_COLLECTION, predictionId);
  const predictionSnap = await getDoc(predictionRef);
  
  if (predictionSnap.exists()) {
    return predictionSnap.data() as FinalPrediction;
  }
  
  return null;
}

/**
 * Obtener todas las predicciones de la final
 */
export async function getAllFinalPredictions(): Promise<FinalPrediction[]> {
  const snapshot = await getDocs(collection(db, FINAL_PREDICTIONS_COLLECTION));
  return snapshot.docs.map(doc => doc.data() as FinalPrediction);
}

/**
 * Procesar ganadores del Premio Gordo
 */
export async function processFinalWinners(
  teamA: string,
  teamB: string,
  champion: string,
  decidedBy: "normal" | "extra" | "penalties",
  scoreA: number,
  scoreB: number
): Promise<FinalPrediction[]> {
  const allPredictions = await getAllFinalPredictions();
  
  // Filtrar ganadores (predicción exacta)
  const winners = allPredictions.filter(p => 
    p.teamA === teamA &&
    p.teamB === teamB &&
    p.champion === champion &&
    p.decidedBy === decidedBy &&
    p.scoreA === scoreA &&
    p.scoreB === scoreB
  );

  // Calcular premio por ganador
  const JACKPOT = 1000000; // 1,000,000 WGoal
  const rewardPerWinner = winners.length > 0 ? JACKPOT / winners.length : 0;

  // Actualizar cada predicción ganadora
  for (const winner of winners) {
    const predictionRef = doc(db, FINAL_PREDICTIONS_COLLECTION, winner.predictionId);
    await updateDoc(predictionRef, {
      isCorrect: true,
      rewardAmount: rewardPerWinner
    });
  }

  return winners;
}
