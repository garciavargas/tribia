"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ModalInicio from "@/components/modals/ModalInicio";
import { MiniKit, isMiniKitAvailable } from "@/lib/minikit";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [miniKitReady, setMiniKitReady] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar MiniKit inmediatamente y con reintentos
    const checkMiniKit = () => {
      const isAvailable = isMiniKitAvailable();
      
      if (isAvailable) {
        setMiniKitReady(true);
      }
    };

    // Verificar inmediatamente
    checkMiniKit();
    
    // Reintentar cada 500ms durante 5 segundos
    const interval = setInterval(checkMiniKit, 500);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      // Si después de 5 segundos no está disponible, habilitarlo igual
      // (para permitir pruebas en desarrollo)
      if (!isMiniKitAvailable()) {
        console.warn("MiniKit no detectado, pero habilitando botón");
        setMiniKitReady(true);
      }
    }, 5000);
    
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const handleLoadingComplete = () => {
    setLoading(false);
    setShowModal(true);
  };

  const handleConnect = async () => {
    setConnecting(true);
    
    try {
      if (!miniKitReady) {
        const toast = (await import("react-hot-toast")).default;
        toast.error("MiniKit no está disponible. Abre la app desde Worldcoin.");
        setConnecting(false);
        return;
      }

      const toast = (await import("react-hot-toast")).default;
      toast.loading("Conectando wallet...", { id: "auth" });

      // Generar nonce único
      const nonce = crypto.randomUUID();
      const requestId = crypto.randomUUID();
      const expirationTime = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      console.log("Iniciando Wallet Auth con:", { nonce, requestId });

      // Conectar wallet con MiniKit
      const walletAuthResult = await MiniKit.walletAuth({
        nonce,
        requestId,
        expirationTime,
        statement: "Inicia sesión en Tribia para predecir el Mundial 2026"
      });

      console.log("Wallet Auth Result:", walletAuthResult);

      // Verificar si se ejecutó con fallback (no está en World App)
      if (walletAuthResult.executedWith === "fallback") {
        toast.error("Debes usar World App para conectar", { id: "auth" });
        setConnecting(false);
        return;
      }

      // Verificar si tenemos la dirección de la wallet
      if (!walletAuthResult.data?.address) {
        toast.error("No se pudo obtener la dirección de la wallet", { id: "auth" });
        setConnecting(false);
        return;
      }

      const address = walletAuthResult.data.address;
      console.log("Wallet conectada:", address);

      toast.loading("Verificando identidad...", { id: "auth" });

      // Verificar World ID con IDKit 4.0
      try {
        const { IDKit, orbLegacy } = await import("@worldcoin/idkit-core");
        
        const appId = process.env.NEXT_PUBLIC_APP_ID;
        const rpId = process.env.NEXT_PUBLIC_RP_ID;
        
        if (!appId || !rpId) {
          throw new Error(`Configuración faltante: ${!appId ? 'APP_ID' : 'RP_ID'}`);
        }

        // Obtener RP signature del backend
        const rpSig = await fetch("/api/rp-signature", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "tribia-signup" }),
        }).then((r) => r.json());

        if (!rpSig.sig) {
          throw new Error("No se pudo obtener la firma RP");
        }

        // Crear request de verificación
        const request = await IDKit.request({
          app_id: appId as `app_${string}`,
          action: "tribia-signup",
          rp_context: {
            rp_id: rpId as `rp_${string}`,
            nonce: rpSig.nonce,
            created_at: rpSig.created_at,
            expires_at: rpSig.expires_at,
            signature: rpSig.sig,
          },
          allow_legacy_proofs: true,
          environment: "production",
        }).preset(orbLegacy({ signal: crypto.randomUUID() }));

        // Obtener proof del usuario
        const idkitResponse = await request.pollUntilCompletion();

        // Verificar proof en backend
        const verifyResult = await fetch("/api/verify-proof", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ idkitResponse }),
        }).then((r) => r.json());

        if (!verifyResult.success) {
          toast.error("Verificación de World ID fallida", { id: "auth" });
          setConnecting(false);
          return;
        }

        // Guardar datos de usuario en localStorage
        localStorage.setItem("tribia_user", JSON.stringify({
          address,
          verified: true,
          nullifierHash: verifyResult.nullifier,
          joinedAt: Date.now()
        }));
        
        // Crear usuario en Firebase
        const { createUser, getUser } = await import("@/lib/database/users");
        const existingUser = await getUser(address);
        
        if (!existingUser) {
          await createUser(
            address,
            "orb",
            verifyResult.nullifier
          );
        }
        
        toast.success("¡Conectado exitosamente! 🎉", { id: "auth" });
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);

      } catch (verifyError) {
        console.error("Error en verificación World ID:", verifyError);
        
        // Si falla la verificación pero tenemos la wallet, permitir acceso temporal
        toast.success("Wallet conectada (verificación pendiente)", { id: "auth" });
        
        localStorage.setItem("tribia_user", JSON.stringify({
          address,
          verified: false,
          nullifierHash: null,
          joinedAt: Date.now()
        }));
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      }

    } catch (error) {
      console.error("Error en autenticación:", error);
      const toast = (await import("react-hot-toast")).default;
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      toast.error(`Error: ${errorMessage}`, { id: "auth" });
      setConnecting(false);
    }
  };

  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header isGuest />
      
      <main className="flex-1 flex items-center justify-center p-4">
        <ModalInicio 
          open={showModal} 
          onConnect={handleConnect}
          connecting={connecting}
        />
      </main>
      
      <Footer isGuest />
    </div>
  );
}
