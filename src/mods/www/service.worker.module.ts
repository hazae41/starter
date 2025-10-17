/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope
declare const events: ServiceWorkerGlobalScope

console.log("hello world from service worker");

events.oninstall = (event) => {
  console.log("install event", event)
  event.waitUntil(install());
}

events.onactivate = (event) => {
  console.log("activate event", event)
  event.waitUntil(self.clients.claim());
}

async function respond(request: Request) {
  return new Response("Hello from eval service worker!")
}

events.onfetch = (event) => {
  console.log("fetch event", event.request.url);

  event.respondWith(respond(event.request));
};