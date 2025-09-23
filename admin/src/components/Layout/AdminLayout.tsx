import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Dashboard,
  Person,
  School,
  ContactMail,
  Message,
  Logout,
  TrendingUp,
  Folder,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminStore } from "@/store/adminStore";

const drawerWidth = 280;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { hero, projects, contactForms, fetchHero, fetchContactForms } =
    useAdminStore();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  useEffect(() => {
    fetchHero();
    fetchContactForms();
  }, [fetchHero, fetchContactForms]);

  const menuItems = [
    {
      text: "Dashboard",
      icon: <Dashboard />,
      path: "/admin/dashboard",
      color: "#00ffff",
      badge: null,
    },
    {
      text: "Hero Section",
      icon: <Person />,
      path: "/admin/dashboard/hero",
      color: "#ff6b7a",
      badge: null,
    },
    {
      text: "Projects",
      icon: <Folder />,
      path: "/admin/dashboard/projects",
      color: "#ffa726",
      badge: projects.length > 0 ? projects.length.toString() : null,
    },
    {
      text: "Experience",
      icon: <TrendingUp />,
      path: "/admin/dashboard/experience",
      color: "#ab47bc",
      badge: null,
    },
    {
      text: "Education",
      icon: <School />,
      path: "/admin/dashboard/education",
      color: "#42a5f5",
      badge: null,
    },
    {
      text: "Contact Info",
      icon: <ContactMail />,
      path: "/admin/dashboard/contact",
      color: "#26c6da",
      badge: null,
    },
    {
      text: "Messages",
      icon: <Message />,
      path: "/admin/dashboard/messages",
      color: "#ef5350",
      badge:
        contactForms.filter((form) => !form.isRead).length > 0
          ? contactForms.filter((form) => !form.isRead).length.toString()
          : null,
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      {/* Enhanced AppBar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          background: "linear-gradient(135deg, #1a2332 0%, #0f1419 100%)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0, 255, 255, 0.2)",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          // mt: 96,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {hero?.profileImage ? (
              <Avatar
                src={hero.profileImage}
                sx={{
                  width: 40,
                  height: 40,
                  border: "2px solid rgba(0, 255, 255, 0.3)",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "linear-gradient(45deg, #00ffff, #00e5e5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1a2332",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              >
                {hero?.name?.charAt(0) || "P"}
              </Box>
            )}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #00ffff, #ffffff)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {hero?.name ? `${hero.name} - Admin` : "Portfolio Admin"}
              </Typography>
              {hero?.title && (
                <Typography
                  variant="caption"
                  sx={{ color: "rgba(224, 242, 241, 0.7)", display: "block" }}
                >
                  {hero.title}
                </Typography>
              )}
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Update Profile">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  p: 1,
                  borderRadius: 2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "rgba(0, 255, 255, 0.1)",
                    transform: "translateY(-1px)",
                  },
                }}
                onClick={() => navigate("/admin/dashboard/hero")}
              >
                {hero?.profileImage ? (
                  <Avatar
                    src={hero.profileImage}
                    sx={{
                      width: 36,
                      height: 36,
                      border: "2px solid rgba(0, 255, 255, 0.3)",
                    }}
                  />
                ) : (
                  <Avatar
                    sx={{
                      width: 36,
                      height: 36,
                      bgcolor: "#00ffff",
                      color: "#1a2332",
                      fontWeight: "bold",
                      border: "2px solid rgba(0, 255, 255, 0.3)",
                    }}
                  >
                    {hero?.name?.charAt(0) || user?.name?.charAt(0) || "A"}
                  </Avatar>
                )}
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "#e0f2f1", fontWeight: 500 }}
                  >
                    {hero?.name || user?.name || "Admin User"}
                  </Typography>
                  <Chip
                    label={user?.role || "Admin"}
                    size="small"
                    sx={{
                      height: 16,
                      fontSize: "0.7rem",
                      bgcolor: "rgba(0, 255, 255, 0.2)",
                      color: "#00ffff",
                    }}
                  />
                </Box>
              </Box>
            </Tooltip>

            <Tooltip title="Logout">
              <IconButton
                color="inherit"
                onClick={handleLogout}
                sx={{
                  ml: 1,
                  "&:hover": {
                    bgcolor: "rgba(239, 83, 80, 0.1)",
                    color: "#ef5350",
                  },
                }}
              >
                <Logout />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Enhanced Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(180deg, #1a2332 0%, #0f1419 100%)",
            borderRight: "1px solid rgba(0, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
          },
        }}
      >
        <Toolbar />

        <Box sx={{ p: 2 }}>
          <Typography
            variant="overline"
            sx={{
              color: "rgba(224, 242, 241, 0.6)",
              fontWeight: 600,
              letterSpacing: 1.2,
              px: 2,
            }}
          >
            MAIN MENU
          </Typography>
        </Box>

        <List sx={{ px: 1 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const isHovered = hoveredItem === item.text;

            return (
              <ListItemButton
                key={item.text}
                onClick={() => navigate(item.path)}
                onMouseEnter={() => setHoveredItem(item.text)}
                onMouseLeave={() => setHoveredItem(null)}
                sx={{
                  mb: 0.5,
                  mx: 1,
                  borderRadius: 2,
                  minHeight: 48,
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: isActive
                      ? `linear-gradient(135deg, ${alpha(
                          item.color,
                          0.2
                        )}, ${alpha(item.color, 0.1)})`
                      : isHovered
                      ? `linear-gradient(135deg, ${alpha(
                          item.color,
                          0.1
                        )}, ${alpha(item.color, 0.05)})`
                      : "transparent",
                    borderRadius: 2,
                    transition: "all 0.3s ease",
                  },
                  "&::after": isActive
                    ? {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 4,
                        height: 24,
                        background: `linear-gradient(180deg, ${
                          item.color
                        }, ${alpha(item.color, 0.7)})`,
                        borderRadius: "0 2px 2px 0",
                      }
                    : {},
                  transform: isHovered ? "translateX(4px)" : "translateX(0)",
                  boxShadow: isActive
                    ? `0 4px 20px ${alpha(item.color, 0.3)}`
                    : "none",
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? item.color : "#e0f2f1",
                    minWidth: 40,
                    transition: "all 0.3s ease",
                    transform: isHovered ? "scale(1.1)" : "scale(1)",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  sx={{
                    "& .MuiTypography-root": {
                      color: isActive ? "#ffffff" : "#e0f2f1",
                      fontWeight: isActive ? 600 : 400,
                      fontSize: "0.9rem",
                      transition: "all 0.3s ease",
                    },
                  }}
                />

                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      bgcolor: item.color,
                      color: "#1a2332",
                      fontWeight: 600,
                      minWidth: 24,
                    }}
                  />
                )}
              </ListItemButton>
            );
          })}
        </List>

        <Box sx={{ mt: "auto", p: 2 }}>
          <Divider sx={{ borderColor: "rgba(0, 255, 255, 0.1)", mb: 2 }} />
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              background:
                "linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 255, 255, 0.05))",
              border: "1px solid rgba(0, 255, 255, 0.2)",
            }}
          >
            <Typography
              variant="caption"
              sx={{ color: "#00ffff", fontWeight: 600 }}
            >
              System Status
            </Typography>
            <Typography variant="body2" sx={{ color: "#e0f2f1", mt: 0.5 }}>
              All systems operational
            </Typography>
          </Box>
        </Box>
      </Drawer>

      {/* Enhanced Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          minHeight: "100vh",
          pt: "88px",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
