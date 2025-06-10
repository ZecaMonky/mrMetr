import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete('authToken', { path: '/' })
  return new Response('Выйти успешно', { status: 200 })
}
