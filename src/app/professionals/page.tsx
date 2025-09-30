"use client"

import { useState, useEffect, useCallback } from "react"
import { invoke } from "src/app/blitz-server"
import getProfessionals from "src/app/professionals/queries/getProfessionals"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  TextField,
  Button,
  Chip,
  Avatar,
  Rating,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  InputAdornment,
  Badge,
  Divider,
} from "@mui/material"
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Star as StarIcon,
  FilterList as FilterIcon,
  Verified as VerifiedIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Computer as OnlineIcon,
  Person as PersonIcon,
} from "@mui/icons-material"
import { SERVICE_TYPES } from "src/constants"
import Link from "next/link"

interface Professional {
  id: number
  serviceType: string
  specialization?: string | null
  location: string | null
  bio?: string | null
  rating?: number | null
  totalReviews: number
  isActive: boolean
  user: {
    id: number
    name?: string | null
    email: string
    phone?: string | null
    address?: string | null
  }
}

// Mock data for enhanced UI demonstration
const mockProfessionals = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    rating: 4.9,
    reviewCount: 127,
    location: "New York, NY",
    experience: "15+ years",
    consultation: {
      online: true,
      inPerson: true,
      price: "$150",
    },
    nextAvailable: "Tomorrow",
    verified: true,
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Dermatologist",
    rating: 4.8,
    reviewCount: 89,
    location: "Los Angeles, CA",
    experience: "12+ years",
    consultation: {
      online: true,
      inPerson: false,
      price: "$120",
    },
    nextAvailable: "Today",
    verified: true,
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Pediatrician",
    rating: 5.0,
    reviewCount: 156,
    location: "Chicago, IL",
    experience: "18+ years",
    consultation: {
      online: false,
      inPerson: true,
      price: "$100",
    },
    nextAvailable: "In 3 days",
    verified: true,
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialty: "Orthopedic Surgeon",
    rating: 4.7,
    reviewCount: 203,
    location: "Houston, TX",
    experience: "20+ years",
    consultation: {
      online: true,
      inPerson: true,
      price: "$200",
    },
    nextAvailable: "Next week",
    verified: true,
  },
  {
    id: 5,
    name: "Dr. Lisa Thompson",
    specialty: "Psychiatrist",
    rating: 4.9,
    reviewCount: 94,
    location: "San Francisco, CA",
    experience: "10+ years",
    consultation: {
      online: true,
      inPerson: true,
      price: "$180",
    },
    nextAvailable: "Tomorrow",
    verified: true,
  },
  {
    id: 6,
    name: "Dr. Robert Davis",
    specialty: "Neurologist",
    rating: 4.6,
    reviewCount: 78,
    location: "Boston, MA",
    experience: "14+ years",
    consultation: {
      online: false,
      inPerson: true,
      price: "$220",
    },
    nextAvailable: "In 5 days",
    verified: true,
  },
]

