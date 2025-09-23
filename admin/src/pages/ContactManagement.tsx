import {
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  CircularProgress,
  alpha,
} from "@mui/material";
import {
  ContactMail,
  Phone,
  LinkedIn,
  GitHub,
  LocationOn,
  Save,
  Email,
  Language,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useSnackbar } from "notistack";

const ContactManagement = () => {
  const { contact, loading, fetchContact, updateContact } = useAdminStore();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    linkedin: "",
    github: "",
    location: "",
  });

  useEffect(() => {
    fetchContact();
  }, [fetchContact]);

  useEffect(() => {
    if (contact) {
      setFormData({
        email: contact.email || "",
        phone: contact.phone || "",
        linkedin: contact.linkedin || "",
        github: contact.github || "",
        location: contact.location || "",
      });
    }
  }, [contact]);

  const handleSubmit = async () => {
    try {
      const result = await updateContact(formData);
      if (result.success) {
        enqueueSnackbar("Contact information updated successfully!", {
          variant: "success",
        });
      } else {
        enqueueSnackbar(result.message || "Update failed", {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred", { variant: "error" });
    }
  };

  const contactFields = [
    {
      key: "email",
      label: "Email Address",
      icon: <Email />,
      placeholder: "your.email@example.com",
      type: "email",
    },
    {
      key: "phone",
      label: "Phone Number",
      icon: <Phone />,
      placeholder: "+1 (555) 123-4567",
      type: "tel",
    },
    {
      key: "linkedin",
      label: "LinkedIn Profile",
      icon: <LinkedIn />,
      placeholder: "https://linkedin.com/in/yourprofile",
      type: "url",
    },
    {
      key: "github",
      label: "GitHub Profile",
      icon: <GitHub />,
      placeholder: "https://github.com/yourusername",
      type: "url",
    },
    {
      key: "location",
      label: "Location",
      icon: <LocationOn />,
      placeholder: "City, Country",
      type: "text",
    },
  ];

  if (loading.contact) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "#26c6da" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        animation: "fadeIn 0.6s ease-out",
        "@keyframes fadeIn": {
          from: { opacity: 0, transform: "translateY(10px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          mb: 2,
          // borderRadius: 3,
          // background: "linear-gradient(135deg,#26c6da 0%,#00acc1 100%)",
          // color: "white",
          display: "flex",
          alignItems: "center",
          color: "#26c6da",
          gap: 2,
        }}
      >
        <ContactMail sx={{ fontSize: 40 }} />
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Contact Information
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85 }}>
            Manage your professional contact details and social profiles
          </Typography>
        </Box>
      </Box>

      {/* Contact Form */}
      <Card
        sx={{
          backgroundColor: "rgba(38,198,218,0.06)",
          border: "1px solid rgba(38,198,218,0.2)",
          borderRadius: 4,
          boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          backdropFilter: "blur(16px)",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography
            variant="h5"
            sx={{
              color: "#26c6da",
              fontWeight: 600,
              mb: 4,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Language sx={{ fontSize: 24 }} />
            Contact Details
          </Typography>

          {/* Responsive Flex Layout */}
          <Box
            component="form"
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
            }}
          >
            {contactFields.map((field) => (
              <Box
                key={field.key}
                sx={{
                  flex: "1 1 300px", // Grow/shrink but keep a min width
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    color: "#26c6da",
                    fontSize: 24,
                    minWidth: 40,
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {field.icon}
                </Box>
                <TextField
                  fullWidth
                  variant="outlined"
                  label={field.label}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.key as keyof typeof formData]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field.key]: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      color: "white",
                      backgroundColor: "rgba(255,255,255,0.04)",
                      transition: "0.2s",
                      "& fieldset": {
                        borderColor: "rgba(38, 198, 218, 0.3)",
                      },
                      "&:hover fieldset": {
                        borderColor: "rgba(38, 198, 218, 0.5)",
                        backgroundColor: "rgba(255,255,255,0.06)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#26c6da",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(224, 242, 241, 0.7)",
                      "&.Mui-focused": {
                        color: "#26c6da",
                      },
                    },
                  }}
                />
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mt: 5,
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "rgba(38, 198, 218, 0.5)",
                color: "#26c6da",
                px: 3,
                "&:hover": {
                  borderColor: "#26c6da",
                  backgroundColor: "rgba(38, 198, 218, 0.1)",
                },
              }}
              onClick={() =>
                setFormData({
                  email: contact?.email || "",
                  phone: contact?.phone || "",
                  linkedin: contact?.linkedin || "",
                  github: contact?.github || "",
                  location: contact?.location || "",
                })
              }
            >
              Reset
            </Button>
            <Button
              variant="contained"
              size="large"
              startIcon={<Save />}
              onClick={handleSubmit}
              disabled={loading.contact}
              sx={{
                bgcolor: "#26c6da",
                color: "#000",
                px: 4,
                fontWeight: 600,
                "&:hover": {
                  bgcolor: alpha("#26c6da", 0.9),
                },
                "&:disabled": {
                  bgcolor: "rgba(38, 198, 218, 0.3)",
                  color: "rgba(0, 0, 0, 0.5)",
                },
              }}
            >
              {loading.contact ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: "#000" }} />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ContactManagement;
