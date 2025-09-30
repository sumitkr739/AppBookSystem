import { Ctx } from "blitz"
import db from "db"

export default async function markNotificationRead(id: number, ctx: Ctx) {
  ctx.session.$authorize()

  const notification = await db.notification.findUnique({
    where: { id },
  })

  if (!notification || notification.userId !== ctx.session.userId) {
    throw new Error("Notification not found or unauthorized")
  }

  const updatedNotification = await db.notification.update({
    where: { id },
    data: { isRead: true },
  })

  return updatedNotification
}
