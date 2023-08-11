// app/env.server.ts
import { z, TypeOf } from "zod"
import chalk from "chalk"

const zodEnv = z.object({
  // Database
  DATABASE_URL: z.string(),
  // Auth
  SESSION_SECRET: z.string(),
  // Buttondown
  BUTTONDOWN_API_KEY: z.string(),
})

declare global {
  namespace NodeJS {
    interface ProcessEnv extends TypeOf<typeof zodEnv> {}
  }
}

try {
  zodEnv.parse(process.env)
} catch (err) {
  if (err instanceof z.ZodError) {
    const { fieldErrors } = err.flatten()
    const errorMessage = Object.entries(fieldErrors)
      .map(([field, errors]) =>
        errors ? `${field}: ${errors.join(", ")}` : field
      )
      .join("\n  ")
    console.error(
      chalk.red(`Missing environment variables:\n  ${errorMessage}`)
    )
    process.exit(1)
  }
}
