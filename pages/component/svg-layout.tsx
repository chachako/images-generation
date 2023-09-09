// import React from 'react'
// import type { YogaDimen } from '../util/yoga.ts'
// import { Yoga } from '../util/yoga.ts'
// import type { ReactHtmlChild } from '../util/react.js'
//
// export default function SvgLayout(props: React.SVGAttributes<SVGSVGElement>) {
//   const { width, height, children, ...rest } = props
//
//   const root = Yoga.node()
//   if (width) root.setWidth(width as YogaDimen)
//   else root.setWidthAuto()
//   if (height) root.setHeight(height as YogaDimen)
//   else root.setHeightAuto()
//
//   // const { type, props } = children
//
//   React.Children.forEach(children, processChild)
//
//   return (
//     <svg
//       width={props.width ?? 100}
//       height={props.height ?? 100}
//       xmlns='http://www.w3.org/2000/svg'{...rest}>{children}</svg>
//   )
// }
//
// function processChild(child: ReactHtmlChild) {
//   // const { style } = child.props
// }
