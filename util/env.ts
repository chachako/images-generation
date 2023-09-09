export const RUNNING_LOCAL = !process.env.VERCEL_URL

export const DEPLOYMENT_URL = RUNNING_LOCAL
  ? `http://localhost:${process.env.PORT ?? 3000}`
  : `https://${process.env.VERCEL_URL}`

export function asset(path: string): string {
  return `${DEPLOYMENT_URL}/${path}`
}
