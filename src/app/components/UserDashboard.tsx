"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Button,
  Chip,
  Avatar,
  IconButton,
  Divider,
  Paper,
} from "@mui/material"
import {
  CalendarToday as CalendarIcon,
  AccessTime as ClockIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  Visibility as ViewIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material"
import { APPOINTMENT_STATUS } from "src/constants"

interface Appointment {
  id: string
  professionalName: string
  specialty: string
  date: string
  time: string
  location: string
  status: string
  type: "online" | "in-person"
}

export default function UserDashboard() {
  const [upcomingAppointments] = useState<Appointment[]>([
    {
      id: "1",
      professionalName: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      date: "2024-01-15",
      time: "10:30 AM",
      location: "Heart Care Center, NYC",
      status: APPOINTMENT_STATUS.APPROVED,
      type: "in-person",
    },
    {
      id: "2",
      professionalName: "Dr. Michael Chen",
      specialty: "Dermatologist",
      date: "2024-01-18",
      time: "2:00 PM",
      location: "Online Consultation",
      status: APPOINTMENT_STATUS.PENDING,
      type: "online",
    },
  ])

  const [pastAppointments] = useState<Appointment[]>([
    {
      id: "3",
      professionalName: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      date: "2024-01-10",
      time: "11:00 AM",
      location: "Children's Medical Center",
      status: APPOINTMENT_STATUS.COMPLETED,
      type: "in-person",
    },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case APPOINTMENT_STATUS.APPROVED:
        return "success"
      case APPOINTMENT_STATUS.PENDING:
        return "warning"
      case APPOINTMENT_STATUS.COMPLETED:
        return "info"
      case APPOINTMENT_STATUS.CANCELLED:
        return "error"
      case APPOINTMENT_STATUS.REJECTED:
        return "error"
      default:
        return "default"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case APPOINTMENT_STATUS.APPROVED:
        return "Approved"
      case APPOINTMENT_STATUS.PENDING:
        return "Pending"
      case APPOINTMENT_STATUS.COMPLETED:
        return "Completed"
      case APPOINTMENT_STATUS.CANCELLED:
        return "Cancelled"
      case APPOINTMENT_STATUS.REJECTED:
        return "Rejected"
      default:
        return status
    }
  }

  const AppointmentCard = ({
    appointment,
    isUpcoming = true,
  }: {
    appointment: Appointment
    isUpcoming?: boolean
  }) => (
    <Paper elevation={2} sx={{ p: 3, mb: 2 }}>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}
      >
        <Box>
          <Typography variant="h6" component="h4" gutterBottom>
            {appointment.professionalName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {appointment.specialty}
          </Typography>
        </Box>
        <Chip
          label={getStatusLabel(appointment.status)}
          color={getStatusColor(appointment.status) as any}
          size="small"
        />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="body2">{new Date(appointment.date).toLocaleDateString()}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <ClockIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          <Typography variant="body2">{appointment.time}</Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {appointment.type === "online" ? (
            <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          ) : (
            <LocationIcon sx={{ fontSize: 16, color: "text.secondary" }} />
          )}
          <Typography variant="body2">{appointment.location}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 1 }}>
        {isUpcoming ? (
          <>
            <Button variant="outlined" size="small" startIcon={<EditIcon />}>
              Reschedule
            </Button>
            <Button variant="outlined" color="error" size="small" startIcon={<CancelIcon />}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant="outlined" size="small" startIcon={<ViewIcon />}>
              View Details
            </Button>
            <Button variant="outlined" size="small" startIcon={<RefreshIcon />}>
              Book Again
            </Button>
          </>
        )}
      </Box>
    </Paper>
  )

  const StatCard = ({
    title,
    value,
    subtitle,
    color = "primary",
  }: {
    title: string
    value: string | number
    subtitle: string
    color?: string
  }) => (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography
          variant="h4"
          component="div"
          color={`${color}.main`}
          sx={{ fontWeight: "bold" }}
        >
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  )

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          My Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your appointments and bookings
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Upcoming"
            value={upcomingAppointments.length}
            subtitle="appointments"
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="This Month" value="5" subtitle="total bookings" color="secondary" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending"
            value={
              upcomingAppointments.filter((apt) => apt.status === APPOINTMENT_STATUS.PENDING).length
            }
            subtitle="awaiting approval"
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Completed" value="12" subtitle="this year" color="success" />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        {/* Upcoming Appointments */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardHeader
              title="Upcoming Appointments"
              subheader="Your scheduled appointments"
              action={
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  component={Link}
                  href="/professionals"
                >
                  Book New
                </Button>
              }
            />
            <Divider />
            <CardContent sx={{ p: 3 }}>
              {upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    isUpcoming={true}
                  />
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <CalendarIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No upcoming appointments
                  </Typography>
                  <Button variant="contained" component={Link} href="/professionals" sx={{ mt: 2 }}>
                    Book Your First Appointment
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Appointments */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardHeader title="Recent Appointments" subheader="Your appointment history" />
            <Divider />
            <CardContent sx={{ p: 3 }}>
              {pastAppointments.length > 0 ? (
                pastAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    appointment={appointment}
                    isUpcoming={false}
                  />
                ))
              ) : (
                <Box sx={{ textAlign: "center", py: 6 }}>
                  <ClockIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No appointment history
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your completed appointments will appear here
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              component={Link}
              href="/professionals"
              startIcon={<AddIcon />}
            >
              Find Professionals
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              component={Link}
              href="/appointments"
              startIcon={<CalendarIcon />}
            >
              View All Appointments
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              component={Link}
              href="/profile"
              startIcon={<EditIcon />}
            >
              Update Profile
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              variant="outlined"
              fullWidth
              component={Link}
              href="/notifications"
              startIcon={<ViewIcon />}
            >
              View Notifications
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
