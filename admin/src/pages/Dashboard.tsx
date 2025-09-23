import { Typography, Box, Card, CardContent, alpha } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person,
  Code,
  Work,
  TrendingUp,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "@/store/adminStore";

const Dashboard = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const { dashboardStats, fetchDashboardStats } = useAdminStore();

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  const stats = [
    {
      title: "Total Projects",
      value: dashboardStats?.totalProjects?.toString() || "0",
      icon: <Work />,
      color: "#00ffff",
      trend: dashboardStats?.totalProjects
        ? `${dashboardStats.totalProjects} active`
        : "No projects",
    },
    {
      title: "Education",
      value: dashboardStats?.totalEducation || 0,
      icon: <Code />,
      color: "#ff6b7a",
      trend: dashboardStats?.totalEducation
        ? `${dashboardStats.totalEducation} records`
        : "No education",
    },
    {
      title: "Experience",
      value: `${dashboardStats?.totalExperiences || 0}`,
      icon: <Person />,
      color: "#66bb6a",
      trend: dashboardStats?.totalExperiences
        ? `${dashboardStats.totalExperiences} companies`
        : "No experience",
    },
    {
      title: "Messages",
      value: dashboardStats?.unreadContactForms?.toString() || "0",
      icon: <DashboardIcon />,
      color: "#ffa726",
      trend: dashboardStats?.unreadContactForms
        ? `${dashboardStats.unreadContactForms} unread`
        : "All read",
    },
  ];

  return (
    <Box sx={{ animation: "fadeIn 0.6s ease-out" }}>
      <Box sx={{ mb: 4, mt: 22 }}>
        <Typography
          variant="h3"
          sx={{
            color: "#ffffff",
            fontWeight: 700,
            mb: 1,
            background: "linear-gradient(45deg, #00ffff, #ffffff)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: "rgba(224, 242, 241, 0.7)" }}>
          Welcome back! Here's what's happening with your portfolio.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        {stats.map((stat, index) => (
          <Card
            key={index}
            onMouseEnter={() => setHoveredCard(index)}
            onMouseLeave={() => setHoveredCard(null)}
            sx={{
              minWidth: 280,
              flex: 1,
              background: `linear-gradient(135deg, ${alpha(
                stat.color,
                0.1
              )}, ${alpha(stat.color, 0.05)})`,
              border: `1px solid ${alpha(stat.color, 0.2)}`,
              borderRadius: 3,
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              transform:
                hoveredCard === index
                  ? "translateY(-8px) scale(1.02)"
                  : "translateY(0) scale(1)",
              boxShadow:
                hoveredCard === index
                  ? `0 20px 40px ${alpha(stat.color, 0.3)}, 0 0 0 1px ${alpha(
                      stat.color,
                      0.4
                    )}`
                  : `0 4px 20px ${alpha(stat.color, 0.1)}`,
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 4,
                background: `linear-gradient(90deg, ${stat.color}, ${alpha(
                  stat.color,
                  0.7
                )})`,
                borderRadius: "12px 12px 0 0",
              },
              position: "relative",
              overflow: "hidden",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                display="flex"
                alignItems="flex-start"
                justifyContent="space-between"
                mb={2}
              >
                <Box>
                  <Typography
                    variant="h3"
                    sx={{
                      color: stat.color,
                      fontWeight: 700,
                      mb: 0.5,
                      fontSize: "2.5rem",
                    }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#ffffff",
                      fontWeight: 500,
                      mb: 0.5,
                    }}
                  >
                    {stat.title}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    color: stat.color,
                    fontSize: 48,
                    opacity: 0.8,
                    transition: "all 0.3s ease",
                    transform:
                      hoveredCard === index
                        ? "rotate(10deg) scale(1.1)"
                        : "rotate(0deg) scale(1)",
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <TrendingUp sx={{ color: "#66bb6a", fontSize: 16 }} />
                <Typography
                  variant="caption"
                  sx={{
                    color: "rgba(224, 242, 241, 0.8)",
                    fontWeight: 500,
                  }}
                >
                  {stat.trend}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          p: 3,
          borderRadius: 3,
          background:
            "linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(0, 255, 255, 0.02))",
          border: "1px solid rgba(0, 255, 255, 0.1)",
          backdropFilter: "blur(20px)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ color: "#00ffff", mb: 3, fontWeight: 600 }}
        >
          Quick Actions
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
          {[
            {
              label: "Add Project",
              path: "/dashboard/projects",
              color: "#ffa726",
              icon: <Work />,
            },
            {
              label: "Update Hero",
              path: "/dashboard/hero",
              color: "#ff6b7a",
              icon: <Person />,
            },
            {
              label: "Add Technology",
              path: "/dashboard/technologies",
              color: "#66bb6a",
              icon: <Code />,
            },
            {
              label: "View Messages",
              path: "/dashboard/messages",
              color: "#ef5350",
              icon: <DashboardIcon />,
            },
          ].map((action, index) => (
            <Box
              key={index}
              onClick={() => navigate(action.path)}
              sx={{
                p: 2,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${alpha(
                  action.color,
                  0.1
                )}, ${alpha(action.color, 0.05)})`,
                border: `1px solid ${alpha(action.color, 0.2)}`,
                cursor: "pointer",
                transition: "all 0.3s ease",
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                minWidth: 160,
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: `0 8px 25px ${alpha(action.color, 0.3)}`,
                  border: `1px solid ${alpha(action.color, 0.4)}`,
                },
              }}
            >
              <Box sx={{ color: action.color, fontSize: 24 }}>
                {action.icon}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#ffffff",
                  fontWeight: 500,
                }}
              >
                {action.label}
              </Typography>
            </Box>
          ))}
        </Box>

        <Typography variant="body1" sx={{ color: "rgba(224, 242, 241, 0.8)" }}>
          Manage your portfolio content efficiently. Each section provides
          comprehensive tools for creating and organizing your professional
          information.
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
