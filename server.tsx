import { ReactNode } from "react";
import { prerender } from "react-dom/static";

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
  Deno.removeSync("./out", { recursive: true })

  const result = await Deno.bundle({ entrypoints: ["./src/mods/app/index.html"], outputDir: "./out", format: "esm", write: false });

  const document = result.outputFiles?.find(file => file.path.endsWith(".html"))

  if (document == null)
    throw new Error("No HTML output found")

  const script = result.outputFiles?.find(file => file.path.endsWith(".js"))

  Deno.mkdirSync("./out", { recursive: true })

  if (script == null)
    return void Deno.writeTextFileSync(document.path, document.text())

  Deno.writeTextFileSync(script.path, script.text())

  await import(script.path)

  if (App == null)
    return void Deno.writeTextFileSync(document.path, document.text())

  const content = await renderToString(<App />)

  const output = document.text().replaceAll("<app />", content)

  Deno.writeTextFileSync(document.path, output)
})()

close()