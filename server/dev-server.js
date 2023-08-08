import { execa } from "execa"

if (process.env.NODE_ENV === "production") {
  console.log("about to import prod")
  await import("./index.js")
} else {
  const command =
    'tsx watch --clear-screen=false --ignore "app/**" --ignore "build/**" --ignore "node_modules/**" --inspect ./index.js'
  console.log("about to import dev", process.cwd())

  execa(command, {
    stdio: ["ignore", "inherit", "inherit"],
    shell: true,
    env: {
      FORCE_COLOR: true,
      ...process.env,
    },
    // https://github.com/sindresorhus/execa/issues/433
    windowsHide: false,
  })
}
