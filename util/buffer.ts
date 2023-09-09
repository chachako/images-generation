import { DEPLOYMENT_URL } from './env.ts'

export async function getFileBuffer(file: string) {
  const res = await fetch(`${DEPLOYMENT_URL}/${file}`)
  return await res.arrayBuffer()
}

export async function getFileString(file: string) {
  const res = await fetch(`${DEPLOYMENT_URL}/${file}`)
  return await res.text()
}
