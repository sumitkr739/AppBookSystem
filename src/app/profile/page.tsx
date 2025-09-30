"use client"

import { useCurrentUser } from "src/app/users/hooks/useCurrentUser"
import { USER_ROLES } from "src/constants"
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Avatar,
  Button,
  TextField,
  Divider,
  Chip,
  IconButton,
} from "@mui/material"
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material"
import { useState } from "react"

export default function ProfilePage() {
  const user = useCurrentUser()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    address: "",
  })

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Please log in to view your profile
        </Typography>
      </Container>
    )
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return <AdminIcon color="error" />
      case USER_ROLES.PROFESSIONAL:
        return <BusinessIcon color="primary" />
      case USER_ROLES.USER:
      default:
        return <PersonIcon color="action" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return "error"
      case USER_ROLES.PROFESSIONAL:
        return "primary"
      case USER_ROLES.USER:
      default:
        return "default"
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = () => {
    // TODO: Implement save functionality
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      address: "",
    })
    setIsEditing(false)
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Profile
      </Typography>

      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: "primary.main" }}>
              {user.name?.charAt(0) || user.email.charAt(0)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" gutterBottom>
                {user.name || "No name set"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                {getRoleIcon(user.role)}
                <Chip label={user.role} color={getRoleColor(user.role) as any} size="small" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Member since {new Date().toLocaleDateString()}
              </Typography>
            </Box>
            <IconButton onClick={() => setIsEditing(!isEditing)} color="primary">
              <EditIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "filled"}
                type="email"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                disabled={!isEditing}
                variant={isEditing ? "outlined" : "filled"}
              />
            </Grid>
          </Grid>

          {isEditing && (
            <Box sx={{ display: "flex", gap: 2, mt: 3, justifyContent: "flex-end" }}>
              <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancel}>
                Cancel
              </Button>
              <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
                Save Changes
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Additional sections based on user role */}
      {user.role === USER_ROLES.PROFESSIONAL && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Professional Information
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage your professional profile, services, and availability.
            </Typography>
            <Button variant="outlined" sx={{ mt: 2 }}>
              Edit Professional Profile
            </Button>
          </CardContent>
        </Card>
      )}

      {user.role === USER_ROLES.ADMIN && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Admin Tools
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Access administrative functions and system settings.
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button variant="outlined" href="/admin/users">
                Manage Users
              </Button>
              <Button variant="outlined" href="/admin/appointments">
                Manage Appointments
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Container>
  )
}
