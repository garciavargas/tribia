import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const CLAIM_INTERVAL = 5 * 60 * 1000; // 5 minutos para pruebas (cambiar a 24 * 60 * 60 * 1000 para producción)

export async function canClaimDailyReward(address: string): Promise<{ canClaim: boolean; nextClaimTime?: number }> {
  const userRef = doc(db, 'users', address);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    return { canClaim: true };
  }

  const lastClaim = userDoc.data()?.lastDailyClaim;
  
  if (!lastClaim) {
    return { canClaim: true };
  }

  const now = Date.now();
  const timeSinceLastClaim = now - lastClaim;

  if (timeSinceLastClaim >= CLAIM_INTERVAL) {
    return { canClaim: true };
  }

  return {
    canClaim: false,
    nextClaimTime: lastClaim + CLAIM_INTERVAL,
  };
}

export async function recordDailyClaim(address: string) {
  const userRef = doc(db, 'users', address);
  await setDoc(
    userRef,
    {
      lastDailyClaim: Date.now(),
      updatedAt: Date.now(),
    },
    { merge: true }
  );
}
