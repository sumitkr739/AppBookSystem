"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { invoke } from "src/app/blitz-server"
import { useCurrentUser } from "src/app/users/hooks/useCurrentUser"
import getProfessional from "src/app/professionals/queries/getProfessional"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Rating,
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material"
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Star as StarIcon,
  Verified as VerifiedIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  ArrowBack as BackIcon,
  CheckCircle as CheckIcon,
  Computer as OnlineIcon,
} from "@mui/icons-material"
import { format, addDays, startOfDay } from "date-fns"
import { SERVICE_TYPES, USER_ROLES } from "src/constants"
import { ProfessionalWithUser } from "@/types"
import Link from "next/link"

// Mock data for enhanced UI demonstration
const mockProfessional = {
  id: 1,
  name: "Dr. Sarah Johnson",
  specialty: "Cardiologist",
  rating: 4.9,
  reviewCount: 127,
  location: "New York, NY",
  experience: "15+ years",
  bio: "Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating cardiovascular diseases. She specializes in preventive cardiology, heart failure management, and interventional procedures. Dr. Johnson is committed to providing personalized care to each patient and staying up-to-date with the latest advances in cardiac medicine.",
  education: [
    "MD - Harvard Medical School",
    "Residency - Johns Hopkins Hospital",
    "Fellowship - Mayo Clinic"
  ],
  specializations: [
    "Preventive Cardiology",
    "Heart Failure Management",
    "Interventional Cardiology",
    "Cardiac Imaging"
  ],
  consultation: {
    online: true,
    inPerson: true,
    price: 150,
  },
  workingHours: {
    monday: { start: "09:00", end: "17:00" },
    tuesday: { start: "09:00", end: "17:00" },
    wednesday: { start: "09:00", end: "17:00" },
    thursday: { start: "09:00", end: "17:00" },
    friday: { start: "09:00", end: "17:00" },
    saturday: { start: "10:00", end: "14:00" },
    sunday: null,
  },
  nextAvailable: "Tomorrow",
  verified: true,
  reviews: [
    {
      id: 1,
      patientName: "John D.",
      rating: 5,
      comment: "Excellent doctor! Very thorough and caring. Highly recommend.",
      date: "2024-01-15"
    },
    {
      id: 2,
      patientName: "Mary S.",
      rating: 5,
      comment: "Dr. Johnson took the time to explain everything clearly. Great experience.",
      date: "2024-01-10"
    },
    {
      id: 3,
      patientName: "Robert K.",
      rating: 4,
      comment: "Professional and knowledgeable. The appointment was on time.",
      date: "2024-01-05"
    }
  ]
}

