import { PrismaClient } from "@prisma/client"
import { SecurePassword } from "@blitzjs/auth/secure-password"
import {
  USER_ROLES,
  SERVICE_TYPES,
  APPOINTMENT_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
} from "../src/constants"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting seed...")

  // Create admin user
  const adminPassword = await SecurePassword.hash("admin123")
  const admin = await prisma.user.upsert({
    where: { email: "admin@appbook.com" },
    update: {},
    create: {
      name: "System Admin",
      email: "admin@appbook.com",
      hashedPassword: adminPassword,
      role: USER_ROLES.ADMIN,
      phone: "+1234567890",
      address: "123 Admin Street, Admin City",
    },
  })

  // Create sample users
  const users = []
  const userData = [
    {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567891",
      address: "123 Main St, New York",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1234567892",
      address: "456 Oak Ave, Los Angeles",
    },
    {
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+1234567893",
      address: "789 Pine Rd, Chicago",
    },
    {
      name: "Sarah Wilson",
      email: "sarah@example.com",
      phone: "+1234567894",
      address: "321 Elm St, Houston",
    },
  ]

  for (const userInfo of userData) {
    const password = await SecurePassword.hash("password123")
    const user = await prisma.user.upsert({
      where: { email: userInfo.email },
      update: {},
      create: {
        ...userInfo,
        hashedPassword: password,
        role: USER_ROLES.USER,
      },
    })
    users.push(user)
  }

  // Create professional users
  const professionalUsers = []
  const professionalData = [
    {
      name: "Dr. Emily Chen",
      email: "dr.chen@example.com",
      phone: "+1234567895",
      address: "555 Medical Center, Boston",
      serviceType: SERVICE_TYPES.DOCTOR,
      specialization: "Cardiology",
      location: "Boston, MA",
      bio: "Experienced cardiologist with over 10 years of practice. Specializes in preventive cardiology and heart disease management.",
      workingHours: {
        start: "09:00",
        end: "17:00",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
    },
    {
      name: "Dr. Michael Rodriguez",
      email: "dr.rodriguez@example.com",
      phone: "+1234567896",
      address: "777 Dental Plaza, Miami",
      serviceType: SERVICE_TYPES.DENTIST,
      specialization: "Orthodontics",
      location: "Miami, FL",
      bio: "Board-certified orthodontist specializing in braces and clear aligners. Committed to creating beautiful, healthy smiles.",
      workingHours: {
        start: "08:00",
        end: "18:00",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      },
    },
    {
      name: "Lisa Thompson",
      email: "lisa@example.com",
      phone: "+1234567897",
      address: "999 Beauty Lane, Seattle",
      serviceType: SERVICE_TYPES.SALON,
      specialization: "Hair Styling",
      location: "Seattle, WA",
      bio: "Professional hair stylist with expertise in cutting, coloring, and styling. Passionate about helping clients look and feel their best.",
      workingHours: {
        start: "10:00",
        end: "19:00",
        days: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      },
    },
    {
      name: "David Park",
      email: "david@example.com",
      phone: "+1234567898",
      address: "444 Fitness Center, Denver",
      serviceType: SERVICE_TYPES.TRAINER,
      specialization: "Personal Training",
      location: "Denver, CO",
      bio: "Certified personal trainer with 8 years of experience. Specializes in strength training, weight loss, and athletic performance.",
      workingHours: {
        start: "06:00",
        end: "20:00",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      },
    },
    {
      name: "Maria Garcia",
      email: "maria@example.com",
      phone: "+1234567899",
      address: "666 Wellness Spa, Phoenix",
      serviceType: SERVICE_TYPES.SPA,
      specialization: "Massage Therapy",
      location: "Phoenix, AZ",
      bio: "Licensed massage therapist specializing in therapeutic and relaxation massage. Helping clients reduce stress and improve well-being.",
      workingHours: {
        start: "09:00",
        end: "18:00",
        days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
    },
  ]

  for (const profInfo of professionalData) {
    const password = await SecurePassword.hash("password123")
    const user = await prisma.user.upsert({
      where: { email: profInfo.email },
      update: {},
      create: {
        name: profInfo.name,
        email: profInfo.email,
        hashedPassword: password,
        role: USER_ROLES.PROFESSIONAL,
        phone: profInfo.phone,
        address: profInfo.address,
      },
    })

    const professional = await prisma.professional.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        serviceType: profInfo.serviceType,
        specialization: profInfo.specialization,
        location: profInfo.location,
        bio: profInfo.bio,
        workingHours: profInfo.workingHours,
        rating: Math.random() * 2 + 3, // Random rating between 3-5
        totalReviews: Math.floor(Math.random() * 50) + 10, // Random reviews between 10-60
        isActive: true,
      },
    })

    professionalUsers.push({ user, professional })
  }

  // Create sample appointments
  const appointments = []
  for (let i = 0; i < 10; i++) {
    const customer = users[Math.floor(Math.random() * users.length)]
    const prof = professionalUsers[Math.floor(Math.random() * professionalUsers.length)]

    const appointmentDate = new Date()
    appointmentDate.setDate(appointmentDate.getDate() + Math.floor(Math.random() * 30) + 1)
    appointmentDate.setHours(9 + Math.floor(Math.random() * 8), Math.random() > 0.5 ? 0 : 30, 0, 0)

    const appointment = await prisma.appointment.create({
      data: {
        customerId: customer.id,
        professionalId: prof.professional.id,
        serviceType: prof.professional.serviceType,
        dateTime: appointmentDate,
        duration: 60,
        status: [
          APPOINTMENT_STATUS.PENDING,
          APPOINTMENT_STATUS.APPROVED,
          APPOINTMENT_STATUS.COMPLETED,
        ][Math.floor(Math.random() * 3)],
        notes: `Sample appointment ${i + 1}`,
      },
    })

    appointments.push(appointment)
  }

  // Create sample payments
  for (const appointment of appointments.slice(0, 5)) {
    await prisma.payment.create({
      data: {
        appointmentId: appointment.id,
        amount: Math.floor(Math.random() * 200) + 50, // Random amount between $50-$250
        status: [PAYMENT_STATUS.PENDING, PAYMENT_STATUS.PAID][Math.floor(Math.random() * 2)],
        method:
          Object.values(PAYMENT_METHODS)[
            Math.floor(Math.random() * Object.values(PAYMENT_METHODS).length)
          ],
        transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
      },
    })
  }

  // Create sample notifications
  const notificationMessages = [
    "Your appointment has been confirmed",
    "New appointment request received",
    "Payment processed successfully",
    "Appointment reminder: You have an appointment tomorrow",
    "Your profile has been updated",
  ]

  for (let i = 0; i < 20; i++) {
    const user = [...users, ...professionalUsers.map((p) => p.user)][
      Math.floor(Math.random() * (users.length + professionalUsers.length))
    ]
    const message = notificationMessages[Math.floor(Math.random() * notificationMessages.length)]

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: ["EMAIL", "SMS", "PUSH"][Math.floor(Math.random() * 3)],
        message,
        status: ["SENT", "PENDING", "FAILED"][Math.floor(Math.random() * 3)],
        isRead: Math.random() > 0.5,
      },
    })
  }

  console.log("✅ Seed completed successfully!")
  console.log(`👤 Created ${users.length + professionalUsers.length + 1} users`)
  console.log(`🏥 Created ${professionalUsers.length} professionals`)
  console.log(`📅 Created ${appointments.length} appointments`)
  console.log(`💰 Created ${appointments.slice(0, 5).length} payments`)
  console.log(`🔔 Created 20 notifications`)
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
