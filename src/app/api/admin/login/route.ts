import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const { password } = await request.json()
  
  if (password === process.env.ADMIN_PASSWORD) {
    cookies().set('admin_token', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24小时
    })
    return new Response(null, { status: 200 })
  }

  return new Response(null, { status: 401 })
} 