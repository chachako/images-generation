import type { HTMLAttributes, ReactElement, ReactNode } from 'react'
import type React from 'react'

export type ReactHtmlChild<T = unknown> = React.ReactElement<HTMLAttributes<T>>

export function isReactElement(node: ReactNode): node is ReactElement {
  const type = typeof node
  return !(type === 'number'
    || type === 'bigint'
    || type === 'string'
    || type === 'boolean')
}
