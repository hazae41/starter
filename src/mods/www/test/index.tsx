import { immutable } from "@hazae41/immutable";
import { Rewind } from "@hazae41/rewind";
import React, { ReactNode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";

React;

async function upgrade() {
  if (navigator.serviceWorker.controller != null)
    navigator.serviceWorker.addEventListener("controllerchange", () => location.reload())

  const { registration, update } = await immutable.serviceWorker.register("/service.worker.js", { type: "module", scope: "/", updateViaCache: "all" })

  if (update == null)
    return registration
  if (!confirm(`An update of ${location.origin} is available. Do you want to update now?`))
    return registration

  return await update()
}

function Page() {
  useEffect(() => {
    upgrade().then(console.log).catch(console.error)
  }, [])

  return <div className="text-2xl font-sans">
    Welcome to the test page
  </div>
}

// @ts-ignore: process not found
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