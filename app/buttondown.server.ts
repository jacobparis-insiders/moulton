import { cachified } from "./cache.server.js"
import { z } from "zod"
const baseUrl = "https://api.buttondown.email"

const userSchema = z.object({
  id: z.string(),
  email: z.string(),
  notes: z.string(),
  metadata: z.object({
    name: z.string().optional(),
  }),
  tags: z.array(z.string()),
  referrer_url: z.string(),
  creation_date: z.string(),
  secondary_id: z.number(),
  subscriber_type: z.string(),
  source: z.string(),
  utm_campaign: z.string(),
  utm_medium: z.string(),
  utm_source: z.string(),
  referral_code: z.string(),
  avatar_url: z.string(),
  stripe_customer_id: z.string().nullable(),
  unsubscription_date: z.string().nullable(),
  churn_date: z.string().nullable(),
  unsubscription_reason: z.string(),
  transitions: z.array(z.object({})),
})

export async function createSubscriber({
  email,
  name,
}: {
  email: string
  name?: string
}) {
  const response = await fetchButtondown(`/v1/subscribers`, {
    method: "post",
    body: JSON.stringify({
      email,
      metadata: {
        name,
      },
      tags: ["test"],
    }),
  })

  try {
    if (response.ok) {
      return {
        code: "success" as const,
        data: userSchema.parse(response.data),
      }
    } else {
      return z
        .discriminatedUnion("code", [
          z.object({
            code: z.literal("email_already_exists"),
            detail: z.string(),
            metadata: z.object({
              subscriber_id: z.string(),
            }),
          }),
        ])
        .parse(response.error)
    }
  } catch (error) {
    console.error("Error creating subscriber")
    console.log(JSON.stringify(response, null, 2))
    return {
      code: "error" as const,
      detail: error,
    }
  }
}

export async function getSubscriber({ email }: { email: string }) {
  const response = await cachified({
    key: `subscriber:${email}`,
    ttl: 1000 * 60,
    staleWhileRevalidate: 1000 * 60 * 5,
    async getFreshValue() {
      return fetchButtondown(`/v1/subscribers/${email}`, {
        method: "GET",
      })
    },
  })

  try {
    if (response.ok) {
      return {
        code: "success" as const,
        data: userSchema.parse(response.data),
      }
    } else {
      return z
        .discriminatedUnion("code", [
          z.object({
            code: z.literal("not_found"),
            detail: z.string(),
          }),
        ])
        .parse(response.error)
    }
  } catch (error) {
    console.error("Error getting subscriber", response)
    return {
      code: "error" as const,
    }
  }
}

export async function upsertSubscriber({
  email,
  name,
}: {
  email: string
  name?: string
}) {
  const sub = await getSubscriber({ email: email.toString() })

  if (sub.code !== "success") {
    const newSub = await createSubscriber({
      email,
      name,
    })

    if (newSub.code === "email_already_exists") {
      throw new Error("Transaction error: email already exists")
    }
  } else {
    return sub
  }
}
export async function resendConfirmationEmail({ email }: { email: string }) {
  const response = await fetchButtondown(
    `/v1/subscribers/${email}/send-reminder`,
    {
      method: "POST",
    }
  )

  if (response.ok) {
    return {
      code: "success" as const,
    }
  }

  return {
    code: "error" as const,
  }
}

async function fetchButtondown(
  path: string,
  options: RequestInit
): Promise<
  | {
      ok: true
      data: unknown
    }
  | {
      ok: false
      error: unknown
    }
> {
  const url = new URL(path, baseUrl)

  const response = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Token ${process.env.BUTTONDOWN_API_KEY}`,
      // ...(options.method !== "GET" && {
      //   "Content-Type": "application/json",
      // }),
      ...options.headers,
    },
  })

  const text = await response.text()

  return response.ok
    ? {
        ok: true,
        data: text ? JSON.parse(text) : {},
      }
    : {
        ok: false,
        error: text ? JSON.parse(text) : {},
      }
}
