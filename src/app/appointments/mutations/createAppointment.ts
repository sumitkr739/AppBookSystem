import db from "db"
import { CreateAppointmentInput } from "src/app/validations/appointment"
import { Ctx } from "blitz"
import { APPOINTMENT_STATUS, ERROR_MESSAGES } from "src/constants"

export default async function createAppointment(input: any, ctx: Ctx) {
  if (!ctx.session.userId) {
    throw new Error("You must be logged in to create an appointment")
  }

  const data = CreateAppointmentInput.parse(input)

  // Check if professional exists and is active
  const professional = await db.professional.findUnique({
    where: { id: data.professionalId },
    include: { user: true },
  })

  if (!professional || !professional.isActive) {
    throw new Error("Professional not found or inactive")
  }

  // Check for time conflicts
  const conflictingAppointment = await db.appointment.findFirst({
    where: {
      professionalId: data.professionalId,
      dateTime: {
        gte: new Date(data.dateTime.getTime() - data.duration * 60000),
        lte: new Date(data.dateTime.getTime() + data.duration * 60000),
      },
      status: {
        in: [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.APPROVED],
      },
    },
  })

  if (conflictingAppointment) {
    throw new Error(ERROR_MESSAGES.APPOINTMENT_CONFLICT)
  }

  const appointment = await db.appointment.create({
    data: {
      ...data,
      customerId: ctx.session.userId,
      status: APPOINTMENT_STATUS.PENDING,
    },
    include: {
      customer: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
      professional: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })

  // Create notification for professional
  await db.notification.create({
    data: {
      userId: professional.userId,
      type: "EMAIL",
      message: `New appointment request from ${appointment.customer.name} for ${data.serviceType}`,
      status: "PENDING",
    },
  })

  return appointment
}
