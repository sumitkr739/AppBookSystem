"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCurrentUser } from "src/app/users/hooks/useCurrentUser"
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Rating,
  Chip,
  Grid,
} from "@mui/material"
import {
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  AccessTime as ClockIcon,
  Security as ShieldIcon,
  Star as StarIcon,
  ArrowForward as ArrowRightIcon,
  CheckCircle as CheckCircleIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
} from "@mui/icons-material"
import Link from "next/link"
import { SERVICE_TYPES, USER_ROLES } from "src/constants"

export default function Home() {
  const user = useCurrentUser()
  const router = useRouter()
  const [searchData, setSearchData] = useState({
    serviceType: "",
    location: "",
  })

  useEffect(() => {
    if (user) {
      router.push("/dashboard")
    }
  }, [user, router])

  if (user) {
    return null // Will redirect to dashboard
  }

  const features = [
    {
      icon: CalendarIcon,
      title: "Easy Scheduling",
      description: "Book appointments with your preferred professionals in just a few clicks.",
    },
    {
      icon: ClockIcon,
      title: "Real-time Availability",
      description: "See real-time availability and get instant confirmations.",
    },
    {
      icon: ShieldIcon,
      title: "Secure & Private",
      description: "Your personal information is protected with enterprise-grade security.",
    },
  ]

  const professionals = [
    {
      name: "Dr. Sarah Johnson",
      specialty: "Cardiologist",
      rating: 4.9,
      reviews: 127,
      location: "New York, NY",
    },
    {
      name: "Dr. Michael Chen",
      specialty: "Dermatologist",
      rating: 4.8,
      reviews: 89,
      location: "Los Angeles, CA",
    },
    {
      name: "Dr. Emily Rodriguez",
      specialty: "Pediatrician",
      rating: 5.0,
      reviews: 156,
      location: "Chicago, IL",
    },
  ]

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log("Search:", searchData)
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: "800px", mx: "auto", textAlign: "center" }}>
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontSize: { xs: "2.5rem", md: "3.5rem" },
                fontWeight: "bold",
                mb: 3,
              }}
            >
              Book Appointments with
              <Box component="span" sx={{ display: "block", color: "rgba(255,255,255,0.9)" }}>
                Top Professionals
              </Box>
            </Typography>
            <Typography
              variant="h5"
              sx={{
                mb: 6,
                color: "rgba(255,255,255,0.9)",
                fontSize: { xs: "1.1rem", md: "1.3rem" },
              }}
            >
              Connect with verified healthcare professionals, consultants, and service providers.
              Schedule appointments instantly and manage your bookings effortlessly.
            </Typography>

            {/* Search Bar */}
            <Card
              sx={{
                maxWidth: "800px",
                mx: "auto",
                mb: 4,
                bgcolor: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2 }}>
                  <FormControl sx={{ flex: 1 }}>
                    <InputLabel>Service Type</InputLabel>
                    <Select
                      value={searchData.serviceType}
                      label="Service Type"
                      onChange={(e) =>
                        setSearchData((prev) => ({ ...prev, serviceType: e.target.value }))
                      }
                    >
                      <MenuItem value="">Select service type</MenuItem>
                      {Object.values(SERVICE_TYPES).map((service) => (
                        <MenuItem key={service} value={service}>
                          {service}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <TextField
                    sx={{ flex: 1 }}
                    label="Location"
                    placeholder="Enter your location"
                    value={searchData.location}
                    onChange={(e) =>
                      setSearchData((prev) => ({ ...prev, location: e.target.value }))
                    }
                  />
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleSearch}
                    startIcon={<SearchIcon />}
                    sx={{ px: 4 }}
                  >
                    Search
                  </Button>
                </Box>
              </CardContent>
            </Card>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: "center",
              }}
            >
              <Button
                size="large"
                variant="contained"
                component={Link}
                href={`/signup?role=${USER_ROLES.USER}`}
                endIcon={<ArrowRightIcon />}
                sx={{ bgcolor: "white", color: "primary.main", "&:hover": { bgcolor: "grey.100" } }}
              >
                Book an Appointment
              </Button>
              <Button
                size="large"
                variant="outlined"
                component={Link}
                href={`/signup?role=${USER_ROLES.PROFESSIONAL}`}
                sx={{
                  borderColor: "white",
                  color: "white",
                  "&:hover": { bgcolor: "white", color: "primary.main" },
                }}
              >
                Join as Professional
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: "grey.50" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
              Why Choose AppBookSystem?
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: "600px", mx: "auto" }}>
              Experience the future of appointment booking with our comprehensive platform
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    textAlign: "center",
                    p: 4,
                    transition: "all 0.3s ease",
                    "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                  }}
                >
                  <CardContent sx={{ p: 0 }}>
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        bgcolor: "primary.50",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mx: "auto",
                        mb: 3,
                      }}
                    >
                      <feature.icon sx={{ fontSize: 32, color: "primary.main" }} />
                    </Box>
                    <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: "600" }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Professionals */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
              Featured Professionals
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Connect with our top-rated professionals
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {professionals.map((professional, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    "&:hover": { boxShadow: 6, transform: "translateY(-4px)" },
                  }}
                >
                  <Box
                    sx={{
                      aspectRatio: "1",
                      bgcolor: "grey.100",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: "primary.main",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                      }}
                    >
                      {professional.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Avatar>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: "600" }}>
                      {professional.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {professional.specialty}
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Rating value={professional.rating} precision={0.1} size="small" readOnly />
                      <Typography variant="body2" sx={{ ml: 1, fontWeight: "500" }}>
                        {professional.rating}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({professional.reviews} reviews)
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                      {professional.location}
                    </Typography>

                    <Button
                      variant="contained"
                      fullWidth
                      component={Link}
                      href={`/professionals/${index + 1}`}
                    >
                      Book Appointment
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ textAlign: "center", mt: 6 }}>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              href="/professionals"
              endIcon={<ArrowRightIcon />}
            >
              View All Professionals
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 8,
          bgcolor: "primary.main",
          color: "primary.contrastText",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
              Ready to Get Started?
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, color: "rgba(255,255,255,0.9)" }}>
              Join thousands of satisfied users who trust AppBookSystem for their appointment needs
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 3,
                justifyContent: "center",
                mb: 4,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CheckCircleIcon sx={{ mr: 1 }} />
                <Typography>Free to join</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CheckCircleIcon sx={{ mr: 1 }} />
                <Typography>Instant confirmations</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CheckCircleIcon sx={{ mr: 1 }} />
                <Typography>24/7 support</Typography>
              </Box>
            </Box>

            <Button
              size="large"
              variant="contained"
              component={Link}
              href="/signup"
              endIcon={<ArrowRightIcon />}
              sx={{ bgcolor: "white", color: "primary.main", "&:hover": { bgcolor: "grey.100" } }}
            >
              Create Free Account
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}
