import esbuild from "esbuild";
import { Document, Window } from "happy-dom";
import { readFileSync } from "node:fs";
import path from "node:path";

const entrypoints = ["./src/mods/app/index.html"]

const windows = new Map<string, Window>()
const documents = new Map<string, Document>()

const scripts = new Array<string>()

for (const entrypoint of entrypoints) {
  const window = new Window({ url: "file://" + path.resolve(entrypoint) });

  windows.set(entrypoint, window)

  const document = new window.DOMParser().parseFromString(readFileSync(entrypoint, "utf8"), "text/html")

  documents.set(entrypoint, document)

  for (const element of document.querySelectorAll("script[type=bundle]")) {
    const script = element as unknown as HTMLScriptElement

    if (script.src) {
      const url = new URL(script.src)

      if (url.protocol === "file:") {
        scripts.push(url.pathname)
      } else {
        // TODO
      }
    } else {
      // TODO
    }
  }
}

if (typeof Deno !== "undefined") {
  const result = await Deno.bundle({
    entrypoints: scripts,
    format: "esm",
    outputDir: "./dist"
  })

  console.log(result)
} else {
  const result = await esbuild.build({
    entryPoints: scripts,
    bundle: true,
    format: "esm",
    outdir: "./dist",
  })

  console.log(result)
}