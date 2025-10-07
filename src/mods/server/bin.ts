#!/usr/bin/env node

import { createReadStream, existsSync } from "node:fs";
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
  const file = path.join(root, req.url === "/" ? "index.html" : req.url!);

  if (!existsSync(file)) {
    res.statusCode = 404;
    res.end("Not Found")
    return
  }

  res.setHeader("Content-Type", mimes[path.extname(file)]);

  createReadStream(file).pipe(res)
}).listen(port, () => console.log(`Serving at http://localhost:${port}`));