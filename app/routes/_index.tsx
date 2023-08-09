// http://localhost:3000/

import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import { type V2_MetaFunction, type LoaderArgs, json } from "@remix-run/node"
import { Form, useActionData } from "@remix-run/react"
import dotStylesheetHref from "~/styles/dot.css"

const title = "Moulton"
const description = "A Remix Newsletter"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: dotStylesheetHref },
]

export const meta: V2_MetaFunction = () => {
  return [
    { title },
    { name: "og:title", content: title },
    { name: "description", content: description },
    { name: "og:description", content: description },
    { name: "og:image", content: "https://www.readmoulton.com/og.png" },
    { name: "og:url", content: "https://www.readmoulton.com" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: "@readmoulton" },
  ]
}

import type { ActionArgs, LinksFunction } from "@remix-run/node"

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const submission = await parse(formData, { schema: subscribeSchema })
  if (!submission.value) {
    return json({ status: "error", submission }, { status: 400 })
  }

  return json({ status: "success", submission }, { status: 201 })
}

export async function loader({ request }: LoaderArgs) {
  return null
}

import { z } from "zod"
import { ExternalLink } from "~/components/ExternalLink.tsx"

export const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string(),
})

export default function Index() {
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
    <div className="bg-gray-900  text-white pt-10 sm:pt-16 lg:pt-8 lg:pb-14">
      <div className="mx-auto max-w-7xl px-8">
        <h1 className="text-4xl font-extrabold tracking-tight  sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
          <span className="block bg-gradient-to-r from-teal-200 to-cyan-400 bg-clip-text pb-3 text-transparent sm:pb-5">
            {title}
          </span>
        </h1>

        <h2 className="text-2xl sm:text-3xl mt-12">
          Keep up on everything new in the Remix Community
        </h2>
        <section className="bg-gray-900 mt-12">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-24 max-w-5xl">
            <div className="relative z-10 font-medium">
              <div className="prose prose-invert  space-y-5 sm:prose-lg">
                <p>
                  Hey folks! It's{" "}
                  <ExternalLink href="https://twitter.com/jacobmparis">
                    Jacob Paris
                  </ExternalLink>{" "}
                  here with the Moulton newsletter.
                </p>
                <p>
                  About once per month, I send an email with the latest Remix
                  community news, including:
                </p>
                <ul>
                  <li> New guides and tutorials </li>
                  <li> Upcoming talks, meetups, and events </li>
                  <li> Cool new libraries and packages </li>
                  <li> What's new in the latest versions of Remix </li>
                </ul>
                <br />
                <p>
                  Stay up to date with everything in the Remix community by
                  <strong> entering your email below. </strong>
                </p>
              </div>
            </div>
            <div className="relative" aria-hidden>
              <div className="mt-12 absolute">
                <div className="flex">
                  <div className="relative h-[250px] w-[250px]">
                    <span className="dot" />
                  </div>
                  <aside className="relative h-[250px] w-[250px]">
                    <span className="dot" />
                  </aside>
                </div>
                <div className="flex">
                  <aside className="relative h-[250px] w-[250px]">
                    <span className="dot" />
                  </aside>
                  <aside className="relative h-[250px] w-[250px]">
                    <span className="dot" />
                  </aside>
                </div>
              </div>

              <div className="relative pl-12">
                <Form
                  method="post"
                  className="sm:mx-auto lg:mx-0 min-w-[20rem] bg-glass px-8 py-4 border-slate-700 border rounded-lg overflow-hidden"
                  {...form.props}
                >
                  <style>
                    {`.bg-glass {
              backdrop-filter: blur(0.75rem) saturate(200%) contrast(50%) brightness(130%);
              -webkit-backdrop-filter: blur(0.75rem) saturate(200%) contrast(50%) brightness(130%);
              background-color: rgba(0,0,0, 0.45);
            }`}
                  </style>
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
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
