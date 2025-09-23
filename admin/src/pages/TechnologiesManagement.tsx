import { 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  alpha,
  CircularProgress,
} from "@mui/material";
import { Code, Add, Edit, Delete, Save, Close } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import { Technology } from "@/types";

const TechnologiesManagement = () => {
  const { technologies, loading, fetchTechnologies, createTechnology, updateTechnology, deleteTechnology } = useAdminStore();
  const [open, setOpen] = useState(false);
  const [editingTech, setEditingTech] = useState<Technology | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "frontend" as Technology["category"],
    icon: "",
    color: "#66bb6a",
    proficiency: 80,
  });

  useEffect(() => {
    fetchTechnologies();
  }, [fetchTechnologies]);

  const handleOpen = (tech?: Technology) => {
    if (tech) {
      setEditingTech(tech);
      setFormData({
        name: tech.name,
        category: tech.category,
        icon: tech.icon,
        color: tech.color,
        proficiency: tech.proficiency,
      });
    } else {
      setEditingTech(null);
      setFormData({
        name: "",
        category: "frontend",
        icon: "",
        color: "#66bb6a",
        proficiency: 80,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingTech(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingTech) {
        await updateTechnology(editingTech._id!, formData);
      } else {
        await createTechnology({ ...formData, isActive: true });
      }
      handleClose();
      fetchTechnologies();
    } catch (error) {
      console.error("Error saving technology:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this technology?")) {
      try {
        await deleteTechnology(id);
        fetchTechnologies();
      } catch (error) {
        console.error("Error deleting technology:", error);
      }
    }
  };

  const categoryColors = {
    frontend: "#66bb6a",
    backend: "#ff6b7a", 
    database: "#ffa726",
    tools: "#42a5f5",
    cloud: "#ab47bc",
    mobile: "#26c6da"
  };

  return (
    <Box sx={{ animation: "fadeIn 0.6s ease-out" }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background: "linear-gradient(135deg, rgba(102, 187, 106, 0.2), rgba(102, 187, 106, 0.1))",
                border: "1px solid rgba(102, 187, 106, 0.3)",
              }}
            >
              <Code sx={{ color: "#66bb6a", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: "#ffffff",
                  fontWeight: 700,
                  mb: 0.5,
                }}
              >
                Technologies
              </Typography>
              <Typography variant="body1" sx={{ color: "rgba(224, 242, 241, 0.7)" }}>
                Manage your technical skills and expertise
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {Object.entries(categoryColors).map(([category, color]) => (
              <Chip 
                key={category}
                label={category.charAt(0).toUpperCase() + category.slice(1)} 
                sx={{ 
                  bgcolor: alpha(color, 0.2), 
                  color: color,
                  border: `1px solid ${alpha(color, 0.3)}`,
                  textTransform: "capitalize"
                }} 
              />
            ))}
          </Box>
        </Box>
        
        <Button
          startIcon={<Add />}
          variant="contained"
          onClick={() => handleOpen()}
          sx={{
            background: "linear-gradient(45deg, #66bb6a, #4caf50)",
            "&:hover": {
              background: "linear-gradient(45deg, #4caf50, #388e3c)",
            },
          }}
        >
          Add Technology
        </Button>
      </Box>

      {/* Technologies Grid */}
      {loading.technologies ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress sx={{ color: "#66bb6a" }} />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
          {technologies.map((tech) => (
            <Card 
              key={tech._id}
              sx={{ 
                minWidth: 280,
                background: `linear-gradient(135deg, ${alpha(tech.color, 0.1)}, ${alpha(tech.color, 0.05)})`,
                border: `1px solid ${alpha(tech.color, 0.2)}`,
                borderRadius: 3,
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 12px 30px ${alpha(tech.color, 0.3)}`,
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Box 
                      sx={{ 
                        width: 48, 
                        height: 48, 
                        borderRadius: 2,
                        background: `linear-gradient(135deg, ${tech.color}, ${alpha(tech.color, 0.7)})`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.5rem",
                      }}
                    >
                      {tech.icon || "💻"}
                    </Box>
                    <Box>
                      <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 600 }}>
                        {tech.name}
                      </Typography>
                      <Chip 
                        label={tech.category} 
                        size="small"
                        sx={{ 
                          bgcolor: alpha(tech.color, 0.2),
                          color: tech.color,
                          textTransform: "capitalize",
                          fontSize: "0.7rem"
                        }}
                      />
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpen(tech)}
                      sx={{ color: "#00ffff" }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDelete(tech._id!)}
                      sx={{ color: "#ef5350" }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography variant="body2" sx={{ color: "rgba(224, 242, 241, 0.8)" }}>
                      Proficiency
                    </Typography>
                    <Typography variant="body2" sx={{ color: tech.color, fontWeight: 600 }}>
                      {tech.proficiency}%
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      height: 6, 
                      bgcolor: alpha(tech.color, 0.2), 
                      borderRadius: 3,
                      overflow: "hidden"
                    }}
                  >
                    <Box 
                      sx={{ 
                        height: "100%", 
                        width: `${tech.proficiency}%`,
                        background: `linear-gradient(90deg, ${tech.color}, ${alpha(tech.color, 0.8)})`,
                        borderRadius: 3,
                        transition: "width 0.3s ease"
                      }} 
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#1a2332", color: "#ffffff" }}>
          {editingTech ? "Edit Technology" : "Add Technology"}
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#1a2332", pt: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Technology Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            
            <TextField
              label="Category"
              select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Technology["category"] })}
              fullWidth
            >
              {Object.keys(categoryColors).map((category) => (
                <MenuItem key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </MenuItem>
              ))}
            </TextField>
            
            <TextField
              label="Icon (Emoji or Text)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              fullWidth
              placeholder="💻, ⚛️, 🔧, etc."
            />
            
            <TextField
              label="Color (Hex)"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              fullWidth
              type="color"
            />
            
            <TextField
              label="Proficiency (%)"
              type="number"
              value={formData.proficiency}
              onChange={(e) => setFormData({ ...formData, proficiency: Number(e.target.value) })}
              fullWidth
              inputProps={{ min: 0, max: 100 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#1a2332", p: 2 }}>
          <Button onClick={handleClose} startIcon={<Close />}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            startIcon={<Save />}
            sx={{
              background: "linear-gradient(45deg, #66bb6a, #4caf50)",
              "&:hover": {
                background: "linear-gradient(45deg, #4caf50, #388e3c)",
              },
            }}
          >
            {editingTech ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TechnologiesManagement;