import db from "db"
import { GetAppointmentsInput } from "src/app/validations/appointment"

export default async function getAppointments(input: any) {
  const { professionalId, customerId, status, startDate, endDate, page = 1, limit = 10 } =
    GetAppointmentsInput.parse(input)

  const where: any = {}

  if (professionalId) where.professionalId = professionalId
  if (customerId) where.customerId = customerId
  if (status) where.status = status
  if (startDate || endDate) {
    where.dateTime = {}
    if (startDate) where.dateTime.gte = startDate
    if (endDate) where.dateTime.lte = endDate
  }

  const skip = (page - 1) * limit

  const [appointments, total] = await Promise.all([
    db.appointment.findMany({
      where,
      select: {
        id: true,
        customerId: true,
        professionalId: true,
        serviceType: true,
        dateTime: true,
        duration: true,
        status: true,
        notes: true,
        createdAt: true,
        updatedAt: true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        professional: {
          select: {
            id: true,
            serviceType: true,
            specialization: true,
            location: true,
            user: {
              select: {
                name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
            method: true,
            transactionId: true,
            createdAt: true,
          },
        },
      },
      orderBy: [
        { dateTime: "desc" },
        { createdAt: "desc" }
      ],
      skip,
      take: limit,
    }),
    db.appointment.count({ where }),
  ])

  return {
    appointments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}
