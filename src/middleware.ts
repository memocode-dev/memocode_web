import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.pathname;
    const response = NextResponse.next();
    response.headers.set('x-url-path', url);
    return response;
}

export const config = {
    matcher: '/:path*', // 모든 경로에 대해 미들웨어를 적용
};
