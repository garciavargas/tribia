"use client";

import { useState } from "react";
import { Container, Box, Typography, Button, Grid } from "@mui/material";
import { 
  VerificationModal, 
  PaymentModal, 
  DailyRewardModal, 
  PredictionModal,
  TransactionModal 
} from "@/components/modals";

export default function ModalsDemo() {
  const [showVerification, setShowVerification] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<"pending" | "success" | "error">("success");

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          🎨 Modales de Tribia
        </Typography>
        <Typography variant="body1" sx={{ color: "#666" }}>
          Diseño moderno inspirado en MiniKit de Worldcoin
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Verification Modal */}
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => setShowVerification(true)}
            sx={{ 
              minHeight: 80,
              bgcolor: "#667eea",
              "&:hover": { bgcolor: "#5568d3" }
            }}
          >
            <Box>
              <Typography variant="h6">🌍 Verificación</Typography>
              <Typography variant="caption">Conectar World ID</Typography>
            </Box>
          </Button>
        </Grid>

        {/* Payment Modal */}
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => setShowPayment(true)}
            sx={{ 
              minHeight: 80,
              bgcolor: "#FFD700",
              color: "#1a1a1a",
              "&:hover": { bgcolor: "#FFC700" }
            }}
          >
            <Box>
              <Typography variant="h6">💰 Pago</Typography>
              <Typography variant="caption">Confirmar transacción</Typography>
            </Box>
          </Button>
        </Grid>

        {/* Daily Reward Modal */}
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => setShowDailyReward(true)}
            sx={{ 
              minHeight: 80,
              bgcolor: "#f093fb",
              "&:hover": { bgcolor: "#e082ea" }
            }}
          >
            <Box>
              <Typography variant="h6">🎁 Recompensa</Typography>
              <Typography variant="caption">Reclamar diaria</Typography>
            </Box>
          </Button>
        </Grid>

        {/* Prediction Modal */}
        <Grid item xs={12} sm={6}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => setShowPrediction(true)}
            sx={{ 
              minHeight: 80,
              bgcolor: "#11998e",
              "&:hover": { bgcolor: "#0e8a7f" }
            }}
          >
            <Box>
              <Typography variant="h6">⚽ Predicción</Typography>
              <Typography variant="caption">Hacer pronóstico</Typography>
            </Box>
          </Button>
        </Grid>

        {/* Transaction Success */}
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => {
              setTransactionStatus("success");
              setShowTransaction(true);
            }}
            sx={{ 
              minHeight: 80,
              bgcolor: "#4caf50",
              "&:hover": { bgcolor: "#45a049" }
            }}
          >
            <Box>
              <Typography variant="h6">✅ Éxito</Typography>
              <Typography variant="caption">Transacción exitosa</Typography>
            </Box>
          </Button>
        </Grid>

        {/* Transaction Pending */}
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => {
              setTransactionStatus("pending");
              setShowTransaction(true);
            }}
            sx={{ 
              minHeight: 80,
              bgcolor: "#2196f3",
              "&:hover": { bgcolor: "#1976d2" }
            }}
          >
            <Box>
              <Typography variant="h6">⏳ Pendiente</Typography>
              <Typography variant="caption">Procesando...</Typography>
            </Box>
          </Button>
        </Grid>

        {/* Transaction Error */}
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={() => {
              setTransactionStatus("error");
              setShowTransaction(true);
            }}
            sx={{ 
              minHeight: 80,
              bgcolor: "#f44336",
              "&:hover": { bgcolor: "#d32f2f" }
            }}
          >
            <Box>
              <Typography variant="h6">❌ Error</Typography>
              <Typography variant="caption">Transacción fallida</Typography>
            </Box>
          </Button>
        </Grid>
      </Grid>

      {/* Modals */}
      <VerificationModal
        open={showVerification}
        onClose={() => setShowVerification(false)}
        onSuccess={() => {
          setShowVerification(false);
          alert("¡Verificación exitosa!");
        }}
      />

      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        amount={5}
        description="Premio por predicción correcta en fase de grupos"
      />

      <DailyRewardModal
        open={showDailyReward}
        onClose={() => setShowDailyReward(false)}
        onSuccess={() => {
          setShowDailyReward(false);
          alert("¡Recompensa reclamada!");
        }}
      />

      <PredictionModal
        open={showPrediction}
        onClose={() => setShowPrediction(false)}
        homeTeam="México"
        awayTeam="Brasil"
        homeFlag="🇲🇽"
        awayFlag="🇧🇷"
        matchDate="11 de junio, 2026 - 15:00"
        onConfirm={(prediction) => {
          alert(`Predicción: ${prediction}`);
          setShowPrediction(false);
        }}
      />

      <TransactionModal
        open={showTransaction}
        onClose={() => setShowTransaction(false)}
        status={transactionStatus}
        message={
          transactionStatus === "success" 
            ? "Tu predicción fue guardada exitosamente" 
            : transactionStatus === "pending"
            ? "Esperando confirmación de la blockchain..."
            : "No se pudo procesar tu predicción. Intenta de nuevo."
        }
      />
    </Container>
  );
}
