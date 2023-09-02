import opentype from '@shuding/opentype.js'
import type { SVGAttributes } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

export class Font {
  instance: opentype.Font

  constructor(data: Buffer | ArrayBuffer) {
    this.instance = opentype.parse(
      // Buffer to ArrayBuffer.
      'buffer' in data
        ? data.buffer.slice(
          data.byteOffset,
          data.byteOffset + data.byteLength,
        )
        : data,
      // @ts-expect-error
      { lowMemory: true },
    )
  }

  /**
   * Measure the width of the specified text.
   *
   * @param text to measure
   * @param options font options
   * @returns width of the text
   */
  getTextWidth(text: string, options?: TextOptions | null) {
    const fontSize = options.fontSize || 72
    const kerning = 'kerning' in options ? options.kerning : true
    const fontScale = 1 / this.instance.unitsPerEm * fontSize

    let width = 0
    const glyphs = this.instance.stringToGlyphs(text)
    for (let i = 0; i < glyphs.length; i++) {
      const glyph = glyphs[i]

      if (glyph.advanceWidth)
        width += glyph.advanceWidth * fontScale

      if (kerning && i < glyphs.length - 1) {
        const kerningValue = this.instance.getKerningValue(glyph, glyphs[i + 1])
        width += kerningValue * fontScale
      }

      if (options.letterSpacing)
        width += options.letterSpacing * fontSize
      else if (options.tracking)
        width += (options.tracking / 1000) * fontSize
    }
    return width
  }

  /**
   * Measure the height of the font.
   *
   * @param fontSize to measure with
   * @returns height of the font
   */
  getTextHeight(fontSize: number) {
    const fontScale = 1 / this.instance.unitsPerEm * fontSize
    return (this.instance.ascender - this.instance.descender) * fontScale
  }

  /**
   * Measure the text metrics.
   *
   * @param text to measure
   * @param options font options
   */
  getTextMetrics(text: string, options?: TextOptions | null) {
    const fontSize = options.fontSize || 72
    const kerning = 'kerning' in options ? options.kerning : true
    const letterSpacing = 'letterSpacing' in options ? options.letterSpacing : 0
    const tracking = 'tracking' in options ? options.tracking : 0

    const width = this.getTextWidth(text, options)
    const height = this.getTextHeight(fontSize)

    const fontScale = 1 / this.instance.unitsPerEm * fontSize
    const ascender = this.instance.ascender * fontScale
    const descender = this.instance.descender * fontScale
    const baseline = ascender

    const path = this.instance.getPath(
      text,
      0,
      baseline,
      fontSize,
      { kerning, letterSpacing, tracking },
    )

    const d = path.toPathData(1)
    const svgPath = renderToStaticMarkup(<path {...options.attributes} d={d} />)

    return {
      x: 0,
      y: 0,
      baseline,
      width,
      height,
      ascender,
      descender,
      svgPath,
    }
  }
}

export interface TextOptions {
  /**
   * Horizontal position of the beginning of the text.
   * @default 0
   */
  x?: number | null | undefined

  /**
   * Vertical position of the baseline of the text.
   * @default 0
   */
  y?: number | null | undefined

  /**
   * Size of the text.
   * @default 72
   */
  fontSize?: number | null | undefined

  /**
   * If true takes kerning information into account.
   * @default true
   */
  kerning?: boolean | null | undefined

  /**
   * Letter-spacing value in em.
   */
  letterSpacing?: number | null | undefined

  /**
   * Tracking value in (em / 1000).
   */
  tracking?: number | null | undefined

  /**
   * Key-value pairs of attributes for `<path>` element.
   */
  attributes?: SVGAttributes<SVGPathElement> | null | undefined
}
