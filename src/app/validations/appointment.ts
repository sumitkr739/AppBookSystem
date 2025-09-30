import { z } from "zod"
import {
  USER_ROLES,
  APPOINTMENT_STATUS,
  PAYMENT_METHODS,
  SERVICE_TYPES,
  DEFAULT_APPOINTMENT_DURATION,
} from "src/constants"

// User validation schemas
export const SignupInput = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum([USER_ROLES.USER, USER_ROLES.PROFESSIONAL, USER_ROLES.ADMIN] as const),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export const LoginInput = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

// Professional validation schemas
export const CreateProfessionalInput = z.object({
  serviceType: z.enum(Object.values(SERVICE_TYPES) as [string, ...string[]]),
  specialization: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  bio: z.string().max(500, "Bio too long").optional(),
  workingHours: z.object({
    start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    days: z.array(z.string()).min(1, "At least one working day required"),
  }),
})

export const UpdateProfessionalInput = CreateProfessionalInput.partial()

// Appointment validation schemas
export const CreateAppointmentInput = z.object({
  professionalId: z.number().int().positive("Invalid professional ID"),
  serviceType: z.string().min(1, "Service type is required"),
  dateTime: z
    .date()
    .refine((date) => date > new Date(), "Appointment must be scheduled for the future"),
  duration: z.number().int().positive().default(DEFAULT_APPOINTMENT_DURATION),
  notes: z.string().max(1000, "Notes too long").optional(),
})

export const UpdateAppointmentInput = z.object({
  id: z.number().int().positive(),
  status: z.enum(Object.values(APPOINTMENT_STATUS) as [string, ...string[]]).optional(),
  dateTime: z.date().optional(),
  duration: z.number().int().positive().optional(),
  notes: z.string().max(1000, "Notes too long").optional(),
})

export const CancelAppointmentInput = z.object({
  id: z.number().int().positive(),
  reason: z.string().optional(),
})

// Payment validation schemas
export const CreatePaymentInput = z.object({
  appointmentId: z.number().int().positive("Invalid appointment ID"),
  amount: z.number().positive("Amount must be positive"),
  method: z.enum(Object.values(PAYMENT_METHODS) as [string, ...string[]]),
})

export const UpdatePaymentInput = z.object({
  id: z.number().int().positive(),
  status: z.enum(["PENDING", "PAID", "REFUNDED", "FAILED"] as const).optional(),
  transactionId: z.string().optional(),
})

// Notification validation schemas
export const CreateNotificationInput = z.object({
  userId: z.number().int().positive("Invalid user ID"),
  type: z.enum(["EMAIL", "SMS", "PUSH"] as const),
  message: z.string().min(1, "Message is required"),
})

export const MarkNotificationReadInput = z.object({
  id: z.number().int().positive(),
})

// Query validation schemas
export const GetAppointmentsInput = z.object({
  professionalId: z.number().int().positive().optional(),
  customerId: z.number().int().positive().optional(),
  status: z.enum(Object.values(APPOINTMENT_STATUS) as [string, ...string[]]).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

export const GetProfessionalsInput = z.object({
  serviceType: z.string().optional(),
  location: z.string().optional(),
  isActive: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
})

// Type exports
export type SignupInputType = z.infer<typeof SignupInput>
export type LoginInputType = z.infer<typeof LoginInput>
export type CreateProfessionalInputType = z.infer<typeof CreateProfessionalInput>
export type UpdateProfessionalInputType = z.infer<typeof UpdateProfessionalInput>
export type CreateAppointmentInputType = z.infer<typeof CreateAppointmentInput>
export type UpdateAppointmentInputType = z.infer<typeof UpdateAppointmentInput>
export type CancelAppointmentInputType = z.infer<typeof CancelAppointmentInput>
export type CreatePaymentInputType = z.infer<typeof CreatePaymentInput>
export type UpdatePaymentInputType = z.infer<typeof UpdatePaymentInput>
export type CreateNotificationInputType = z.infer<typeof CreateNotificationInput>
export type MarkNotificationReadInputType = z.infer<typeof MarkNotificationReadInput>
export type GetAppointmentsInputType = z.infer<typeof GetAppointmentsInput>
export type GetProfessionalsInputType = z.infer<typeof GetProfessionalsInput>
