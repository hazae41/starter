import esbuild from "esbuild";
import { Document, Window } from "happy-dom";
import { readFileSync } from "node:fs";
import path from "node:path";

const entrypoints = ["./src/mods/app/index.html", "./src/mods/app/test/index.html"]

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

export async function* bundle(scripts: string[]) {
  if (typeof Deno !== "undefined") {
    const result = await Deno.bundle({
      entrypoints: scripts,
      format: "esm",
      outputDir: "./dist",
      codeSplitting: true,
      minify: true,
      write: false
    })

    for (const warning of result.warnings)
      console.warn(warning)

    for (const error of result.errors)
      console.error(error)

    if (result.errors.length)
      throw new Error("Build failed")

    if (result.outputFiles == null)
      throw new Error("No output files")

    for (const file of result.outputFiles)
      yield { path: file.path, text: file.text(), hash: file.hash }

    return
  } else {
    const result = await esbuild.build({
      entryPoints: scripts,
      bundle: true,
      format: "esm",
      outdir: "./dist",
      splitting: true,
      write: false
    })

    for (const warning of result.warnings)
      console.warn(warning)

    for (const error of result.errors)
      console.error(error)

    if (result.errors.length)
      throw new Error("Build failed")

    if (result.outputFiles == null)
      throw new Error("No output files")

    for (const file of result.outputFiles)
      yield { path: file.path, text: file.text, hash: file.hash }

    return
  }
}

const outputs = new Array<{ path: string, text: string, hash: string }>()

for await (const output of bundle(scripts)) {
  console.log(output.path)

  outputs.push(output)
}

for (const entrypoint of entrypoints) {
  const window = windows.get(entrypoint)!
  const document = documents.get(entrypoint)!

  for (const element of document.querySelectorAll("script[type=bundle]")) {
    const script = element as unknown as HTMLScriptElement

    if (script.src) {
      const url = new URL(script.src)

      if (url.protocol === "file:") {
        // const sibling = path.join(path.dirname(url.pathname), `${path.basename(url.pathname, ".ts")}.js`)
      } else {
        // TODO
      }
    } else {
      // TODO
    }
  }
}