import { basename, dirname } from "@std/path";
import { ReactNode } from "react";
import { prerender } from "react-dom/static";

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
  try {
    Deno.removeSync("./out", { recursive: true })
  } catch {
    // NOOP
  }

  const entrypoints = [
    "./src/mods/app/index.html",
    "./src/mods/app/test/index.html"
  ]

  const bundle = await Deno.bundle({ entrypoints, outputDir: "./out", write: false });

  if (bundle.outputFiles == null)
    throw new Error("No output files found")

  const files = new Set<{ path: string; text: string }>()

  for (const file of bundle.outputFiles)
    files.add({ path: file.path, text: file.text() })

  for (const script of files) {
    if (!script.path.endsWith(".js"))
      continue

    const original = basename(script.path)
    const replaced = original.split("-")[0] + ".js"

    script.path = script.path.replaceAll(original, replaced)

    for (const file of files) {
      if (!file.text.includes(original))
        continue
      file.text = file.text.replaceAll(original, replaced)
    }
  }

  for (const file of files) {
    Deno.mkdirSync(dirname(file.path), { recursive: true })

    if (file.path.endsWith(".html"))
      continue

    Deno.writeTextFileSync(file.path, file.text)
  }

  for (const document of files) {
    if (!document.path.endsWith(".html"))
      continue
    let output = document.text

    for (const script of files) {
      if (!script.path.endsWith(".js"))
        continue
      if (!output.includes(basename(script.path)))
        continue

      globalThis.App = undefined

      await import(script.path)

      if (App == null)
        continue

      const rendered = await renderToString(<App />)

      output = output.replaceAll("<app />", rendered)
    }

    Deno.writeTextFileSync(document.path, output)
  }
})()

close()