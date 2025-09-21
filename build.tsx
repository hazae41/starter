import { basename, dirname, extname, normalize, relative } from "node:path";

await (async () => {
  const entrypoints = ["./src/mods/app/index.html"]

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
  } catch { /* NOOP */ }

  for (const file of files) {
    Deno.mkdirSync(dirname(file.path), { recursive: true })

    Deno.writeTextFileSync(file.path, file.text)

    continue
  }
})()

close()