export default function ProfessionalDetailPage() {
  const params = useParams()
  const router = useRouter()
  const user = useCurrentUser()
  const [professional, setProfessional] = useState<ProfessionalWithUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [appointmentNotes, setAppointmentNotes] = useState("")
  const [consultationType, setConsultationType] = useState("in-person")

  const professionalId = parseInt(params.id as string)

  // Use mock data for enhanced UI demonstration
  const [useMockData] = useState(true)

  const loadProfessional = useCallback(async () => {
    if (useMockData) {
      setLoading(false)
      return
    }

    if (!professionalId || isNaN(professionalId)) {
      setError("Invalid professional ID")
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const result = await invoke(getProfessional, { id: professionalId })
      setProfessional(result)
    } catch (error) {
      console.error("Failed to load professional:", error)
      setError("Failed to load professional details")
    } finally {
      setLoading(false)
    }
  }, [useMockData, professionalId])

  useEffect(() => {
    loadProfessional()
  }, [loadProfessional])

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) return

    try {
      // TODO: Implement create appointment mutation
      const appointmentData = {
        professionalId: professionalId,
        serviceType: mockProfessional.specialty,
        dateTime: new Date(`${selectedDate}T${selectedTime}`),
        notes: appointmentNotes,
        consultationType,
      }
      console.log("Booking appointment:", appointmentData)

      setBookingDialogOpen(false)
      router.push("/appointments")
    } catch (error) {
      console.error("Failed to book appointment:", error)
    }
  }

  const generateAvailableSlots = () => {
    const slots = []
    const today = new Date()

    for (let i = 1; i <= 7; i++) {
      const date = addDays(today, i)
      const dayName = format(date, "EEEE").toLowerCase()
      const workingHours = mockProfessional.workingHours[dayName as keyof typeof mockProfessional.workingHours]

      if (workingHours) {
        slots.push({
          date: format(date, "yyyy-MM-dd"),
          displayDate: format(date, "EEEE, MMM dd"),
          times: generateTimeSlots(workingHours.start, workingHours.end)
        })
      }
    }

    return slots
  }

  const generateTimeSlots = (start: string, end: string) => {
    const slots = []
    const startTime = new Date(`2024-01-01T${start}:00`)
    const endTime = new Date(`2024-01-01T${end}:00`)

    while (startTime < endTime) {
      slots.push(format(startTime, "HH:mm"))
      startTime.setMinutes(startTime.getMinutes() + 60) // 1-hour slots
    }

    return slots
  }

  const availableSlots = generateAvailableSlots()

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography>Loading professional details...</Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          startIcon={<BackIcon />}
          component={Link}
          href="/professionals"
        >
          Back to Professionals
        </Button>
      </Container>
    )
  }

  // Use mock data for demonstration
  const prof = mockProfessional

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<BackIcon />}
          component={Link}
          href="/professionals"
          sx={{ mb: 2 }}
        >
          Back to Professionals
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {/* Professional Info */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3, mb: 3 }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: "primary.main",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                >
                  {prof.name.split(" ").map((n) => n[0]).join("")}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: "bold" }}>
                      {prof.name}
                    </Typography>
                    {prof.verified && (
                      <Chip
                        icon={<VerifiedIcon />}
                        label="Verified"
                        color="success"
                        size="small"
                      />
                    )}
                  </Box>
                  <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                    {prof.specialty}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Rating value={prof.rating} precision={0.1} readOnly />
                    <Typography variant="body1" sx={{ fontWeight: "500" }}>
                      {prof.rating}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({prof.reviewCount} reviews)
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <LocationIcon sx={{ color: "text.secondary" }} />
                    <Typography variant="body1">{prof.location}</Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary">
                    {prof.experience} experience
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "600" }}>
                  About
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                  {prof.bio}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "600" }}>
                  Education & Training
                </Typography>
                <List dense>
                  {prof.education.map((edu, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={edu} />
                    </ListItem>
                  ))}
                </List>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "600" }}>
                  Specializations
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {prof.specializations.map((spec, index) => (
                    <Chip key={index} label={spec} variant="outlined" />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "600" }}>
                Patient Reviews ({prof.reviewCount})
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {prof.reviews.map((review) => (
                  <Paper key={review.id} sx={{ p: 3, bgcolor: "grey.50" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: "500" }}>
                          {review.patientName}
                        </Typography>
                        <Rating value={review.rating} size="small" readOnly />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {format(new Date(review.date), "MMM dd, yyyy")}
                      </Typography>
                    </Box>
                    <Typography variant="body1">
                      {review.comment}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Booking Card */}
          <Card sx={{ mb: 3, position: "sticky", top: 20 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "600" }}>
                Book Appointment
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Consultation Fee
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
                  ${prof.consultation.price}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Available Options
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {prof.consultation.online && (
                    <Chip
                      icon={<OnlineIcon />}
                      label="Online"
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  )}
                  {prof.consultation.inPerson && (
                    <Chip
                      icon={<PersonIcon />}
                      label="In-person"
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  )}
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Next Available
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "500" }}>
                  {prof.nextAvailable}
                </Typography>
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => setBookingDialogOpen(true)}
                disabled={!user || user.role !== USER_ROLES.USER}
                sx={{ mb: 2 }}
              >
                Book Appointment
              </Button>

              {(!user || user.role !== USER_ROLES.USER) && (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                  {!user ? "Please log in to book an appointment" : "Only patients can book appointments"}
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "600", display: "flex", alignItems: "center", gap: 1 }}>
                <ScheduleIcon />
                Working Hours
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {Object.entries(prof.workingHours).map(([day, hours]) => (
                  <Box key={day} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="body2" sx={{ textTransform: "capitalize", fontWeight: "500" }}>
                      {day}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {hours ? `${hours.start} - ${hours.end}` : "Closed"}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Booking Dialog */}
      <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Book Appointment with {prof.name}</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Select Date</InputLabel>
                <Select
                  value={selectedDate}
                  label="Select Date"
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  {availableSlots.map((slot) => (
                    <MenuItem key={slot.date} value={slot.date}>
                      {slot.displayDate}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth disabled={!selectedDate}>
                <InputLabel>Select Time</InputLabel>
                <Select
                  value={selectedTime}
                  label="Select Time"
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  {selectedDate && availableSlots
                    .find(slot => slot.date === selectedDate)
                    ?.times.map((time) => (
                      <MenuItem key={time} value={time}>
                        {format(new Date(`2024-01-01T${time}`), "hh:mm a")}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Consultation Type</InputLabel>
                <Select
                  value={consultationType}
                  label="Consultation Type"
                  onChange={(e) => setConsultationType(e.target.value)}
                >
                  {prof.consultation.inPerson && (
                    <MenuItem value="in-person">In-person</MenuItem>
                  )}
                  {prof.consultation.online && (
                    <MenuItem value="online">Online</MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Notes (optional)"
                placeholder="Describe your symptoms or reason for visit..."
                value={appointmentNotes}
                onChange={(e) => setAppointmentNotes(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setBookingDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleBookAppointment}
            variant="contained"
            disabled={!selectedDate || !selectedTime}
          >
            Book Appointment (${prof.consultation.price})
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}