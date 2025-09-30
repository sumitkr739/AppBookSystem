import db from "db"
import { CreatePaymentInput } from "src/app/validations/appointment"
import { Ctx } from "blitz"
import { PAYMENT_STATUS, ERROR_MESSAGES } from "src/constants"

export default async function createPayment(input: any, ctx: Ctx) {
  if (!ctx.session.userId) {
    throw new Error("You must be logged in to create a payment")
  }

  const data = CreatePaymentInput.parse(input)

  // Get the appointment
  const appointment = await db.appointment.findUnique({
    where: { id: data.appointmentId },
    include: {
      customer: true,
      professional: true,
      payment: true,
    },
  })

  if (!appointment) {
    throw new Error("Appointment not found")
  }

  // Check if payment already exists
  if (appointment.payment) {
    throw new Error("Payment already exists for this appointment")
  }

  // Check permissions
  const isCustomer = appointment.customerId === ctx.session.userId
  const isAdmin = ctx.session.role === "ADMIN"

  if (!isCustomer && !isAdmin) {
    throw new Error(ERROR_MESSAGES.UNAUTHORIZED)
  }

  // Create payment
  const payment = await db.payment.create({
    data: {
      ...data,
      status: PAYMENT_STATUS.PENDING,
    },
  })

  // Create notification for professional
  await db.notification.create({
    data: {
      userId: appointment.professional.userId,
      type: "EMAIL",
      message: `Payment of ₹${data.amount} initiated for appointment with ${appointment.customer.name}`,
      status: "PENDING",
    },
  })

  return payment
}
