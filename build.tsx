import { basename, dirname, extname, normalize, relative, } from "@std/path";
import React, { ReactNode } from "react";
import { prerender } from "react-dom/static.browser";

React;

declare global {
  var App: unknown
}

async function renderToString(node: ReactNode) {
  using stack = new DisposableStack()

  const stream = await prerender(node)
  const reader = stream.prelude.getReader()

  stack.defer(() => reader.releaseLock())

  let html = ""

  for (let result = await reader.read(); !result.done; result = await reader.read())
    html += new TextDecoder().decode(result.value)

  return html
}

await (async () => {
  const entrypoints = [
    "./src/mods/app/index.html",
    "./src/mods/app/test/index.html"
  ]

  const prerenders = new Map<string, string>()

  for (const entrypoint of entrypoints) {
    const prebundle = await Deno.bundle({ entrypoints: [entrypoint], outputDir: "./out", write: false, external: ["react"], format: "esm" })

    if (prebundle.outputFiles == null)
      throw new Error("No output files found")

    for (const document of prebundle.outputFiles) {
      if (!document.path.endsWith(".html"))
        continue
      globalThis.App = undefined

      for (const script of prebundle.outputFiles) {
        if (!script.path.endsWith(".js"))
          continue
        const file = Deno.makeTempFileSync()

        Deno.writeTextFileSync(file, script.text())

        await import(file)

        if (App == null)
          continue

        const rendered = await renderToString(<App />)

        prerenders.set(document.path, rendered)

        break
      }

      break
    }
  }

  const bundle = await Deno.bundle({ entrypoints, outputDir: "./out", write: false });

  if (bundle.outputFiles == null)
    throw new Error("No output files found")

  const files = new Set<{ path: string; text: string }>()

  for (const file of bundle.outputFiles)
    files.add({ path: file.path, text: file.text() })

  for (const referee of files) {
    const type = extname(referee.path)
    const name = basename(referee.path, type)

    const original = name + type
    const replaced = name.split("-")[0] + type

    for (const referer of files) {
      if (referer.path === referee.path)
        continue
      const target = normalize(relative(dirname(referer.path), referee.path))
      const needle = `"${target.startsWith(".") ? target : `./${target}`}"`

      if (!referer.text.includes(needle))
        continue
      referer.text = referer.text.replaceAll(needle, needle.replaceAll(original, replaced))
    }

    referee.path = referee.path.replaceAll(original, replaced)
  }

  try {
    Deno.removeSync("./out", { recursive: true })
  } catch {
    // NOOP
  }

  for (const file of files) {
    Deno.mkdirSync(dirname(file.path), { recursive: true })

    const prerender = prerenders.get(file.path)

    if (prerender != null)
      Deno.writeTextFileSync(file.path, file.text.replaceAll("<app />", prerender))
    else
      Deno.writeTextFileSync(file.path, file.text)

    continue
  }
})()

close()