/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

console.log("hello world from service worker");

self.addEventListener("install", (event) => {
  console.log("install event", event)
  event.waitUntil(self.skipWaiting());
})

self.addEventListener("activate", (event) => {
  console.log("activate event", event)
  event.waitUntil(self.clients.claim());
})

self.addEventListener("fetch", (event) => {
  console.log("fetch event", event.request.url);
});