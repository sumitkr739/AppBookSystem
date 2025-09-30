"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { invoke } from "src/app/blitz-server"
import { useCurrentUser } from "src/app/users/hooks/useCurrentUser"
import getAppointment from "src/app/appointments/queries/getAppointment"
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
  Grid,
  Paper,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material"
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Payment as PaymentIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material"
import { format } from "date-fns"
import { APPOINTMENT_STATUS, USER_ROLES } from "src/constants"
import { AppointmentWithDetails } from "@/types"
import Link from "next/link"

export default function AppointmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const user = useCurrentUser()
  const [appointment, setAppointment] = useState<AppointmentWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [newStatus, setNewStatus] = useState("")
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")

  const appointmentId = parseInt(params.id as string)

  const loadAppointment = useCallback(async () => {
    if (!appointmentId || isNaN(appointmentId)) {
      setError("Invalid appointment ID")
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const result = await invoke(getAppointment, { id: appointmentId })
      setAppointment(result)
    } catch (error) {
      console.error("Failed to load appointment:", error)
      setError("Failed to load appointment details")
    } finally {
      setLoading(false)
    }
  }, [appointmentId])

  useEffect(() => {
    loadAppointment()
  }, [loadAppointment])

  const handleStatusUpdate = async () => {
    if (!appointment || !newStatus) return

    try {
      // TODO: Implement update appointment status mutation
      console.log("Updating appointment status:", appointment.id, "to:", newStatus)
      setStatusDialogOpen(false)
      setNewStatus("")
      loadAppointment()
    } catch (error) {
      console.error("Failed to update appointment status:", error)
    }
  }

  const handleCancelAppointment = async () => {
    if (!appointment) return

    try {
      // TODO: Implement cancel appointment mutation
      console.log("Cancelling appointment:", appointment.id, "Reason:", cancelReason)
      setCancelDialogOpen(false)
      setCancelReason("")
      loadAppointment()
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

  const canUpdateStatus = () => {
    return user?.role === USER_ROLES.PROFESSIONAL &&
      appointment?.status === APPOINTMENT_STATUS.PENDING
  }

  const canCancelAppointment = () => {
    return appointment?.status === APPOINTMENT_STATUS.PENDING ||
      appointment?.status === APPOINTMENT_STATUS.APPROVED
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading appointment details...</Typography>
      </Container>
    )
  }

  if (error || !appointment) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "Appointment not found"}
        </Alert>
        <Button
          startIcon={<BackIcon />}
          component={Link}
          href="/appointments"
        >
          Back to Appointments
        </Button>
      </Container>
    )
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Please log in to view appointment details
        </Typography>
      </Container>
    )
  }

  const isCustomer = user.role === USER_ROLES.USER
  const isProfessional = user.role === USER_ROLES.PROFESSIONAL
  const otherParty = isCustomer ? appointment.professional : appointment.customer

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          component={Link}
          href="/appointments"
          sx={{ mb: 2 }}
        >
          Back to Appointments
        </Button>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          Appointment Details
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Appointment #{appointment.id}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Main Details */}
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56 }}>
                    {isCustomer ? <BusinessIcon /> : <PersonIcon />}
                  </Avatar>
                  <Box>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {isCustomer
                        ? appointment.professional.user.name || appointment.professional.user.email
                        : appointment.customer.name || appointment.customer.email}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {appointment.serviceType}
                      {appointment.professional.specialization && ` - ${appointment.professional.specialization}`}
                    </Typography>
                  </Box>
                </Box>
                <Chip
                  icon={getStatusIcon(appointment.status)}
                  label={appointment.status}
                  color={getStatusColor(appointment.status) as any}
                  size="large"
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <CalendarIcon sx={{ color: "text.secondary" }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "500" }}>
                        {format(new Date(appointment.dateTime), "EEEE, MMMM dd, yyyy")}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <TimeIcon sx={{ color: "text.secondary" }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Time & Duration
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: "500" }}>
                        {format(new Date(appointment.dateTime), "hh:mm a")} ({appointment.duration} minutes)
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                {appointment.professional.location && (
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                      <LocationIcon sx={{ color: "text.secondary" }} />
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Location
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: "500" }}>
                          {appointment.professional.location}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                )}
              </Grid>

              {appointment.notes && (
                <>
                  <Divider sx={{ my: 3 }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Notes
                    </Typography>
                    <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                      <Typography variant="body1">
                        {appointment.notes}
                      </Typography>
                    </Paper>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>

          {/* Payment Information */}
          {appointment.payment && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" component="h3" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <PaymentIcon />
                  Payment Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Amount
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "500" }}>
                      ${appointment.payment.amount}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={appointment.payment.status}
                      color={appointment.payment.status === "PAID" ? "success" : "warning"}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="body2" color="text.secondary">
                      Method
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: "500" }}>
                      {appointment.payment.method}
                    </Typography>
                  </Grid>
                  {appointment.payment.transactionId && (
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Transaction ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontFamily: "monospace" }}>
                        {appointment.payment.transactionId}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Contact Information */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Contact Information
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <EmailIcon sx={{ color: "text.secondary" }} />
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">
                    {isCustomer ? appointment.professional.user.email : appointment.customer.email}
                  </Typography>
                </Box>
              </Box>
              {(isCustomer ? appointment.professional.user.phone : appointment.customer.phone) && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <PhoneIcon sx={{ color: "text.secondary" }} />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Phone
                    </Typography>
                    <Typography variant="body1">
                      {isCustomer ? appointment.professional.user.phone : appointment.customer.phone}
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent>
              <Typography variant="h6" component="h3" gutterBottom>
                Actions
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {canUpdateStatus() && (
                  <Button
                    variant="contained"
                    startIcon={<CheckIcon />}
                    onClick={() => setStatusDialogOpen(true)}
                    fullWidth
                  >
                    Update Status
                  </Button>
                )}
                {canCancelAppointment() && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => setCancelDialogOpen(true)}
                    fullWidth
                  >
                    Cancel Appointment
                  </Button>
                )}
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  fullWidth
                  disabled
                >
                  Reschedule (Coming Soon)
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Appointment Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={newStatus}
              label="New Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value={APPOINTMENT_STATUS.APPROVED}>Approve</MenuItem>
              <MenuItem value={APPOINTMENT_STATUS.REJECTED}>Reject</MenuItem>
              <MenuItem value={APPOINTMENT_STATUS.COMPLETED}>Mark as Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleStatusUpdate} variant="contained" disabled={!newStatus}>
            Update Status
          </Button>
        </DialogActions>
      </Dialog>

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
          <Button onClick={handleCancelAppointment} color="error" variant="contained">
            Cancel Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}