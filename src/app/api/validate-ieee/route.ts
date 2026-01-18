import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route to validate IEEE membership
 * This calls the VPS API which handles the actual IEEE validation
 */
export async function POST(request: NextRequest) {
  try {
    const { memberId } = await request.json();

    if (!memberId || !memberId.trim()) {
      return NextResponse.json(
        { error: 'IEEE member number is required' },
        { status: 400 }
      );
    }

    // Get VPS API URL from environment variable
    const vpsApiUrl = process.env.VPS_API_URL || 'http://65.20.84.46:5001';
    const vpsApiKey = process.env.VPS_API_KEY;

    // Fetch cookie from VPS API
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (vpsApiKey) {
      headers['Authorization'] = `Bearer ${vpsApiKey}`;
    }

    // Try VPS validation endpoint first (preferred - uses Python validator)
    let validationResponse;
    try {
      validationResponse = await fetch(`${vpsApiUrl}/api/validate-member`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ memberId: memberId.trim() }),
        cache: 'no-store',
        signal: AbortSignal.timeout(30000),
      });

      if (validationResponse.ok) {
        const result = await validationResponse.json();
        return NextResponse.json({
          isValid: result.isValid || false,
          membershipStatus: result.membershipStatus || 'Unknown',
          nameInitials: result.nameInitials || null,
          memberGrade: result.memberGrade || null,
          memberId: result.memberId || memberId.trim(),
          error: result.error || null,
        });
      }

      // If 404, endpoint doesn't exist yet - fallback to direct validation
      if (validationResponse.status === 404) {
        console.log('VPS validation endpoint not available, using direct validation');
        // Fall through to direct validation below
      } else {
        const errorData = await validationResponse.json().catch(() => ({}));
        if (validationResponse.status === 503) {
          return NextResponse.json(
            { 
              error: errorData.error || 'IEEE validation service is temporarily unavailable',
              message: errorData.message || 'Please try again in a moment',
              isValid: false
            },
            { status: 503 }
          );
        }
        throw new Error(`VPS validation failed: ${validationResponse.status}`);
      }
    } catch (error: any) {
      // If VPS endpoint doesn't exist (404) or other error, fallback to direct validation
      if (error.message?.includes('404') || validationResponse?.status === 404) {
        console.log('Falling back to direct IEEE validation');
        // Continue to direct validation below
      } else {
        throw error;
      }
    }

    // Fallback: Direct validation (if VPS endpoint not available yet)
    // Get cookie from VPS
    const cookieResponse = await fetch(`${vpsApiUrl}/api/cookie`, {
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(5000),
    });

    if (!cookieResponse.ok) {
      return NextResponse.json(
        { 
          error: 'Failed to get cookie from VPS API',
          isValid: false
        },
        { status: 503 }
      );
    }

    const cookieData = await cookieResponse.json();
    const cookie = cookieData.cookie;

    if (!cookie) {
      return NextResponse.json(
        { 
          error: 'Cookie not available from VPS',
          isValid: false
        },
        { status: 503 }
      );
    }

    // Validate directly with IEEE
    const formData = new URLSearchParams();
    formData.append('customerId', memberId.trim());

    const ieeeResponse = await fetch(
      'https://services24.ieee.org/membership-validator.html',
      {
        method: 'POST',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': 'https://services24.ieee.org/membership-validator.html',
          'Origin': 'https://services24.ieee.org',
          'Cookie': `PA.Global_Websession=${cookie}`,
        },
        body: formData.toString(),
        signal: AbortSignal.timeout(30000),
      }
    );

    if (!ieeeResponse.ok) {
      return NextResponse.json(
        { 
          error: `IEEE validation failed (HTTP ${ieeeResponse.status})`,
          isValid: false
        },
        { status: ieeeResponse.status >= 500 ? 503 : 400 }
      );
    }

    const html = await ieeeResponse.text();

    if (!html.includes('Membership validation status')) {
      return NextResponse.json(
        { 
          error: 'Validation service session expired or invalid response',
          isValid: false
        },
        { status: 401 }
      );
    }

    // Extract membership status using regex
    const statusMatch = html.match(/Membership status[^<]*<span[^>]*>([^<]+)<\/span>/i) ||
                        html.match(/Membership status[^:]*:\s*([^<\n]+)/i);
    const membershipStatus = statusMatch ? statusMatch[1].trim() : null;

    const isValid = membershipStatus?.toLowerCase().includes('active') || false;

    // Extract name initials
    const nameMatch = html.match(/First and last name initials[^<]*<span[^>]*>([^<]+)<\/span>/i) ||
                       html.match(/name initials[^:]*:\s*([^<\n]+)/i);
    const nameInitials = nameMatch ? nameMatch[1].trim() : null;

    return NextResponse.json({
      isValid,
      membershipStatus: membershipStatus || 'Unknown',
      nameInitials: nameInitials || null,
      memberId: memberId.trim(),
    });

  } catch (error: any) {
    console.error('IEEE validation error:', error);

    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      return NextResponse.json(
        { 
          error: 'Validation request timed out',
          isValid: false
        },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { 
        error: error.message || 'Failed to validate IEEE membership',
        isValid: false
      },
      { status: 500 }
    );
  }
}

