"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "@blitzjs/rpc"
import signup from "../mutations/signup"
import { SignupInput } from "src/app/validations/appointment"
import { USER_ROLES } from "src/constants"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@mui/material"
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
} from "@mui/icons-material"
import Link from "next/link"

type SignupFormProps = {
  onSuccess?: () => void
}

export const SignupForm = (props: SignupFormProps) => {
  const [signupMutation, { isPending }] = useMutation(signup)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: USER_ROLES.USER as string,
    phone: "",
    address: "",
    agreeToTerms: false,
  })
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get role from URL params if available
  const urlRole = searchParams?.get("role")
  if (urlRole && Object.values(USER_ROLES).includes(urlRole as any)) {
    formData.role = urlRole as any
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFieldErrors({})

    // Client-side validation
    const errors: Record<string, string> = {}

    if (!formData.name.trim()) {
      errors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid"
    }

    if (!formData.password) {
      errors.password = "Password is required"
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeToTerms) {
      errors.agreeToTerms = "You must agree to the terms and conditions"
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    try {
      await signupMutation({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
      })

            router.refresh()
      router.push("/dashboard")
          } catch (error: any) {
            if (error.code === "P2002" && error.meta?.target?.includes("email")) {
        setFieldErrors({ email: "This email is already being used" })
            } else {
        setError(error.message || "An unexpected error occurred. Please try again.")
      }
    }
  }

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value as any,
    }))
  }

  const handleGoogleSignup = () => {
    // TODO: Implement Google authentication
    console.log("Google signup not implemented yet")
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        {/* Logo */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 4 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: "primary.main",
                color: "primary.contrastText",
              }}
            >
              <CalendarIcon sx={{ fontSize: 24 }} />
            </Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
              AppBookSystem
            </Typography>
          </Box>
        </Box>

        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                Create your account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join thousands of users who trust AppBookSystem
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
              {/* Role Selection */}
              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <FormLabel component="legend" sx={{ mb: 2 }}>
                  I want to join as
                </FormLabel>
                <RadioGroup
                  value={formData.role}
                  onChange={handleRoleChange}
                  sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
                >
                  <Box
                    sx={{
                      border: 1,
                      borderColor: formData.role === USER_ROLES.USER ? "primary.main" : "divider",
                      borderRadius: 2,
                      p: 2,
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                      bgcolor: formData.role === USER_ROLES.USER ? "primary.50" : "transparent",
                    }}
                    onClick={() => setFormData((prev) => ({ ...prev, role: USER_ROLES.USER }))}
                  >
                    <FormControlLabel
                      value={USER_ROLES.USER}
                      control={<Radio />}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <PersonIcon sx={{ fontSize: 20 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                              User
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Book appointments
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ m: 0 }}
                    />
                  </Box>
                  <Box
                    sx={{
                      border: 1,
                      borderColor:
                        formData.role === USER_ROLES.PROFESSIONAL ? "primary.main" : "divider",
                      borderRadius: 2,
                      p: 2,
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                      bgcolor:
                        formData.role === USER_ROLES.PROFESSIONAL ? "primary.50" : "transparent",
                    }}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, role: USER_ROLES.PROFESSIONAL }))
                    }
                  >
                    <FormControlLabel
                      value={USER_ROLES.PROFESSIONAL}
                      control={<Radio />}
                      label={
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <BusinessIcon sx={{ fontSize: 20 }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                              Professional
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Offer services
                            </Typography>
                          </Box>
                        </Box>
                      }
                      sx={{ m: 0 }}
                    />
                  </Box>
                </RadioGroup>
              </FormControl>

              {/* Name Fields */}
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="First name"
                  placeholder="John"
                  value={formData.name.split(" ")[0] || ""}
                  onChange={(e) => {
                    const firstName = e.target.value
                    const lastName = formData.name.split(" ").slice(1).join(" ")
                    setFormData((prev) => ({
                      ...prev,
                      name: lastName ? `${firstName} ${lastName}` : firstName,
                    }))
                  }}
                  error={!!fieldErrors.name}
                  helperText={fieldErrors.name}
                  required
                />
                <TextField
                  fullWidth
                  label="Last name"
                  placeholder="Doe"
                  value={formData.name.split(" ").slice(1).join(" ") || ""}
                  onChange={(e) => {
                    const lastName = e.target.value
                    const firstName = formData.name.split(" ")[0] || ""
                    setFormData((prev) => ({
                      ...prev,
                      name: firstName ? `${firstName} ${lastName}` : lastName,
                    }))
                  }}
                  error={!!fieldErrors.name}
                  helperText={fieldErrors.name}
                  required
                />
              </Box>

              {/* Email */}
              <TextField
                fullWidth
                label="Email address"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleInputChange("email")}
                error={!!fieldErrors.email}
                helperText={fieldErrors.email}
                required
                sx={{ mb: 2 }}
                autoComplete="email"
              />

              {/* Password */}
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleInputChange("password")}
                error={!!fieldErrors.password}
                helperText={fieldErrors.password}
                required
                sx={{ mb: 2 }}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Confirm Password */}
              <TextField
                fullWidth
                label="Confirm password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange("confirmPassword")}
                error={!!fieldErrors.confirmPassword}
                helperText={fieldErrors.confirmPassword}
                required
                sx={{ mb: 2 }}
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Optional Fields */}
              <TextField
                fullWidth
                label="Phone number (optional)"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={handleInputChange("phone")}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Address (optional)"
                placeholder="123 Main St, City, State"
                value={formData.address}
                onChange={handleInputChange("address")}
                sx={{ mb: 2 }}
              />

              {/* Terms Agreement */}
              <FormControl error={!!fieldErrors.agreeToTerms} sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.agreeToTerms}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, agreeToTerms: e.target.checked }))
                      }
                      color="primary"
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the{" "}
                      <Typography
                        component="span"
                        variant="body2"
                        color="primary"
                        sx={{ "&:hover": { textDecoration: "underline" }, cursor: "pointer" }}
                        onClick={() => console.log("Terms of Service clicked")}
                      >
                        Terms of Service
                      </Typography>{" "}
                      and{" "}
                      <Typography
                        component="span"
                        variant="body2"
                        color="primary"
                        sx={{ "&:hover": { textDecoration: "underline" }, cursor: "pointer" }}
                        onClick={() => console.log("Privacy Policy clicked")}
                      >
                        Privacy Policy
                      </Typography>
                    </Typography>
                  }
                />
                {fieldErrors.agreeToTerms && (
                  <FormHelperText>{fieldErrors.agreeToTerms}</FormHelperText>
                )}
              </FormControl>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isPending}
                sx={{ mb: 3 }}
              >
                {isPending ? <CircularProgress size={24} /> : "Create account"}
              </Button>
            </Box>

            <Divider sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleSignup}
              sx={{ mb: 3 }}
            >
              Continue with Google
            </Button>

            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link href="/login" style={{ textDecoration: "none" }}>
                  <Typography
                    component="span"
                    variant="body2"
                    color="primary"
                    sx={{ fontWeight: "medium", "&:hover": { textDecoration: "underline" } }}
                  >
                    Sign in
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="caption" color="text.secondary">
            By creating an account, you agree to our{" "}
            <Typography
              component="span"
              variant="caption"
              color="primary"
              sx={{ "&:hover": { textDecoration: "underline" }, cursor: "pointer" }}
            >
              Terms of Service
            </Typography>{" "}
            and{" "}
            <Typography
              component="span"
              variant="caption"
              color="primary"
              sx={{ "&:hover": { textDecoration: "underline" }, cursor: "pointer" }}
            >
              Privacy Policy
            </Typography>
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
