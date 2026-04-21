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

      // Validar variables de entorno
      const appId = process.env.NEXT_PUBLIC_APP_ID;
      const rpId = process.env.NEXT_PUBLIC_RP_ID;
      
      console.log("App ID:", appId);
      console.log("RP ID:", rpId);
      
      if (!appId || !rpId) {
        const toast = (await import("react-hot-toast")).default;
        toast.error(`Error de configuración: ${!appId ? 'APP_ID' : 'RP_ID'} no está definido`);
        setConnecting(false);
        return;
      }

      const toast = (await import("react-hot-toast")).default;
      toast.loading("Verificando identidad...", { id: "auth" });

      // Paso 1: Verificar World ID con IDKit 4.0
      const { IDKit, orbLegacy } = await import("@worldcoin/idkit-core");
      
      // Obtener RP signature del backend
      const rpSig = await fetch("/api/rp-signature", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "tribia-signup" }),
      }).then((r) => r.json());

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
        toast.error("Verificación fallida. Intenta de nuevo.", { id: "auth" });
        setConnecting(false);
        return;
      }

      toast.loading("Conectando wallet...", { id: "auth" });

      // Paso 2: Conectar wallet
      // @ts-expect-error - MiniKit types
      const { finalPayload } = await MiniKit.walletAuth({
        nonce: Math.random().toString(36).substring(7),
        requestId: crypto.randomUUID(),
        expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        statement: "Inicia sesión en Tribia para predecir el Mundial 2026"
      });

      if (finalPayload.status === "success") {
        // Guardar datos de usuario en localStorage
        localStorage.setItem("tribia_user", JSON.stringify({
          address: finalPayload.address,
          verified: true,
          nullifierHash: verifyResult.nullifier,
          joinedAt: Date.now()
        }));
        
        // Crear usuario en Firebase
        const { createUser, getUser } = await import("@/lib/database/users");
        const existingUser = await getUser(finalPayload.address);
        
        if (!existingUser) {
          await createUser(
            finalPayload.address,
            "orb",
            verifyResult.nullifier
          );
        }
        
        toast.success("¡Conectado exitosamente! 🎉", { id: "auth" });
        
        setTimeout(() => {
          router.push("/dashboard");
        }, 500);
      } else {
        toast.error("Error al conectar wallet. Intenta de nuevo.", { id: "auth" });
        setConnecting(false);
      }
    } catch (error) {
      console.error("Error en autenticación:", error);
      const toast = (await import("react-hot-toast")).default;
      toast.error(`Error: ${error}`, { id: "auth" });
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
