import { log } from "@/libs/log/mod.ts";
import { Rewind } from "@hazae41/rewind";
import React, { ReactNode, useEffect } from "react";
import { hydrateRoot } from "react-dom/client";

React;

declare global {
  interface Uint8Array {
    toHex(): string;
  }
}

async function register(options: RegistrationOptions = {}) {
  const { scope, type } = options

  const manifest = await fetch("/manifest.json", { cache: "reload" }).then(r => r.ok ? r.bytes() : Promise.reject(r))
  const checksum = await crypto.subtle.digest("SHA-256", manifest).then(a => new Uint8Array(a).toHex().slice(0, 8))

  await navigator.serviceWorker.register(`/service.worker.js?version=${checksum}`, { type: "module", updateViaCache: "all" });
}

function Page() {
  useEffect(() => {
    log("Hello world")
  }, [])

  useEffect(() => {
    register().catch(console.error)
  }, [])

  return <div className="text-2xl font-sans">
    Hello world
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