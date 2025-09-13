import { basename, dirname, extname, normalize, relative, } from "@std/path";
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
      const target = normalize(relative(dirname(document.path), script.path))
      const needle = `"${target.startsWith(".") ? target : `./${target}`}"`

      if (!document.text.includes(needle))
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