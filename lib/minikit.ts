import { MiniKit } from "@worldcoin/minikit-js";

export const initMiniKit = () => {
  MiniKit.install(process.env.NEXT_PUBLIC_APP_ID);
};

export { MiniKit };
