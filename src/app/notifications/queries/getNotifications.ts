import db from "db"
import { Ctx } from "blitz"

interface GetNotificationsInput {
  isRead?: boolean
  type?: string
  page?: number
  limit?: number
}

export default async function getNotifications(input: GetNotificationsInput, ctx: Ctx) {
  if (!ctx.session.userId) {
    throw new Error("You must be logged in to view notifications")
  }

  const { isRead, type, page = 1, limit = 20 } = input
  const skip = (page - 1) * limit

  const where: any = {
    userId: ctx.session.userId,
  }

  if (isRead !== undefined) where.isRead = isRead
  if (type) where.type = type

  const [notifications, total, unreadCount] = await Promise.all([
    db.notification.findMany({
      where,
      select: {
        id: true,
        type: true,
        message: true,
        status: true,
        isRead: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: [
        { isRead: "asc" },
        { createdAt: "desc" }
      ],
      skip,
      take: limit,
    }),
    db.notification.count({ where }),
    db.notification.count({
      where: {
        userId: ctx.session.userId,
        isRead: false,
      },
    }),
  ])

  return {
    notifications,
    unreadCount,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}