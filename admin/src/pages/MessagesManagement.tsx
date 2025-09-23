import {
  Typography,
  Box,
  Card,
  IconButton,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  ToggleButton,
  ToggleButtonGroup,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Message,
  MarkEmailRead,
  MarkEmailUnread,
  Archive,
  Unarchive,
  Delete,
  Close,
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useAdminStore } from "@/store/adminStore";
import { useSnackbar } from "notistack";
import { ContactForm } from "@/types";
import ConfirmDialog from "@/components/common/ConfirmDialog";

const MessagesManagement = () => {
  const {
    contactForms,
    loading,
    fetchContactForms,
    toggleContactFormRead,
    toggleContactFormArchive,
    deleteContactForm,
  } = useAdminStore();
  const { enqueueSnackbar } = useSnackbar();

  const [selectedMessage, setSelectedMessage] = useState<ContactForm | null>(
    null
  );
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    id: string;
    name: string;
  }>({ open: false, id: "", name: "" });
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchContactForms();
  }, [fetchContactForms]);

  const handleToggleRead = async (id: string, isRead: boolean) => {
    const result = await toggleContactFormRead(id, !isRead);
    if (result.success) {
      enqueueSnackbar(`Message marked as ${!isRead ? "read" : "unread"}`, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(result.message || "Operation failed", {
        variant: "error",
      });
    }
  };

  const handleMessageClick = async (message: ContactForm) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      await toggleContactFormRead(message._id, true);
    }
  };

  const handleToggleArchive = async (id: string, isArchived: boolean) => {
    const result = await toggleContactFormArchive(id, !isArchived);
    if (result.success) {
      enqueueSnackbar(`Message ${!isArchived ? "archived" : "unarchived"}`, {
        variant: "success",
      });
    } else {
      enqueueSnackbar(result.message || "Operation failed", {
        variant: "error",
      });
    }
  };

  const handleDeleteClick = (message: ContactForm) => {
    setDeleteConfirm({
      open: true,
      id: message._id,
      name: message.name,
    });
  };

  const handleDeleteConfirm = async () => {
    const result = await deleteContactForm(deleteConfirm.id);
    if (result.success) {
      enqueueSnackbar("Message deleted successfully!", {
        variant: "success",
      });
    } else {
      enqueueSnackbar(result.message || "Failed to delete message", {
        variant: "error",
      });
    }
    setDeleteConfirm({ open: false, id: "", name: "" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading.contactForms) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress sx={{ color: "#00ffff" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ animation: "fadeIn 0.6s ease-out" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              background:
                "linear-gradient(135deg, rgba(255, 87, 34, 0.2), rgba(255, 87, 34, 0.1))",
              border: "1px solid rgba(255, 87, 34, 0.3)",
            }}
          >
            <Message sx={{ color: "#ff5722", fontSize: 28 }} />
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
              Messages Management
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: "rgba(224, 242, 241, 0.7)" }}
            >
              View and manage contact form submissions
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
        <Card
          sx={{
            background:
              "linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(76, 175, 80, 0.08))",
            border: "1px solid rgba(76, 175, 80, 0.3)",
            borderRadius: 3,
            p: 2,
            flex: 1,
          }}
        >
          <Typography variant="h4" sx={{ color: "#4caf50", fontWeight: 700 }}>
            {contactForms.length}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(224, 242, 241, 0.7)" }}
          >
            Total Messages
          </Typography>
        </Card>
        <Card
          sx={{
            background:
              "linear-gradient(135deg, rgba(255, 193, 7, 0.15), rgba(255, 193, 7, 0.08))",
            border: "1px solid rgba(255, 193, 7, 0.3)",
            borderRadius: 3,
            p: 2,
            flex: 1,
          }}
        >
          <Typography variant="h4" sx={{ color: "#ffc107", fontWeight: 700 }}>
            {contactForms.filter((f) => !f.isRead).length}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(224, 242, 241, 0.7)" }}
          >
            Unread Messages
          </Typography>
        </Card>
        <Card
          sx={{
            background:
              "linear-gradient(135deg, rgba(158, 158, 158, 0.15), rgba(158, 158, 158, 0.08))",
            border: "1px solid rgba(158, 158, 158, 0.3)",
            borderRadius: 3,
            p: 2,
            flex: 1,
          }}
        >
          <Typography variant="h4" sx={{ color: "#9e9e9e", fontWeight: 700 }}>
            {contactForms.filter((f) => f.isArchived).length}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(224, 242, 241, 0.7)" }}
          >
            Archived Messages
          </Typography>
        </Card>
      </Box>

      {/* Filter Buttons and Mark All Read */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<MarkEmailRead />}
          onClick={async () => {
            const unreadMessages = contactForms.filter((f) => !f.isRead);
            for (const message of unreadMessages) {
              await toggleContactFormRead(message._id, true);
            }
            enqueueSnackbar(
              `${unreadMessages.length} messages marked as read`,
              { variant: "success" }
            );
          }}
          disabled={contactForms.filter((f) => !f.isRead).length === 0}
          sx={{
            color: "#ff5722",
            borderColor: "rgba(255, 87, 34, 0.3)",
            "&:hover": {
              borderColor: "#ff5722",
              bgcolor: "rgba(255, 87, 34, 0.1)",
            },
          }}
        >
          Mark All Read
        </Button>

        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, newFilter) => newFilter && setFilter(newFilter)}
          sx={{
            "& .MuiToggleButton-root": {
              color: "rgba(224, 242, 241, 0.7)",
              border: "1px solid rgba(255, 87, 34, 0.3)",
              "&.Mui-selected": {
                bgcolor: "rgba(255, 87, 34, 0.2)",
                color: "#ff5722",
                border: "1px solid rgba(255, 87, 34, 0.5)",
              },
            },
          }}
        >
          <ToggleButton value="all">All Messages</ToggleButton>
          <ToggleButton value="unread">Unread</ToggleButton>
          <ToggleButton value="read">Read</ToggleButton>
          <ToggleButton value="archived">Archived</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Messages List */}
      {contactForms.length === 0 ? (
        <Card
          sx={{
            background:
              "linear-gradient(135deg, rgba(255, 87, 34, 0.1), rgba(255, 87, 34, 0.05))",
            border: "1px solid rgba(255, 87, 34, 0.2)",
            borderRadius: 4,
            p: 6,
            textAlign: "center",
          }}
        >
          <Message
            sx={{ fontSize: 64, color: "rgba(255, 87, 34, 0.5)", mb: 2 }}
          />
          <Typography variant="h5" sx={{ color: "#ffffff", mb: 1 }}>
            No Messages Yet
          </Typography>
          <Typography
            variant="body1"
            sx={{ color: "rgba(224, 242, 241, 0.7)" }}
          >
            Contact form submissions will appear here
          </Typography>
        </Card>
      ) : (
        <Card
          sx={{
            background:
              "linear-gradient(135deg, rgba(255, 87, 34, 0.1), rgba(255, 87, 34, 0.05))",
            border: "1px solid rgba(255, 87, 34, 0.2)",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <List sx={{ p: 0 }}>
            {contactForms
              .filter((message) => {
                switch (filter) {
                  case "unread":
                    return !message.isRead && !message.isArchived;
                  case "read":
                    return message.isRead && !message.isArchived;
                  case "archived":
                    return message.isArchived;
                  default:
                    return true;
                }
              })
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
              )
              .map((message, index) => (
                <Box key={message._id}>
                  <ListItem
                    sx={{
                      cursor: "pointer",
                      py: 2,
                      px: 3,
                      backgroundColor: message.isRead
                        ? "transparent"
                        : "rgba(255, 87, 34, 0.08)",
                      opacity: message.isArchived ? 0.6 : 1,
                      "&:hover": {
                        backgroundColor: "rgba(255, 87, 34, 0.1)",
                      },
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => handleMessageClick(message)}
                  >
                    <ListItemAvatar>
                      <Avatar
                        sx={{
                          bgcolor: message.isRead
                            ? "rgba(255, 87, 34, 0.3)"
                            : "#ff5722",
                          color: "#ffffff",
                          fontWeight: 600,
                        }}
                      >
                        {message.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 0.5,
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{
                              color: "#ffffff",
                              fontWeight: message.isRead ? 400 : 600,
                            }}
                          >
                            {message.name}
                          </Typography>
                          {!message.isRead && (
                            <Chip
                              label="NEW"
                              size="small"
                              sx={{
                                bgcolor: "#ff5722",
                                color: "#ffffff",
                                fontSize: "0.7rem",
                                height: 20,
                              }}
                            />
                          )}
                          {message.isArchived && (
                            <Chip
                              label="ARCHIVED"
                              size="small"
                              sx={{
                                bgcolor: "rgba(158, 158, 158, 0.3)",
                                color: "#9e9e9e",
                                fontSize: "0.7rem",
                                height: 20,
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ color: "#ff5722", mb: 0.5 }}
                          >
                            {message.role} at {message.company} •{" "}
                            {message.email}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "rgba(224, 242, 241, 0.8)",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {message.message}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "rgba(224, 242, 241, 0.6)" }}
                      >
                        {formatDate(message.createdAt)}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip
                          title={message.isArchived ? "Unarchive" : "Archive"}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleArchive(
                                message._id,
                                message.isArchived
                              );
                            }}
                            sx={{ color: "rgba(224, 242, 241, 0.7)" }}
                          >
                            {message.isArchived ? <Unarchive /> : <Archive />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(message);
                            }}
                            sx={{ color: "rgba(244, 67, 54, 0.7)" }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </ListItem>
                  {index < contactForms.length - 1 && (
                    <Divider sx={{ borderColor: "rgba(255, 87, 34, 0.1)" }} />
                  )}
                </Box>
              ))}
          </List>
        </Card>
      )}

      {/* Message Detail Dialog */}
      <Dialog
        open={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "rgba(18, 18, 18, 0.95)",
            border: "1px solid rgba(255, 87, 34, 0.3)",
          },
        }}
      >
        {selectedMessage && (
          <>
            <DialogTitle
              sx={{
                color: "#ffffff",
                borderBottom: "1px solid rgba(255, 87, 34, 0.2)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ color: "#ffffff" }}>
                  Message from {selectedMessage.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#ff5722" }}>
                  {formatDate(selectedMessage.createdAt)}
                </Typography>
              </Box>
              <IconButton
                onClick={() => setSelectedMessage(null)}
                sx={{ color: "rgba(224, 242, 241, 0.7)" }}
              >
                <Close />
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: "#ff5722", mb: 1 }}>
                  Contact Details:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(224, 242, 241, 0.8)", mb: 0.5 }}
                >
                  Email: {selectedMessage.email}
                </Typography>
                {selectedMessage.phone && (
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(224, 242, 241, 0.8)", mb: 0.5 }}
                  >
                    Phone: {selectedMessage.phone}
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(224, 242, 241, 0.8)", mb: 0.5 }}
                >
                  Role: {selectedMessage.role}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "rgba(224, 242, 241, 0.8)" }}
                >
                  Company: {selectedMessage.company}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" sx={{ color: "#ff5722", mb: 1 }}>
                  Message:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "rgba(224, 242, 241, 0.9)",
                    lineHeight: 1.6,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {selectedMessage.message}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions
              sx={{ p: 3, borderTop: "1px solid rgba(255, 87, 34, 0.2)" }}
            >
              <Button
                onClick={() =>
                  handleToggleRead(selectedMessage._id, selectedMessage.isRead)
                }
                startIcon={<MarkEmailUnread />}
                sx={{ color: "#ff5722" }}
              >
                Mark as Unread
              </Button>
              <Button
                onClick={() =>
                  handleToggleArchive(
                    selectedMessage._id,
                    selectedMessage.isArchived
                  )
                }
                startIcon={
                  selectedMessage.isArchived ? <Unarchive /> : <Archive />
                }
                sx={{ color: "#ff5722" }}
              >
                {selectedMessage.isArchived ? "Unarchive" : "Archive"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteConfirm.open}
        title="Delete Message"
        message={`Are you sure you want to delete the message from "${deleteConfirm.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirm({ open: false, id: "", name: "" })}
        severity="error"
      />
    </Box>
  );
};

export default MessagesManagement;
