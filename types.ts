import { SimpleRolesIsAuthorized } from "@blitzjs/auth"
import { User } from "@/db"
import { UserRole } from "@/src/constants"

export type Role = UserRole

declare module "@blitzjs/auth" {
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>
    PublicData: {
      userId: User["id"]
      role: Role
      email: string
      name?: string | null
    }
  }
}

// Additional type definitions for the application
export interface ProfessionalWithUser {
  id: number
  serviceType: string
  specialization?: string | null
  location: string | null
  bio?: string | null
  rating?: number | null
  totalReviews: number
  isActive: boolean
  workingHours: any
  createdAt: Date
  updatedAt: Date
  user: {
    id: number
    name?: string | null
    email: string
    phone?: string | null
    address?: string | null
  }
}

export interface AppointmentWithDetails {
  id: number
  customerId: number
  professionalId: number
  serviceType: string
  dateTime: Date
  duration: number
  status: string
  notes?: string | null
  createdAt: Date
  updatedAt: Date
  customer: {
    id: number
    name?: string | null
    email: string
    phone?: string | null
  }
  professional: {
    id: number
    serviceType: string
    specialization?: string | null
    location: string | null
    user: {
      name?: string | null
      email: string
      phone?: string | null
    }
  }
  payment?: {
    id: number
    amount: number
    status: string
    method: string
    transactionId?: string | null
  } | null
}

export interface NotificationWithUser {
  id: number
  userId: number
  type: string
  message: string
  status: string
  isRead: boolean
  createdAt: Date
  updatedAt: Date
  user: {
    id: number
    name?: string | null
    email: string
  }
}
