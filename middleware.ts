import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  
  // 如果访问的是 www 子域名，重定向到不带 www 的域名
  if (hostname.startsWith('www.')) {
    const url = request.nextUrl.clone()
    url.host = hostname.replace('www.', '')
    return NextResponse.redirect(url, 301)
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
