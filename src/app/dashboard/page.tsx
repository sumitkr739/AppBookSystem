"use client"

import { useCurrentUser } from "src/app/users/hooks/useCurrentUser"
import { USER_ROLES } from "src/constants"
import { Box, Container, Typography, Card, CardContent, Button, Chip } from "@mui/material"
import {
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
} from "@mui/icons-material"
import Link from "next/link"
import UserDashboard from "src/app/components/UserDashboard"

export default function DashboardPage() {
  const user = useCurrentUser()

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Please log in to access your dashboard
        </Typography>
      </Container>
    )
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case USER_ROLES.USER:
        return <PersonIcon />
      case USER_ROLES.PROFESSIONAL:
        return <BusinessIcon />
      case USER_ROLES.ADMIN:
        return <AdminIcon />
      default:
        return <PersonIcon />
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

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome back, {user.name || user.email}!
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            icon={getRoleIcon(user.role)}
            label={user.role}
            color={getRoleColor(user.role) as any}
            variant="outlined"
          />
          <Typography variant="body1" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      </Box>

      {/* Role-based Dashboard Content */}
      {user.role === USER_ROLES.USER ? (
        <UserDashboard />
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 3,
          }}
        >
          {user.role === USER_ROLES.PROFESSIONAL && (
            <>
              <Box>
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <CalendarIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">My Schedule</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Manage your appointments and availability
                    </Typography>
                    <Button component={Link} href="/appointments" variant="contained" fullWidth>
                      View Schedule
                    </Button>
                  </CardContent>
                </Card>
              </Box>

              <Box>
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <BusinessIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">My Profile</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Update your professional information
                    </Typography>
                    <Button component={Link} href="/profile" variant="contained" fullWidth>
                      Edit Profile
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            </>
          )}

          {user.role === USER_ROLES.ADMIN && (
            <>
              <Box>
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <AdminIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">User Management</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Manage users and their roles
                    </Typography>
                    <Button component={Link} href="/admin/users" variant="contained" fullWidth>
                      Manage Users
                    </Button>
                  </CardContent>
                </Card>
              </Box>

              <Box>
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <CalendarIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Appointment Management</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Oversee all appointments in the system
                    </Typography>
                    <Button
                      component={Link}
                      href="/admin/appointments"
                      variant="contained"
                      fullWidth
                    >
                      Manage Appointments
                    </Button>
                  </CardContent>
                </Card>
              </Box>

              <Box>
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <BusinessIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Professional Management</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      Manage professional profiles and services
                    </Typography>
                    <Button
                      component={Link}
                      href="/admin/professionals"
                      variant="contained"
                      fullWidth
                    >
                      Manage Professionals
                    </Button>
                  </CardContent>
                </Card>
              </Box>

              <Box>
                <Card>
                  <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <CalendarIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">Notifications</Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      View your recent notifications and updates
                    </Typography>
                    <Button component={Link} href="/notifications" variant="outlined" fullWidth>
                      View Notifications
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            </>
          )}
        </Box>
      )}
    </Container>
  )
}
