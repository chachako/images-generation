import { renderToStaticMarkup } from 'react-dom/server'
import React from 'react'
import {
  ALIGN_CENTER,
  EDGE_BOTTOM,
  EDGE_LEFT,
  EDGE_RIGHT,
  EDGE_TOP,
  FLEX_DIRECTION_ROW,
  WRAP_NO_WRAP,
} from 'yoga-wasm-web'
import * as Squircle from 'figma-squircle'
import type { NextRequest } from 'next/server.js'
import { Yoga } from '../../../util/yoga.ts'
import { Font } from '../../../util/font.tsx'
import { getFileBuffer, getFileString } from '../../../util/buffer.ts'

let font: Font

const strokeWidth = 1
const cornerRadius = 8
const cornerSmoothing = 0.6

const logos = {
  download: {
    light: '<path fill="#182544" d="M12.27 10.377c-2.081-.65-4.436-1.216-5.85-3-.098-.125-.228-.237.014-.281.53.054 1.065.036 1.57-.123-1.286-.3-2.157-1.426-2.245-2.728-.048-.3-.003-.744-.335-.887-.894-.234-1.508.657-1.678 1.428-.587-.88-1.438-1.553-2.537-1.559.097.009.184.017.252.025-.357-.049-.986-.115-1.268.076-.404.638-.075 2.611.092 3.377 1.245 5.448 7.733 8.612 12.315 4.863l-.015-.049.586-.536c.306-.279-.751-.56-.9-.606Z"/><path fill="url(#a)" d="M15.828 3.353c-.359-.194-.858-.164-1.241-.107-1.012.062-1.78.736-2.325 1.54-.15-.474-.322-.983-.764-1.269-.29-.171-.933-.363-1.127.043-.187.7-.153 1.476-.557 2.115-1.162 1.843-4.1 1.892-5.554.37.344 3.541 2.749 6.357 6.389 6.656 3.577-1.37 5.714-5.445 5.3-9.17a.232.232 0 0 0-.121-.178Z"/><defs><linearGradient id="a" x1="15.987" x2="9.566" y1="3.2" y2="12.7" gradientUnits="userSpaceOnUse"><stop stop-color="#C75EF8"/><stop offset="1" stop-color="#5744C6"/></linearGradient></defs>',
    dark: '<path fill="#F0D0FF" fill-opacity=".4" d="M12.27 10.377c-2.081-.65-4.436-1.216-5.85-3-.098-.125-.228-.237.014-.281.53.054 1.065.036 1.57-.123-1.286-.3-2.157-1.426-2.245-2.728-.048-.3-.003-.744-.335-.887-.894-.234-1.508.657-1.678 1.428-.587-.88-1.438-1.553-2.537-1.559.097.009.184.017.252.025-.357-.049-.986-.115-1.268.076-.404.638-.075 2.611.092 3.377 1.245 5.448 7.733 8.612 12.315 4.863l-.015-.049.586-.536c.306-.279-.751-.56-.9-.606Z"/><path fill="url(#a)" d="M15.828 3.353c-.359-.194-.858-.164-1.241-.107-1.012.062-1.78.736-2.325 1.54-.15-.474-.322-.983-.764-1.269-.29-.171-.933-.363-1.127.043-.187.7-.153 1.476-.557 2.115-1.162 1.843-4.1 1.892-5.554.37.344 3.541 2.749 6.357 6.389 6.656 3.577-1.37 5.714-5.445 5.3-9.17a.232.232 0 0 0-.121-.178Z"/><defs><linearGradient id="a" x1="15.987" x2="9.566" y1="3.2" y2="12.7" gradientUnits="userSpaceOnUse"><stop stop-color="#C75EF8"/><stop offset="1" stop-color="#5744C6"/></linearGradient></defs>',
  },
  sync: {
    light: '<path fill="url(#a)" d="M12.991 2.15a2.536 2.536 0 0 0-1.386.66.247.247 0 0 0-.078.173c0 .066.027.129.073.176l.315.326a.242.242 0 0 0 .316.023c.251-.19.557-.291.87-.29a1.452 1.452 0 0 1 1.031 2.48C12.12 7.714 9.431 2.072 3.33 4.974a.83.83 0 0 0-.37 1.162l1.046 1.81a.83.83 0 0 0 1.121.308l.026-.015-.02.015.464-.26a10.63 10.63 0 0 0 1.459-1.091.257.257 0 0 1 .334 0 .236.236 0 0 1 .092.185.244.244 0 0 1-.08.184c-.479.425-.994.807-1.54 1.142h-.014l-.464.26A1.334 1.334 0 0 1 3.59 8.18L2.6 6.47C.703 7.813-.45 10.398.169 13.677a.244.244 0 0 0 .237.196h1.127a.24.24 0 0 0 .238-.21 1.65 1.65 0 0 1 3.274 0 .242.242 0 0 0 .24.21h1.098a.24.24 0 0 0 .238-.21 1.652 1.652 0 0 1 3.276 0 .24.24 0 0 0 .238.21h1.084a.24.24 0 0 0 .241-.236c.026-1.528.438-3.284 1.613-4.163 4.07-3.045 3-5.655 2.059-6.603a2.537 2.537 0 0 0-2.14-.72Zm-2.405 4.458a.488.488 0 0 1 .393.871v-.003l-.776-.39a.488.488 0 0 1 .383-.478Z"/><defs><linearGradient id="a" x1="0" x2="16" y1="1.778" y2="14.222" gradientUnits="userSpaceOnUse"><stop stop-color="#36CAA6"/><stop offset="1" stop-color="#10A0CD"/></linearGradient></defs>',
    dark: '<path fill="url(#a)" d="M12.991 2.15a2.536 2.536 0 0 0-1.386.66.247.247 0 0 0-.078.173c0 .066.027.129.073.176l.315.326a.242.242 0 0 0 .316.023c.251-.19.557-.291.87-.29a1.452 1.452 0 0 1 1.031 2.48C12.12 7.714 9.431 2.072 3.33 4.974a.83.83 0 0 0-.37 1.162l1.046 1.81a.83.83 0 0 0 1.121.308l.026-.015-.02.015.464-.26a10.63 10.63 0 0 0 1.459-1.091.257.257 0 0 1 .334 0 .236.236 0 0 1 .092.185.244.244 0 0 1-.08.184c-.479.425-.994.807-1.54 1.142h-.014l-.464.26A1.334 1.334 0 0 1 3.59 8.18L2.6 6.47C.703 7.813-.45 10.398.169 13.677a.244.244 0 0 0 .237.196h1.127a.24.24 0 0 0 .238-.21 1.65 1.65 0 0 1 3.274 0 .242.242 0 0 0 .24.21h1.098a.24.24 0 0 0 .238-.21 1.652 1.652 0 0 1 3.276 0 .24.24 0 0 0 .238.21h1.084a.24.24 0 0 0 .241-.236c.026-1.528.438-3.284 1.613-4.163 4.07-3.045 3-5.655 2.059-6.603a2.537 2.537 0 0 0-2.14-.72Zm-2.405 4.458a.488.488 0 0 1 .393.871v-.003l-.776-.39a.488.488 0 0 1 .383-.478Z"/><defs><linearGradient id="a" x1="0" x2="16" y1="1.778" y2="14.222" gradientUnits="userSpaceOnUse"><stop stop-color="#54C6AA"/><stop offset="1" stop-color="#34A0C2"/></linearGradient></defs>',
  },
  tests: {
    light: '<path fill="url(#a)" d="M8 .82a7.05 7.05 0 0 0-2.229 13.74c.352.062.484-.15.484-.335 0-.167-.008-.723-.008-1.313-1.772.326-2.23-.432-2.371-.829a2.563 2.563 0 0 0-.723-.996c-.246-.132-.599-.458-.009-.466a1.41 1.41 0 0 1 1.084.722 1.507 1.507 0 0 0 2.053.582c.03-.359.19-.694.45-.943-1.568-.177-3.208-.784-3.208-3.481-.01-.7.249-1.379.723-1.895a2.534 2.534 0 0 1 .07-1.868s.59-.185 1.94.722a6.646 6.646 0 0 1 3.524 0c1.348-.916 1.94-.722 1.94-.722.26.59.285 1.259.07 1.868.475.515.734 1.194.722 1.895 0 2.705-1.648 3.304-3.217 3.48a1.67 1.67 0 0 1 .476 1.305c0 .943-.008 1.701-.008 1.939 0 .185.132.405.484.335A7.053 7.053 0 0 0 8 .82Z"/><defs><linearGradient id="a" x1="1" x2="15" y1="1" y2="15" gradientUnits="userSpaceOnUse"><stop stop-color="#606F95"/><stop offset="1" stop-color="#535C71"/></linearGradient></defs>',
    dark: '<path fill="url(#a)" d="M8.5.82a7.05 7.05 0 0 0-2.229 13.74c.352.062.484-.15.484-.335 0-.167-.008-.723-.008-1.313-1.772.326-2.23-.432-2.371-.829a2.563 2.563 0 0 0-.723-.996c-.246-.132-.599-.458-.009-.466a1.41 1.41 0 0 1 1.084.722 1.507 1.507 0 0 0 2.053.582c.03-.359.19-.694.45-.943-1.568-.177-3.208-.784-3.208-3.481-.01-.7.249-1.379.723-1.895a2.534 2.534 0 0 1 .07-1.868s.59-.185 1.94.722a6.646 6.646 0 0 1 3.524 0c1.348-.916 1.94-.722 1.94-.722.26.59.285 1.259.07 1.868.475.515.734 1.194.722 1.895 0 2.705-1.648 3.304-3.217 3.48a1.67 1.67 0 0 1 .476 1.305c0 .943-.008 1.701-.008 1.939 0 .185.132.405.484.335A7.053 7.053 0 0 0 8.5.82Z"/><defs><linearGradient id="a" x1="1" x2="16" y1="1" y2="15" gradientUnits="userSpaceOnUse"><stop stop-color="#DAE1F2"/><stop offset="1" stop-color="#AAB4CD"/></linearGradient></defs>',
  },
}

