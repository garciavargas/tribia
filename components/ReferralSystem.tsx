"use client";

import { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Button, TextField, Chip, Divider } from "@mui/material";
import toast from "react-hot-toast";

interface ReferralSystemProps {
  walletAddress: string;
}

export default function ReferralSystem({ walletAddress }: ReferralSystemProps) {
  const [referralCode, setReferralCode] = useState("");
  const [referralLink, setReferralLink] = useState("");
  const [referredUsers, setReferredUsers] = useState(0);
  const [earnedTokens, setEarnedTokens] = useState(0);
  const [inputCode, setInputCode] = useState("");

  useEffect(() => {
    // Generar código único basado en wallet address
    const code = generateReferralCode(walletAddress);
    setReferralCode(code);
    setReferralLink(`${window.location.origin}?ref=${code}`);
    
    // Cargar datos del usuario
    loadReferralData(walletAddress);
  }, [walletAddress]);

  const generateReferralCode = (address: string): string => {
    // Crear código único de 8 caracteres basado en wallet
    const hash = address.slice(2, 10).toUpperCase();
    return hash;
  };

  const loadReferralData = async (address: string) => {
    // TODO: Cargar desde backend/blockchain
    // Por ahora datos mock
    setReferredUsers(3);
    setEarnedTokens(15); // 5 WGoal por referido
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("¡Link copiado!");
  };

  const applyReferralCode = async () => {
    if (!inputCode.trim()) {
      toast.error("Ingresa un código de referido");
      return;
    }

    // TODO: Validar y aplicar código en backend
    // Verificar que:
    // 1. El código existe
    // 2. No es el propio código
    // 3. El usuario no ha usado otro código antes
    
    toast.success("¡Código aplicado! Tú y tu referidor ganaron 5 WGoal");
    setInputCode("");
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          🎁 Sistema de Referidos
        </Typography>

        {/* Tu código */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
            Tu código de referido:
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <TextField
              value={referralCode}
              fullWidth
              disabled
              size="small"
              sx={{ 
                "& .MuiInputBase-input": { 
                  fontWeight: "bold", 
                  fontSize: "1.2rem",
                  textAlign: "center"
                } 
              }}
            />
            <Button variant="contained" onClick={copyToClipboard}>
              Copiar Link
            </Button>
          </Box>
        </Box>

        {/* Stats */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Chip 
            label={`👥 ${referredUsers} referidos`} 
            color="primary" 
            sx={{ flex: 1 }}
          />
          <Chip 
            label={`💰 ${earnedTokens} WGoal ganados`} 
            color="success" 
            sx={{ flex: 1 }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Aplicar código */}
        <Box>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>
            ¿Te invitó alguien? Ingresa su código:
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value.toUpperCase())}
              placeholder="Ej: A1B2C3D4"
              size="small"
              fullWidth
              slotProps={{ htmlInput: { maxLength: 8 } }}
            />
            <Button 
              variant="outlined" 
              onClick={applyReferralCode}
              disabled={!inputCode.trim()}
            >
              Aplicar
            </Button>
          </Box>
        </Box>

        {/* Info */}
        <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
          <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
            💡 <strong>Cómo funciona:</strong>
          </Typography>
          <Typography variant="caption" sx={{ display: "block", color: "text.secondary", mt: 0.5 }}>
            • Comparte tu código con amigos
          </Typography>
          <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
            • Cuando se registren, ambos ganan 5 WGoal
          </Typography>
          <Typography variant="caption" sx={{ display: "block", color: "text.secondary" }}>
            • Sin límite de referidos
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}