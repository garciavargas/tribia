import { Referral, UserReferralStats } from "@/types/referral";

/**
 * Genera un código de referido único basado en wallet address
 */
export function generateReferralCode(walletAddress: string): string {
  // Tomar los primeros 8 caracteres del wallet (sin 0x)
  const code = walletAddress.slice(2, 10).toUpperCase();
  return code;
}

/**
 * Valida un código de referido
 */
export function validateReferralCode(code: string): boolean {
  // Debe ser exactamente 8 caracteres hexadecimales
  const regex = /^[0-9A-F]{8}$/;
  return regex.test(code);
}

/**
 * Obtiene el wallet address desde un código de referido
 */
export async function getWalletFromReferralCode(code: string): Promise<string | null> {
  // TODO: Consultar en base de datos
  // SELECT walletAddress FROM Users WHERE referralCode = code
  
  // Por ahora retornamos null (implementar con DB)
  return null;
}

/**
 * Aplica un código de referido a un nuevo usuario
 */
export async function applyReferralCode(
  newUserId: string,
  referralCode: string
): Promise<{ success: boolean; message: string }> {
  
  // 1. Validar formato del código
  if (!validateReferralCode(referralCode)) {
    return { success: false, message: "Código inválido" };
  }

  // 2. Verificar que el código no sea el propio
  const ownCode = generateReferralCode(newUserId);
  if (referralCode === ownCode) {
    return { success: false, message: "No puedes usar tu propio código" };
  }

  // 3. Verificar que el usuario no haya usado otro código antes
  const userStats = await getUserReferralStats(newUserId);
  if (userStats.hasUsedReferral) {
    return { success: false, message: "Ya usaste un código de referido" };
  }

  // 4. Buscar al referidor
  const referrerId = await getWalletFromReferralCode(referralCode);
  if (!referrerId) {
    return { success: false, message: "Código no encontrado" };
  }

  // 5. Crear el registro de referido
  const referral: Referral = {
    referralId: crypto.randomUUID(),
    referrerId,
    referredId: newUserId,
    referralCode,
    timestamp: new Date(),
    rewardClaimed: false,
    rewardAmount: 5
  };

  // TODO: Guardar en base de datos
  // await saveReferral(referral);

  // 6. Distribuir recompensas (5 WGoal para cada uno)
  await distributeReferralRewards(referrerId, newUserId);

  return { success: true, message: "¡Código aplicado! Ambos ganaron 5 WGoal" };
}

/**
 * Distribuye las recompensas de referido
 */
async function distributeReferralRewards(
  referrerId: string,
  referredId: string
): Promise<void> {
  // TODO: Enviar tokens WGoal
  // await sendWGoal(referrerId, 5);
  // await sendWGoal(referredId, 5);
  
  console.log(`Recompensas distribuidas: ${referrerId} y ${referredId} recibieron 5 WGoal`);
}

/**
 * Obtiene las estadísticas de referidos de un usuario
 */
export async function getUserReferralStats(userId: string): Promise<UserReferralStats> {
  // TODO: Consultar en base de datos
  // SELECT * FROM UserReferralStats WHERE userId = userId
  
  // Por ahora retornamos datos mock
  return {
    userId,
    referralCode: generateReferralCode(userId),
    totalReferrals: 0,
    totalEarned: 0,
    hasUsedReferral: false
  };
}

/**
 * Obtiene la lista de usuarios referidos por un usuario
 */
export async function getReferredUsers(userId: string): Promise<Referral[]> {
  // TODO: Consultar en base de datos
  // SELECT * FROM Referrals WHERE referrerId = userId ORDER BY timestamp DESC
  
  return [];
}

/**
 * Procesa un nuevo registro con código de referido desde URL
 */
export async function processReferralFromURL(
  newUserId: string,
  urlParams: URLSearchParams
): Promise<void> {
  const refCode = urlParams.get("ref");
  
  if (refCode) {
    const result = await applyReferralCode(newUserId, refCode);
    console.log("Referral result:", result);
  }
}