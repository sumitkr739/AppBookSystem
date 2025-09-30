"use client"

import { useState, useEffect, useCallback } from "react"
import { invoke } from "src/app/blitz-server"
import { useCurrentUser } from "src/app/users/hooks/useCurrentUser"
import getAppointments from "src/app/appointments/queries/getAppointments"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Divider,
  Tab,
  Tabs,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material"
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  MoreVert as MoreIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Payment as PaymentIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material"
import { format } from "date-fns"
import { APPOINTMENT_STATUS, USER_ROLES } from "src/constants"
import { AppointmentWithDetails } from "@/types"
import Link from "next/link"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`appointments-tabpanel-${index}`}
      aria-labelledby={`appointments-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function AppointmentsPage() {
  const user = useCurrentUser()
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithDetails | null>(null)
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")

  const loadAppointments = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      const filters = user.role === USER_ROLES.PROFESSIONAL
        ? { professionalId: user.id }
        : { customerId: user.id }

      const result = await invoke(getAppointments, filters)
      setAppointments(result.appointments)
    } catch (error) {
      console.error("Failed to load appointments:", error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, appointment: AppointmentWithDetails) => {
    setAnchorEl(event.currentTarget)
    setSelectedAppointment(appointment)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedAppointment(null)
  }

  const handleCancelAppointment = () => {
    setCancelDialogOpen(true)
    handleMenuClose()
  }

  const confirmCancelAppointment = async () => {
    if (!selectedAppointment) return

    try {
      // TODO: Implement cancel appointment mutation
      console.log("Cancelling appointment:", selectedAppointment.id, "Reason:", cancelReason)
      setCancelDialogOpen(false)
      setCancelReason("")
      setSelectedAppointment(null)
      loadAppointments()
    } catch (error) {
      console.error("Failed to cancel appointment:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case APPOINTMENT_STATUS.APPROVED:
        return "success"
      case APPOINTMENT_STATUS.PENDING:
        return "warning"
      case APPOINTMENT_STATUS.CANCELLED:
      case APPOINTMENT_STATUS.REJECTED:
        return "error"
      case APPOINTMENT_STATUS.COMPLETED:
        return "info"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case APPOINTMENT_STATUS.APPROVED:
        return <CheckIcon />
      case APPOINTMENT_STATUS.PENDING:
        return <ScheduleIcon />
      case APPOINTMENT_STATUS.CANCELLED:
      case APPOINTMENT_STATUS.REJECTED:
        return <CancelIcon />
      case APPOINTMENT_STATUS.COMPLETED:
        return <CheckIcon />
      default:
        return <ScheduleIcon />
    }
  }

  const filterAppointmentsByStatus = (status?: string) => {
    if (!status) return appointments
    return appointments.filter(appointment => appointment.status === status)
  }

  const upcomingAppointments = filterAppointmentsByStatus(APPOINTMENT_STATUS.APPROVED)
  const pendingAppointments = filterAppointmentsByStatus(APPOINTMENT_STATUS.PENDING)
  const pastAppointments = appointments.filter(appointment =>
    appointment.status === APPOINTMENT_STATUS.COMPLETED ||
    appointment.status === APPOINTMENT_STATUS.CANCELLED ||
    appointment.status === APPOINTMENT_STATUS.REJECTED
  )

  const renderAppointmentCard = (appointment: AppointmentWithDetails) => (
    <Card key={appointment.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              {user?.role === USER_ROLES.PROFESSIONAL ? (
                <PersonIcon />
              ) : (
                <BusinessIcon />
              )}
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3">
                {user?.role === USER_ROLES.PROFESSIONAL
                  ? appointment.customer.name || appointment.customer.email
                  : appointment.professional.user.name || appointment.professional.user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {appointment.serviceType}
                {appointment.professional.specialization && ` - ${appointment.professional.specialization}`}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              icon={getStatusIcon(appointment.status)}
              label={appointment.status}
              color={getStatusColor(appointment.status) as any}
              size="small"
            />
            <IconButton
              size="small"
              onClick={(e) => handleMenuClick(e, appointment)}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CalendarIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2">
                {format(new Date(appointment.dateTime), "MMM dd, yyyy")}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2">
                {format(new Date(appointment.dateTime), "hh:mm a")} ({appointment.duration} min)
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {appointment.notes && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Notes:</strong> {appointment.notes}
            </Typography>
          </Box>
        )}

        {appointment.payment && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <PaymentIcon sx={{ fontSize: 16, color: "text.secondary" }} />
            <Typography variant="body2">
              Payment: ${appointment.payment.amount} - {appointment.payment.status}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          {appointment.status === APPOINTMENT_STATUS.PENDING && user?.role === USER_ROLES.PROFESSIONAL && (
            <>
              <Button size="small" variant="contained" color="success">
                Approve
              </Button>
              <Button size="small" variant="outlined" color="error">
                Reject
              </Button>
            </>
          )}
          {appointment.status === APPOINTMENT_STATUS.APPROVED && (
            <Button size="small" variant="outlined">
              Reschedule
            </Button>
          )}
          <Button size="small" variant="outlined" component={Link} href={`/appointments/${appointment.id}`}>
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  )

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Please log in to view your appointments
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          {user.role === USER_ROLES.PROFESSIONAL ? "My Schedule" : "My Appointments"}
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {user.role === USER_ROLES.PROFESSIONAL
            ? "Manage your appointments and schedule"
            : "View and manage your booked appointments"}
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="appointments tabs">
          <Tab label={`Upcoming (${upcomingAppointments.length})`} />
          <Tab label={`Pending (${pendingAppointments.length})`} />
          <Tab label={`Past (${pastAppointments.length})`} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {loading ? (
          <Typography>Loading appointments...</Typography>
        ) : upcomingAppointments.length > 0 ? (
          upcomingAppointments.map(renderAppointmentCard)
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <CalendarIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" component="h3" gutterBottom>
              No upcoming appointments
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {user.role === USER_ROLES.PROFESSIONAL
                ? "You don't have any upcoming appointments scheduled."
                : "You don't have any upcoming appointments. Book one now!"}
            </Typography>
            {user.role === USER_ROLES.USER && (
              <Button variant="contained" component={Link} href="/professionals">
                Book Appointment
              </Button>
            )}
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {loading ? (
          <Typography>Loading appointments...</Typography>
        ) : pendingAppointments.length > 0 ? (
          pendingAppointments.map(renderAppointmentCard)
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <ScheduleIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" component="h3" gutterBottom>
              No pending appointments
            </Typography>
            <Typography variant="body1" color="text.secondary">
              All your appointments have been processed.
            </Typography>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {loading ? (
          <Typography>Loading appointments...</Typography>
        ) : pastAppointments.length > 0 ? (
          pastAppointments.map(renderAppointmentCard)
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <CheckIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" component="h3" gutterBottom>
              No past appointments
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your appointment history will appear here.
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => console.log("Edit appointment")}>
          <EditIcon sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleCancelAppointment}>
          <CancelIcon sx={{ mr: 1 }} />
          Cancel
        </MenuItem>
      </Menu>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to cancel this appointment?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for cancellation (optional)"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>
            Keep Appointment
          </Button>
          <Button onClick={confirmCancelAppointment} color="error" variant="contained">
            Cancel Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}