// import { ReactNode } from "react";
// import { prerender } from "react-dom/static";
// import App from "./src/mods/app/index.tsx";

import { ReactNode } from "react";
import { prerender } from "react-dom/static";

// async function renderToString(node: ReactNode) {
//   using stack = new DisposableStack()

//   const stream = await prerender(node)
//   const reader = stream.prelude.getReader()

//   stack.defer(() => reader.releaseLock())

//   let html = ""

//   for (let result = await reader.read(); !result.done; result = await reader.read())
//     html += new TextDecoder().decode(result.value)

//   return html
// }

// const template = Deno.readTextFileSync("./index.html")
// const content = await renderToString(<App />)

// const document = template.replaceAll("<app />", content)

// Deno.mkdirSync("./out", { recursive: true })
// Deno.writeTextFileSync("./out/index.html", document)

// close()

declare const App: (() => ReactNode) | undefined

async function renderToString(node: ReactNode) {
  using stack = new DisposableStack()

  const stream = await prerender(node)
  const reader = stream.prelude.getReader()

  stack.defer(() => reader.releaseLock())

  let html = ""

  for (let result = await reader.read(); !result.done; result = await reader.read())
    html += new TextDecoder().decode(result.value)

  return html
}

await (async () => {
  const result = await Deno.bundle({ entrypoints: ["./src/mods/app/index.html"], outputDir: "./out", format: "esm", write: false });

  const document = result.outputFiles?.find(file => file.path.endsWith(".html"))

  if (document == null)
    throw new Error("No HTML output found")

  const script = result.outputFiles?.find(file => file.path.endsWith(".js"))

  Deno.mkdirSync("./out", { recursive: true })

  if (script == null)
    return void Deno.writeTextFileSync("./out/index.html", document.text())

  Deno.writeTextFileSync("./out/index.js", script.text())

  await import("./out/index.js")

  if (App == null)
    return void Deno.writeTextFileSync("./out/index.html", document.text())

  const content = await renderToString(<App />)

  const output = document.text().replaceAll("<app />", content)

  Deno.writeTextFileSync("./out/index.html", output)
})()

close()