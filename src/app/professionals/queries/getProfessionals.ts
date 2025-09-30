import db from "db"
import { GetProfessionalsInput } from "src/app/validations/appointment"

export default async function getProfessionals(input: any) {
  const { serviceType, location, isActive = true, page = 1, limit = 10 } = GetProfessionalsInput.parse(input)

  const where: any = { isActive }

  if (serviceType) where.serviceType = serviceType
  if (location) where.location = { contains: location, mode: "insensitive" }

  const skip = (page - 1) * limit

  const [professionals, total] = await Promise.all([
    db.professional.findMany({
      where,
      select: {
        id: true,
        serviceType: true,
        specialization: true,
        location: true,
        bio: true,
        rating: true,
        totalReviews: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
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
      orderBy: [
        { rating: "desc" },
        { totalReviews: "desc" },
        { createdAt: "desc" }
      ],
      skip,
      take: limit,
    }),
    db.professional.count({ where }),
  ])

  return {
    professionals,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  }
}
