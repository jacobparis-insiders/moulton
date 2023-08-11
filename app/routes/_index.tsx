// http://localhost:3000/

import dotStylesheetHref from "~/styles/dot.css"

import type { LinksFunction } from "@remix-run/node"

import { ExternalLink } from "~/components/ExternalLink.tsx"
import { SubscribeForm } from "./subscribe.tsx"

import { useRootLoaderData } from "~/root.tsx"
import { Link } from "@remix-run/react"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: dotStylesheetHref },
]

export default function Index() {
  const { user, subscriber } = useRootLoaderData()

  return (
    <div className="bg-gray-900  text-white pt-10 sm:pt-16 lg:pt-8 lg:pb-14">
      <div className="mx-auto max-w-7xl px-8">
        <h1 className="text-4xl font-extrabold tracking-tight  sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
          <span className="block bg-gradient-to-r from-teal-200 to-cyan-400 bg-clip-text pb-3 text-transparent sm:pb-5">
            Moulton
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

              {user ? (
                <div className="relative">
                  <div className="sm:mx-auto lg:mx-0 min-w-[20rem] bg-glass px-8 py-4 border-slate-700 border rounded-lg overflow-hidden">
                    {subscriber.type === "regular" ? (
                      <>
                        <h2 className="text-2xl font-bold">
                          You&rsquo;re subscribed!
                        </h2>
                        <p className="mt-2">
                          When the next newsletter is ready, it'll be sent to{" "}
                          <strong>{user.email}</strong>
                        </p>
                      </>
                    ) : subscriber.type === "unactivated" ? (
                      <>
                        <h2 className="text-2xl font-bold">
                          Check your email!
                        </h2>
                        <p className="mt-2">
                          You still need to{" "}
                          <Link
                            to="/subscribe/success"
                            className="text-sky-400 hover:text-sky-500 hover:underline"
                          >
                            confirm your email
                          </Link>{" "}
                          before you&rsquo;ll start getting the newsletter.
                        </p>
                      </>
                    ) : subscriber.type === "unsubscribed" ? (
                      <>
                        <h2 className="text-2xl font-bold">
                          You&rsquo;re unsubscribed!
                        </h2>
                        <p className="mt-2">
                          Thanks for subscribing to the Moulton newsletter!
                          You'll be hearing from me soon.
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="text-2xl font-bold">
                          There might be an issue with your subscription
                        </h2>
                        <p className="mt-2">
                          Thanks for subscribing to the Moulton newsletter!
                          You'll be hearing from me soon.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="relative pl-12">
                  <SubscribeForm />
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
