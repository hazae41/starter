/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

const events: Record<string, (event: Event) => void> = {}

const loaded = Promise.withResolvers<void>()

self.addEventListener("install", (event) => event.waitUntil(loaded.promise.then(() => events.oninstall?.(event))))
self.addEventListener("activate", (event) => event.waitUntil(loaded.promise.then(() => events.onactivate?.(event))))
self.addEventListener("fetch", (event) => event.waitUntil(loaded.promise.then(() => events.onfetch?.(event))))
self.addEventListener("message", (event) => event.waitUntil(loaded.promise.then(() => events.onmessage?.(event))))

async function load() {
  const request = new Request("/service.worker.module.js");
  const response = await caches.match(request);

  if (!response?.ok)
    return

  const esm = await response.text()

  const lines = esm.split(/[;\n]/)

  const prelude = lines.slice(0, -3)
  const finaler = lines[lines.length - 3]

  const iife = `(async (events) => { ${prelude.join(";")}; return ${finaler.replaceAll("export default ", "")}; })`

  await globalThis["eval"](iife)(events)

  loaded.resolve()

  return
}

load().catch(console.error)