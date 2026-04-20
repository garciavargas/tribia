import { MiniKit } from "@worldcoin/minikit-js";

export const initMiniKit = () => {
  const appId = process.env.NEXT_PUBLIC_APP_ID;
  
  if (!appId) {
    console.error("NEXT_PUBLIC_APP_ID no está configurado");
    return;
  }

  MiniKit.install(appId);
  console.log("MiniKit instalado con App ID:", appId);
};

export const isMiniKitAvailable = (): boolean => {
  return typeof window !== "undefined" && !!MiniKit.isInstalled();
};

export { MiniKit };
