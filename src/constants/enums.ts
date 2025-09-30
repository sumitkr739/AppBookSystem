// User Roles
export const USER_ROLES = {
  USER: "USER",
  PROFESSIONAL: "PROFESSIONAL",
  ADMIN: "ADMIN",
} as const

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]

// Appointment Status
export const APPOINTMENT_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  CANCELLED: "CANCELLED",
  COMPLETED: "COMPLETED",
} as const

export type AppointmentStatus = (typeof APPOINTMENT_STATUS)[keyof typeof APPOINTMENT_STATUS]

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: "PENDING",
  PAID: "PAID",
  REFUNDED: "REFUNDED",
  FAILED: "FAILED",
} as const

export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS]

// Payment Methods
export const PAYMENT_METHODS = {
  UPI: "UPI",
  CARD: "CARD",
  WALLET: "WALLET",
  CASH: "CASH",
} as const

export type PaymentMethod = (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS]

// Notification Types
export const NOTIFICATION_TYPES = {
  EMAIL: "EMAIL",
  SMS: "SMS",
  PUSH: "PUSH",
} as const

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES]

// Notification Status
export const NOTIFICATION_STATUS = {
  SENT: "SENT",
  PENDING: "PENDING",
  FAILED: "FAILED",
} as const

export type NotificationStatus = (typeof NOTIFICATION_STATUS)[keyof typeof NOTIFICATION_STATUS]

// Service Types
export const SERVICE_TYPES = {
  DOCTOR: "Doctor",
  DENTIST: "Dentist",
  SALON: "Salon",
  SPA: "Spa",
  GYM: "Gym",
  CONSULTANT: "Consultant",
  THERAPIST: "Therapist",
  TRAINER: "Trainer",
  OTHER: "Other",
} as const

export type ServiceType = (typeof SERVICE_TYPES)[keyof typeof SERVICE_TYPES]

// Helper functions for validation
export const isValidUserRole = (role: string): role is UserRole => {
  return Object.values(USER_ROLES).includes(role as UserRole)
}

export const isValidAppointmentStatus = (status: string): status is AppointmentStatus => {
  return Object.values(APPOINTMENT_STATUS).includes(status as AppointmentStatus)
}

export const isValidPaymentStatus = (status: string): status is PaymentStatus => {
  return Object.values(PAYMENT_STATUS).includes(status as PaymentStatus)
}

export const isValidPaymentMethod = (method: string): method is PaymentMethod => {
  return Object.values(PAYMENT_METHODS).includes(method as PaymentMethod)
}

export const isValidServiceType = (type: string): type is ServiceType => {
  return Object.values(SERVICE_TYPES).includes(type as ServiceType)
}
