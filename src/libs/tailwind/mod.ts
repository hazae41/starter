import * as Tailwind from "tailwindcss";
import { allItemsOf } from "../dom/mod.ts";

export interface Compiler {
  build(classes: string[]): string
}

export class Rewind {

  readonly classes = new Set<string>()

  readonly styles = new Map<HTMLStyleElement, Compiler>()

  readonly observer = new MutationObserver(() => this.#recompile())

  async compile() {
    for (const element of allItemsOf(document.querySelectorAll("[class]")))
      for (const name of allItemsOf(element.classList))
        this.classes.add(name)

    for (const link of allItemsOf(document.getElementsByTagName("link"))) {
      if (link.rel !== "stylesheet")
        continue
      const source = await fetch(link.href).then(r => r.text())

      const compiler = await Tailwind.compile(source)

      const style = document.createElement("style")

      style.textContent = compiler.build([...this.classes])

      this.styles.set(style, compiler)

      link.replaceWith(style)
    }

    this.observer.observe(document, { attributes: true, attributeFilter: ["class"], subtree: true, childList: true })
  }

  #recompile() {
    const size = this.classes.size

    for (const x of allItemsOf(document.querySelectorAll("[class]")))
      for (const y of allItemsOf(x.classList))
        this.classes.add(y)

    if (size === this.classes.size)
      return

    for (const [style, compiler] of this.styles)
      style.textContent = compiler.build([...this.classes])

    return
  }

}
