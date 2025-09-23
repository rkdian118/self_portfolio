// src/components/Auth/Login.tsx
import React from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  CssBaseline,
  Link,
} from "@mui/material";

import { LockOutlined as LockOutlinedIcon } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAuth } from "@/hooks/useAuth"; // Updated import
import { useNavigate, useLocation } from "react-router-dom";
import { useSnackbar } from "notistack";
import { LoginForm } from "@/types";

const schema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const { login, loading } = useAuth();

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/admin/dashboard";

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        enqueueSnackbar("Login successful!", { variant: "success" });
        navigate(from, { replace: true });
      } else {
        setError("root", {
          type: "manual",
          message: result.message || "Login failed",
        });
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "An error occurred during login";
      setError("root", {
        type: "manual",
        message,
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0e14 0%, #1a2332 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <CssBaseline />
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={24}
          sx={{
            p: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            background:
              "linear-gradient(135deg, rgba(26, 35, 50, 0.95), rgba(15, 20, 25, 0.95))",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(0, 255, 255, 0.2)",
            borderRadius: 4,
            boxShadow: "0 20px 40px rgba(0, 255, 255, 0.1)",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(45deg, #00ffff, #00e5e5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 3,
              boxShadow: "0 8px 32px rgba(0, 255, 255, 0.3)",
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 40, color: "#1a2332" }} />
          </Box>

          <Typography
            component="h1"
            variant="h3"
            sx={{
              mb: 1,
              fontWeight: 700,
              background: "linear-gradient(45deg, #00ffff, #ffffff)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
            }}
          >
            Portfolio Admin
          </Typography>

          <Typography
            variant="body1"
            sx={{
              mb: 4,
              color: "rgba(224, 242, 241, 0.8)",
              textAlign: "center",
            }}
          >
            Sign in to manage your portfolio content
          </Typography>

          {errors.root && (
            <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
              {errors.root.message}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1, width: "100%" }}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#ffffff",
                      backgroundColor: "rgba(0, 255, 255, 0.05)",
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "rgba(0, 255, 255, 0.3)",
                        borderWidth: 2,
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(0, 255, 255, 0.6)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#00ffff",
                        boxShadow: "0 0 0 3px rgba(0, 255, 255, 0.1)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(224, 242, 241, 0.8)",
                      fontWeight: 500,
                      "&.Mui-focused": {
                        color: "#00ffff",
                      },
                    },
                  }}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "#ffffff",
                      backgroundColor: "rgba(0, 255, 255, 0.05)",
                      borderRadius: 2,
                      "& fieldset": {
                        borderColor: "rgba(0, 255, 255, 0.3)",
                        borderWidth: 2,
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(0, 255, 255, 0.6)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#00ffff",
                        boxShadow: "0 0 0 3px rgba(0, 255, 255, 0.1)",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(224, 242, 241, 0.8)",
                      fontWeight: 500,
                      "&.Mui-focused": {
                        color: "#00ffff",
                      },
                    },
                  }}
                />
              )}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              size="large"
              sx={{
                mt: 4,
                mb: 3,
                height: 56,
                borderRadius: 3,
                background: "linear-gradient(45deg, #00ffff, #00e5e5)",
                color: "#1a2332",
                fontWeight: 700,
                fontSize: "1.1rem",
                boxShadow: "0 8px 32px rgba(0, 255, 255, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #00e5e5, #00cccc)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 12px 40px rgba(0, 255, 255, 0.4)",
                },
                "&:disabled": {
                  background: "rgba(0, 255, 255, 0.3)",
                  color: "rgba(26, 35, 50, 0.5)",
                  transform: "none",
                },
                transition: "all 0.3s ease",
              }}
            >
              {loading ? (
                <>
                  <CircularProgress
                    size={24}
                    sx={{ mr: 1, color: "#1a2332" }}
                  />
                  Signing In...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </Button>
          </Box>
        </Paper>

        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 4, color: "rgba(224, 242, 241, 0.6)" }}
        >
          {"© "}
          {new Date().getFullYear()}{" "}
          <Link href="#" sx={{ color: "#00ffff", textDecoration: "none" }}>
            Dhanraj Vishwakarma Portfolio
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Login;
