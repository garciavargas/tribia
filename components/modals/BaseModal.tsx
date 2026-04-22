"use client";

import { ReactNode } from "react";
import { Dialog, DialogContent, IconButton } from "@mui/material";
import { FaTimes } from "react-icons/fa";

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  showCloseButton?: boolean;
  maxWidth?: number;
}

export default function BaseModal({ 
  open, 
  onClose, 
  children,
  showCloseButton = true,
  maxWidth = 400
}: BaseModalProps) {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            backdropFilter: "blur(4px)"
          }
        },
        paper: {
          sx: {
            borderRadius: 4,
            m: 2,
            maxWidth,
            bgcolor: "#f5f5f5",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
          }
        }
      }}
    >
      <DialogContent sx={{ p: 0, position: "relative" }}>
        {/* Close Button */}
        {showCloseButton && (
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              bgcolor: "#e0e0e0",
              width: 40,
              height: 40,
              zIndex: 10,
              transition: "all 0.2s ease",
              "&:hover": { 
                bgcolor: "#d0d0d0",
                transform: "scale(1.1)"
              }
            }}
          >
            <FaTimes size={18} />
          </IconButton>
        )}

        {children}
      </DialogContent>
    </Dialog>
  );
}
