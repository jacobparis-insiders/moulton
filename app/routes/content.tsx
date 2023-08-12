// http://localhost:3000/content

import { json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { getLatestContent } from "~/buttondown.server.ts"

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  {
    title: "Moulton Content Archives",
  },
]

export async function loader({ request }: LoaderArgs) {
  const content = await getLatestContent()

  if (content.code === "success") {
    return json({
      count: content.data.count,
      results: content.data.results,
    })
  }

  return json({
    count: 0,
    results: [],
  })
}
export default function Content() {
  const { results } = useLoaderData<typeof loader>()

  return (
    <div className="bg-gray-900  text-white pt-10 sm:pt-16 lg:pt-8 lg:pb-14">
      <div className="mx-auto max-w-7xl px-8">
        <div className="prose prose-invert  prose-xl">
          <h1 className="">Content archives</h1>

          <p className="">
            {" "}
            Previous issues of the Moulton newsletter are here.
          </p>

          {results.map((result) => (
            <article key={result.id} className="mt-12  ">
              <h2>
                <Link to={`/content/${result.id}`} prefetch="viewport">
                  {result.subject}
                </Link>
              </h2>

              <p>{result.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
