# COMANDOS DE MINIKIT - GUÍA DETALLADA

## COMANDO: PAY

Solicita un pago del usuario. Esta es una abstracción para una transferencia simple.

**Soporte:** WLD y todas las stablecoins locales

### Uso Básico

```typescript
import { MiniKit } from "@worldcoin/minikit-js";
import {
  Tokens,
  tokenToDecimals,
  type CommandResultByVia,
  type MiniKitPayOptions,
  type PayResult,
} from "@worldcoin/minikit-js/commands";

export async function sendPayment() {
  // Crear un nonce en el backend para usar como referencia
  const nonce = await generateNonce();
  
  const payOptions: MiniKitPayOptions = {
    reference: nonce,
    to: "0x...", // Dirección del destinatario
    tokens: [
      {
        symbol: Tokens.WLD,
        token_amount: tokenToDecimals(1, Tokens.WLD).toString(),
      },
    ],
    description: "Pago de prueba",
  };

  const result = await MiniKit.pay(payOptions);
  
  if (result.executedWith === "minikit") {
    const payResult = result.data as PayResult;
    console.log("Pago exitoso:", payResult);
  }
}
```

### Verificación en Backend

Después de recibir el pago, verifica en tu backend:

```typescript
// Verificar el estado de la transacción
const isValid = await verifyPayment(nonce, payResult);
```

---

## COMANDO: WALLET AUTH

Autentica al usuario con Sign-In with Ethereum (SIWE).

### Uso Básico

```typescript
import { MiniKit } from "@worldcoin/minikit-js";
import type { WalletAuthResult } from "@worldcoin/minikit-js/commands";

export async function authenticateUser() {
  // Generar nonce en el backend (mínimo 8 caracteres alfanuméricos)
  const nonce = await generateNonce();
  
  const result = await MiniKit.walletAuth({
    nonce,
    requestId: "unique-request-id",
    expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
    notBefore: new Date(),
    statement: "Inicia sesión en Tribia",
  });

  if (result.executedWith === "minikit") {
    const authResult = result.data as WalletAuthResult;
    
    // Enviar al backend para verificación
    const verified = await verifyAuth(authResult);
    
    if (verified) {
      // Usuario autenticado
      console.log("Usuario:", MiniKit.user.username);
      console.log("Wallet:", MiniKit.user.walletAddress);
    }
  }
}
```

### Verificación en Backend

```typescript
// Verificar la firma SIWE
import { verifyMessage } from "ethers";

const recoveredAddress = verifyMessage(message, signature);
const isValid = recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
```

---

## COMANDO: SEND TRANSACTION

Envía una o más transacciones a World Chain.

### Características

- Soporte para múltiples transacciones en batch
- Aprobación automática de tokens a Permit2
- Retorna `userOpHash` para seguimiento

### Uso Básico

```typescript
import { MiniKit } from "@worldcoin/minikit-js";
import type { SendTransactionResult } from "@worldcoin/minikit-js/commands";

export async function sendTransaction() {
  const result = await MiniKit.sendTransaction({
    transaction: [
      {
        address: "0x...", // Dirección del contrato
        abi: [...], // ABI del contrato
        functionName: "transfer",
        args: ["0x...", "1000000000000000000"], // destinatario, cantidad
      },
    ],
  });

  if (result.executedWith === "minikit") {
    const txResult = result.data as SendTransactionResult;
    console.log("UserOpHash:", txResult.userOpHash);
    
    // Esperar confirmación
    const receipt = await waitForReceipt(txResult.userOpHash);
  }
}
```

### Bundle Approve + Contract Call

World App aprueba automáticamente tokens a Permit2, permitiendo bundlear la aprobación y tu llamada al contrato:

```typescript
const result = await MiniKit.sendTransaction({
  transaction: [
    {
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [PERMIT2_ADDRESS, amount],
    },
    {
      address: contractAddress,
      abi: CONTRACT_ABI,
      functionName: "yourFunction",
      args: [...],
    },
  ],
});
```

---

## COMANDO: SIGN MESSAGE

Firma un mensaje personal EIP-191.

### Uso Básico

```typescript
import { MiniKit } from "@worldcoin/minikit-js";
import type { SignMessageResult } from "@worldcoin/minikit-js/commands";

export async function signMessage() {
  const message = "Mensaje a firmar";
  
  const result = await MiniKit.signMessage({
    message,
  });

  if (result.executedWith === "minikit") {
    const signResult = result.data as SignMessageResult;
    console.log("Firma:", signResult.signature);
    
    // Verificar en backend
    const isValid = await verifySignature(message, signResult.signature);
  }
}
```

---

## COMANDO: SIGN TYPED DATA

Firma un payload tipado EIP-712.

### Uso Básico

```typescript
import { MiniKit } from "@worldcoin/minikit-js";
import type { SignTypedDataResult } from "@worldcoin/minikit-js/commands";

export async function signTypedData() {
  const domain = {
    name: "Tribia",
    version: "1",
    chainId: 1,
    verifyingContract: "0x...",
  };

  const types = {
    Person: [
      { name: "name", type: "string" },
      { name: "wallet", type: "address" },
    ],
  };

  const value = {
    name: "Usuario",
    wallet: "0x...",
  };

  const result = await MiniKit.signTypedData({
    domain,
    types,
    primaryType: "Person",
    message: value,
  });

  if (result.executedWith === "minikit") {
    const signResult = result.data as SignTypedDataResult;
    console.log("Firma tipada:", signResult.signature);
  }
}
```

