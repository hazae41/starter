export interface Items<T> {

  readonly length: number

  item(index: number): T | null

}

export function* allItemsOf<T>(items: Items<T>) {
  for (let i = 0, x = items.item(i); i < items.length && x != null; i++, x = items.item(i))
    yield x
}