export default function ProfessionalsPage() {
  const [professionals, setProfessionals] = useState<Professional[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [filters, setFilters] = useState({
    serviceType: "",
    location: "",
    page: 1,
    limit: 12,
  })
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
  })

  // Use mock data for enhanced UI demonstration
  const [useMockData] = useState(true)

  const loadProfessionals = async () => {
    if (useMockData) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const result = await invoke(getProfessionals, filters)
      setProfessionals(result.professionals)
      setPagination(result.pagination)
    } catch (error) {
      // Handle error silently or show user-friendly message
    } finally {
      setLoading(false)
    }
  }

  // Load professionals on component mount and when filters change
  useEffect(() => {
    loadProfessionals()
  }, [filters])

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: field !== "page" ? 1 : value, // Reset to page 1 when other filters change
    }))
  }

  const handlePageChange = (event: any, page: number) => {
    handleFilterChange("page", page)
  }

  const specialties = Array.from(new Set(mockProfessionals.map((p) => p.specialty)))
  const locations = Array.from(new Set(mockProfessionals.map((p) => p.location)))

  const filteredProfessionals = mockProfessionals.filter((professional) => {
    const matchesSearch =
      professional.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      professional.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSpecialty =
      !selectedSpecialty ||
      selectedSpecialty === "all" ||
      professional.specialty === selectedSpecialty
    const matchesLocation =
      !selectedLocation || selectedLocation === "all" || professional.location === selectedLocation

    return matchesSearch && matchesSpecialty && matchesLocation
  })

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedSpecialty("")
    setSelectedLocation("")
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
            Find Professionals
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Connect with verified healthcare professionals and service providers
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr auto" },
                gap: 2,
                alignItems: "end",
              }}
            >
              <TextField
                fullWidth
                placeholder="Search professionals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Specialty</InputLabel>
                <Select
                  value={selectedSpecialty}
                  label="Specialty"
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                >
                  <MenuItem value="">All specialties</MenuItem>
                  {specialties.map((specialty) => (
                    <MenuItem key={specialty} value={specialty}>
                      {specialty}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={selectedLocation}
                  label="Location"
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  <MenuItem value="">All locations</MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location} value={location}>
                      {location}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button variant="outlined" startIcon={<FilterIcon />} sx={{ height: "56px" }}>
                More Filters
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Results Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography variant="body1" color="text.secondary">
            Showing {filteredProfessionals.length} professionals
          </Typography>
          {(searchQuery || selectedSpecialty || selectedLocation) && (
            <Button variant="text" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </Box>

        {/* Professionals Grid */}
        {loading ? (
          <Typography>Loading professionals...</Typography>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
                gap: 3,
                mb: 4,
              }}
            >
              {filteredProfessionals.map((professional) => (
                <Card
                  key={professional.id}
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
                      position: "relative",
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
                    {professional.verified && (
                      <Badge
                        badgeContent={<VerifiedIcon sx={{ fontSize: 16 }} />}
                        color="success"
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          "& .MuiBadge-badge": {
                            bgcolor: "success.main",
                            color: "white",
                          },
                        }}
                      >
                        <Chip
                          label="Verified"
                          size="small"
                          sx={{
                            bgcolor: "success.main",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        />
                      </Badge>
                    )}
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h6"
                        component="h3"
                        gutterBottom
                        sx={{ fontWeight: "600" }}
                      >
                        {professional.name}
                      </Typography>
                      <Typography variant="body1" color="primary" sx={{ fontWeight: "500", mb: 1 }}>
                        {professional.specialty}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {professional.experience} experience
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Rating value={professional.rating} precision={0.1} size="small" readOnly />
                        <Typography variant="body2" sx={{ ml: 1, fontWeight: "500" }}>
                          {professional.rating}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({professional.reviewCount} reviews)
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                        <LocationIcon sx={{ mr: 1, fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {professional.location}
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <CalendarIcon sx={{ mr: 1, fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          Available {professional.nextAvailable}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Consultation:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: "500" }}>
                          {professional.consultation.price}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", gap: 1 }}>
                        {professional.consultation.online && (
                          <Chip
                            icon={<OnlineIcon />}
                            label="Online"
                            size="small"
                            variant="outlined"
                            color="primary"
                          />
                        )}
                        {professional.consultation.inPerson && (
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

                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        component={Link}
                        href={`/professionals/${professional.id}`}
                      >
                        Book Now
                      </Button>
                      <Button
                        variant="outlined"
                        component={Link}
                        href={`/professionals/${professional.id}`}
                      >
                        View Profile
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                  count={pagination.pages}
                  page={filters.page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                />
              </Box>
            )}

            {/* Empty State */}
            {filteredProfessionals.length === 0 && !loading && (
              <Box sx={{ textAlign: "center", py: 8 }}>
                <SearchIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: "600" }}>
                  No professionals found
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Try adjusting your search criteria or browse all professionals
                </Typography>
                <Button variant="contained" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  )
}
