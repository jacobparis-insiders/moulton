// http://localhost:3000/

import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import { type V2_MetaFunction, type LoaderArgs, json } from "@remix-run/node"
import { Form, useActionData } from "@remix-run/react"
import dotStylesheetHref from "~/styles/dot.css"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: dotStylesheetHref },
]

import type { ActionArgs, LinksFunction } from "@remix-run/node"

import { z } from "zod"
import { ExternalLink } from "~/components/ExternalLink.tsx"

export const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string(),
})
export function useSubscribeActionData() {
  return useActionData<typeof action>()
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const submission = await parse(formData, { schema: subscribeSchema })
  if (!submission.value) {
    return json({ status: "error", submission }, { status: 400 })
  }

  return json({ status: "success", submission }, { status: 201 })
}

export default function Index() {
  const actionData = useActionData<typeof action>()
  console.log(actionData)
  return (
    <div className="bg-gray-900  text-white pt-10 sm:pt-16 lg:pt-8 lg:pb-14">
      <div className="mx-auto max-w-7xl px-8">
        <h1 className="text-4xl font-extrabold tracking-tight  sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
          <span className="block bg-gradient-to-r from-teal-200 to-cyan-400 bg-clip-text pb-3 text-transparent sm:pb-5">
            Moulton
          </span>
        </h1>

        {actionData?.status === "success" ? (
          <>
            <h2 className="text-2xl sm:text-3xl mt-12">
              Not done yet – check your email!
            </h2>
            <div className="prose-xl prose-invert mt-12">
              <p>
                There's one more thing you need to do before you'll start
                getting emails.{" "}
              </p>

              <ul className="list-disc ml-8">
                <li> Check your inbox for an email from readmoulton.com. </li>
                <li> Click the confirmation link in that email. </li>
                <li> If you don't see the email, check your spam folder. </li>
                <li>
                  Optional: Add <strong>hi@readmoulton.com</strong> to your
                  contacts so you don't miss any emails.
                </li>
              </ul>

              <p>Once you do that, you'll be on the list!</p>

              <p>
                By the way, if you have any feedback or ideas you'd like to
                share with the Remix community, I'd love to hear from you.
              </p>

              <p>
                Shoot me an email or reply to any of my emails and let me know
                your thoughts!
              </p>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl sm:text-3xl mt-12">
              Keep up on everything new in the Remix Community
            </h2>
            <section className="bg-gray-900 mt-12">
              <div className="relative">
                <div className="mt-12 absolute aria-hidden">
                  <div className="flex">
                    <div className="relative h-[250px] w-[250px]">
                      <span className="dot" />
                    </div>
                    <div className="relative h-[250px] w-[250px]">
                      <span className="dot" />
                    </div>
                  </div>
                  <div className="flex">
                    <div className="relative h-[250px] w-[250px]">
                      <span className="dot" />
                    </div>
                    <div className="relative h-[250px] w-[250px]">
                      <span className="dot" />
                    </div>
                  </div>
                </div>

                <div className="relative mx-auto max-w-[30rem]">
                  <SubscribeForm />
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
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
      action="/subscribed"
      method="post"
      className="sm:mx-auto lg:mx-0 min-w-[20rem] bg-glass px-8 py-4 border-slate-700 border rounded-lg overflow-hidden"
      {...form.props}
    >
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
