/// <reference lib="dom" />

import { ReactNode } from "react";
import { hydrateRoot } from "react-dom/client";
import { prerender } from "react-dom/static";

export default function App() {
  return <div className="text-2xl font-sans">Welcome</div>
}

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

if (typeof Deno !== "undefined") {
  await renderToString(<App />)
}

if (typeof Deno === "undefined") {
  hydrateRoot(document.getElementById("app")!, <App />)
} 