const titles = {
  download: 'Download',
  sync: 'Sync Upstream',
  tests: 'CI Tests',
}

const colors = {
  download: { light: '#352363', dark: '#D5CEE0' },
  sync: { light: '#245457', dark: '#C8DBDC' },
  tests: { light: '#3A4359', dark: '#C8DBDC' },
}

const shadows = {
  download: { light: '#b78fe8', dark: '#9252E0' },
  sync: { light: '#79d7d4', dark: '#40929a' },
  tests: { light: '#a3b5d9', dark: '#5c79af' },
}

const grays = { light: '#000', dark: '#FFF' }

const trailingIcons = {
  download: {
    light: '<path fill="url(#b)" fill-rule="evenodd" d="M12.396 7A5.396 5.396 0 1 0 1.604 7a5.396 5.396 0 0 0 10.792 0ZM7.017 4.1l-.043.002a.459.459 0 0 0-.414.455v3.547l-.869-.87a.459.459 0 0 0-.324-.134.455.455 0 0 0-.322.135.455.455 0 0 0 0 .646l1.648 1.65a.459.459 0 0 0 .649 0l1.648-1.65a.458.458 0 0 0 0-.646v-.002l-.033-.03v-.001a.458.458 0 0 0-.613.033l-.87.869V4.557a.454.454 0 0 0-.457-.457Z" clip-rule="evenodd"/><defs><linearGradient id="b" x1="1.955" x2="14.46" y1="1.219" y2="8.798" gradientUnits="userSpaceOnUse"><stop stop-color="#786B8B" stop-opacity=".85"/><stop offset="1" stop-color="#786B8B" stop-opacity=".5"/></linearGradient></defs>',
    dark: '<path fill="url(#b)" fill-rule="evenodd" d="M12.396 7A5.396 5.396 0 1 0 1.604 7a5.396 5.396 0 0 0 10.792 0ZM7.017 4.1l-.043.002a.459.459 0 0 0-.414.455v3.547l-.869-.87a.459.459 0 0 0-.324-.134.455.455 0 0 0-.322.135.455.455 0 0 0 0 .646l1.648 1.65a.459.459 0 0 0 .649 0l1.648-1.65a.458.458 0 0 0 0-.646v-.002l-.033-.03v-.001a.458.458 0 0 0-.613.033l-.87.869V4.557a.454.454 0 0 0-.457-.457Z" clip-rule="evenodd"/><defs><linearGradient id="b" x1="1.955" x2="14.46" y1="1.219" y2="8.798" gradientUnits="userSpaceOnUse"><stop stop-color="#D5CEE0" stop-opacity=".85"/><stop offset="1" stop-color="#D5CEE0" stop-opacity=".5"/></linearGradient></defs>',
  },
  sync: {
    latest: {
      light: '<path fill="url(#b)" d="M3.792 11.667a3.127 3.127 0 0 1-2.268-.92c-.628-.612-.941-1.36-.94-2.245 0-.758.228-1.434.685-2.027a3.032 3.032 0 0 1 1.794-1.138A3.96 3.96 0 0 1 4.52 3.165 3.991 3.991 0 0 1 7 2.333c1.138 0 2.103.397 2.895 1.19.793.792 1.189 1.756 1.188 2.894a2.54 2.54 0 0 1 1.67.868c.443.5.664 1.086.664 1.757 0 .729-.256 1.349-.766 1.86a2.53 2.53 0 0 1-1.86.765h-7Zm2.246-1.998c.077 0 .15-.013.218-.037a.518.518 0 0 0 .19-.124L8.91 7.044a.576.576 0 0 0 .175-.423.576.576 0 0 0-.175-.423.576.576 0 0 0-.422-.175.576.576 0 0 0-.423.175L6.023 8.239l-.817-.816a.553.553 0 0 0-.408-.16.576.576 0 0 0-.583.583.53.53 0 0 0 .175.408l1.24 1.254c.058.059.12.1.189.124a.66.66 0 0 0 .219.037Z"/><defs><linearGradient id="b" x1="1" x2="13" y1="2" y2="12" gradientUnits="userSpaceOnUse"><stop stop-color="#759495"/><stop offset="1" stop-color="#759495" stop-opacity=".6"/></linearGradient></defs>',
      dark: '<path fill="url(#b)" d="M3.792 11.667a3.127 3.127 0 0 1-2.268-.92c-.628-.612-.941-1.36-.94-2.245 0-.758.228-1.434.685-2.027a3.032 3.032 0 0 1 1.794-1.138A3.96 3.96 0 0 1 4.52 3.165 3.991 3.991 0 0 1 7 2.333c1.138 0 2.103.397 2.895 1.19.793.792 1.189 1.756 1.188 2.894a2.54 2.54 0 0 1 1.67.868c.443.5.664 1.086.664 1.757 0 .729-.256 1.349-.766 1.86a2.53 2.53 0 0 1-1.86.765h-7Zm2.246-1.998c.077 0 .15-.013.218-.037a.518.518 0 0 0 .19-.124L8.91 7.044a.576.576 0 0 0 .175-.423.576.576 0 0 0-.175-.423.576.576 0 0 0-.422-.175.576.576 0 0 0-.423.175L6.023 8.239l-.817-.816a.553.553 0 0 0-.408-.16.576.576 0 0 0-.583.583.53.53 0 0 0 .175.408l1.24 1.254c.058.059.12.1.189.124a.66.66 0 0 0 .219.037Z"/><defs><linearGradient id="b" x1="1" x2="13" y1="2" y2="12" gradientUnits="userSpaceOnUse"><stop stop-color="#C8DBDC"/><stop offset="1" stop-color="#C8DBDC" stop-opacity=".6"/></linearGradient></defs>',
    },
    behind: {
      light: '<path fill="url(#b)" d="M8.083 10.208c0 .52.105 1.01.292 1.459H4.292c-.875 0-1.64-.292-2.27-.916a3.035 3.035 0 0 1-.939-2.246c0-.758.228-1.435.683-2.03a3.043 3.043 0 0 1 1.797-1.138 3.969 3.969 0 0 1 1.458-2.17A3.998 3.998 0 0 1 7.5 2.333c1.138 0 2.1.397 2.893 1.19.794.794 1.19 1.756 1.19 2.894h.059c-1.984.134-3.559 1.779-3.559 3.791Zm3.5-2.333V7l-1.312 1.312 1.312 1.313V8.75a1.458 1.458 0 0 1 1.307 2.112l.636.635a2.333 2.333 0 0 0-1.943-3.622Zm0 3.792a1.458 1.458 0 0 1-1.458-1.459c0-.233.053-.455.152-.653l-.636-.636a2.333 2.333 0 0 0 1.943 3.623v.875l1.312-1.313-1.313-1.312v.875Z"/><defs><linearGradient id="b" x1="1.5" x2="15.124" y1="1.938" y2="11.498" gradientUnits="userSpaceOnUse"><stop stop-color="#759495"/><stop offset="1" stop-color="#759495" stop-opacity=".6"/></linearGradient></defs>',
      dark: '<path fill="url(#b)" d="M8.083 10.208c0 .52.105 1.01.292 1.459H4.292c-.875 0-1.64-.292-2.27-.916a3.035 3.035 0 0 1-.939-2.246c0-.758.228-1.435.683-2.03a3.043 3.043 0 0 1 1.797-1.138 3.969 3.969 0 0 1 1.458-2.17A3.998 3.998 0 0 1 7.5 2.333c1.138 0 2.1.397 2.893 1.19.794.794 1.19 1.756 1.19 2.894h.059c-1.984.134-3.559 1.779-3.559 3.791Zm3.5-2.333V7l-1.312 1.312 1.312 1.313V8.75a1.458 1.458 0 0 1 1.307 2.112l.636.635a2.333 2.333 0 0 0-1.943-3.622Zm0 3.792a1.458 1.458 0 0 1-1.458-1.459c0-.233.053-.455.152-.653l-.636-.636a2.333 2.333 0 0 0 1.943 3.623v.875l1.312-1.313-1.313-1.312v.875Z"/><defs><linearGradient id="b" x1="1.5" x2="15.124" y1="1.938" y2="11.498" gradientUnits="userSpaceOnUse"><stop stop-color="#C8DBDC"/><stop offset="1" stop-color="#C8DBDC" stop-opacity=".6"/></linearGradient></defs>',
    },
  },
  tests: {
    passing: {
      light: '<path fill="url(#b)" d="M6.995 12.39a5.395 5.395 0 1 1 0-10.79 5.395 5.395 0 0 1 0 10.79Zm2.722-7.11a.528.528 0 0 0-.75.017l-2.421 2.55-1.604-1.505a.528.528 0 0 0-.892.407.535.535 0 0 0 .168.372l1.988 1.866a.528.528 0 0 0 .742-.022l2.783-2.93a.535.535 0 0 0-.014-.756Z"/><defs><linearGradient id="b" x1="1.6" x2="14.101" y1="2.24" y2="5.752" gradientUnits="userSpaceOnUse"><stop stop-color="#4DB89D"/><stop offset="1" stop-color="#4DB89D" stop-opacity=".6"/></linearGradient></defs>',
      dark: '<path fill="url(#b)" d="M7.495 12.39a5.395 5.395 0 1 1 0-10.79 5.395 5.395 0 0 1 0 10.79Zm2.722-7.11a.528.528 0 0 0-.75.017l-2.421 2.55-1.604-1.505a.528.528 0 0 0-.892.407.535.535 0 0 0 .168.372l1.988 1.866a.528.528 0 0 0 .742-.022l2.783-2.93a.534.534 0 0 0-.014-.756Z"/><defs><linearGradient id="b" x1="2.1" x2="14.601" y1="2.24" y2="5.752" gradientUnits="userSpaceOnUse"><stop stop-color="#57D1B3"/><stop offset="1" stop-color="#57D1B3" stop-opacity=".6"/></linearGradient></defs>',
    },
    failing: {
      light: '<path fill="url(#b)" d="M6.995 1.6a5.395 5.395 0 1 0 0 10.79 5.395 5.395 0 0 0 0-10.79Zm.464 2.698v3.577a.464.464 0 0 1-.928 0V4.298a.464.464 0 0 1 .928 0Zm-.464 4.51a.674.674 0 1 1 0 1.348.674.674 0 0 1 0-1.349Z"/><defs><linearGradient id="b" x1="1.6" x2="14.101" y1="2.24" y2="5.752" gradientUnits="userSpaceOnUse"><stop stop-color="#DC6969"/><stop offset="1" stop-color="#DC6969" stop-opacity=".6"/></linearGradient></defs>',
      dark: '<path fill="url(#b)" d="M7.495 1.6a5.395 5.395 0 1 0 0 10.79 5.395 5.395 0 0 0 0-10.79Zm.464 2.698v3.577a.464.464 0 0 1-.928 0V4.298a.464.464 0 0 1 .928 0Zm-.464 4.51a.674.674 0 1 1 0 1.348.674.674 0 0 1 0-1.349Z"/><defs><linearGradient id="b" x1="2.1" x2="14.601" y1="2.24" y2="5.752" gradientUnits="userSpaceOnUse"><stop stop-color="#F9859A"/><stop offset="1" stop-color="#F9859A" stop-opacity=".6"/></linearGradient></defs>',
    },
  },
}

