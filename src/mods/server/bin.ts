#!/usr/bin/env node

import { createReadStream, statSync } from "node:fs";
import http from "node:http";
import path from "node:path";

const mimes: Record<string, string> = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css"
}

const port = 3000;
const root = "./out";

http.createServer((req, res) => {
  console.log(req.url)

  const wanted = path.join(root, req.url!)

  let served = wanted

  if (wanted.endsWith("/index.html")) {
    res.statusCode = 302;
    res.setHeader("Location", req.url!.slice(0, -"index.html".length));
    res.end();
    return
  }

  if (wanted.endsWith(".html")) {
    res.statusCode = 302;
    res.setHeader("Location", req.url!.slice(0, -".html".length));
    res.end();
    return
  }

  if (wanted.endsWith("/")) {
    if (statSync(served = wanted + "index.html", { throwIfNoEntry: false })?.isFile()) {
      res.setHeader("Content-Type", mimes[".html"]);
      createReadStream(served).pipe(res)
      return
    }

    if (statSync(served = wanted.slice(0, -1), { throwIfNoEntry: false })?.isFile()) {
      res.statusCode = 302;
      res.setHeader("Location", req.url!.slice(0, -1));
      res.end();
      return
    }

    if (statSync(served = wanted.slice(0, -1) + ".html", { throwIfNoEntry: false })?.isFile()) {
      res.statusCode = 302;
      res.setHeader("Location", req.url!.slice(0, -1));
      res.end();
      return
    }

    res.statusCode = 404;
    res.end("Not Found")
    return
  }

  if (statSync(wanted, { throwIfNoEntry: false })?.isFile()) {
    res.setHeader("Content-Type", mimes[path.extname(wanted)]);
    createReadStream(wanted).pipe(res)
    return
  }

  if (statSync(served = wanted + ".html", { throwIfNoEntry: false })?.isFile()) {
    res.setHeader("Content-Type", mimes[".html"]);
    createReadStream(served).pipe(res)
    return
  }

  if (statSync(served = wanted + "/index.html", { throwIfNoEntry: false })?.isFile()) {
    res.statusCode = 302;
    res.setHeader("Location", req.url! + "/");
    res.end();
    return
  }

  res.statusCode = 404;
  res.end("Not Found")
  return
}).listen(port, () => console.log(`Serving at http://localhost:${port}`));