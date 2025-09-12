import { ReactNode } from "react";
import { prerender } from "react-dom/static";

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

const template = Deno.readTextFileSync("./index.html")
const content = await renderToString(<App />)

const document = template.replaceAll("<app />", content)

Deno.mkdirSync("./out", { recursive: true })
Deno.writeTextFileSync("./out/index.html", document)

close()