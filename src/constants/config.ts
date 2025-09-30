// Application Configuration Constants

// Default values
export const DEFAULT_APPOINTMENT_DURATION = 60 // minutes
export const DEFAULT_WORKING_HOURS = {
  start: "09:00",
  end: "18:00",
  days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
}

// Pagination
export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100

// File upload limits
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"]

// Validation limits
export const MIN_PASSWORD_LENGTH = 8
export const MAX_NAME_LENGTH = 100
export const MAX_BIO_LENGTH = 500
export const MAX_NOTES_LENGTH = 1000

// Time formats
export const DATE_FORMAT = "yyyy-MM-dd"
export const TIME_FORMAT = "HH:mm"
export const DATETIME_FORMAT = "yyyy-MM-dd HH:mm"

// API endpoints
export const API_ENDPOINTS = {
  PROFESSIONALS: "/api/professionals",
  APPOINTMENTS: "/api/appointments",
  PAYMENTS: "/api/payments",
  NOTIFICATIONS: "/api/notifications",
} as const

// Error messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You are not authorized to perform this action",
  NOT_FOUND: "Resource not found",
  INVALID_INPUT: "Invalid input provided",
  APPOINTMENT_CONFLICT: "Appointment time conflicts with existing booking",
  PAYMENT_FAILED: "Payment processing failed",
  PROFESSIONAL_UNAVAILABLE: "Professional is not available at this time",
} as const

// Success messages
export const SUCCESS_MESSAGES = {
  APPOINTMENT_CREATED: "Appointment created successfully",
  APPOINTMENT_UPDATED: "Appointment updated successfully",
  APPOINTMENT_CANCELLED: "Appointment cancelled successfully",
  PAYMENT_SUCCESS: "Payment processed successfully",
  PROFILE_UPDATED: "Profile updated successfully",
} as const
