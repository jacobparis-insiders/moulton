// http://localhost:3000/

import { cssBundleHref } from "@remix-run/css-bundle"
import tailwindCssHref from "~/styles/tailwind.css"
import {
  type LinksFunction,
  type V2_MetaFunction,
  type LoaderArgs,
  json,
} from "@remix-run/node"
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "@remix-run/react"
import { useMemo } from "react"
import { ExternalLink } from "./components/ExternalLink.tsx"
import { authenticator } from "./auth.server.ts"
import { getSubscriber } from "./buttondown.server.ts"

import type { ShouldRevalidateFunction } from "@remix-run/react"
import invariant from "tiny-invariant"

const title = "Moulton"
const description = "A Remix Newsletter"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindCssHref },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  { rel: "manifest", href: "/manifest.webmanifest" },
  { rel: "icon", href: "/favicon.ico", sizes: "any" },
  { rel: "icon", href: "/icon.svg", type: "image/svg+xml" },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon.png",
  },
]

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => [
  { title },
  { name: "og:title", content: title },
  { name: "description", content: description },
  { name: "og:description", content: description },
  { name: "og:image", content: "https://www.readmoulton.com/og.png" },
  { name: "og:url", content: "https://www.readmoulton.com" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:site", content: "@readmoulton" },
]

export async function loader({ request }: LoaderArgs) {
  const user = await authenticator.isAuthenticated(request)

  if (!user) {
    return json({ user: null, subscriber: null })
  }

  const subscriber = await getSubscriber({ email: user.email })
  if (subscriber.code !== "success") {
    throw authenticator.logout(request, { redirectTo: "/" })
  }

  return json({
    user: user,
    subscriber: {
      type: subscriber.data.subscriber_type,
    },
  })
}

export const shouldRevalidate: ShouldRevalidateFunction = () => false

export function useRootLoaderData() {
  const data = useRouteLoaderData<typeof loader>("root")
  invariant(data, "Expected data to be defined")
  return data
}

export default function App() {
  return (
    <html lang="en" className="h-full">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="h-full">
        <div className="bg-gray-900">
          <div className="relative flex min-h-screen flex-col overflow-hidden">
            <Header />
            <main className="flex-1">
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

function Header() {
  return (
    <header className="relative">
      <div className="bg-gray-900 pt-6">
        <nav
          className="relative mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6"
          aria-label="Global"
        >
          <Link to="/" className="flex items-center gap-x-8">
            <div className="flex w-full items-center justify-between md:w-auto">
              <span className="sr-only">Moulton</span>
              <img className="h-8 w-auto sm:h-10" src="/logo.svg" alt="" />
            </div>

            <div className="text-5xl font-extrabold tracking-tight  sm:mt-5">
              <span className="block bg-gradient-to-r to-teal-200 from-sky-400 bg-clip-text pb-3 text-transparent sm:pb-5">
                Moulton
              </span>
            </div>
          </Link>
        </nav>
      </div>
    </header>
  )
}

const navigation = [
  {
    name: "Twitter",
    href: "https://twitter.com/readmoulton",
    icon: (props: React.ComponentProps<"svg">) => (
      <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
]

function Footer() {
  const year = useMemo(() => getFooterYear(), [])

  return (
    <footer className="relative">
      <div className="from-transparent to-gray-900 bg-gradient-to-b py-10" />
      <div className="bg-gray-900 mx-auto max-w-7xl py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {navigation.map((item) => (
            <ExternalLink key={item.name} href={item.href}>
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </ExternalLink>
          ))}
        </div>
        <p className="text-center text-base text-gray-400">
          &copy; {year} Jacob Paris. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

function getFooterYear() {
  const startYear = new Date(2023, 8, 5).getFullYear()
  const currentYear = new Date().getFullYear()
  const isSameYear = currentYear - startYear === 0

  if (isSameYear) {
    return currentYear.toString()
  }

  return [startYear, currentYear].join(" - ")
}
