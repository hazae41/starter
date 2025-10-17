/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

const events: Record<string, (event: Event) => void> = {}

const loaded = Promise.withResolvers<void>()

self.addEventListener("install", (event) => event.waitUntil(loaded.promise.then(() => events.oninstall?.(event))))
self.addEventListener("activate", (event) => event.waitUntil(loaded.promise.then(() => events.onactivate?.(event))))
self.addEventListener("fetch", (event) => event.waitUntil(loaded.promise.then(() => events.onfetch?.(event))))
self.addEventListener("message", (event) => event.waitUntil(loaded.promise.then(() => events.onmessage?.(event))))

const cache = await caches.open("/")

async function install() {
  const manifest = await get("/manifest.json").then(r => r.text()).then(JSON.parse)

  for (const url in manifest.files) {
    // 
  }

  await self.skipWaiting()
}

async function get(request: string) {
  const cached = await cache.match(request)

  if (cached != null)
    return cached

  const fetched = await fetch(request)

  if (!fetched.ok)
    throw new Error(`Failed to fetch ${request}`, { cause: fetched })

  cache.put(request, fetched.clone())

  return fetched
}

async function load() {
  const esm = await get("/service.worker.module.js").then(r => r.text());

  const lines = esm.split(/[;\n]/)

  const prelude = lines.slice(0, -3)
  const finaler = lines[lines.length - 3]

  const iife = `(async (events) => { ${prelude.join(";")}; return ${finaler.replaceAll("export default ", "")}; })`

  await globalThis["eval"](iife)(events)

  loaded.resolve()

  return
}

load().catch(console.error)