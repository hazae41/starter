import esbuild from "esbuild";
import { HTMLScriptElement, Window } from "happy-dom";
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

const entrypoints = ["./src/mods/app/index.html", "./src/mods/app/aaa/index.html", "./src/mods/app/bbb/index.html"]

function common(a: string, b: string) {
  const sa = path.resolve(a).split(path.sep)
  const sb = path.resolve(b).split(path.sep)

  let i = 0

  while (i < sa.length && i < sb.length && sa[i] === sb[i])
    i++

  return sa.slice(0, i).join(path.sep)
}

const ancestor = entrypoints.reduce((a, b) => common(a, b))

const inputs = new Array<string>()

interface Output {
  readonly path: string
  readonly text: string
  readonly hash: string
}

const resolveOnOutputs = Promise.withResolvers<Output[]>()

const promises = new Array<Promise<void>>()

for (const entrypoint of entrypoints) {
  const exitpoint = path.join("./dist", path.relative(ancestor, entrypoint))

  const window = new Window({ url: "file://" + path.resolve(entrypoint) });
  const document = new window.DOMParser().parseFromString(readFileSync(entrypoint, "utf8"), "text/html")

  const include = async function (script: HTMLScriptElement) {
    if (script.type !== "bundle")
      return

    if (script.src) {
      const url = new URL(script.src)

      if (url.protocol !== "file:")
        throw new Error("Unsupported protocol")

      const nonce = crypto.randomUUID().slice(0, 8)
      const input = path.join(path.dirname(url.pathname), `.${nonce}.${path.basename(url.pathname)}`)

      copyFileSync(url.pathname, input)

      inputs.push(input)

      try {
        const outputs = await resolveOnOutputs.promise
        const output = outputs.find(x => x.path.includes(nonce))

        if (output == null)
          throw new Error("Output not found")

        const absolute = output.path.replaceAll(`.${nonce}.`, "")
        const relative = path.relative(path.dirname(exitpoint), absolute)

        script.type = "module"
        script.src = relative.startsWith(".") ? relative : "./" + relative

        mkdirSync(path.dirname(absolute), { recursive: true })

        writeFileSync(absolute, output.text)
      } finally {
        rmSync(input)
      }
    } else {
      // TODO
    }
  }

  for (const script of document.scripts)
    promises.push(include(script))

  Promise.all(promises).then(() => {
    mkdirSync(path.dirname(exitpoint), { recursive: true })

    writeFileSync(exitpoint, document.documentElement.outerHTML)
  }).catch(console.error)

  // NOOP
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

for await (const output of bundle(inputs)) {
  mkdirSync(path.dirname(output.path), { recursive: true })

  if (path.basename(output.path).startsWith("chunk"))
    writeFileSync(output.path, output.text)

  outputs.push(output)
}

resolveOnOutputs.resolve(outputs)

await Promise.all(promises)