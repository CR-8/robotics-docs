import { NextRequest, NextResponse } from 'next/server';
import { getAnalytics } from '@/lib/analytics-store';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication token
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    // Check against environment variable
    const validCode = process.env.ANALYTICS_CODE || '123456';

    if (token !== validCode) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const analytics = getAnalytics();
    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
