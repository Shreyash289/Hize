import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/ieee-validate/check
 * Create a validation job
 */
export async function POST(request: NextRequest) {
  try {
    const { memberId } = await request.json();

    if (!memberId || !memberId.trim()) {
      return NextResponse.json(
        { error: 'memberId is required' },
        { status: 400 }
      );
    }

    const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

    // Forward to backend API
    const response = await fetch(`${BACKEND_API_URL}/api/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ memberId: memberId.trim() }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/ieee-validate/check:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

