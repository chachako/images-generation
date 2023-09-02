import fs from 'fs'
import { DEPLOYMENT_URL, RUNNING_LOCAL } from './env.ts'

export async function getFileBuffer(file: string) {
  if (RUNNING_LOCAL) {
    const res = await fetch(`${DEPLOYMENT_URL}/${file}`)
    return await res.arrayBuffer()
  } else {
    return Promise.resolve(fs.readFileSync(file))
  }
}

export async function getFileString(file: string) {
  if (RUNNING_LOCAL) {
    const res = await fetch(`${DEPLOYMENT_URL}/${file}`)
    return await res.text()
  } else {
    return Promise.resolve(fs.readFileSync(file, 'utf8'))
  }
}
