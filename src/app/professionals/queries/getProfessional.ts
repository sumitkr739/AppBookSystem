import db from "db"

export default async function getProfessional(input: { id: number }) {
  const professional = await db.professional.findUnique({
    where: { id: input.id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          address: true,
        },
      },
    },
  })

  if (!professional) {
    throw new Error("Professional not found")
  }

  return professional
}