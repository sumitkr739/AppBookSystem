"use client"

import { useState, useEffect, useCallback } from "react"
import { invoke } from "src/app/blitz-server"
import { useCurrentUser } from "src/app/users/hooks/useCurrentUser"
import getAppointments from "src/app/appointments/queries/getAppointments"
import { USER_ROLES, APPOINTMENT_STATUS } from "src/constants"
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
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Grid,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import {
  AdminPanelSettings as AdminIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
} from "@mui/icons-material"
import { format } from "date-fns"
import { AppointmentWithDetails } from "@/types"
import Link from "next/link"

export default function AdminAppointmentsPage() {
  const user = useCurrentUser()
  const [appointments, setAppointments] = useState<AppointmentWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: "",
    serviceType: "",
    search: "",
    page: 1,
    limit: 10,
  })
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
  })
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithDetails | null>(null)
  const [newStatus, setNewStatus] = useState("")

  const loadAppointments = useCallback(async () => {
    setLoading(true)
    try {
      const result = await invoke(getAppointments, filters)
      setAppointments(result.appointments)
      setPagination(result.pagination)
    } catch (error) {
      console.error("Failed to load appointments:", error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    if (user?.role === USER_ROLES.ADMIN) {
      loadAppointments()
    }
  }, [user, loadAppointments])

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: field !== "page" ? 1 : value,
    }))
  }

  const handleStatusUpdate = async () => {
    if (!selectedAppointment || !newStatus) return

    try {
      // TODO: Implement admin update appointment status
      console.log("Admin updating appointment status:", selectedAppointment.id, "to:", newStatus)
      setStatusDialogOpen(false)
      setNewStatus("")
      setSelectedAppointment(null)
      loadAppointments()
    } catch (error) {
      console.error("Failed to update appointment status:", error)
    }
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case APPOINTMENT_STATUS.PENDING:
        return "warning"
      case APPOINTMENT_STATUS.APPROVED:
        return "success"
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
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <AdminIcon sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          Appointment Management
        </Typography>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                placeholder="Search appointments..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {Object.values(APPOINTMENT_STATUS).map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Service Type</InputLabel>
                <Select
                  value={filters.serviceType}
                  label="Service Type"
                  onChange={(e) => handleFilterChange("serviceType", e.target.value)}
                >
                  <MenuItem value="">All Services</MenuItem>
                  <MenuItem value="Doctor">Doctor</MenuItem>
                  <MenuItem value="Dentist">Dentist</MenuItem>
                  <MenuItem value="Salon">Salon</MenuItem>
                  <MenuItem value="Spa">Spa</MenuItem>
                  <MenuItem value="Gym">Gym</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => console.log("Export appointments")}
                fullWidth
              >
                Export
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Typography>Loading appointments...</Typography>
          ) : (
            <>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Customer</TableCell>
                      <TableCell>Professional</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>#{appointment.id}</TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2">
                              {appointment.customer.name || "N/A"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {appointment.customer.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="subtitle2">
                              {appointment.professional.user.name || "N/A"}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {appointment.professional.user.email}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">{appointment.serviceType}</Typography>
                            {appointment.professional.specialization && (
                              <Typography variant="caption" color="text.secondary">
                                {appointment.professional.specialization}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {format(new Date(appointment.dateTime), "MMM dd, yyyy")}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {format(new Date(appointment.dateTime), "hh:mm a")}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{appointment.duration} min</TableCell>
                        <TableCell>
                          <Chip
                            label={appointment.status}
                            color={getStatusColor(appointment.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {appointment.payment ? (
                            <Chip
                              label={`$${appointment.payment.amount} - ${appointment.payment.status}`}
                              color={appointment.payment.status === "PAID" ? "success" : "warning"}
                              size="small"
                            />
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              No payment
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <Link href={`/appointments/${appointment.id}`} passHref>
                            <IconButton size="small">
                              <ViewIcon />
                            </IconButton>
                          </Link>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedAppointment(appointment)
                              setNewStatus(appointment.status)
                              setStatusDialogOpen(true)
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                  <Pagination
                    count={pagination.pages}
                    page={filters.page}
                    onChange={(e, page) => handleFilterChange("page", page)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Appointment Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              label="Status"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              {Object.values(APPOINTMENT_STATUS).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
