import db from "db"
import { CancelAppointmentInput } from "src/app/validations/appointment"
import { Ctx } from "blitz"
import { APPOINTMENT_STATUS, ERROR_MESSAGES } from "src/constants"

export default async function cancelAppointment(input: any, ctx: Ctx) {
  if (!ctx.session.userId) {
    throw new Error("You must be logged in to cancel an appointment")
  }

  const { id, reason } = CancelAppointmentInput.parse(input)

  // Get the appointment
  const appointment = await db.appointment.findUnique({
    where: { id },
    include: {
      professional: {
        include: {
          user: true,
        },
      },
      customer: true,
      payment: true,
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

  // Check if appointment can be cancelled
  if (appointment.status === APPOINTMENT_STATUS.CANCELLED) {
    throw new Error("Appointment is already cancelled")
  }

  if (appointment.status === APPOINTMENT_STATUS.COMPLETED) {
    throw new Error("Cannot cancel a completed appointment")
  }

  // Update appointment status
  const updatedAppointment = await db.appointment.update({
    where: { id },
    data: {
      status: APPOINTMENT_STATUS.CANCELLED,
      notes: reason ? `${appointment.notes || ""}\n\nCancellation reason: ${reason}`.trim() : appointment.notes,
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
      payment: true,
    },
  })

  // Handle payment refund if applicable
  if (appointment.payment && appointment.payment.status === "PAID") {
    await db.payment.update({
      where: { id: appointment.payment.id },
      data: {
        status: "REFUNDED",
      },
    })
  }

  // Create notification for the other party
  const notificationUserId = isCustomer ? appointment.professional.userId : appointment.customerId
  const cancelledBy = isCustomer ? appointment.customer.name : appointment.professional.user.name
  const message = `Appointment cancelled by ${cancelledBy}${reason ? `. Reason: ${reason}` : ""}`

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