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
 * Verificar si el usuario ya reclamó el reward diario de hoy
 */
export async function hasClaimedDailyReward(
  walletAddress: string
): Promise<boolean> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  const q = query(
    collection(db, DAILY_REWARDS_COLLECTION),
    where("userId", "==", walletAddress),
    where("date", "==", today),
    where("claimed", "==", true)
  );
  
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

/**
 * Registrar reward diario
 */
export async function recordDailyReward(
  walletAddress: string,
  txHash: string
): Promise<void> {
  const today = new Date().toISOString().split('T')[0];
  const rewardId = `${walletAddress}-${today}`;
  
  const rewardRef = doc(db, DAILY_REWARDS_COLLECTION, rewardId);
  
  const rewardData: DailyReward = {
    rewardId,
    userId: walletAddress,
    date: today,
    amount: 1,
    claimed: true,
    claimedAt: new Date().toISOString(),
    txHash
  };
  
  await setDoc(rewardRef, rewardData);
  
  // Actualizar balance del usuario
  await updateWGoalBalance(walletAddress, 1);
  
  // Actualizar última fecha de login y racha
  const user = await getUser(walletAddress);
  if (user) {
    const lastLogin = new Date(user.lastLoginDate);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
    
    await updateUser(walletAddress, {
      lastLoginDate: today.toISOString(),
      dailyLoginStreak: diffDays === 1 ? user.dailyLoginStreak + 1 : 1
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
