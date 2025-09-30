"use client"

import { useState, useEffect } from "react"
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
} from "@mui/material"
import {
  AdminPanelSettings as AdminIcon,
  People as UsersIcon,
  Business as ProfessionalsIcon,
  CalendarToday as AppointmentsIcon,
  Payment as PaymentsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Notifications as NotificationsIcon,
  Assessment as ReportsIcon,
} from "@mui/icons-material"
import { format, subDays, startOfMonth, endOfMonth } from "date-fns"
import Link from "next/link"

// Mock data for dashboard
const mockStats = {
  totalUsers: 1247,
  totalProfessionals: 89,
  totalAppointments: 3456,
  totalRevenue: 125430,
  monthlyGrowth: {
    users: 12.5,
    professionals: 8.3,
    appointments: 15.7,
    revenue: 22.1,
  },
  recentAppointments: [
    {
      id: 1,
      customer: "John Doe",
      professional: "Dr. Sarah Johnson",
      service: "Cardiology",
      date: new Date(),
      status: "PENDING",
    },
    {
      id: 2,
      customer: "Jane Smith",
      professional: "Dr. Michael Chen",
      service: "Dermatology",
      date: subDays(new Date(), 1),
      status: "APPROVED",
    },
    {
      id: 3,
      customer: "Bob Wilson",
      professional: "Dr. Emily Rodriguez",
      service: "Pediatrics",
      date: subDays(new Date(), 2),
      status: "COMPLETED",
    },
  ],
  systemHealth: {
    serverUptime: 99.9,
    databaseHealth: 98.5,
    apiResponseTime: 145, // ms
    activeUsers: 234,
  },
}

export default function AdminDashboardPage() {
  const user = useCurrentUser()
  const [stats] = useState(mockStats)
  const [loading, setLoading] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "warning"
      case "APPROVED":
        return "success"
      case "COMPLETED":
        return "info"
      case "CANCELLED":
        return "error"
      default:
        return "default"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <AdminIcon sx={{ mr: 2, fontSize: 32 }} />
        <Box>
          <Typography variant="h4" component="h1">
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back, {user.name || user.email}
          </Typography>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <UsersIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {stats.totalUsers.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 16, color: "success.main", mr: 0.5 }} />
                    <Typography variant="caption" color="success.main">
                      +{stats.monthlyGrowth.users}% this month
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <ProfessionalsIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Professionals
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {stats.totalProfessionals}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 16, color: "success.main", mr: 0.5 }} />
                    <Typography variant="caption" color="success.main">
                      +{stats.monthlyGrowth.professionals}% this month
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "info.main" }}>
                  <AppointmentsIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Appointments
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {stats.totalAppointments.toLocaleString()}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 16, color: "success.main", mr: 0.5 }} />
                    <Typography variant="caption" color="success.main">
                      +{stats.monthlyGrowth.appointments}% this month
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "warning.main" }}>
                  <PaymentsIcon />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {formatCurrency(stats.totalRevenue)}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <TrendingUpIcon sx={{ fontSize: 16, color: "success.main", mr: 0.5 }} />
                    <Typography variant="caption" color="success.main">
                      +{stats.monthlyGrowth.revenue}% this month
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Appointments */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6" component="h2">
                  Recent Appointments
                </Typography>
                <Button component={Link} href="/admin/appointments" size="small">
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Customer</TableCell>
                      <TableCell>Professional</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recentAppointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.customer}</TableCell>
                        <TableCell>{appointment.professional}</TableCell>
                        <TableCell>{appointment.service}</TableCell>
                        <TableCell>
                          {format(appointment.date, "MMM dd, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={appointment.status}
                            color={getStatusColor(appointment.status) as any}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* System Health & Quick Actions */}
        <Grid item xs={12} lg={4}>
          {/* System Health */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                System Health
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Server Uptime</Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {stats.systemHealth.serverUptime}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.systemHealth.serverUptime} 
                  color="success"
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography variant="body2">Database Health</Typography>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    {stats.systemHealth.databaseHealth}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={stats.systemHealth.databaseHealth} 
                  color="success"
                />
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">API Response Time</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {stats.systemHealth.apiResponseTime}ms
                </Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2">Active Users</Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {stats.systemHealth.activeUsers}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<UsersIcon />}
                  component={Link}
                  href="/admin/users"
                  fullWidth
                >
                  Manage Users
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ProfessionalsIcon />}
                  component={Link}
                  href="/admin/professionals"
                  fullWidth
                >
                  Manage Professionals
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<AppointmentsIcon />}
                  component={Link}
                  href="/admin/appointments"
                  fullWidth
                >
                  View Appointments
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<NotificationsIcon />}
                  component={Link}
                  href="/notifications"
                  fullWidth
                >
                  Send Notifications
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<ReportsIcon />}
                  onClick={() => console.log("Generate reports")}
                  fullWidth
                >
                  Generate Reports
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}