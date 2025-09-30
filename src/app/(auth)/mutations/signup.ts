import db from "db"
import { SecurePassword } from "@blitzjs/auth/secure-password"
import { SignupInput } from "src/app/validations/appointment"
import { USER_ROLES } from "src/constants"

export default async function signup(input: any, ctx: any) {
  const blitzContext = ctx

  // Validate input
  const { name, email, password, role, phone, address } = SignupInput.parse(input)

  const hashedPassword = await SecurePassword.hash(password)

  const user = await db.user.create({
    data: {
      name,
      email,
      hashedPassword,
      role: role || USER_ROLES.USER,
      phone,
      address,
    },
  })

  await blitzContext.session.$create({
    userId: user.id,
    role: user.role,
  })

  return { userId: blitzContext.session.userId, ...user }
}
