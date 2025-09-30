import { setupBlitzServer } from "@blitzjs/next"
import db from "db"
import { BlitzLogger } from "blitz"
import { RpcServerPlugin } from "@blitzjs/rpc"
import { authConfig } from "./blitz-auth-config"

// Import auth functions dynamically to avoid bundling issues
const BlitzAuth = require("@blitzjs/auth")
const { AuthServerPlugin, simpleRolesIsAuthorized } = BlitzAuth

// Manual Prisma storage implementation
const prismaStorage = {
  getSession: (handle: string) => db.session.findFirst({ where: { handle } }),
  getSessions: (userId: any) => db.session.findMany({ where: { userId, expiresAt: { gt: new Date() } } }),
  createSession: (session: any) => db.session.create({ data: session }),
  updateSession: (handle: string, session: any) => db.session.update({ where: { handle }, data: session }),
  deleteSession: (handle: string) => db.session.delete({ where: { handle } }),
}

const { api, getBlitzContext, useAuthenticatedBlitzContext, invoke, withBlitzAuth } =
  setupBlitzServer({
    plugins: [
      AuthServerPlugin({
        ...authConfig,
        storage: prismaStorage,
        isAuthorized: simpleRolesIsAuthorized,
      }),
      RpcServerPlugin({}),
    ],
    logger: BlitzLogger({}),
  })

export { api, getBlitzContext, useAuthenticatedBlitzContext, invoke, withBlitzAuth }
