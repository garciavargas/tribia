"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import VerificationModal from "@/components/modals/VerificationModal";
import { Button, Box, Typography } from "@mui/material";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  const handleLoadingComplete = () => {
    setLoading(false);
    setShowModal(true);
  };

  const handleAuthSuccess = () => {
    setShowModal(false);
    setAuthenticated(true);
  };

  if (loading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  if (!authenticated) {
    return (
      <VerificationModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        bgcolor: "grey.50"
      }}
    >
      <Box sx={{ textAlign: "center", maxWidth: 400 }}>
        <Typography variant="h3" sx={{ fontWeight: "bold", color: "primary.main", mb: 2 }}>
          ⚽ Bienvenido a Tribia
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
          Autenticación exitosa
        </Typography>
        <Button
          variant="contained"
          size="large"
          fullWidth
          href="/dashboard"
          sx={{ minHeight: 44 }}
        >
        Iniciar
        </Button>
      </Box>
    </Box>
  );
}
