// http://localhost:3000/subscribe

import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import { json, redirect } from "@remix-run/node"
import { Form, useActionData } from "@remix-run/react"
import dotStylesheetHref from "~/styles/dot.css"
import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
} from "@remix-run/node"

import { z } from "zod"
import { authenticator } from "~/auth.server.ts"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: dotStylesheetHref },
]

export const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string(),
})
export function useSubscribeActionData() {
  return useActionData<typeof action>()
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.clone().formData()
  const submission = await parse(formData, { schema: subscribeSchema })
  if (!submission.value) {
    return json(
      { status: "error", submission, reason: "INVALID_INPUT" } as const,
      { status: 400 }
    )
  }

  await authenticator.authenticate("buttondown", request, {
    successRedirect: "/subscribe/success",
  })

  return json(
    { status: "error", submission, reason: "ALREADY_SUBSCRIBED" } as const,
    { status: 409 }
  )
}

export async function loader({ request }: LoaderFunctionArgs) {
  return redirect("/")
}

export function SubscribeForm() {
  const actionData = useActionData<typeof action>()

  const [form, fields] = useForm({
    id: "subscribe",
    onValidate({ formData }) {
      return parse(formData, { schema: subscribeSchema })
    },
    lastSubmission: actionData?.submission,
    shouldRevalidate: "onBlur",
  })

  return (
    <Form
      reloadDocument
      action="/subscribe"
      method="post"
      className="sm:mx-auto lg:mx-0 min-w-[20rem] bg-glass px-8 py-4 border-slate-700 border rounded-lg overflow-hidden"
      {...form.props}
    >
      {actionData?.status === "error" ? (
        <div className="bg-black/60 rounded-md px-4 py-2 mb-4 text-neutral-300">
          {actionData.reason === "ALREADY_SUBSCRIBED" ? (
            <p> You&rsquo;re already subscribed! </p>
          ) : (
            <p> We weren&rsquo;t able to add you to the list. </p>
          )}
        </div>
      ) : null}

      <div className="flex flex-col gap-x-2 gap-y-6">
        <div className="flex flex-col gap-2">
          <label htmlFor={fields.name.id} className="font-medium">
            First name
          </label>
          <input
            {...conform.input(fields.name)}
            className="block w-full rounded-md border border-gray-100 px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-600"
            placeholder="Preferred name"
          />

          {fields.name.errors ? (
            <div role="alert">{fields.name.errors[0]}</div>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor={fields.email.id} className="font-medium">
            Email address
          </label>
          <input
            {...conform.input(fields.email)}
            className="block w-full rounded-md border border-gray-100 px-5 py-3 text-base text-gray-900 placeholder-gray-500 shadow-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-600"
            placeholder="you@example.com"
          />

          {fields.email.errors ? (
            <div role="alert">{fields.email.errors[0]}</div>
          ) : null}
        </div>

        <div className="">
          <button
            type="submit"
            className="block w-full rounded-md border border-transparent bg-sky-500 px-5 py-3 text-base font-medium text-white shadow hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-sky-600 sm:px-10"
          >
            Sign up today
          </button>
        </div>
      </div>
    </Form>
  )
}
