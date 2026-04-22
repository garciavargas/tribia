import { db } from "@/lib/firebase";
import { collection, doc, getDoc, setDoc, query, where, getDocs } from "firebase/firestore";

const NULLIFIERS_COLLECTION = "nullifiers";

export interface Nullifier {
  nullifier: string;
  action: string;
  walletAddress?: string;
  verifiedAt: number;
}

/**
 * Guarda un nullifier en Firebase
 */
export async function saveNullifier(
  nullifier: string,
  action: string,
  walletAddress?: string
): Promise<void> {
  const nullifierDoc = doc(db, NULLIFIERS_COLLECTION, `${action}_${nullifier}`);
  
  await setDoc(nullifierDoc, {
    nullifier,
    action,
    walletAddress,
    verifiedAt: Date.now(),
  });
}

/**
 * Verifica si un nullifier ya existe para una acción específica
 */
export async function checkNullifier(
  nullifier: string,
  action: string
): Promise<boolean> {
  const nullifierDoc = doc(db, NULLIFIERS_COLLECTION, `${action}_${nullifier}`);
  const docSnap = await getDoc(nullifierDoc);
  
  return docSnap.exists();
}

/**
 * Obtiene todos los nullifiers de un usuario (por wallet address)
 */
export async function getNullifiersByWallet(
  walletAddress: string
): Promise<Nullifier[]> {
  const q = query(
    collection(db, NULLIFIERS_COLLECTION),
    where("walletAddress", "==", walletAddress)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Nullifier);
}

/**
 * Obtiene todos los nullifiers de una acción específica
 */
export async function getNullifiersByAction(
  action: string
): Promise<Nullifier[]> {
  const q = query(
    collection(db, NULLIFIERS_COLLECTION),
    where("action", "==", action)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Nullifier);
}
