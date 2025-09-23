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
  School,
  LocationOn,
  Business,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useSnackbar } from "notistack";
import { Education } from "@/types";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const EducationManagement = () => {
  const {
    education,
    loading,
    fetchEducation,
    createEducation,
    updateEducation,
    deleteEducation,
  } = useAdminStore();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(
    null
  );
  const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(
    new Set()
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
    degree: string;
  }>({ open: false, id: "", degree: "" });
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    duration: "",
    location: "",
    description: "",
    order: 0,
  });

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  const handleOpen = (education?: Education) => {
    if (education) {
      setEditingEducation(education);
      setFormData({
        degree: education.degree || "",
        institution: education.institution || "",
        duration: education.duration || "",
        location: education.location || "",
        description: education.description || "",
        order: education.order || 0,
      });
    } else {
      setEditingEducation(null);
      setFormData({
        degree: "",
        institution: "",
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
    setEditingEducation(null);
  };

  const handleSubmit = async () => {
    try {
      const educationData = {
        ...formData,
        isActive: true,
      };

      const result = editingEducation
        ? await updateEducation(editingEducation._id, educationData)
        : await createEducation(educationData);

      if (result.success) {
        enqueueSnackbar(
          `Education ${editingEducation ? "updated" : "created"} successfully!`,
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

  const handleDeleteClick = (education: Education) => {
    setDeleteConfirm({
      open: true,
      id: education._id,
      degree: education.degree,
    });
  };

  const handleDeleteConfirm = async () => {
    const result = await deleteEducation(deleteConfirm.id);
    if (result.success) {
      enqueueSnackbar("Education deleted successfully!", {
        variant: "success",
      });
    } else {
      enqueueSnackbar(result.message || "Failed to delete education", {
        variant: "error",
      });
    }
    setDeleteConfirm({ open: false, id: "", degree: "" });
  };

  if (loading.education) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "#00ffff" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ animation: "fadeIn 0.6s ease-out" }}>
      {/* Header */}
      <Box sx={{ mb: 4, mt: 6 }}>
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
                  "linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(76, 175, 80, 0.1))",
                border: "1px solid rgba(76, 175, 80, 0.3)",
                // mt: 42,
              }}
            >
              <School sx={{ color: "#4caf50", fontSize: 28 }} />
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
                Education Management
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "rgba(224, 242, 241, 0.7)" }}
              >
                Manage your educational background
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpen()}
            sx={{
              bgcolor: "#4caf50",
              color: "#000",
              "&:hover": {
                bgcolor: alpha("#4caf50", 0.8),
              },
            }}
          >
            Add Education
          </Button>
        </Box>
      </Box>

      {/* Education Grid */}
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
        {education
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((edu) => (
            <Card
              key={edu._id}
              sx={{
                background:
                  "linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.05))",
                border: "1px solid rgba(76, 175, 80, 0.2)",
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
                      {edu.degree}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      <Business sx={{ color: "#4caf50", fontSize: 16 }} />
                      <Typography
                        variant="body2"
                        sx={{ color: "#4caf50", fontWeight: 500 }}
                      >
                        {edu.institution}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip
                    label={`#${edu.order || 0}`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(255, 193, 7, 0.2)",
                      color: "#ffc107",
                      border: "1px solid rgba(255, 193, 7, 0.3)",
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
                    {edu.location}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ color: "#4caf50", mb: 2 }}>
                  {edu.duration}
                </Typography>

                {/* Description with Read More */}
                {edu.description && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(224, 242, 241, 0.8)" }}
                    >
                      {edu.description.length > 100 ? (
                        expandedDescriptions.has(edu._id) ? (
                          <>
                            {edu.description}
                            <Button
                              size="small"
                              onClick={() => {
                                const newExpanded = new Set(
                                  expandedDescriptions
                                );
                                newExpanded.delete(edu._id);
                                setExpandedDescriptions(newExpanded);
                              }}
                              sx={{
                                color: "#4caf50",
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
                            {edu.description.substring(0, 100)}...
                            <Button
                              size="small"
                              onClick={() => {
                                const newExpanded = new Set(
                                  expandedDescriptions
                                );
                                newExpanded.add(edu._id);
                                setExpandedDescriptions(newExpanded);
                              }}
                              sx={{
                                color: "#4caf50",
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
                        edu.description
                      )}
                    </Typography>
                  </Box>
                )}

                {/* Actions */}
                <Box sx={{ display: "flex", gap: 1, mt: "auto" }}>
                  <IconButton
                    onClick={() => handleOpen(edu)}
                    sx={{ color: "#4caf50" }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDeleteClick(edu)}
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
            border: "1px solid rgba(76, 175, 80, 0.3)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#ffffff" }}>
          {editingEducation ? "Edit Education" : "Add New Education"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              fullWidth
              label="Degree"
              value={formData.degree}
              onChange={(e) =>
                setFormData({ ...formData, degree: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": { borderColor: "rgba(76, 175, 80, 0.3)" },
                  "&:hover fieldset": { borderColor: "#4caf50" },
                },
                "& .MuiInputLabel-root": {
                  color: "rgba(224, 242, 241, 0.7)",
                },
              }}
            />
            <TextField
              fullWidth
              label="Institution"
              value={formData.institution}
              onChange={(e) =>
                setFormData({ ...formData, institution: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": { borderColor: "rgba(76, 175, 80, 0.3)" },
                  "&:hover fieldset": { borderColor: "#4caf50" },
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
                    "& fieldset": { borderColor: "rgba(76, 175, 80, 0.3)" },
                    "&:hover fieldset": { borderColor: "#4caf50" },
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
                    "& fieldset": { borderColor: "rgba(76, 175, 80, 0.3)" },
                    "&:hover fieldset": { borderColor: "#4caf50" },
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
                  "& fieldset": { borderColor: "rgba(76, 175, 80, 0.3)" },
                  "&:hover fieldset": { borderColor: "#4caf50" },
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
              label="Description (optional)"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  color: "#ffffff",
                  "& fieldset": { borderColor: "rgba(76, 175, 80, 0.3)" },
                  "&:hover fieldset": { borderColor: "#4caf50" },
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
              bgcolor: "#4caf50",
              color: "#000",
              "&:hover": { bgcolor: alpha("#4caf50", 0.8) },
            }}
          >
            {editingEducation ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete Education"
        message={`Are you sure you want to delete "${deleteConfirm.degree}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ open: false, id: "", degree: "" })}
        confirmText="Delete"
        severity="error"
      />
    </Box>
  );
};

export default EducationManagement;
