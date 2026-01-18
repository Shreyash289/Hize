import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/ieee-validate/status?jobId=xxx
 * Get job status
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    if (!jobId) {
      return NextResponse.json(
        { error: 'jobId query parameter is required' },
        { status: 400 }
      );
    }

    const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

    // Forward to backend API
    const response = await fetch(`${BACKEND_API_URL}/api/status/${jobId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/ieee-validate/status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

