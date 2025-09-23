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
import {
  Add,
  Edit,
  Delete,
  Work,
  Link as LinkIcon,
  LocationOn,
  Business,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useSnackbar } from "notistack";
import { Experience } from "@/types";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const ExperienceManagement = () => {
  const {
    experiences,
    loading,
    fetchExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
  } = useAdminStore();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(
    null
  );
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(
    new Set()
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
    title: string;
  }>({ open: false, id: "", title: "" });
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    website: "",
    duration: "",
    location: "",
    description: "",
    order: 0,
  });

  useEffect(() => {
    fetchExperiences();
  }, [fetchExperiences]);

  const handleOpen = (experience?: Experience) => {
    if (experience) {
      setEditingExperience(experience);
      setFormData({
        title: experience.title || "",
        company: experience.company || "",
        website: experience.website || "",
        duration: experience.duration || "",
        location: experience.location || "",
        description: experience.description || "",
        order: experience.order || 0,
      });
    } else {
      setEditingExperience(null);
      setFormData({
        title: "",
        company: "",
        website: "",
        duration: "",
        location: "",
        description: "",
        order: 0,
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingExperience(null);
  };

  const handleSubmit = async () => {
    try {
      const experienceData = {
        ...formData,
        isActive: true,
      };

      const result = editingExperience
        ? await updateExperience(editingExperience._id, experienceData)
        : await createExperience(experienceData);

      if (result.success) {
        enqueueSnackbar(
          `Experience ${
            editingExperience ? "updated" : "created"
          } successfully!`,
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

  const handleDeleteClick = (experience: Experience) => {
    setDeleteConfirm({
      open: true,
      id: experience._id,
      title: experience.title,
    });
  };

  const handleDeleteConfirm = async () => {
    const result = await deleteExperience(deleteConfirm.id);
    if (result.success) {
      enqueueSnackbar("Experience deleted successfully!", {
        variant: "success",
      });
    } else {
      enqueueSnackbar(result.message || "Failed to delete experience", {
        variant: "error",
      });
    }
    setDeleteConfirm({ open: false, id: "", title: "" });
  };

  if (loading.experiences) {
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
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                background:
                  "linear-gradient(135deg, rgba(255, 107, 122, 0.2), rgba(255, 107, 122, 0.1))",
                border: "1px solid rgba(255, 107, 122, 0.3)",
              }}
            >
              <Work sx={{ color: "#ff6b7a", fontSize: 28 }} />
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
                Experience Management
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "rgba(224, 242, 241, 0.7)" }}
              >
                Manage your work experience
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            sx={{
              bgcolor: "#ff6b7a",
              color: "#000",
              "&:hover": {
                bgcolor: alpha("#ff6b7a", 0.8),
              },
            }}
          >
            Add Experience
          </Button>
        </Box>
      </Box>

      {/* Experience Grid */}
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
        {experiences
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((experience) => (
            <Card
              key={experience._id}
              sx={{
                background:
                  "linear-gradient(135deg, rgba(255, 107, 122, 0.1), rgba(255, 107, 122, 0.05))",
                border: "1px solid rgba(255, 107, 122, 0.2)",
                borderRadius: 3,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h6"
                      sx={{ color: "#ffffff", mb: 0.5, fontWeight: 600 }}
                    >
                      {experience.title}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Business sx={{ color: "#ff6b7a", fontSize: 16 }} />
                      <Typography
                        variant="body2"
                        sx={{ color: "#ff6b7a", fontWeight: 500 }}
                      >
                        {experience.company}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={`#${experience.order || 0}`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(0, 255, 255, 0.2)",
                      color: "#00ffff",
                      border: "1px solid rgba(0, 255, 255, 0.3)",
                      fontSize: "0.7rem",
                    }}
                  />
                </Box>

                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <LocationOn
                    sx={{ color: "rgba(224, 242, 241, 0.7)", fontSize: 16 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(224, 242, 241, 0.7)" }}
                  >
                    {experience.location}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: "#ff6b7a", mb: 2 }}>
                  {experience.duration}
                </Typography>

                {/* Description with Read More */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(224, 242, 241, 0.8)" }}
                  >
                    {experience.description &&
                    experience.description.length > 100 ? (
                      expandedDescriptions.has(experience._id) ? (
                        <>
                          {experience.description}
                          <Button
                            size="small"
                            onClick={() => {
                              const newExpanded = new Set(expandedDescriptions);
                              newExpanded.delete(experience._id);
                              setExpandedDescriptions(newExpanded);
                            }}
                            sx={{
                              color: "#ff6b7a",
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
                          {experience.description.substring(0, 100)}...
                          <Button
                            size="small"
                            onClick={() => {
                              const newExpanded = new Set(expandedDescriptions);
                              newExpanded.add(experience._id);
                              setExpandedDescriptions(newExpanded);
                            }}
                            sx={{
                              color: "#ff6b7a",
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
                      experience.description
                    )}
                  </Typography>
                </Box>

                {/* Website Link */}
                {experience.website && (
                  <Box sx={{ mb: 2 }}>
                    <Button
                      startIcon={<LinkIcon />}
                      href={experience.website}
                      target="_blank"
                      size="small"
                      sx={{ color: "#ff6b7a" }}
                    >
                      Company Website
                    </Button>
                  </Box>
                )}

                {/* Actions */}
                <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                  <IconButton
                    onClick={() => handleOpen(experience)}
                    sx={{ color: "#ff6b7a" }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(experience)}
                    sx={{ color: "#00ffff" }}
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
            border: "1px solid rgba(255, 107, 122, 0.3)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#ffffff" }}>
          {editingExperience ? "Edit Experience" : "Add New Experience"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Job Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": { borderColor: "rgba(255, 107, 122, 0.3)" },
                  "&:hover fieldset": { borderColor: "#ff6b7a" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(224, 242, 241, 0.7)",
                },
              }}
            />
            <TextField
              fullWidth
              label="Company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": { borderColor: "rgba(255, 107, 122, 0.3)" },
                  "&:hover fieldset": { borderColor: "#ff6b7a" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(224, 242, 241, 0.7)",
                },
              }}
            />
            <Box sx={{ display: "flex", gap: 2 }}>
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
                    "& fieldset": { borderColor: "rgba(255, 107, 122, 0.3)" },
                    "&:hover fieldset": { borderColor: "#ff6b7a" },
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
                    "& fieldset": { borderColor: "rgba(255, 107, 122, 0.3)" },
                    "&:hover fieldset": { borderColor: "#ff6b7a" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "rgba(224, 242, 241, 0.7)",
                  },
                }}
              />
            </Box>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": { borderColor: "rgba(255, 107, 122, 0.3)" },
                  "&:hover fieldset": { borderColor: "#ff6b7a" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(224, 242, 241, 0.7)",
                },
              }}
            />
            <TextField
              fullWidth
              label="Company Website"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": { borderColor: "rgba(255, 107, 122, 0.3)" },
                  "&:hover fieldset": { borderColor: "#ff6b7a" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(224, 242, 241, 0.7)",
                },
              }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": { borderColor: "rgba(255, 107, 122, 0.3)" },
                  "&:hover fieldset": { borderColor: "#ff6b7a" },
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
              bgcolor: "#ff6b7a",
              color: "#000",
              "&:hover": { bgcolor: alpha("#ff6b7a", 0.8) },
            }}
          >
            {editingExperience ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete Experience"
        message={`Are you sure you want to delete "${deleteConfirm.title}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ open: false, id: "", title: "" })}
        confirmText="Delete"
        severity="error"
      />
    </Box>
  );
};

export default ExperienceManagement;
