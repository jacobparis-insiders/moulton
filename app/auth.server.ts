import { Authenticator } from "remix-auth"
import { sessionStorage } from "~/session.server.ts"

import { FormStrategy } from "remix-auth-form"
import { upsertSubscriber } from "./buttondown.server.ts"
import invariant from "tiny-invariant"
import { prisma } from "./db.server.ts"

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
type UserSession = {
  id: string
  email: string
  name: string | null
  role: string
}

export let authenticator = new Authenticator<UserSession>(sessionStorage, {
  sessionKey: "sessionId",
})

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const name = form.get("name")?.toString()
    const email = form.get("email")?.toString()
    const url = form.get("url")?.toString()
    invariant(email, "Email is required")

    const sub = await upsertSubscriber({
      email,
      name,
      url,
    })
    invariant(sub, "Could not create subscriber")

    const prismaUser = await prisma.user.findUnique({
      where: {
        email: sub.data.email,
      },
    })

    const user = prismaUser
      ? prismaUser
      : await prisma.user.create({
          data: {
            email: sub.data.email,
            name: name ?? sub.data.metadata?.name ?? undefined,
            role: "USER",
          },
        })

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  }),
  "buttondown"
)
