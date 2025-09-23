import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { Warning } from "@mui/icons-material";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  severity?: "warning" | "error" | "info";
}

const ConfirmDialog = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  severity = "warning",
}: ConfirmDialogProps) => {
  const getColor = () => {
    switch (severity) {
      case "error":
        return "#ff6b7a";
      case "warning":
        return "#ffa726";
      case "info":
        return "#00ffff";
      default:
        return "#ffa726";
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#1a1a1a",
          border: `1px solid ${getColor()}33`,
        },
      }}
    >
      <DialogTitle sx={{ color: "#ffffff", pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Warning sx={{ color: getColor(), fontSize: 24 }} />
          {title}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: "rgba(224, 242, 241, 0.8)" }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onCancel}
          sx={{ color: "rgba(224, 242, 241, 0.7)" }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          sx={{
            bgcolor: getColor(),
            color: "#000",
            "&:hover": { bgcolor: `${getColor()}cc` },
          }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;