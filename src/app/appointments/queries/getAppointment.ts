import db from "db"

export default async function getAppointment(input: { id: number }) {
  const appointment = await db.appointment.findUnique({
    where: { id: input.id },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
        },
      },
      professional: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      payment: true,
    },
  })

  if (!appointment) {
    throw new Error("Appointment not found")
  }

  return appointment
}
