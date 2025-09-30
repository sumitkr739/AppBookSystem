import db from "db"
import { Ctx } from "blitz"

interface GetPaymentsInput {
  status?: string
  page?: number
  limit?: number
}

export default async function getPayments(input: GetPaymentsInput, ctx: Ctx) {
  if (!ctx.session.userId) {
    throw new Error("You must be logged in to view payments")
  }

  const { status, page = 1, limit = 10 } = input
  const skip = (page - 1) * limit

  const where: any = {}

  // Filter by user role
  if (ctx.session.role === "PROFESSIONAL") {
    // For professionals, show payments for their appointments
    where.appointment = {
      professional: {
        userId: ctx.session.userId
      }
    }
  } else {
    // For customers, show their payments
    where.appointment = {
      customerId: ctx.session.userId
    }
  }

  if (status) {
    where.status = status
  }

  const [payments, total] = await Promise.all([
    db.payment.findMany({
      where,
      include: {
        appointment: {
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
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
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    db.payment.count({ where }),
  ])

  return {
    payments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}