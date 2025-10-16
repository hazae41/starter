/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope
declare const events: ServiceWorkerGlobalScope

console.log("hello world from service worker");

events.oninstall = (event) => {
  console.log("install event", event)
  event.waitUntil(self.skipWaiting());
}

events.onactivate = (event) => {
  console.log("activate event", event)
  event.waitUntil(self.clients.claim());
}

events.onfetch = (event) => {
  console.log("fetch event", event.request.url);

  event.respondWith(new Response("Hello from eval service worker!"));
};