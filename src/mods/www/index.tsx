import { log } from "@/libs/log/mod.ts";
import { Rewind } from "@hazae41/rewind";
import React, { ReactNode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";

React;

function Page() {
  useEffect(() => {
    log("Hello world")
  }, [])

  return <div className="text-2xl font-sans">
    Hello world
  </div>
}

// deno-lint-ignore no-process-global
if (process.env.PLATFORM === "browser") {
  await new Rewind(document).hydrateOrThrow().then(() => hydrateRoot(document.body, <Page />))
} else {
  const prerender = async (node: ReactNode) => {
    const ReactDOM = await import("react-dom/static")

    using stack = new DisposableStack()

    const stream = await ReactDOM.default.prerender(node)
    const reader = stream.prelude.getReader()

    stack.defer(() => reader.releaseLock())

    let html = ""

    for (let result = await reader.read(); !result.done; result = await reader.read())
      html += new TextDecoder().decode(result.value)

    return html
  }

  document.body.innerHTML = await prerender(<Page />)

  await new Rewind(document).prerenderOrThrow()
}