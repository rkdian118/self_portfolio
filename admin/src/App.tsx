// src/App.tsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { SnackbarProvider } from "notistack";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";
import AuthGuard from "@/components/Auth/AuthGuard";
import Login from "@/components/Auth/Login";
import AdminLayout from "@/components/Layout/AdminLayout";
import Dashboard from "@/pages/Dashboard";
import HeroManagement from "@/pages/HeroManagement";
import ProjectsManagement from "@/pages/ProjectsManagement";
import ExperienceManagement from "@/pages/ExperienceManagement";
import EducationManagement from "@/pages/EducationManagement";
import ContactManagement from "@/pages/ContactManagement";
import MessagesManagement from "@/pages/MessagesManagement";
import theme from "@/theme";
import "@/styles/global.css";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        autoHideDuration={2000}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/admin/login" element={<AuthGuard><Login /></AuthGuard>} />

              <Route
                path="/admin/dashboard/*"
                element={
                  <ProtectedRoute>
                    <AdminLayout>
                      <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="hero" element={<HeroManagement />} />
                        {/* <Route path="technologies" element={<TechnologiesManagement />} /> */}
                        <Route
                          path="projects"
                          element={<ProjectsManagement />}
                        />
                        <Route
                          path="experience"
                          element={<ExperienceManagement />}
                        />
                        <Route
                          path="education"
                          element={<EducationManagement />}
                        />
                        <Route path="contact" element={<ContactManagement />} />
                        <Route
                          path="messages"
                          element={<MessagesManagement />}
                        />
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
