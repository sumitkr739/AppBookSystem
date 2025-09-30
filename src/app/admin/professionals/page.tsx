"use client"

import { useState, useEffect, useCallback } from "react"
import { invoke } from "src/app/blitz-server"
import { useCurrentUser } from "src/app/users/hooks/useCurrentUser"
import getProfessionals from "src/app/professionals/queries/getProfessionals"
import { USER_ROLES, SERVICE_TYPES } from "src/constants"
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
  Switch,
  FormControlLabel,
  Avatar,
  Rating,
} from "@mui/material"
import {
  AdminPanelSettings as AdminIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Block as BlockIcon,
  CheckCircle as ActivateIcon,
  Download as DownloadIcon,
  Business as BusinessIcon,
} from "@mui/icons-material"
import { format } from "date-fns"
import { ProfessionalWithUser } from "@/types"
import Link from "next/link"

export default function AdminProfessionalsPage() {
  const user = useCurrentUser()
  const [professionals, setProfessionals] = useState<ProfessionalWithUser[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    serviceType: "",
    location: "",
    isActive: undefined as boolean | undefined,
    search: "",
    page: 1,
    limit: 10,
  })
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
  })
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedProfessional, setSelectedProfessional] = useState<ProfessionalWithUser | null>(null)

  const loadProfessionals = useCallback(async () => {
    setLoading(true)
    try {
      const result = await invoke(getProfessionals, filters)
      setProfessionals(result.professionals)
      setPagination(result.pagination)
    } catch (error) {
      console.error("Failed to load professionals:", error)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    if (user?.role === USER_ROLES.ADMIN) {
      loadProfessionals()
    }
  }, [user, loadProfessionals])

  const handleFilterChange = (field: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      page: field !== "page" ? 1 : value,
    }))
  }

  const handleStatusToggle = async () => {
    if (!selectedProfessional) return

    try {
      // TODO: Implement admin toggle professional status
      console.log("Admin toggling professional status:", selectedProfessional.id)
      setStatusDialogOpen(false)
      setSelectedProfessional(null)
      loadProfessionals()
    } catch (error) {
      console.error("Failed to update professional status:", error)
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <AdminIcon sx={{ mr: 2, fontSize: 32 }} />
          <Typography variant="h4" component="h1">
            Professional Management
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => console.log("Add new professional")}
        >
          Add Professional
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <BusinessIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Professionals
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {pagination.total}
                  </Typography>
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
                  <ActivateIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Active
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {professionals.filter(p => p.isActive).length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "error.main" }}>
                  <BlockIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Inactive
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {professionals.filter(p => !p.isActive).length}
                  </Typography>
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
                  <BusinessIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Avg Rating
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {professionals.length > 0
                      ? (professionals.reduce((sum, p) => sum + (p.rating || 0), 0) / professionals.length).toFixed(1)
                      : "0.0"}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                placeholder="Search professionals..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />
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
                  {Object.values(SERVICE_TYPES).map((service) => (
                    <MenuItem key={service} value={service}>
                      {service}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.isActive === undefined ? "" : filters.isActive ? "active" : "inactive"}
                  label="Status"
                  onChange={(e) => {
                    const value = e.target.value
                    handleFilterChange("isActive", value === "" ? undefined : value === "active")
                  }}
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                placeholder="Location..."
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => console.log("Export professionals")}
                fullWidth
              >
                Export
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Professionals Table */}
      <Card>
        <CardContent>
          {loading ? (
            <Typography>Loading professionals...</Typography>
          ) : (
            <>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Professional</TableCell>
                      <TableCell>Service Type</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Rating</TableCell>
                      <TableCell>Reviews</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Joined</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {professionals.map((professional) => (
                      <TableRow key={professional.id}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Avatar sx={{ bgcolor: "primary.main" }}>
                              {professional.user.name
                                ? professional.user.name.split(" ").map((n) => n[0]).join("")
                                : professional.user.email[0].toUpperCase()}
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle2">
                                {professional.user.name || "N/A"}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {professional.user.email}
                              </Typography>
                              {professional.specialization && (
                                <Typography variant="caption" display="block" color="text.secondary">
                                  {professional.specialization}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={professional.serviceType} size="small" variant="outlined" />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {professional.location || "Not specified"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Rating value={professional.rating || 0} precision={0.1} size="small" readOnly />
                            <Typography variant="body2">
                              {professional.rating?.toFixed(1) || "0.0"}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {professional.totalReviews}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={professional.isActive ? "Active" : "Inactive"}
                            color={professional.isActive ? "success" : "error"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {format(new Date(professional.createdAt), "MMM dd, yyyy")}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            component={Link}
                            href={`/professionals/${professional.id}`}
                          >
                            <ViewIcon />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedProfessional(professional)
                              setStatusDialogOpen(true)
                            }}
                          >
                            {professional.isActive ? <BlockIcon /> : <ActivateIcon />}
                          </IconButton>
                          <IconButton size="small">
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

      {/* Status Toggle Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedProfessional?.isActive ? "Deactivate" : "Activate"} Professional
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to {selectedProfessional?.isActive ? "deactivate" : "activate"}{" "}
            <strong>{selectedProfessional?.user.name || selectedProfessional?.user.email}</strong>?
          </Typography>
          {selectedProfessional?.isActive && (
            <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
              Deactivating this professional will prevent them from receiving new appointments.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleStatusToggle}
            variant="contained"
            color={selectedProfessional?.isActive ? "error" : "success"}
          >
            {selectedProfessional?.isActive ? "Deactivate" : "Activate"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}