---

## COMANDO: SHARE CONTACTS

Abre el selector de contactos de World App.

### Uso Básico

```typescript
import { MiniKit } from "@worldcoin/minikit-js";
import type { ShareContactsResult } from "@worldcoin/minikit-js/commands";

export async function shareContacts() {
  const result = await MiniKit.shareContacts();

  if (result.executedWith === "minikit") {
    const contactsResult = result.data as ShareContactsResult;
    console.log("Contactos seleccionados:", contactsResult.contacts);
    
    // contactsResult.contacts es un array de:
    // { username: string, walletAddress: string }
  }
}
```

---

## COMANDO: REQUEST PERMISSION

Solicita permisos de notificaciones o micrófono.

### Uso Básico

```typescript
import { MiniKit } from "@worldcoin/minikit-js";
import type { RequestPermissionResult } from "@worldcoin/minikit-js/commands";

export async function requestNotificationPermission() {
  const result = await MiniKit.requestPermission({
    permission: "notifications",
  });

  if (result.executedWith === "minikit") {
    const permResult = result.data as RequestPermissionResult;
    
    if (permResult.granted) {
      console.log("Permiso concedido");
    } else {
      console.log("Permiso denegado");
    }
  }
}

export async function requestMicrophonePermission() {
  const result = await MiniKit.requestPermission({
    permission: "microphone",
  });

  if (result.executedWith === "minikit") {
    const permResult = result.data as RequestPermissionResult;
    
    if (permResult.granted) {
      console.log("Micrófono habilitado");
    }
  }
}
```

---

## COMANDO: GET PERMISSIONS

Lee el estado actual de permisos de la mini app.

### Uso Básico

```typescript
import { MiniKit } from "@worldcoin/minikit-js";
import type { MiniAppGetPermissionsSuccessPayload } from "@worldcoin/minikit-js/commands";

export async function checkPermissions() {
  const result = await MiniKit.getPermissions();
  
  const permissions: MiniAppGetPermissionsSuccessPayload["permissions"] =
    result.data.permissions;

  console.log("Notificaciones:", permissions.notifications);
  console.log("Contactos:", permissions.contacts);
  console.log("Micrófono:", permissions.microphone);
}
```

---

## COMANDO: SEND HAPTIC FEEDBACK

Activa feedback háptico nativo.

### Tipos de Feedback

- `success`: Feedback de éxito
- `warning`: Feedback de advertencia
- `error`: Feedback de error

### Uso Básico

```typescript
import { MiniKit } from "@worldcoin/minikit-js";

export async function triggerHaptic() {
  await MiniKit.sendHapticFeedback({
    type: "success",
  });
}
```

---

## COMANDO: SHARE

Abre la hoja de compartir nativa.

### Uso Básico

```typescript
import { MiniKit } from "@worldcoin/minikit-js";

export async function shareContent() {
  await MiniKit.share({
    title: "Tribia",
    text: "¡Únete a Tribia!",
    url: "https://tribia.app",
  });
}
```

---

## COMANDO: WORLD CHAT

Abre World Chat con un mensaje prellenado.

### Uso Básico

```typescript
import { MiniKit } from "@worldcoin/minikit-js";

export async function openChat() {
  await MiniKit.chat({
    message: "¡Hola desde Tribia!",
    recipientUsername: "usuario123", // Opcional
  });
}
```

---

## COMANDO: ATTESTATION

Solicita un token de atestación de app.

### Uso Básico

```typescript
import { MiniKit } from "@worldcoin/minikit-js";
import type { AttestationResult } from "@worldcoin/minikit-js/commands";

export async function getAttestation() {
  const result = await MiniKit.attestation({
    action: "verify-user",
    signal: "unique-signal",
  });

  if (result.executedWith === "minikit") {
    const attestResult = result.data as AttestationResult;
    console.log("Token de atestación:", attestResult.token);
    
    // Verificar en backend
    const isValid = await verifyAttestation(attestResult.token);
  }
}
```

---

## COMANDO: CLOSE MINI APP

Cierra programáticamente la mini app.

### Uso Básico

```typescript
import { MiniKit } from "@worldcoin/minikit-js";

export async function closeMiniApp() {
  await MiniKit.closeMiniApp();
}
```

---

## MANEJO DE ERRORES

Todos los comandos pueden fallar. Maneja los errores apropiadamente:

```typescript
try {
  const result = await MiniKit.someCommand(options);
  
  if (result.executedWith === "minikit") {
    // Éxito
    console.log("Comando ejecutado:", result.data);
  } else {
    // Fallback
    console.log("Ejecutado con fallback");
  }
} catch (error) {
  console.error("Error al ejecutar comando:", error);
  // Mostrar mensaje al usuario
}
```

---

## CÓDIGOS DE ERROR COMUNES

- `user_cancelled`: Usuario canceló la operación
- `invalid_params`: Parámetros inválidos
- `not_supported`: Comando no soportado en esta versión
- `network_error`: Error de red
- `insufficient_funds`: Fondos insuficientes (para Pay)

---

**Nota:** Todos los comandos son asíncronos y retornan una Promise. Siempre usa `await` o `.then()` para manejar el resultado.
