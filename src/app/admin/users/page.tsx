"use client"

import { useCurrentUser } from "src/app/users/hooks/useCurrentUser"
import { USER_ROLES } from "src/constants"
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  IconButton,
  Button,
} from "@mui/material"
import {
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material"

export default function AdminUsersPage() {
  const user = useCurrentUser()

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Please log in to access this page
        </Typography>
      </Container>
    )
  }

  if (user.role !== USER_ROLES.ADMIN) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1">You need admin privileges to access this page.</Typography>
      </Container>
    )
  }

  // Mock data - in a real app, this would come from a query
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "USER",
      phone: "+1234567891",
      createdAt: "2025-09-21T10:27:01.018Z",
    },
    {
      id: 2,
      name: "System Admin",
      email: "admin@appbook.com",
      role: "ADMIN",
      phone: "+1234567890",
      createdAt: "2025-09-21T10:27:01.018Z",
    },
    {
      id: 3,
      name: "Dr. Emily Chen",
      email: "dr.chen@example.com",
      role: "PROFESSIONAL",
      phone: "+1234567890",
      createdAt: "2025-09-21T10:27:01.018Z",
    },
  ]

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

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            // TODO: Implement add user functionality
          }}
        >
          Add User
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: "primary.main" }}>
                          {user.name?.charAt(0) || user.email.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{user.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {user.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {getRoleIcon(user.role)}
                        <Chip
                          label={user.role}
                          color={getRoleColor(user.role) as any}
                          size="small"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>{user.phone || "N/A"}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => {
                          // TODO: Implement edit functionality
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          // TODO: Implement delete functionality
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  )
}
