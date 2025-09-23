import {
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Avatar,
  alpha,
  Divider,
  CircularProgress,
  Chip,
  IconButton,
} from "@mui/material";
import {
  Person,
  Save,
  Upload,
  Preview,
  Refresh,
  Edit,
  Visibility,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useSnackbar } from "notistack";

const HeroManagement = () => {
  const {
    hero,
    loading,
    fetchHero,
    updateHero,
    uploadHeroImage,
    uploadHeroCV,
  } = useAdminStore();
  const { enqueueSnackbar } = useSnackbar();
  const [heroData, setHeroData] = useState({
    name: "",
    title: "",
    bio: "",
    profileImage: "",
    cvUrl: "",
    yearsExperience: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchHero();
  }, [fetchHero]);

  useEffect(() => {
    if (hero) {
      setHeroData({
        name: hero.name || "",
        title: hero.title || "",
        bio: hero.bio || "",
        profileImage: hero.profileImage || "",
        cvUrl: hero.cvUrl || "",
        yearsExperience: hero.yearsExperience || 0,
      });
    }
  }, [hero]);

  const handleInputChange = (field: string, value: string) => {
    const processedValue =
      field === "yearsExperience" ? parseFloat(value) || 0 : value;
    setHeroData((prev) => ({ ...prev, [field]: processedValue }));
  };

  const handleSave = async () => {
    try {
      const result = await updateHero(heroData);
      if (result.success) {
        enqueueSnackbar("Hero section updated successfully!", {
          variant: "success",
        });
        setIsEditing(false);
      } else {
        enqueueSnackbar(result.message || "Failed to update hero section", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred while updating", { variant: "error" });
    }
  };

  const handleReset = () => {
    if (hero) {
      setHeroData({
        name: hero.name || "",
        title: hero.title || "",
        bio: hero.bio || "",
        profileImage: hero.profileImage || "",
        cvUrl: hero.cvUrl || "",
        yearsExperience: hero.yearsExperience || 0,
      });
    }
    setIsEditing(false);
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar("Image size must be less than 5MB", { variant: "error" });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      enqueueSnackbar("Please select a valid image file", { variant: "error" });
      return;
    }

    setUploading(true);
    try {
      const result = await uploadHeroImage(file);

      if (result.success && result.profileImage) {
        setHeroData((prev) => ({
          ...prev,
          profileImage: result.profileImage!,
        }));
        enqueueSnackbar("Profile image uploaded successfully!", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(result.message || "Failed to upload image", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("Error uploading image", { variant: "error" });
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  const handleResumeUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      enqueueSnackbar("Resume size must be less than 10MB", {
        variant: "error",
      });
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedTypes.includes(file.type)) {
      enqueueSnackbar("Please select a PDF or Word document", {
        variant: "error",
      });
      return;
    }

    setUploading(true);
    try {
      const result = await uploadHeroCV(file);

      if (result.success && result.cvUrl) {
        setHeroData((prev) => ({ ...prev, cvUrl: result.cvUrl! }));
        enqueueSnackbar("Resume uploaded successfully!", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(result.message || "Failed to upload resume", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("Error uploading resume", { variant: "error" });
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = "";
    }
  };

  if (loading.hero) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "#ff6b7a" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ animation: "fadeIn 0.6s ease-out" }}>
      {/* Header */}
      <Box sx={{ mb: 4, mt: 0 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
            mt: 6,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                // p: 1.5,
                borderRadius: 2,
                background:
                  "linear-gradient(135deg, rgba(255, 107, 122, 0.2), rgba(255, 107, 122, 0.1))",
                border: "1px solid rgba(255, 107, 122, 0.3)",
              }}
            >
              <Person sx={{ color: "#ff6b7a", fontSize: 28 }} />
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
                Hero Section
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "rgba(224, 242, 241, 0.7)" }}
              >
                Manage your personal information and introduction
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              icon={isEditing ? <Edit /> : <Visibility />}
              label={isEditing ? "Edit Mode" : "View Mode"}
              sx={{
                bgcolor: isEditing
                  ? "rgba(255, 107, 122, 0.2)"
                  : "rgba(0, 255, 255, 0.2)",
                color: isEditing ? "#ff6b7a" : "#00ffff",
                border: `1px solid ${
                  isEditing
                    ? "rgba(255, 107, 122, 0.3)"
                    : "rgba(0, 255, 255, 0.3)"
                }`,
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Profile Display Card */}
      <Card
        sx={{
          mb: 2,
          background:
            "linear-gradient(135deg, rgba(255, 107, 122, 0.1), rgba(255, 107, 122, 0.05))",
          border: "1px solid rgba(255, 107, 122, 0.2)",
          borderRadius: 3,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background:
              "linear-gradient(90deg, #ff6b7a, rgba(255, 107, 122, 0.7))",
          },
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: "flex", alignItems: "flex-start", gap: 4 }}>
            {/* Avatar Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                src={heroData.profileImage}
                sx={{
                  width: 120,
                  height: 120,
                  border: "4px solid rgba(255, 107, 122, 0.3)",
                  boxShadow: `0 8px 32px ${alpha("#ff6b7a", 0.3)}`,
                }}
              >
                {heroData.name?.charAt(0) || "U"}
              </Avatar>
              <Box>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button
                    component="span"
                    startIcon={
                      uploading ? <CircularProgress size={16} /> : <Upload />
                    }
                    variant="outlined"
                    size="small"
                    disabled={uploading}
                    sx={{
                      borderColor: "rgba(255, 107, 122, 0.3)",
                      color: "#ff6b7a",
                      "&:hover": {
                        borderColor: "#ff6b7a",
                        bgcolor: "rgba(255, 107, 122, 0.1)",
                      },
                      "&:disabled": {
                        borderColor: "rgba(255, 107, 122, 0.2)",
                        color: "rgba(255, 107, 122, 0.5)",
                      },
                    }}
                  >
                    {uploading ? "Uploading..." : "Change Photo"}
                  </Button>
                </label>
              </Box>
            </Box>

            {/* Info Section */}
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h3"
                    sx={{ color: "#ffffff", fontWeight: 700, mb: 1 }}
                  >
                    {heroData.name || "Your Name"}
                  </Typography>
                  <Typography variant="h5" sx={{ color: "#ff6b7a", mb: 2 }}>
                    {heroData.title || "Your Professional Title"}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => setIsEditing(!isEditing)}
                  sx={{
                    color: "#00ffff",
                    bgcolor: "rgba(0, 255, 255, 0.1)",
                    "&:hover": {
                      bgcolor: "rgba(0, 255, 255, 0.2)",
                    },
                  }}
                >
                  <Edit />
                </IconButton>
              </Box>

              <Typography
                variant="body1"
                sx={{
                  color: "rgba(224, 242, 241, 0.9)",
                  lineHeight: 1.8,
                  fontSize: "1rem",
                  mb: 2,
                }}
              >
                {heroData.bio ||
                  "Your professional bio and introduction will appear here. Click edit to add your story."}
              </Typography>

              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  startIcon={<Preview />}
                  variant="outlined"
                  sx={{
                    borderColor: "rgba(0, 255, 255, 0.3)",
                    color: "#00ffff",
                    "&:hover": {
                      borderColor: "#00ffff",
                      bgcolor: "rgba(0, 255, 255, 0.1)",
                    },
                  }}
                >
                  Preview Live Site
                </Button>
                <Box>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    style={{ display: "none" }}
                    id="resume-upload"
                  />
                  <label htmlFor="resume-upload">
                    <Button
                      component="span"
                      startIcon={
                        uploading ? <CircularProgress size={16} /> : <Upload />
                      }
                      variant="outlined"
                      disabled={uploading}
                      sx={{
                        borderColor: "rgba(0, 255, 255, 0.3)",
                        color: "#00ffff",
                        "&:hover": {
                          borderColor: "#00ffff",
                          bgcolor: "rgba(0, 255, 255, 0.1)",
                        },
                        "&:disabled": {
                          borderColor: "rgba(0, 255, 255, 0.2)",
                          color: "rgba(0, 255, 255, 0.5)",
                        },
                      }}
                    >
                      {uploading ? "Uploading..." : "Update Resume"}
                    </Button>
                  </label>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Edit Form */}
      {isEditing && (
        <Card
          sx={{
            background:
              "linear-gradient(135deg, rgba(0, 255, 255, 0.05), rgba(0, 255, 255, 0.02))",
            border: "1px solid rgba(0, 255, 255, 0.1)",
            borderRadius: 3,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Typography
              variant="h5"
              sx={{ color: "#00ffff", mb: 4, fontWeight: 600 }}
            >
              Edit Hero Information
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {/* Basic Info Row */}
              <Box sx={{ display: "flex", gap: 3 }}>
                <TextField
                  label="Full Name"
                  value={heroData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your full name"
                />

                <TextField
                  label="Professional Title"
                  value={heroData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  fullWidth
                  variant="outlined"
                  placeholder="e.g., Full Stack Developer, UI/UX Designer"
                />

                <TextField
                  label="Years of Experience"
                  type="number"
                  value={heroData.yearsExperience}
                  onChange={(e) =>
                    handleInputChange("yearsExperience", e.target.value)
                  }
                  variant="outlined"
                  placeholder="0"
                  inputProps={{ min: 0, max: 50, step: 0.5 }}
                  sx={{ minWidth: 200 }}
                />
              </Box>

              {/* Bio Section */}
              <Box>
                <Typography
                  variant="h6"
                  sx={{ color: "#ffffff", mb: 2, fontWeight: 500 }}
                >
                  Professional Bio
                </Typography>
                <TextField
                  label="About You"
                  value={heroData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  fullWidth
                  multiline
                  rows={10}
                  variant="outlined"
                  placeholder="Write a compelling introduction about yourself, your skills, experience, and what makes you unique. This will be the first thing visitors see on your portfolio..."
                  sx={{
                    "& .MuiInputBase-root": {
                      fontSize: "1rem",
                      lineHeight: 1.6,
                    },
                  }}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(224, 242, 241, 0.6)" }}
                  >
                    Write a detailed introduction that showcases your
                    personality and expertise
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: "rgba(224, 242, 241, 0.6)" }}
                  >
                    {heroData.bio.length} characters
                  </Typography>
                </Box>
              </Box>

              {/* Action Buttons */}
              <Divider sx={{ borderColor: "rgba(0, 255, 255, 0.1)" }} />

              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  startIcon={<Refresh />}
                  variant="outlined"
                  onClick={handleReset}
                  disabled={loading.hero}
                  sx={{
                    borderColor: "rgba(224, 242, 241, 0.3)",
                    color: "rgba(224, 242, 241, 0.7)",
                    "&:hover": {
                      borderColor: "rgba(224, 242, 241, 0.5)",
                      bgcolor: "rgba(224, 242, 241, 0.05)",
                    },
                  }}
                >
                  Cancel Changes
                </Button>

                <Button
                  startIcon={<Save />}
                  variant="contained"
                  onClick={handleSave}
                  disabled={loading.hero}
                  sx={{
                    background: "linear-gradient(45deg, #00ffff, #00e5e5)",
                    color: "#1a2332",
                    fontWeight: 600,
                    px: 4,
                    "&:hover": {
                      background: "linear-gradient(45deg, #00e5e5, #00cccc)",
                      transform: "translateY(-2px)",
                    },
                    "&:disabled": {
                      background: "rgba(0, 255, 255, 0.3)",
                      color: "rgba(26, 35, 50, 0.5)",
                    },
                  }}
                >
                  {loading.hero ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default HeroManagement;
