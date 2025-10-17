/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope

console.log("hello world from service worker");

self.oninstall = (event) => {
  console.log("install event", event)
  event.waitUntil(self.skipWaiting());
}

self.onactivate = (event) => {
  console.log("activate event", event)
  event.waitUntil(self.clients.claim());
}

self.onfetch = (event) => {
  console.log("fetch event", event.request.url);
};