// noinspection JSUnusedGlobalSymbols
export const config = { runtime: 'edge' }

export default async function handler(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const badgeType = searchParams.get('type')
  const colorMode = searchParams.get('colorMode')
  const isDark = colorMode === 'dark'

  const syncBehind = await getFileString('/cradle/sync-behind.txt')
  const isSyncBehind = syncBehind !== '0'

  const currentOf = (object: any): string => {
    const result = object[badgeType] ?? object
    if (result.light && result.dark) return result[colorMode]
    return result
  }
  const translate = (x: number, y: number) => `translate(${x}, ${y})`

  const opacity = badgeType === 'sync' && isSyncBehind ? 0.65 : 1
  const shadow = currentOf(shadows)
  let titleContent = currentOf(titles)
  let trailingIconPath = currentOf(trailingIcons)
  let trailingTextColor = currentOf(colors)

  let isPassingTests = false

  switch (badgeType) {
    case 'sync':
      if (isSyncBehind) titleContent += ': Pending'
      trailingIconPath = currentOf(trailingIconPath[isSyncBehind ? 'behind' : 'latest'])
      break
    case 'tests':
      isPassingTests = await fetch('https://github.com/meowool/cradle/actions/workflows/subprojects-test.yml/badge.svg')
        .then(response => response.text())
        .then(text => text.includes('passing'))
      trailingIconPath = currentOf(trailingIconPath[isPassingTests ? 'passing' : 'failing'])
      trailingTextColor = currentOf(
        isPassingTests
          ? { light: '#409A84', dark: '#7CD9C2' }
          : { light: '#BA3939', dark: '#E57D90' },
      )
      break
  }

  const trailingTextContent = currentOf({
    download: await getFileString('/cradle/latest-version.txt'),
    sync: isSyncBehind ? `BEHIND ${syncBehind}` : 'UP-TO-DATE',
    tests: isPassingTests ? 'PASSING' : 'FAILING',
  })
  const hasTrailing = typeof trailingTextContent === 'string'

  if (!font) font = new Font(await getFileBuffer('/cradle/font.ttf'))

  await Yoga.load()

  const root = Yoga.node()
  root.setWidthAuto()
  root.setHeightAuto()
  root.setFlexWrap(WRAP_NO_WRAP)
  root.setFlexDirection(FLEX_DIRECTION_ROW)
  root.setAlignItems(ALIGN_CENTER)

  const logo = Yoga.node()
  logo.setWidth(16)
  logo.setHeight(16)
  logo.setMargin(EDGE_LEFT, 10)
  logo.setMargin(EDGE_TOP, 8)
  logo.setMargin(EDGE_BOTTOM, 8)
  root.insertChild(logo, 0)

  const title = Yoga.node()
  const titleMetrics = font.getTextMetrics(titleContent, {
    fontSize: 11,
    attributes: {
      fill: currentOf(colors),
      fillOpacity: 0.9,
    },
  })
  title.setWidth(titleMetrics.width)
  title.setHeight(titleMetrics.height)
  title.setMargin(EDGE_LEFT, 8)

  const separator = Yoga.node()
  separator.setWidth(1)
  separator.setMargin(EDGE_LEFT, 8)

  const trailingText = Yoga.node()
  const trailingTextMetrics = font.getTextMetrics(trailingTextContent, {
    fontSize: 9,
    letterSpacing: 0.003,
    attributes: {
      fill: trailingTextColor,
      fillOpacity: 0.7,
    },
  })
  trailingText.setWidth(trailingTextMetrics.width)
  trailingText.setHeight(trailingTextMetrics.height)
  trailingText.setMargin(EDGE_LEFT, 10)

  const trailingIcon = Yoga.node()
  trailingIcon.setWidth(14)
  trailingIcon.setHeight(14)
  trailingIcon.setMargin(EDGE_LEFT, 6)
  trailingIcon.setMargin(EDGE_RIGHT, 9)

  root.insertChild(title, 1)
  root.insertChild(separator, 2)
  if (hasTrailing) root.insertChild(trailingText, 3)
  if (hasTrailing) root.insertChild(trailingIcon, 4)
  root.calculateLayout()

  const maxWidth = root.getComputedWidth()
  const maxHeight = root.getComputedHeight()

  const backgroundPath = Squircle.getSvgPath({
    width: maxWidth,
    height: maxHeight,
    cornerRadius,
    cornerSmoothing,
  })
  const background = <path
    fill={currentOf(grays)}
    fillOpacity={isDark ? 0.06 : 0.04}
    d={backgroundPath}
  />
  const stroke = <path
    fill='none'
    stroke={currentOf(grays)}
    strokeOpacity={isDark ? 0.1 : 0.07}
    strokeWidth={1}
    transform={translate(strokeWidth / 2, strokeWidth / 2)}
    d={Squircle.getSvgPath({
      width: maxWidth - strokeWidth,
      height: maxHeight - strokeWidth,
      cornerRadius,
      cornerSmoothing,
    })}
  />
  const content = <>
    <g transform={translate(
      logo.getComputedLayout().left,
      logo.getComputedLayout().top,
    )} style={{
      filter: `drop-shadow(0px 0px 10px ${shadow}) `
        + `drop-shadow(0px 0px 15px ${shadow}) `
        + `drop-shadow(0px 0px 18px ${shadow}) `
        + `drop-shadow(0px 1px 5px rgba(0, 0, 0, ${isDark ? 0.5 : 0.1}))`,
    }}>Logo</g>

    <g transform={translate(
      title.getComputedLayout().left,
      title.getComputedLayout().top,
    )}>Title</g>

    <rect
      x={separator.getComputedLayout().left}
      y={1}
      width={separator.getComputedWidth()}
      height={maxHeight - 2}
      fill={currentOf(grays)}
      fillOpacity={isDark ? 0.06 : 0.05}
    />

    {hasTrailing && <g transform={translate(
      trailingText.getComputedLayout().left,
      trailingText.getComputedLayout().top - 0.7,
    )}>TrailingText</g>}

    {hasTrailing && <g transform={translate(
      trailingIcon.getComputedLayout().left,
      trailingIcon.getComputedLayout().top,
    )}>TrailingIcon</g>}
  </>
  const container = opacity === 1 ? content : <g opacity={opacity}>{content}</g>

  const svg = <svg
    width={maxWidth}
    height={maxHeight}
    clipPath='url(#clip)'
    xmlns='http://www.w3.org/2000/svg'>

    <defs>
      <clipPath id='clip'>
        <path d={backgroundPath} />
      </clipPath>
    </defs>

    {background}
    {container}
    {stroke}
  </svg>

  const body: string = renderToStaticMarkup(svg)
    .replace('Logo', currentOf(logos))
    .replace('Title', titleMetrics.svgPath)
    .replace('TrailingText', trailingTextMetrics.svgPath)
    .replace('TrailingIcon', trailingIconPath)

  // console.log(svg)

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 's-maxage=1, stale-while-revalidate',
    },
  })
}
