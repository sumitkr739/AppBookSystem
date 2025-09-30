"use client"

import { Box, Container, Typography, Card, CardContent, Grid, Avatar, Chip } from "@mui/material"
import {
  CalendarToday as CalendarIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Support as SupportIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
} from "@mui/icons-material"

export default function AboutPage() {
  const team = [
    {
      name: "John Smith",
      role: "CEO & Founder",
      bio: "10+ years in healthcare technology",
      avatar: "JS",
    },
    {
      name: "Sarah Johnson",
      role: "CTO",
      bio: "Expert in scalable systems",
      avatar: "SJ",
    },
    {
      name: "Mike Chen",
      role: "Head of Product",
      bio: "User experience specialist",
      avatar: "MC",
    },
  ]

  const values = [
    {
      icon: SecurityIcon,
      title: "Security First",
      description:
        "We prioritize the security and privacy of your personal information with enterprise-grade encryption.",
    },
    {
      icon: SpeedIcon,
      title: "Fast & Reliable",
      description:
        "Our platform is built for speed and reliability, ensuring you can book appointments without delays.",
    },
    {
      icon: SupportIcon,
      title: "24/7 Support",
      description:
        "Our dedicated support team is available around the clock to help you with any questions or issues.",
    },
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          About AppBookSystem
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: "800px", mx: "auto" }}>
          We&apos;re revolutionizing the way people book appointments with professionals, making it
          easier, faster, and more reliable than ever before.
        </Typography>
      </Box>

      {/* Mission Section */}
      <Box sx={{ mb: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: "600" }}>
              Our Mission
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              To connect people with the best professionals in their area through a seamless,
              secure, and user-friendly platform. We believe that booking appointments should be
              simple, transparent, and accessible to everyone.
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Since our founding in 2020, we&apos;ve helped thousands of users find and book appointments
              with healthcare providers, consultants, and service professionals across the country.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 300,
                bgcolor: "primary.50",
                borderRadius: 2,
              }}
            >
              <CalendarIcon sx={{ fontSize: 120, color: "primary.main" }} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Values Section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: "600", mb: 6 }}
        >
          Our Values
        </Typography>
        <Grid container spacing={4}>
          {values.map((value, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: "100%", textAlign: "center", p: 3 }}>
                <CardContent>
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
                    <value.icon sx={{ fontSize: 32, color: "primary.main" }} />
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: "600" }}>
                    {value.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {value.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Team Section */}
      <Box sx={{ mb: 8 }}>
        <Typography
          variant="h4"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: "600", mb: 6 }}
        >
          Meet Our Team
        </Typography>
        <Grid container spacing={4}>
          {team.map((member, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ textAlign: "center", p: 3 }}>
                <CardContent>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: "primary.main",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    {member.avatar}
                  </Avatar>
                  <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: "600" }}>
                    {member.name}
                  </Typography>
                  <Chip label={member.role} color="primary" sx={{ mb: 2 }} />
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Stats Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "primary.contrastText",
          borderRadius: 2,
          p: 6,
          textAlign: "center",
        }}
      >
        <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: "600", mb: 4 }}>
          Our Impact
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h3" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
              10,000+
            </Typography>
            <Typography variant="h6">Active Users</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h3" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
              500+
            </Typography>
            <Typography variant="h6">Verified Professionals</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h3" component="div" sx={{ fontWeight: "bold", mb: 1 }}>
              50,000+
            </Typography>
            <Typography variant="h6">Appointments Booked</Typography>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
