import db from "db"
import { UpdateAppointmentInput } from "src/app/validations/appointment"
import { Ctx } from "blitz"
import { APPOINTMENT_STATUS, ERROR_MESSAGES } from "src/constants"

export default async function updateAppointment(input: any, ctx: Ctx) {
  if (!ctx.session.userId) {
    throw new Error("You must be logged in to update an appointment")
  }

  const { id, ...updateData } = UpdateAppointmentInput.parse(input)

  // Get the appointment
  const appointment = await db.appointment.findUnique({
    where: { id },
    include: {
      professional: true,
      customer: true,
    },
  })

  if (!appointment) {
    throw new Error("Appointment not found")
  }

  // Check permissions
  const isCustomer = appointment.customerId === ctx.session.userId
  const isProfessional = appointment.professional.userId === ctx.session.userId
  const isAdmin = ctx.session.role === "ADMIN"

  if (!isCustomer && !isProfessional && !isAdmin) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
  }

  // If updating date/time, check for conflicts
  if (updateData.dateTime || updateData.duration) {
    const dateTime = updateData.dateTime || appointment.dateTime
    const duration = updateData.duration || appointment.duration

    const conflictingAppointment = await db.appointment.findFirst({
      where: {
        professionalId: appointment.professionalId,
        id: { not: id },
        dateTime: {
          gte: new Date(dateTime.getTime() - duration * 60000),
          lte: new Date(dateTime.getTime() + duration * 60000),
        },
        status: {
          in: [APPOINTMENT_STATUS.PENDING, APPOINTMENT_STATUS.APPROVED],
        },
      },
    })

    if (conflictingAppointment) {
      throw new Error(ERROR_MESSAGES.APPOINTMENT_CONFLICT)
    }
  }

  const updatedAppointment = await db.appointment.update({
    where: { id },
    data: updateData,
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
      payment: true,
    },
  })

  // Create notification for the other party
  const notificationUserId = isCustomer ? appointment.professional.userId : appointment.customerId
  const message = isCustomer
    ? `Appointment updated by ${appointment.customer.name}`
    : `Appointment updated by ${appointment.professional.user.name}`

  await db.notification.create({
    data: {
      userId: notificationUserId,
      type: "EMAIL",
      message,
      status: "PENDING",
    },
  })

  return updatedAppointment
}
