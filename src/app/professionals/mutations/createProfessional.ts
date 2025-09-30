import db from "db"
import { CreateProfessionalInput } from "src/app/validations/appointment"
import { Ctx } from "blitz"
import { USER_ROLES } from "src/constants"

export default async function createProfessional(input: any, ctx: Ctx) {
  if (!ctx.session.userId) {
    throw new Error("You must be logged in to create a professional profile")
  }

  const user = await db.user.findUnique({
    where: { id: ctx.session.userId },
  })

  if (!user) {
    throw new Error("User not found")
  }

  if (user.role !== USER_ROLES.PROFESSIONAL && user.role !== USER_ROLES.ADMIN) {
    throw new Error("Only professionals can create professional profiles")
  }

  // Check if professional profile already exists
  const existingProfessional = await db.professional.findUnique({
    where: { userId: ctx.session.userId },
  })

  if (existingProfessional) {
    throw new Error("Professional profile already exists")
  }

  const data = CreateProfessionalInput.parse(input)

  const professional = await db.professional.create({
    data: {
      ...data,
      userId: ctx.session.userId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phone: true,
        },
      },
    },
  })

  return professional
}
