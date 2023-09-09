import type { Yoga as RawYoga } from 'yoga-wasm-web'

export type YogaDimen = number | 'auto' | `${number}%`

export class Yoga {
  private static instance: RawYoga

  static async load() {
    const { default: initYoga } = await import('yoga-wasm-web/asm')
    Yoga.instance = initYoga()
  }

  static node() {
    return this.instance.Node.create()
  }
}
