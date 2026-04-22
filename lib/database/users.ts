import { db } from "../firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp
} from "firebase/firestore";
import { User, DailyReward } from "@/types/database";

const USERS_COLLECTION = "users";
const DAILY_REWARDS_COLLECTION = "dailyRewards";

/**
 * Crear o actualizar usuario
 */
export async function createUser(
  walletAddress: string,
  worldId: string,
  nullifierHash: string
): Promise<User> {
  const userRef = doc(db, USERS_COLLECTION, walletAddress);
  
  const userData: User = {
    walletAddress,
    worldId,
    nullifierHash,
    totalWGoal: 0,
    dailyLoginStreak: 0,
    lastLoginDate: new Date().toISOString(),
    welcomeReceived: false,
    createdAt: new Date().toISOString()
  };

  await setDoc(userRef, userData);
  return userData;
}

/**
 * Obtener usuario por wallet address
 */
export async function getUser(walletAddress: string): Promise<User | null> {
  const userRef = doc(db, USERS_COLLECTION, walletAddress);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as User;
  }
  
  return null;
}

/**
 * Actualizar datos del usuario
 */
export async function updateUser(
  walletAddress: string,
  data: Partial<User>
): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, walletAddress);
  await updateDoc(userRef, data);
}

/**
 * Marcar bienvenida como recibida
 */
export async function markWelcomeReceived(walletAddress: string): Promise<void> {
  await updateUser(walletAddress, {
    welcomeReceived: true,
    totalWGoal: 1
  });
}

/**
 * Actualizar balance de WGoal
 */
export async function updateWGoalBalance(
  walletAddress: string,
  amount: number
): Promise<void> {
  const user = await getUser(walletAddress);
  if (user) {
    await updateUser(walletAddress, {
      totalWGoal: user.totalWGoal + amount
    });
  }
}

/**
 * Verificar si el usuario ya reclamó el reward en los últimos 5 minutos
 * TODO: Cambiar a 24 horas en producción
 */
export async function hasClaimedDailyReward(
  walletAddress: string
): Promise<boolean> {
  const q = query(
    collection(db, DAILY_REWARDS_COLLECTION),
    where("userId", "==", walletAddress),
    where("claimed", "==", true)
  );
  
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return false;
  }
  
  // Obtener el último reward
  const lastReward = snapshot.docs[0].data() as DailyReward;
  const lastClaimedAt = new Date(lastReward.claimedAt);
  const now = new Date();
  
  // Verificar si han pasado 5 minutos (300000 ms)
  // TODO: Cambiar a 24 horas (86400000 ms) en producción
  const timeDiff = now.getTime() - lastClaimedAt.getTime();
  const FIVE_MINUTES = 5 * 60 * 1000; // 300000 ms
  
  return timeDiff < FIVE_MINUTES;
}

/**
 * Registrar reward diario
 */
export async function recordDailyReward(
  walletAddress: string,
  txHash: string
): Promise<void> {
  const now = new Date();
  const rewardId = `${walletAddress}-${now.getTime()}`;
  
  const rewardRef = doc(db, DAILY_REWARDS_COLLECTION, rewardId);
  
  const rewardData: DailyReward = {
    rewardId,
    userId: walletAddress,
    date: now.toISOString().split('T')[0],
    amount: 1,
    claimed: true,
    claimedAt: now.toISOString(),
    txHash
  };
  
  await setDoc(rewardRef, rewardData);
  
  // Actualizar balance del usuario
  await updateWGoalBalance(walletAddress, 1);
  
  // Actualizar última fecha de login y racha
  const user = await getUser(walletAddress);
  if (user) {
    await updateUser(walletAddress, {
      lastLoginDate: now.toISOString(),
      dailyLoginStreak: user.dailyLoginStreak + 1
    });
  }
}

/**
 * Obtener racha de login del usuario
 */
export async function getUserStreak(walletAddress: string): Promise<number> {
  const user = await getUser(walletAddress);
  return user?.dailyLoginStreak || 0;
}
