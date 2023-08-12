// http://localhost:3000/content

import {
  json,
  redirect,
  type LoaderArgs,
  type V2_MetaFunction,
} from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { getEmail } from "~/buttondown.server.ts"
import { marked } from "marked"
import { cachified } from "~/cache.server.ts"

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.content?.subject,
  },
]

export async function loader({ request, params }: LoaderArgs) {
  const id = params.id
  if (!id) {
    throw redirect("/content")
  }

  const compiled = await cachified({
    key: `compiled_email:${id}`,
    async getFreshValue() {
      const content = await getEmail({ id })
      if (content.code === "success") {
        return {
          ...content.data,
          body: marked(content.data.body),
        }
      }
      return null
    },
  })

  if (compiled) {
    return json({
      content: compiled,
    })
  }

  throw redirect("/content")
}

export default function Content() {
  const { content } = useLoaderData<typeof loader>()

  return (
    <div className="bg-gray-900  text-white pt-10 sm:pt-16 lg:pt-8 lg:pb-14">
      <div className="mx-auto max-w-7xl px-8">
        <div className="flex font-medium gap-x-4">
          <Link
            to="/"
            className="text-sky-400 hover:text-sky-500 hover:underline"
          >
            Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link
            to="/content"
            className="text-sky-400 hover:text-sky-500 hover:underline"
          >
            Content
          </Link>
          <span className="text-gray-400">/</span>
          <h1>{content.subject}</h1>
        </div>
        <article
          key={content.id}
          className="mt-12 prose prose-invert prose-xl"
          dangerouslySetInnerHTML={{ __html: content.body }}
        />
      </div>
    </div>
  )
}
