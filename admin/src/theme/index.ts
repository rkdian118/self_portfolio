// src/theme/index.ts
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00ffff",
      light: "#00e5e5",
      dark: "#00cccc",
      contrastText: "#1a2332",
    },
    secondary: {
      main: "#1a2332",
      light: "#2d3748",
      dark: "#0f1419",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0a0e14",
      paper: "#1a2332",
    },
    text: {
      primary: "#ffffff",
      secondary: "#e0f2f1",
    },
    error: {
      main: "#ff4757",
      light: "#ff6b7a",
      dark: "#c44569",
    },
    warning: {
      main: "#ffa726",
      light: "#ffb74d",
      dark: "#f57c00",
    },
    success: {
      main: "#66bb6a",
      light: "#81c784",
      dark: "#4caf50",
    },
    info: {
      main: "#29b6f6",
      light: "#4fc3f7",
      dark: "#0288d1",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.5rem",
      color: "#ffffff",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      color: "#ffffff",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      color: "#ffffff",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      color: "#ffffff",
    },
    h5: {
      fontWeight: 500,
      fontSize: "1.25rem",
      color: "#ffffff",
    },
    h6: {
      fontWeight: 500,
      fontSize: "1rem",
      color: "#ffffff",
    },
    body1: {
      color: "#e0f2f1",
    },
    body2: {
      color: "#e0f2f1",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #1a2332 0%, #0f1419 100%)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(0, 255, 255, 0.2)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "linear-gradient(135deg, #1a2332 0%, #0f1419 100%)",
          borderRight: "1px solid rgba(0, 255, 255, 0.2)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #1a2332 0%, #2d3748 100%)",
          border: "1px solid rgba(0, 255, 255, 0.1)",
          "&:hover": {
            border: "1px solid rgba(0, 255, 255, 0.3)",
            transform: "translateY(-2px)",
            boxShadow: "0 8px 32px rgba(0, 255, 255, 0.1)",
          },
          transition: "all 0.3s ease",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: "linear-gradient(45deg, #00ffff, #00e5e5)",
          color: "#1a2332",
          fontWeight: "bold",
          "&:hover": {
            background: "linear-gradient(45deg, #00e5e5, #00cccc)",
            transform: "translateY(-2px)",
            boxShadow: "0 4px 20px rgba(0, 255, 255, 0.3)",
          },
        },
        outlined: {
          borderColor: "#00ffff",
          color: "#00ffff",
          "&:hover": {
            borderColor: "#00e5e5",
            backgroundColor: "rgba(0, 255, 255, 0.1)",
            transform: "translateY(-1px)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            color: "#ffffff",
            "& fieldset": {
              borderColor: "rgba(0, 255, 255, 0.3)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(0, 255, 255, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#00ffff",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#e0f2f1",
            "&.Mui-focused": {
              color: "#00ffff",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: "linear-gradient(135deg, #1a2332 0%, #2d3748 100%)",
          border: "1px solid rgba(0, 255, 255, 0.1)",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "rgba(0, 255, 255, 0.1)",
          },
          "&.Mui-selected": {
            backgroundColor: "rgba(0, 255, 255, 0.2)",
            borderRight: "3px solid #00ffff",
            "&:hover": {
              backgroundColor: "rgba(0, 255, 255, 0.3)",
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 255, 255, 0.1)",
          color: "#00ffff",
          border: "1px solid rgba(0, 255, 255, 0.3)",
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
});

export default theme;
