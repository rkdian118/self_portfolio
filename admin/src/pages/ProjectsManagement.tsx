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
  IconButton,
  Chip,
  CircularProgress,
  alpha,
} from "@mui/material";
import { Add, Edit, Delete, Work, Link as LinkIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useSnackbar } from "notistack";
import { Project } from "@/types";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const ProjectsManagement = () => {
  const {
    projects,
    loading,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    // uploadProjectImage,
  } = useAdminStore();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  // const [uploading, setUploading] = useState<string | null>(null);
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(
    new Set()
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
    name: string;
  }>({ open: false, id: "", name: "" });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    duration: "",
    skills: "",
    website: "",
    order: 0,
  });

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleOpen = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name || "",
        description: project.description || "",
        duration: project.duration || "",
        skills: project.skills
          ? Array.isArray(project.skills)
            ? project.skills.join(", ")
            : project.skills
          : "",
        website: project.website || "",
        order: project.order || 0,
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: "",
        description: "",
        duration: "",
        skills: "",
        website: "",
        order: 0,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProject(null);
  };

  const handleSubmit = async () => {
    try {
      const projectData = {
        ...formData,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s)
          .join(", "),
        isActive: true,
      };

      const result = editingProject
        ? await updateProject(editingProject._id, projectData)
        : await createProject(projectData);

      if (result.success) {
        enqueueSnackbar(
          `Project ${editingProject ? "updated" : "created"} successfully!`,
          { variant: "success" }
        );
        handleClose();
      } else {
        enqueueSnackbar(result.message || "Operation failed", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred", { variant: "error" });
    }
  };

  const handleDeleteClick = (project: Project) => {
    setDeleteConfirm({
      open: true,
      id: project._id,
      name: project.name,
    });
  };

  const handleDeleteConfirm = async () => {
    const result = await deleteProject(deleteConfirm.id);
    if (result.success) {
      enqueueSnackbar("Project deleted successfully!", {
        variant: "success",
      });
    } else {
      enqueueSnackbar(result.message || "Failed to delete project", {
        variant: "error",
      });
    }
    setDeleteConfirm({ open: false, id: "", name: "" });
  };

  // const handleImageUpload = async (
  //   event: React.ChangeEvent<HTMLInputElement>,
  //   projectId: string
  // ) => {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   if (file.size > 5 * 1024 * 1024) {
  //     enqueueSnackbar("Image size must be less than 5MB", { variant: "error" });
  //     return;
  //   }

  //   if (!file.type.startsWith("image/")) {
  //     enqueueSnackbar("Please select a valid image file", { variant: "error" });
  //     return;
  //   }

  //   setUploading(projectId);
  //   try {
  //     const result = await uploadProjectImage(projectId, file);
  //     if (result.success) {
  //       enqueueSnackbar("Project image uploaded successfully!", {
  //         variant: "success",
  //       });
  //       fetchProjects();
  //     } else {
  //       enqueueSnackbar(result.message || "Failed to upload image", {
  //         variant: "error",
  //       });
  //     }
  //   } catch (error) {
  //     enqueueSnackbar("Error uploading image", { variant: "error" });
  //   } finally {
  //     setUploading(null);
  //     event.target.value = "";
  //   }
  // };

  if (loading.projects) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "#00ffff" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ animation: "fadeIn 0.6s ease-out" }}>
      {/* Header */}
      <Box sx={{ mb: 4, mt: 42 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "flex-start", sm: "center" },
            justifyContent: "space-between",
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 2, sm: 0 },
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background:
                  "linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(0, 255, 255, 0.1))",
                border: "1px solid rgba(0, 255, 255, 0.3)",
              }}
            >
              <Work sx={{ color: "#00ffff", fontSize: 28 }} />
            </Box>
            <Box>
              <Typography
                variant="h4"
                sx={{
                  color: "#ffffff",
                  fontWeight: 700,
                  mb: 0.5,
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
                }}
              >
                Projects Management
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "rgba(224, 242, 241, 0.7)" }}
              >
                Manage your portfolio projects
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            fullWidth={false}
            sx={{
              bgcolor: "#00ffff",
              color: "#000",
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                bgcolor: alpha("#00ffff", 0.8),
              },
            }}
          >
            Add Project
          </Button>
        </Box>
      </Box>

      {/* Projects Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 3,
        }}
      >
        {projects
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((project) => (
            <Card
              key={project._id}
              sx={{
                background:
                  "linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(0, 255, 255, 0.05))",
                border: "1px solid rgba(0, 255, 255, 0.2)",
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                {/* Project Image */}

                <Typography
                  variant="h6"
                  sx={{ color: "#ffffff", mb: 1, fontWeight: 600 }}
                >
                  {project.name}
                </Typography>

                {/* Description with Read More */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(224, 242, 241, 0.8)" }}
                  >
                    {project.description && project.description.length > 100 ? (
                      expandedDescriptions.has(project._id) ? (
                        <>
                          {project.description}
                          <Button
                            size="small"
                            onClick={() => {
                              const newExpanded = new Set(expandedDescriptions);
                              newExpanded.delete(project._id);
                              setExpandedDescriptions(newExpanded);
                            }}
                            sx={{
                              color: "#00ffff",
                              textTransform: "none",
                              p: 0,
                              minWidth: "auto",
                              ml: 1,
                            }}
                          >
                            Read Less
                          </Button>
                        </>
                      ) : (
                        <>
                          {project.description.substring(0, 100)}...
                          <Button
                            size="small"
                            onClick={() => {
                              const newExpanded = new Set(expandedDescriptions);
                              newExpanded.add(project._id);
                              setExpandedDescriptions(newExpanded);
                            }}
                            sx={{
                              color: "#00ffff",
                              textTransform: "none",
                              p: 0,
                              minWidth: "auto",
                              ml: 1,
                            }}
                          >
                            Read More
                          </Button>
                        </>
                      )
                    ) : (
                      project.description
                    )}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1, sm: 0 },
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" sx={{ color: "#00ffff" }}>
                    Duration: {project.duration}
                  </Typography>
                  <Chip
                    label={`#${project.order || 0}`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255, 107, 122, 0.2)",
                      color: "#ff6b7a",
                      border: "1px solid rgba(255, 107, 122, 0.3)",
                      fontSize: "0.7rem",
                    }}
                  />
                </Box>

                {/* Skills */}
                <Box sx={{ mb: 2 }}>
                  {project.skills &&
                    (Array.isArray(project.skills)
                      ? project.skills
                      : project.skills.split(",")
                    ).map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill.trim()}
                        size="small"
                        sx={{
                          mr: 0.5,
                          mb: 0.5,
                          bgcolor: "rgba(0, 255, 255, 0.2)",
                          color: "#00ffff",
                          border: "1px solid rgba(0, 255, 255, 0.3)",
                        }}
                      />
                    ))}
                </Box>

                {/* Website Link */}
                {project.website && (
                  <Box sx={{ mb: 2 }}>
                    <Button
                      startIcon={<LinkIcon />}
                      href={project.website}
                      target="_blank"
                      size="small"
                      sx={{ color: "#00ffff" }}
                    >
                      View Project
                    </Button>
                  </Box>
                )}

                {/* Actions */}
                <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                  <IconButton
                    onClick={() => handleOpen(project)}
                    sx={{ color: "#00ffff" }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(project)}
                    sx={{ color: "#ff6b7a" }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          ))}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#1a1a1a",
            border: "1px solid rgba(0, 255, 255, 0.3)",
            m: { xs: 1, sm: 2 },
            maxHeight: { xs: "90vh", sm: "80vh" },
          },
        }}
      >
        <DialogTitle sx={{ color: "#ffffff" }}>
          {editingProject ? "Edit Project" : "Add New Project"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Project Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": { borderColor: "rgba(0, 255, 255, 0.3)" },
                  "&:hover fieldset": { borderColor: "#00ffff" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(224, 242, 241, 0.7)",
                },
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": { borderColor: "rgba(0, 255, 255, 0.3)" },
                  "&:hover fieldset": { borderColor: "#00ffff" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(224, 242, 241, 0.7)",
                },
              }}
            />
            <Box sx={{ display: "flex", gap: { xs: 1, sm: 2 }, flexDirection: { xs: "column", sm: "row" } }}>
              <TextField
                fullWidth
                label="Duration"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#ffffff",
                    "& fieldset": { borderColor: "rgba(0, 255, 255, 0.3)" },
                    "&:hover fieldset": { borderColor: "#00ffff" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(224, 242, 241, 0.7)",
                  },
                }}
              />
              <TextField
                fullWidth
                label="Order"
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value) || 0,
                  })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    color: "#ffffff",
                    "& fieldset": { borderColor: "rgba(0, 255, 255, 0.3)" },
                    "&:hover fieldset": { borderColor: "#00ffff" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(224, 242, 241, 0.7)",
                  },
                }}
              />
            </Box>
            <TextField
              fullWidth
              label="Skills (comma separated)"
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": { borderColor: "rgba(0, 255, 255, 0.3)" },
                  "&:hover fieldset": { borderColor: "#00ffff" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(224, 242, 241, 0.7)",
                },
              }}
            />
            <TextField
              fullWidth
              label="Website URL (optional)"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": { borderColor: "rgba(0, 255, 255, 0.3)" },
                  "&:hover fieldset": { borderColor: "#00ffff" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(224, 242, 241, 0.7)",
                },
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{ color: "rgba(224, 242, 241, 0.7)" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              bgcolor: "#00ffff",
              color: "#000",
              "&:hover": { bgcolor: alpha("#00ffff", 0.8) },
            }}
          >
            {editingProject ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteConfirm.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ open: false, id: "", name: "" })}
        confirmText="Delete"
        severity="error"
      />
    </Box>
  );
};

export default ProjectsManagement;
