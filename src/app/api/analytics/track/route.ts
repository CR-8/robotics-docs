import { NextRequest, NextResponse } from 'next/server';
import { trackPageView } from '@/lib/analytics-store';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, referer } = body;

    // Get IP from headers (works on Vercel)
    const ip = 
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const userAgent = request.headers.get('user-agent') || undefined;

    trackPageView({
      path,
      ip,
      userAgent,
      referer,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
